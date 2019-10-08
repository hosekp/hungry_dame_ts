import PredictorState from "./PredictorState";

export type EndState = "b" | "w" | "=" | undefined;

export interface PredictorScore extends Array<PredictorState>{
  /** positive value means white is winning */
  score:number;
  state: EndState;
}

export const createScore=(path:Array<PredictorState>,score:number,state?:EndState):PredictorScore=>{
  (path as PredictorScore).score=score;
  (path as PredictorScore).state=state;
  return (path as PredictorScore);
};