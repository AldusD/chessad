import { SignInParams, SignUpParams } from "@/services";
import Joi from "joi";

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signUpSchema = Joi.object<SignUpParams>({
    username: Joi.string().pattern(/^[A-Za-z0-9 ]+$/).required().messages({ 'string.pattern.base': "username can not contain special characters"}),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
