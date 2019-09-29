import { Request, Response } from "express";
import { game } from "../lib/game/game";

export const postRestart = (req: Request, res: Response) => {
  game.reset();
  res.send(game.getStatus());
};
