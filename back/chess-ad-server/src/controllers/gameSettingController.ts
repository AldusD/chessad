import { Request, Response } from "express";
import httpStatus from "http-status";

import gameSettingService from "../services/gameSettingService";

export async function getGameSettings(req: Request, res: Response) {
  try {
    const result = await gameSettingService.listGameSettings();
    
    return res.status(httpStatus.OK).send({ games: result });
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postGameSetting(req: Request, res: Response) {
  const { time, increment, side } = req.body;
  const { userId } = res.locals.tokenData;
  try {
    const result = await gameSettingService.createGameSetting({ time, increment, side, userId });
    return res.status(httpStatus.CREATED).send({ path: result });
  } catch (error) {
    console.log(error)    
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }

}
