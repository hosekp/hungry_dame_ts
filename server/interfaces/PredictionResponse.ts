import {PredictionType} from "./PredictionType";

export interface PredictionResponse {
  predictions: PredictionType[],
  ratio:number,
  queue: number
}
