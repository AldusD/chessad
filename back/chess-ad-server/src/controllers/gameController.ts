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
    if (error.name === Errors.unprocessableEntityError) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.message);  
    }

    if (error.name === Errors.invalidPathError) {
      return res.status(httpStatus.GONE).send(error.message);  
    }

    if (error.name === Errors.cannotJoinGameError) {
      return res.status(httpStatus.FORBIDDEN).send(error.message);  
    }

    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
}

export async function getGameByPath(req: Request, res: Response) {
  const { path } = req.params;

  try {
    const result = await gameService.listGameByPath(path);
    return res.status(httpStatus.OK).send({ game: result });
  } catch (error) {
    if (error.name === Errors.invalidPathError) {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
}

export async function getPlayerToken(req: Request, res: Response) {
  const { userId } = res.locals.tokenData;
  const { path } = req.params;

  try {
    const result = await gameService.sendPlayerToken({ userId, path });
    return res.status(httpStatus.OK).send({ playerToken: result });
  } catch (error) {
    if (error.name === Errors.invalidPathError) {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    if (error.name === Errors.cannotJoinGameError) {
      return res.status(httpStatus.FORBIDDEN).send(error.message);
    }

    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
}

export async function patchGame(req: Request, res: Response) {
  const { resultToken } = req.body;

  try {
    const result = await gameService.finishGame(resultToken);
    return res.status(httpStatus.OK).send({ game: result });
  } catch (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.message);
  }
}

export async function getGames(req: Request, res: Response) {
  const username = req.query.u as string;

  try {
    const result = await gameService.listGames(username);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}
