import { Router, Response } from "express";

import { validateSchema, verifyToken } from "../middlewares";
import { gameSettingSchema } from "../schemas";
import { getGameSettings, getGameSetting, postGameSetting } from "../controllers";

const gameSettingRouter = Router();
const notImplement = (_: any, res: Response) => res.sendStatus(501);

gameSettingRouter.get("/", getGameSettings);
gameSettingRouter.post("/", verifyToken, validateSchema(gameSettingSchema), postGameSetting);
gameSettingRouter.get("/:path", getGameSetting);
gameSettingRouter.put("/join/:gameId", verifyToken, notImplement);

export { gameSettingRouter };