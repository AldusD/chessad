import Joi from "joi";
import { GameSettingParams } from "@/services";

export const gameSettingSchema = Joi.object<GameSettingParams>({
  time: Joi.number().required(),
  increment: Joi.number().required(),
  side: Joi.string().valid('black', 'white', 'random').required()
  });
