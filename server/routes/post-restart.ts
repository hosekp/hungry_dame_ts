import { Request, Response } from "express";
import { game } from "../lib/game/game";
import { predictor } from "../lib/predictor/Predictor";

export const postRestart = (req: Request, res: Response) => {
  game.reset();
  predictor.reset(game.state);
  res.send(game.getStatus());
};
