import axios from "axios";
import { Request, Response } from "express";
import httpStatus from "http-status";

import { Errors } from "../services/errors";
import authenticationService, { SignInParams, SignUpParams } from "../services/authenticationService";

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.login({ email: email.toLowerCase(), password });
    
    return res.status(httpStatus.OK).send({ token: result.token, user: result.user });
  } catch (error) {
    if (error.name === Errors.invalidCredentialsError) {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);  
    }
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
}

export async function signUp(req: Request, res: Response) {
  const { username, email, password } = req.body as SignUpParams;
  try {
    const result = await authenticationService.createUser({ username, email: email.toLowerCase(), password });
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if (error.name === Errors.conflictError) {
      return res.status(httpStatus.CONFLICT).send(error.message);  
    }

    if (error.name === "ServerError") {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
    
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
}

export async function signOut(req: Request, res: Response) {
  const { userId } = res.locals.tokenData;

  try {
    await authenticationService.logout(userId);
    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function getToken(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.split(" ")[1]) return res.status(httpStatus.UNAUTHORIZED).send('refresh token expired or invalid');
  const refreshToken = authHeader.split(" ")[1];
  

  try {
    const result = await authenticationService.sendNewToken(refreshToken);
    return res.status(httpStatus.OK).send({ token: result });
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send('refresh token expired or invalid');
  }
}

export async function getData(req: Request, res: Response) {
  const { userId } = res.locals.tokenData;
  
  try {
    const result = await authenticationService.sendUserData(userId);
    return res.status(httpStatus.OK).send({ user: result });
  } catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
