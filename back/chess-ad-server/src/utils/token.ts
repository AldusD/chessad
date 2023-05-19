import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export enum Results {
  WHITE = 'white',
  BLACK = 'black',
  TIE = 'tie',
}

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
  timeControl: number[],
  team?: Teams
};

type GameResultTokenData = {
  path: string,
  result: Results,
  pgn: string
}

function createToken(payload: TokenData | PlayerTokenData | GameResultTokenData, expiration?: string | number) {
  const expiresIn = expiration || '1h'; 
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

const getTokenDataOrFail = (token: string, callback: any) => jwt.verify(token, process.env.JWT_SECRET, callback);

export { createToken, getTokenDataOrFail, TokenTypes, TokenData, PlayerTokenTypes, PlayerTokenData, Teams };