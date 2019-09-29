import { NextFunction, Request, Response } from "express";
import { game } from "../lib/game/game";
import { PossibleMove } from "../interfaces/possible-move";
import ArgumentError from "../errors/argument-error";

export const getMoves = (req: Request, res: Response, next: NextFunction) => {
  const pos = parseInt(req.params.piece);
  if (isNaN(pos)) {
    return next(
      new ArgumentError(`Error: "${req.params.piece}" is not integer => ${pos}`)
    );
  }
  const result: PossibleMove = {
    piece: pos,
    moves: game.getPossibleMoves(pos)
  };
  res.send(result);
};
