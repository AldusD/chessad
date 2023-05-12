import { Socket, Server } from "socket.io";

import gameJoinService from '../services/gameJoinService'

const gamePlayHandlers = (io: Server, socket: Socket) => {
  const joinGame = gameJoinService.joinGame(io, socket);
  socket.on("move_piece", joinGame);
}

export default gamePlayHandlers;
