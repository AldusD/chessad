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
const getTokenDataOrFail = (token: string) => jwt.verify(token, process.env.TOKEN_SECRET);
export { createToken, getTokenDataOrFail, TokenTypes };