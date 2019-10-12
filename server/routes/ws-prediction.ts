import { Request } from "express";
import { predictor } from "../lib/predictor/Predictor";
import { PredictionResponse } from "../interfaces/PredictionResponse";

export const wsPrediction = (ws, req: Request) => {
  const streamIndex = predictor.stream.listen((data: PredictionResponse) => {
    ws.send(JSON.stringify(data));
  });
  ws.on("close", () => {
    predictor.stream.clear(streamIndex);
  });
};
