import { Server, Socket } from "socket.io";
import registerGameHandlers from "./controllers/gameJoinController";
import registerGameplayHandlers from "./controllers/gameplayController";
import registerGameActionsHandlers from "./controllers/gameActionsController";

const connectServices = (io: Server, socket: Socket) => {
  registerGameHandlers(io, socket);
  registerGameplayHandlers(io, socket);
  registerGameActionsHandlers(io, socket);
}

export default connectServices;