import { Router, Response } from "express";

import { validateSchema, verifyToken } from "../middlewares";
import { gameSettingSchema } from "../schemas";
import { getGameSettings, getGameSetting, postGameSetting } from "../controllers";

const gameSettingRouter = Router();

gameSettingRouter.get("/", getGameSettings);
gameSettingRouter.post("/", verifyToken, validateSchema(gameSettingSchema), postGameSetting);
gameSettingRouter.get("/:path", getGameSetting);

export { gameSettingRouter };