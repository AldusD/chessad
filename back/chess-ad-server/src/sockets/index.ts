import { Server, Socket } from "socket.io";
import registerGameHandlers from "./controllers/gameJoinController";
import gameplayHandlers from "./controllers/gameplayController";

const connectServices = (io: Server, socket: Socket) => {
  registerGameHandlers(io, socket);
  gameplayHandlers(io, socket);
}

export default connectServices;