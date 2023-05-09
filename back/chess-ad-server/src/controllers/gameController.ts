import { Request, Response } from "express";
import httpStatus from "http-status";

import { Errors } from "../services/errors";
import gameService from "../services/gameService";

export async function postJoinGame(req: Request, res: Response) {
  const { path } = req.body;
  const { userId } = res.locals.tokenData;

  try {
    const result = await gameService.createGame({ path, userId });
    return res.status(httpStatus.CREATED).send({ playerToken: result });
  } catch (error) {
    if (error.name === Errors.invalidPathError) {
      return res.status(httpStatus.GONE).send(error.message);  
    }

    if (error.name === Errors.cannotJoinGameError) {
      return res.status(httpStatus.FORBIDDEN).send(error.message);  
    }

    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
}
