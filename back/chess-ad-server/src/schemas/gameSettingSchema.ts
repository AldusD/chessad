import { SignUpParams } from "@/services";
import Joi from "joi";

export const signUpSchema = Joi.object<any>({
  time: Joi.number().required(),
  increment: Joi.number().required(),
  side: Joi.string().valid('black', 'white', 'random').required(),
  userId: Joi.string().required()
  });
