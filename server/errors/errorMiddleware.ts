import { NextFunction, Request, Response } from 'express';
import ServerError from "./server-error";

function errorMiddleware(error: ServerError, request: Request, response: Response, next: NextFunction) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const stack = error.stack;
  response
    .status(status)
    .send({
      status,
      message,
      stack
    })
}

export default errorMiddleware;