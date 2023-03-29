import { Router, Response } from "express";

import { validateSchema, verifyToken } from "../middlewares";
import { signUpSchema, signInSchema } from "../schemas";
import { signUp, signIn, getToken, getData, signOut } from "../controllers";

const authenticationRouter = Router();
const notImplement = (_: any, res: Response) => res.sendStatus(501);

authenticationRouter.post("/sign-up", validateSchema(signUpSchema), signUp);
authenticationRouter.post("/sign-in", validateSchema(signInSchema), signIn);
authenticationRouter.post("/logout", verifyToken, signOut);
authenticationRouter.get("/data", verifyToken, getData);
authenticationRouter.get("/token", getToken);
authenticationRouter.post("/oauth/sign-in", notImplement);

export { authenticationRouter };