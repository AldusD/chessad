import { Router, Response } from "express";

import { validateSchema } from "@/middlewares";
import { signUpSchema } from "@/schemas/authenticationSchema";
import { signUp } from "@/controllers";

const authenticationRouter = Router();
const notImplement = (_: any, res: Response) => res.sendStatus(501);

authenticationRouter.post("/sign-up", validateSchema(signUpSchema), signUp);
authenticationRouter.post("/sign-in", notImplement);
authenticationRouter.post("/oauth/sign-in", notImplement);

export { authenticationRouter };