import { verifyToken } from "../middlewares";
import { getGameByPath, postJoinGame, getPlayerToken, patchGame } from "../controllers";
import { Router, Response } from "express";

const gameRouter = Router();
const notImplement = (_: any, res: Response) => res.sendStatus(501);

gameRouter.get("/", notImplement);
gameRouter.patch("/", patchGame);
gameRouter.get("/:path", getGameByPath);
gameRouter.get("/:path/token", verifyToken, getPlayerToken);
gameRouter.post("/join", verifyToken, postJoinGame);

export { gameRouter };