import { Server, Socket } from "socket.io";
import registerGameHandlers from "./controllers/gameJoinController";
import gamePlayHandlers from "./controllers/gameplayController";

const connectServices = (io: Server, socket: Socket) => {
  registerGameHandlers(io, socket);
  gamePlayHandlers(io, socket);
}

export default connectServices;