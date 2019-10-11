import { AlignmentDiff } from "../lib/predictor/alignmentDiff";
import { EndState } from "../lib/predictor/PredictorScore";

export interface PredictionType {
  move: AlignmentDiff;
  moves:number,
  score: number;
  state: EndState;
}
