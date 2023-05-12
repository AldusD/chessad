import { Socket, Server } from "socket.io";
import jwt from "jsonwebtoken";

import { getTokenDataOrFail, PlayerTokenData, PlayerTokenTypes } from "../utils/token";

type TokenVerificationResult = {
  tokenData?: PlayerTokenData,
  error?: Error 
}

const registerGameHandlers = (io: Server, socket: Socket) => {
  const verifyPlayerToken = (playerToken: string): TokenVerificationResult => {
    if (!playerToken) return { error: Error('Send a player token') };

    const result = {} as TokenVerificationResult;
    getTokenDataOrFail(playerToken, (error: jwt.JsonWebTokenError, tokenData: PlayerTokenData) => {
      if (error || !tokenData.path) return result.error = Error('Player token invalid or expired');
      return result.tokenData = tokenData;
    })
    return result;
  }

  const joinGame = (data: { playerToken: string }) => {
    const { tokenData, error } = verifyPlayerToken(data.playerToken);

    if (error) {
      return io.in(socket.id).emit('error', error.message);
    }

    if (tokenData.type === PlayerTokenTypes.creatorPlayer) {
      console.log('creator joined')
      socket.join(tokenData.path);
    }

    if (tokenData.type === PlayerTokenTypes.joiningPlayer) {
      socket.join(tokenData.path);
      socket.broadcast.to(tokenData.path).emit("join_game");
    }
  }
  
  socket.on("join_game", joinGame);
}

export default registerGameHandlers;
