import { Socket, Server } from "socket.io";

import gameJoinService from '../services/gameJoinService'

const registerGameHandlers = (io: Server, socket: Socket) => {
  const joinGame = gameJoinService.joinGame(io, socket);
  socket.on("join_game", joinGame);
}

export default registerGameHandlers;
