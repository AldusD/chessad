import { Socket, Server } from "socket.io";
import { PlayerTokenTypes, PlayerTokenData, createToken } from "../../../utils/token";
import { verifyPlayerToken } from "../../middlewares";
import gameRepository, { Status, Results } from "../../repositories/gameRepository";
import initialPositionJson from "./positionHandler";
import moveValitation from "./moveValidation";
import Events from "../../eventEnums";
import { Teams } from "../../../utils/token";

const MINUTES_TO_MILLISECONDS = 1000 * 60;
const SECONDS_TO_MILLISECONDS = 1000;

type MoveDetails = { 
  move: string[], 
  usingSpell: boolean, 
  promote: string 
};

type MoveInfo = {
  moveDetails: MoveDetails,
  tokenData: PlayerTokenData
}

type StatusInfo = {
  tokenData: PlayerTokenData,
  moveDetails: MoveDetails,
  turn: Results.WHITE | Results.BLACK
}

type TryMoveResult = { 
  error?: boolean, 
  position?: string 
  checkmate?: string | boolean,
  moveNumber?: number
}

type TryStatusResult = {
  result?: Results.WHITE | Results.BLACK,
  error?: boolean,
  status?: Status  
}

type TimeoutInfo = {
  lastMoveTime: number,
  time: number
}

const checkTimeout = (timeoutInfo: TimeoutInfo): boolean => !!(timeoutInfo.time < (Date.now() - timeoutInfo.lastMoveTime));

const extractPgnAdd = (info: Partial<MoveDetails>): string => {
  const { promote, usingSpell } = info;
  if (promote) return `/p-${promote[1].toLowerCase()}`;
  if (usingSpell) return '/s';
  return '';
}

const tryMove = async (moveInfo: MoveInfo): Promise<TryMoveResult> => {
  try {
    const { moveDetails, tokenData } = moveInfo;
    const positionData = await gameRepository.readGamePosition(tokenData.path);
    const positionJson = (positionData) ? positionData : initialPositionJson;
    const position = JSON.parse(positionJson);
    const moveNumber = position.move as number;
    
    const newPosition = moveValitation({ 
      coordI: moveDetails.move[0], 
      coordF: moveDetails.move[1], 
      pieces: position, 
      usingSpell: moveDetails.usingSpell, 
      promote: moveDetails.promote,
      team: tokenData.team
    });
    
    if (newPosition.error) return { error: true, position: positionJson };
    await gameRepository.saveGamePosition({ path: tokenData.path, position: JSON.stringify(newPosition.position) });
    return { position: JSON.stringify(newPosition.position), checkmate: newPosition.checkmate, moveNumber };
  } catch (error) {
   return { error: true }; 
  }
}

const tryStatus = async (statusInfo: StatusInfo): Promise<TryStatusResult> => {
  try {
    const { tokenData, moveDetails, turn } = statusInfo;
    const { move, usingSpell, promote } = moveDetails;
    const previousStatusJson = await gameRepository.readGameStatus(tokenData.path);
    if (!previousStatusJson) { 
      const timeControl = tokenData.timeControl;
      const initialTime = timeControl[0] * MINUTES_TO_MILLISECONDS;
      const status = { 
        timeControl, 
        whitePlayerTime: initialTime, 
        blackPlayerTime: initialTime, 
        lastMoveTimestamp: Date.now(),  
        pgn: `${move[0]}-${move[1]}` 
      }; 
      await gameRepository.saveGameStatus({ path: tokenData.path, status });
      return { status };
    }
    
    const previousStatus = JSON.parse(previousStatusJson);
    const { timeControl, whitePlayerTime, blackPlayerTime, lastMoveTimestamp, pgn } = previousStatus;
    const pgnAdd = extractPgnAdd({ usingSpell, promote }); 
    const updatedPgn = `${pgn}, ${move[0]}-${move[1]}${pgnAdd}`;
    const moveTimestamp = Date.now();
    const timeSpent = moveTimestamp - lastMoveTimestamp;
    const increment = timeControl[1] * SECONDS_TO_MILLISECONDS;
    const status = {
      pgn: updatedPgn,
      timeControl,
      lastMoveTimestamp: moveTimestamp,
      whitePlayerTime: (turn === Results.WHITE) ? whitePlayerTime - timeSpent + increment : whitePlayerTime,
      blackPlayerTime: (turn === Results.BLACK) ? blackPlayerTime - timeSpent + increment : blackPlayerTime,
    }

    if (checkTimeout({ time: previousStatus[`${turn}PlayerTime`], lastMoveTime: previousStatus.lastMoveTimestamp })) {
      return { result: (turn === Results.WHITE) ? Results.BLACK : Results.WHITE };
    }

    await gameRepository.saveGameStatus({ path: tokenData.path, status });
    return { status };
  } catch (error) {
    console.log('ts', error)
    return { error: true };
  }
}

