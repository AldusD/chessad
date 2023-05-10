import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

enum TokenTypes {
  access,
  refresh  
};

enum PlayerTokenTypes {
  creatorPlayer,
  joiningPlayer
};

enum Teams {
  white,
  black
};

type TokenData = {
  userId: string,
  type: TokenTypes,     
};

type PlayerTokenData = {
  path: string,
  type: PlayerTokenTypes,
  team?: Teams
};

function createToken(payload: TokenData | PlayerTokenData, expiration?: string | number) {
  const expiresIn = expiration || '1h'; 
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

const getTokenDataOrFail = (token: string, callback: any) => jwt.verify(token, process.env.JWT_SECRET, callback);

export { createToken, getTokenDataOrFail, TokenTypes, TokenData, PlayerTokenTypes, PlayerTokenData, Teams };