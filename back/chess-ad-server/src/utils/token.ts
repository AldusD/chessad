import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

enum TokenTypes {
  access,
  refresh  
}

type TokenData = {
    userId: string,
    type: TokenTypes     
}

function createToken(payload: TokenData, expiration?: string | number) {
  const expiresIn = expiration || '1h'; 
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

const getTokenDataOrFail = (token: string, callback: any) => jwt.verify(token, process.env.TOKEN_SECRET, callback);

export { createToken, getTokenDataOrFail, TokenTypes, TokenData };