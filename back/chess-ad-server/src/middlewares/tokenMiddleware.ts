import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { getTokenDataOrFail, TokenData, TokenTypes } from '../utils/token';

import * as jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(httpStatus.UNAUTHORIZED).send('invalid token');

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(httpStatus.UNAUTHORIZED).send('invalid token');
  
  getTokenDataOrFail(token, (error: jwt.JsonWebTokenError, tokenData: TokenData) => {
    if (error) {
      console.log(error);
      return res.status(httpStatus.UNAUTHORIZED).send('invalid token');
    }

    if (tokenData.type === TokenTypes.access) {
      res.locals.tokenData = tokenData;
      return next();
    } else return res.status(httpStatus.UNAUTHORIZED).send('invalid token');
  });
}