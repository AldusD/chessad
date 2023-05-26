import { verifyToken } from "../middlewares";
import { getGameByPath, postJoinGame, getPlayerToken, patchGame, getGames } from "../controllers";
import { Router, Response } from "express";

const gameRouter = Router();

gameRouter.get("/", getGames);
gameRouter.patch("/", patchGame);
gameRouter.get("/:path", getGameByPath);
gameRouter.get("/:path/token", verifyToken, getPlayerToken);
gameRouter.post("/join", verifyToken, postJoinGame);

export { gameRouter }; 