import { postJoinGame } from "../controllers";
import { Router, Response } from "express";

const gameRouter = Router();
const notImplement = (_: any, res: Response) => res.sendStatus(501);

gameRouter.post("/join", postJoinGame);

export { gameRouter };