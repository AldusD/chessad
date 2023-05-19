import { Socket, Server } from "socket.io";
import { verifyPlayerToken } from "../../middlewares";
import Events from "../../../sockets/eventEnums";
import gameRepository, { Results } from "../../repositories/gameRepository";
import { Teams, createToken } from "../../../utils/token";

function resign (io: Server, socket: Socket) {
  return async (data: { playerToken: string }) => {
    const { playerToken } = data;
    const { tokenData, error } = verifyPlayerToken(playerToken); 
    if (error) return io.in(socket.id).emit(Events.MOVE_ERROR, error.message);

    try {
      const isFinished = await gameRepository.readGameResult(tokenData.path);
      if (isFinished) return io.in(tokenData.path).emit(Events.GAME_RESULT, isFinished);
      const winningSide = (tokenData.team === Teams.white) ? Results.BLACK : Results.WHITE;
      const statusResult = await gameRepository.readGameStatus(tokenData.path);
      const status = (statusResult) ? JSON.parse(statusResult) : { pgn: '' };
      const resultToken = createToken({ path: tokenData.path, pgn: status.pgn, result: winningSide });
      await gameRepository.saveGameResult({ path: tokenData.path, resultToken });
      return io.in(tokenData.path).emit(Events.GAME_RESULT, resultToken);
    } catch (error) {
      console.log('rsn', error);
    }
  }
}

function offerDraw (io: Server, socket: Socket) {
  return async (data: { playerToken: string }) => {
    const { playerToken } = data;
    const { tokenData, error } = verifyPlayerToken(playerToken); 
    if (error) return io.in(socket.id).emit(Events.MOVE_ERROR, error.message);

    try {
      const isFinished = await gameRepository.readGameResult(tokenData.path);
      if (isFinished) return io.in(tokenData.path).emit(Events.GAME_RESULT, isFinished);
      const side = (tokenData.team === Teams.white) ? Results.WHITE : Results.BLACK;
      const existingOffer = await gameRepository.readDrawOffer(tokenData.path);
      if (!existingOffer) {
        socket.to(tokenData.path).emit(Events.OFFER_DRAW, 'draw');
        return await gameRepository.saveDrawOffer({ path: tokenData.path, side });
      }
      if (existingOffer != side) {
        const statusResult = await gameRepository.readGameStatus(tokenData.path);
        const status = (statusResult) ? JSON.parse(statusResult) : { pgn: '' };
        const resultToken = createToken({ path: tokenData.path, pgn: status.pgn, result: Results.TIE });
        await gameRepository.saveGameResult({ path: tokenData.path, resultToken });
        return io.in(tokenData.path).emit(Events.GAME_RESULT, resultToken);
      };
      return;
    } catch (error) {
      console.log('doff', error);
    }
  }
}

const gameActionsService = {
  resign,
  offerDraw
};

export default gameActionsService;