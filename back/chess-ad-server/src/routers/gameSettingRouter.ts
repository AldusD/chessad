import { Router, Response } from "express";

import { validateSchema, verifyToken } from "../middlewares";
import { getGameSettings, postGameSetting } from "../controllers";

const gameSettingRouter = Router();
const notImplement = (_: any, res: Response) => res.sendStatus(501);

gameSettingRouter.get("/", getGameSettings);
gameSettingRouter.post("/", verifyToken, postGameSetting);

export { gameSettingRouter };