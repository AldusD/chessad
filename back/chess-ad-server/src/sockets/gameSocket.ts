import { Socket, Server } from "socket.io";

const registerGameHandlers = (io: Server, socket: Socket) => {
    const joinGame = (data: { path: string }) => {
      socket.join(data.path);
      socket.broadcast.to(data.path).emit("join", `join ${socket.id}`);
    }
  
    socket.on("join_game", joinGame);
}

export default registerGameHandlers;