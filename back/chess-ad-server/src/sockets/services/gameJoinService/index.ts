import { Socket, Server } from "socket.io";

import { PlayerTokenTypes } from "../../../utils/token";
import { verifyPlayerToken } from "../../middlewares";

function joinGame (io: Server, socket: Socket) {
  return (data: { playerToken: string }) => {
    const { tokenData, error } = verifyPlayerToken(data.playerToken);  
    if (error) {
      return io.in(socket.id).emit('error', error.message);
    }

    if (tokenData?.type === PlayerTokenTypes.creatorPlayer) {
      socket.join(tokenData.path);
    }

    if (tokenData?.type === PlayerTokenTypes.joiningPlayer) {
      socket.join(tokenData.path);
      socket.broadcast.to(tokenData.path).emit("join_game");
    }
  }
}

const joinGameService = {
  joinGame
};

export default joinGameService;