function movePiece (io: Server, socket: Socket) {
  return async (data: { playerToken: string, moveDetails: MoveDetails }) => {
    if (!data || !data.playerToken) return io.in(socket.id).emit(Events.MOVE_ERROR, 'Player token invalid or expired');
    if (!data.moveDetails || !data.moveDetails.move || !(data.moveDetails.move.length === 2) || typeof(data.moveDetails.usingSpell) == 'undefined' ) {
      return io.in(socket.id).emit(Events.MOVE_ERROR, 'Invalid move details');
    }
    
    try {
      const { playerToken, moveDetails } = data;
      const { tokenData, error } = verifyPlayerToken(playerToken); 
      if (error) return io.in(socket.id).emit(Events.MOVE_ERROR, error.message);
      const isFinished = await gameRepository.readGameResult(tokenData.path);
      if (isFinished) return io.in(tokenData.path).emit(Events.GAME_RESULT, isFinished);
      const moveResult = await tryMove({ tokenData, moveDetails });
      if (moveResult.error) return io.in(socket.id).emit(Events.POSITION, { position: moveResult.position });
      let checkmate: Results.WHITE | Results.BLACK | boolean = false;
      if (moveResult.checkmate === 'WHITE') checkmate = Results.WHITE;
      if (moveResult.checkmate === 'BLACK') checkmate = Results.BLACK;

      const turn = (moveResult.moveNumber % 2 === 1) ? Results.WHITE : Results.BLACK;
      const nextTurn = (turn === Results.WHITE) ? Results.BLACK : Results.WHITE;

      const statusResult = await tryStatus({ tokenData, turn, moveDetails });
      if (statusResult.error) return;
      
      if (statusResult.result) {
        const gameResultToken = createToken({ path: tokenData.path, pgn: statusResult.status.pgn, result: statusResult.result });
        await gameRepository.saveGameResult({ path: tokenData.path, resultToken: gameResultToken });
        io.in(socket.id).emit(Events.POSITION, { position: moveResult.position, status: statusResult.status });
        return io.in(tokenData.path).emit(Events.GAME_RESULT, gameResultToken);
      }
      
      if (checkmate) {
        const gameResultToken = createToken({ path: tokenData.path, pgn: statusResult.status.pgn, result: checkmate });
        await gameRepository.saveGameResult({ path: tokenData.path, resultToken: gameResultToken });
        io.in(tokenData.path).emit(Events.POSITION, { position: moveResult.position, status: { ...statusResult.status, turn } });
        return io.in(tokenData.path).emit(Events.GAME_RESULT, gameResultToken);
      }
      
      await gameRepository.deleteDrawOffer(tokenData.path);
      io.in(tokenData.path).emit(Events.OFFER_DRAW, 'canceled');
      return io.in(tokenData.path).emit(Events.POSITION, { position: moveResult.position, status: { ...statusResult.status, turn: nextTurn } });
    } catch (error) {
      return console.log('mpError', error);
    }
  }
}

function sendPosition (io: Server, socket: Socket) {
  return async (data: { playerToken: string }) => {
    if (!data || !data.playerToken) return io.in(socket.id).emit(Events.MOVE_ERROR, 'Player token invalid or expired');
    try {
    const { playerToken } = data;
    const { tokenData, error } = verifyPlayerToken(playerToken); 
    if (error) return io.in(socket.id).emit(Events.MOVE_ERROR, error.message);
    
    const result = await gameRepository.readGameResult(tokenData.path) as Results;
    const positionData = await gameRepository.readGamePosition(tokenData.path);
    const position = (positionData) ? positionData : initialPositionJson;
    const moveNumber = JSON.parse(position).move;
    const turn = (moveNumber % 2 === 1) ? Results.WHITE : Results.BLACK;
    const statusResult = await gameRepository.readGameStatus(tokenData.path);
    const status = (statusResult) ? JSON.parse(statusResult) : { pgn: '' };    

    if (result) {
      const gameResultToken = createToken({ path: tokenData.path, pgn: status.pgn, result });
      await gameRepository.saveGameResult({ path: tokenData.path, resultToken: gameResultToken });
      return io.in(tokenData.path).emit(Events.GAME_RESULT, gameResultToken);
    }

    const time = status[`${turn}PlayerTime`];
    const timeLeft = time - (Date.now() - status.lastMoveTimestamp);

    if (timeLeft <= 0) {
      const timeout = (turn === Results.WHITE) ? Results.BLACK : Results.WHITE;
      const gameResultToken = createToken({ path: tokenData.path, pgn: status.pgn, result: timeout });
      await gameRepository.saveGameResult({ path: tokenData.path, resultToken: gameResultToken });
      return io.in(tokenData.path).emit(Events.GAME_RESULT, gameResultToken);
    }

    if (statusResult) {
      const updatedStatus = { 
        ...status, 
        whitePlayerTime: (turn === Results.WHITE) ? timeLeft : status.whitePlayerTime, 
        blackPlayerTime: (turn === Results.BLACK) ? timeLeft : status.blackPlayerTime
      };
      await gameRepository.saveGameStatus({ path: tokenData.path, status: updatedStatus });
      return io.in(socket.id).emit(Events.POSITION, { position, status: { ...updatedStatus, turn  } });
    }

    return io.in(socket.id).emit(Events.POSITION, { position });
    } catch (error) {
      return console.log('spError', error);
    }
  }
}

const gameplayService = {
  movePiece,
  sendPosition
};

export default gameplayService;