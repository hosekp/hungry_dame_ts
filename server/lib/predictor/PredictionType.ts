import { AlignmentDiff } from "./alignmentDiff";
import { EndState } from "./PredictorScore";

export interface PredictionType {
  move: AlignmentDiff;
  moves:number,
  score: number;
  state: EndState;
}
