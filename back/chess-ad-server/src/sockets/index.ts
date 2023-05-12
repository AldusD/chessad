import { Server, Socket } from "socket.io";
import registerGameHandlers from "./gameSocket";

const connectServices = (io: Server, socket: Socket) => {
  registerGameHandlers(io, socket);
}

export default connectServices;