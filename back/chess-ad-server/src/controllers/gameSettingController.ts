import { Request, Response } from "express";
import httpStatus from "http-status";

import { Errors } from "../services/errors";
import gameSettingService, { GameSettingParams } from "../services/gameSettingService";

export async function getGameSettings(req: Request, res: Response) {
  try {
    const result = await gameSettingService.listGameSettings();
    return res.status(httpStatus.OK).send({ games: result });
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getGameSetting(req: Request, res: Response) {
  const { path } = req.params;

  try {
    const result = await gameSettingService.listGameSettingByPath(path);
    return res.status(httpStatus.OK).send({ game: result });
  } catch (error) {
    if (error.name === Errors.invalidPathError) return res.send(error.message).status(httpStatus.GONE);
    return res.sendStatus(httpStatus.GONE);
  }
}

export async function postGameSetting(req: Request, res: Response) {
  const { time, increment, side } = req.body;
  const { userId } = res.locals.tokenData;
  const data: GameSettingParams = { time: Number(time), increment: Number(increment), side, userId };

  try {
    const result = await gameSettingService.createGameSetting(data);
    return res.status(httpStatus.CREATED).send({ path: result.path, playerToken: result.playerToken });
  } catch (error) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
}
