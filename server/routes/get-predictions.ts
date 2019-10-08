import { Request, Response } from "express";
import { predictor } from "../lib/predictor/Predictor";

export const getPredictions = (req: Request, res: Response) => {
  const predictions = predictor.getPredictions();
  res.send(predictions);
};
