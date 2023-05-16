import { Socket, Server } from "socket.io";

import { PlayerTokenTypes, PlayerTokenData } from "../../../utils/token";
import { verifyPlayerToken } from "../../middlewares";
import gameRepository, { Status, Results } from "../../repositories/gameRepository";
import initialPositionJson from "./positionHandler";
import moveValitation from "./moveValidation";
import Events from "../../eventEnums";
import { Teams } from "../../../utils/token";

const MINUTES_TO_MILLISECONDS = 1000 * 60;

type MoveDetails = { 
  move: string[], 
  usingSpell: boolean, 
  promote: boolean 
};

type MoveInfo = {
  moveDetails: MoveDetails,
  tokenData: PlayerTokenData
}

type StatusInfo = {
  tokenData: PlayerTokenData,
  checkmate: Results.WHITE | Results.BLACK | boolean
}

type TryMoveResult = { 
  error?: boolean, 
  position?: string 
  checkmate?: string | boolean
}

function movePiece (io: Server, socket: Socket) {
  const tryMove = async (moveInfo: MoveInfo): Promise<TryMoveResult> => {
    try {
      const { moveDetails, tokenData } = moveInfo;
      const positionData = await gameRepository.readGamePosition(tokenData.path);
      const positionJson = (positionData) ? positionData : initialPositionJson;
      const position = JSON.parse(positionJson);
      
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
      return { position: JSON.stringify(newPosition.position), checkmate: newPosition.checkmate };
    } catch (error) {
     return { error: true }; 
    }
  }

  const tryStatus = async (statusInfo: StatusInfo) => {
    const { checkmate, tokenData } = statusInfo;
    const previousStatus = await gameRepository.readGamePosition(tokenData.path);
    if (!previousStatus) { 
      const timeControl = tokenData.timeControl;
      const initialTime = timeControl[0] * MINUTES_TO_MILLISECONDS;

      return gameRepository.saveGameStatus({ 
        path: tokenData.path, 
        status: { timeControl, whitePlayerTime: initialTime, blackPlayerTime: initialTime, lastMoveTimestamp: Date.now(), result: Results.ONGOING } 
      })
    }

    const { timeControl, whitePlayerTime, blackPlayerTime,  } = JSON.parse(previousStatus);
  }

  return async (data: { playerToken: string, moveDetails: MoveDetails }) => {
    if (!data || !data.playerToken) return io.in(socket.id).emit(Events.MOVE_ERROR, 'Player token invalid or expired');
    if (!data.moveDetails || !data.moveDetails.move || !(data.moveDetails.move.length === 2) || typeof(data.moveDetails.promote) == 'undefined' || typeof(data.moveDetails.usingSpell) == 'undefined' ) {
      return io.in(socket.id).emit(Events.MOVE_ERROR, 'Invalid move details');
    }
    
    try {
      const { playerToken, moveDetails } = data;
      const { tokenData, error } = verifyPlayerToken(playerToken); 
  
      if (error) return io.in(socket.id).emit(Events.MOVE_ERROR, error.message);
  
      const moveResult = await tryMove({ tokenData, moveDetails });
      if (moveResult.error) return io.in(socket.id).emit(Events.POSITION, moveResult.position);

      let checkmate: Results.WHITE | Results.BLACK | boolean = false;
      if (moveResult.checkmate === 'WHITE') checkmate = Results.WHITE;
      if (moveResult.checkmate === 'BLACK') checkmate = Results.BLACK;

      const statusResult = await tryStatus({ tokenData, checkmate })

      
      return io.in(tokenData.path).emit(Events.POSITION, moveResult.position);
    } catch (error) {
      return console.log(error);
    }
  }
}

function sendPosition (io: Server, socket: Socket) {
  return async (data: { playerToken: string }) => {
    try {
    const { playerToken } = data;
    const { tokenData, error } = verifyPlayerToken(playerToken); 
    if (error) return io.in(socket.id).emit(Events.MOVE_ERROR, error.message);

    const positionData = await gameRepository.readGamePosition(tokenData.path);
    const position = (positionData) ? positionData : initialPositionJson;
    
    return io.in(socket.id).emit(Events.POSITION, position);
    } catch (error) {
      return console.log(error);
    }
  }
}

const gameplayService = {
  movePiece,
  sendPosition
};

export default gameplayService;