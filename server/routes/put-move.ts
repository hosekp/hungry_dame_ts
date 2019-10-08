import { NextFunction, Request, Response } from "express";
import { game } from "../lib/game/game";
import ArgumentError from "../errors/argument-error";
import { predictor } from "../lib/predictor/Predictor";
export const putMove = (req: Request, res: Response, next: NextFunction) => {
  const piecePos = parseInt(req.params.piece);
  const target = parseInt(req.params.target);
  if (isNaN(piecePos) || isNaN(target)) {
    return next(new ArgumentError(":piece or :target is not integer"));
  }
  const errorMessage = game.move(piecePos, target);
  if (errorMessage) {
    return next(new ArgumentError(errorMessage));
  }
  predictor.move(game.state);
  res.send(game.getStatus());
};
