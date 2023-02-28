import { Router, Response } from "express";

import { validateSchema } from "../middlewares";
import { signUpSchema, signInSchema } from "../schemas";
import { signUp, singIn } from "../controllers";

const authenticationRouter = Router();
const notImplement = (_: any, res: Response) => res.sendStatus(501);

authenticationRouter.post("/sign-up", validateSchema(signUpSchema), signUp);
authenticationRouter.post("/sign-in", validateSchema(signInSchema), singIn);
authenticationRouter.post("/oauth/sign-in", notImplement);

export { authenticationRouter };