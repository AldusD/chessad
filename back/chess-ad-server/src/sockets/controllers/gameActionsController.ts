import { Socket, Server } from "socket.io";

import gameActionsService from "../services/gameActionsService";
import Events from "../eventEnums";

const registerGameHandlers = (io: Server, socket: Socket) => {
  const resign = gameActionsService.resign(io, socket);
  const offerDraw = gameActionsService.offerDraw(io, socket);
  
  socket.on(Events.RESIGN, resign);
  socket.on(Events.OFFER_DRAW, offerDraw);
}

export default registerGameHandlers;
