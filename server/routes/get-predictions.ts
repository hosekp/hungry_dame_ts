import { Request, Response } from "express";
import { Predictor, predictor } from "../lib/predictor/Predictor";
import { PredictionResponse } from "../interfaces/PredictionResponse";

export const getPredictions = (req: Request, res: Response) => {
  const predictions = predictor.getPredictions();
  const response: PredictionResponse = {
    predictions,
    ratio: predictor.currentSteps / predictor.maxSteps,
    queue: Predictor.queue.length + Predictor.priorityQueue.length
  };
  res.send(response);
};
