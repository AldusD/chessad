import { Router, Response } from "express";

import { validateSchema } from "../middlewares";
import { signUpSchema, signInSchema } from "../schemas";
import { signUp, singIn } from "../controllers";

const gameSettingRouter = Router();
const notImplement = (_: any, res: Response) => res.sendStatus(501);

gameSettingRouter.get("/", notImplement);
gameSettingRouter.post("/", validateSchema(signUpSchema), signUp);
gameSettingRouter.post("/oauth/sign-in", notImplement);

export { gameSettingRouter };