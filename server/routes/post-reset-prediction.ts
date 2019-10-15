import { Request, Response } from "express";
import { game } from "../lib/game/game";
import { predictor } from "../lib/predictor/Predictor";

export const postResetPrediction = (req: Request, res: Response) => {
  predictor.reset(game.state);
  res.send(game.getStatus());
};
