import Joi from "joi";
import { GameSettingParams } from "@/services";

export const gameSettingSchema = Joi.object<GameSettingParams>({
  time: Joi.number().min(1).required(),
  increment: Joi.number().min(0).required(),
  side: Joi.string().valid('black', 'white', 'random').required()
  });
