import { Socket, Server } from "socket.io";

import gameJoinService from '../services/gameJoinService'
import Events from "../eventEnums";

const registerGameHandlers = (io: Server, socket: Socket) => {
  const joinGame = gameJoinService.joinGame(io, socket);
  socket.on(Events.JOIN_GAME, joinGame);
}

export default registerGameHandlers;
