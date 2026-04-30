import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export const validate =
  (schema: ObjectSchema, property: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(error);
    }

    if (property === "body") {
      req.body = value;
    } else if (property === "query") {
      Object.assign(req.query, value);
    } else if (property === "params") {
      Object.assign(req.params, value);
    }

    next();
  };
