import httpStatus from "http-status";
import { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

import { invalidDataError } from "../errors";

export function validateSchema(schema: ObjectSchema): ValidationMiddleware {
  return validate(schema);
}

function validate(schema: ObjectSchema): ValidationMiddleware {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
  
    if (!error) {
      next();
    } else {
      res.status(httpStatus.UNPROCESSABLE_ENTITY).send(invalidDataError(error.details.map((d) => d.message)));
    }
  };
}

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction)=> void;
