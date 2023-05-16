import { Socket, Server } from "socket.io";
import jwt from "jsonwebtoken";

import { getTokenDataOrFail, PlayerTokenData, PlayerTokenTypes } from "../../utils/token";

type TokenVerificationResult = {
  tokenData?: PlayerTokenData,
  error?: Error 
}

export function verifyPlayerToken (playerToken: string): TokenVerificationResult {
  if (!playerToken) return { error: Error('Player token invalid or expired') };  
  
  const result = {} as TokenVerificationResult;
  
  getTokenDataOrFail(playerToken, (error: jwt.JsonWebTokenError, tokenData: PlayerTokenData) => {
    if (error || !tokenData.path) return result.error = Error('Player token invalid or expired');
    return result.tokenData = tokenData;
  })
  return result;
}