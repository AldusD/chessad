import { SignUpParams } from "@/services";
import Joi from "joi";

export const signUpSchema = Joi.object<SignUpParams>({
    username: Joi.string().min(4).pattern(/^[A-Za-z0-9 ]+$/).required().messages({ 'string.pattern.base': "username can not contain special characters"}),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
