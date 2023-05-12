import { Socket, Server } from "socket.io";

import { PlayerTokenTypes } from "../../../utils/token";
import { verifyPlayerToken } from "../../middlewares";

function movePiece (io: Server, socket: Socket) {
  return (data: { playerToken: string }) => {
    const { tokenData, error } = verifyPlayerToken(data.playerToken);  
    if (error) {
      return io.in(socket.id).emit('error', error.message);
    }

    return socket.to(tokenData.path).emit('move_piece');
  }
}

const gameplayService = {
  movePiece
};

export default gameplayService;