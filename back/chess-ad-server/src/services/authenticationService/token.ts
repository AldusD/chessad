import jwt from "jsonwebtoken";
import { VerifyOptions } from "jsonwebtoken";
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
const compareToken = (token: string, callback: VerifyOptions) => jwt.verify(token, process.env.TOKEN_SECRET, callback);
export { createToken, compareToken, TokenTypes };