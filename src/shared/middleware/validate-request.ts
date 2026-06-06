import type { RequestHandler } from "express";

type Parser<T> = {
  parse(value: unknown): T;
};

type RequestSchema = {
  body?: Parser<unknown>;
  params?: Parser<unknown>;
  query?: Parser<unknown>;
};

export const validateRequest = (schema: RequestSchema): RequestHandler => {
  return (req, _res, next) => {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }

    if (schema.params) {
      req.params = schema.params.parse(req.params) as typeof req.params;
    }

    if (schema.query) {
      req.query = schema.query.parse(req.query) as typeof req.query;
    }

    next();
  };
};
