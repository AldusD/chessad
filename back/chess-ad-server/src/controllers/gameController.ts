import { Request, Response } from "express";
import httpStatus from "http-status";

import gameService from "../services/gameService";

export async function postJoinGame(req: Request, res: Response) {
  const { path } = req.body;
  const { userId } = res.locals.tokenData;

  if (!path) return res.sendStatus(422);

  try {
    const result = await gameService.createGame({ path, userId });
    return res.status(httpStatus.CREATED).send({ playerToken: result });
  } catch (error) {
    console.log(error)  
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
}
