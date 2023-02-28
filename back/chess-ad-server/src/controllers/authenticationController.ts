import axios from "axios";
import { Request, Response } from "express";
import httpStatus from "http-status";

import authenticationService, { SignInParams, SignUpParams } from "../services/authenticationService";

export async function singIn(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.login({ email, password });
    
    return res.status(httpStatus.OK).send({ token: result });
  } catch (error) {
    if (error.name === "InvalidCredentialsError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);  
    }
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
}

export async function signUp(req: Request, res: Response) {
  const { username, email, password } = req.body as SignUpParams;

  try {
    const result = await authenticationService.createUser({ username, email, password });
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if (error.name === "conflictError") {
      return res.status(httpStatus.CONFLICT).send(error.message);  
    }
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }

}
