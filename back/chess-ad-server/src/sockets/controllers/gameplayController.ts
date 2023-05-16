import { Socket, Server } from "socket.io";

import gameplayService from "../services/gameplayService";
import Events from "../eventEnums";

const gameplayHandlers = (io: Server, socket: Socket) => {
  const movePiece = gameplayService.movePiece(io, socket);
  const sendPosition = gameplayService.sendPosition(io, socket);

  socket.on(Events.MOVE_PIECE, movePiece);
  socket.on(Events.POSITION, sendPosition);
}

export default gameplayHandlers;
