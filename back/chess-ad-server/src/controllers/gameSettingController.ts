import { Request, Response } from "express";
import httpStatus from "http-status";

import authenticationService, { SignInParams, SignUpParams } from "../services/authenticationService";

export async function singIn(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.login({ email: email.toLowerCase(), password });
    
    return res.status(httpStatus.OK).send({ token: result.token, user: result.user });
  } catch (error) {
    if (error.name === "InvalidCredentialsError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);  
    }
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
}

export async function postGameSetting(req: Request, res: Response) {
  const { username, email, password } = req.body as SignUpParams;
  try {
    const result = await authenticationService.createUser({ username, email: email.toLowerCase(), password });
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    console.log(error)
    if (error.name === "conflictError") {
      return res.status(httpStatus.CONFLICT).send(error.message);  
    }

    if (error.name === "ServerError") {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
    
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }

}
