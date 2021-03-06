import PredictorState, {
  blackComparator,
  whiteComparator
} from "./PredictorState";
import { State } from "../game/state";
import { createAlignment } from "../game/alignment";
import { PredictorScore } from "./PredictorScore";
import { alignmentDiff } from "./alignmentDiff";
import { PredictionType } from "../../interfaces/PredictionType";
import { PredictionResponse } from "../../interfaces/PredictionResponse";
import Stream from "./stream";

import Immediate = NodeJS.Immediate;

export class Predictor {
  currentState: PredictorState = new PredictorState(
    createAlignment("bbbbbbbbbbbb--------wwwwwwwwwwww"),
    null,
    false
  );
  static queue: PredictorState[] = [];
  static priorityQueue: PredictorState[] = [];
  static queuePointer: number = 0;
  static priorityPointer: number = 0;
  static states: { [id: string]: PredictorState } = {};
  timeout: Immediate | null = null;
  maxSteps: number = 1000000;
  currentSteps: number = 0;
  stream: Stream<PredictionResponse> = new Stream<PredictionResponse>();

  reset(initial: State) {
    const predictorInitial = this.currentState.createState(
      initial.alignment,
      initial.forcedPiece,
      initial.isBlackPlaying
    );
    this.currentState = predictorInitial;
    Predictor.priorityQueue = [];
    Predictor.priorityPointer = 0;
    Predictor.queue = [predictorInitial];
    Predictor.queuePointer = 0;
    Predictor.states = {};
    this.currentSteps = 0;
    this.oneBatch();
  }

  move(state: State) {
    if (this.timeout) {
      clearImmediate(this.timeout);
    }
    this.currentSteps = 0;
    if (this.currentState.children === null) {
      //console.log("PREBATCH", this.currentState.alignment.join(""));
      this.oneBatch(true);
    }
    const children = this.currentState.children as PredictorState[];
    if (!children) {
      console.log("NO CHILDREN", this.currentState.alignment.join(""));
    }
    const align = state.alignment;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.alignment.every((sign, index) => sign === align[index])) {
        // console.log("Move to " + child.alignment.join(""));
        this.currentState = child;
        Predictor.priorityQueue = [];
        Predictor.priorityPointer = 0;
        Predictor.queue = [child];
        Predictor.queuePointer = 0;
        Predictor.states = {};
        this.sendPrediction(false);
        this.oneBatch();
        return;
      }
    }
    throw new Error("Predictor.move cannot find same state");
  }
  kill() {
    if (this.timeout) {
      clearImmediate(this.timeout);
    }
  }

  oneBatch(justOne?: boolean) {
    if (this.timeout) {
      clearImmediate(this.timeout);
    }
    if (this.currentSteps === this.maxSteps) {
      console.log("Computing finished - maxSteps reached", [
        Predictor.priorityQueue.length - Predictor.priorityPointer,
        Predictor.queue.length - Predictor.queuePointer
      ]);
      this.sendPrediction(true);
      return;
    }
    if ((5 * this.currentSteps) % this.maxSteps < 5) {
      this.sendPrediction(false);
    }
    this.currentSteps++;
    try {
      if (Predictor.priorityQueue.length > Predictor.priorityPointer) {
        Predictor.priorityQueue[Predictor.priorityPointer].compute();
        Predictor.priorityPointer++;
      } else if (Predictor.queue.length > Predictor.queuePointer) {
        Predictor.queue[Predictor.queuePointer].compute();
        Predictor.queuePointer++;
      } else {
        console.log("Computing finished - no more states to compute", [
          Predictor.priorityQueue.length,
          Predictor.queue.length
        ]);
        this.sendPrediction(true);
        return;
      }
    } catch (e) {
      console.log("NO CHILDREN", this.currentSteps);
      throw e;
    }
    if (justOne) return;
    this.timeout = setImmediate(() => this.oneBatch(), 0);
  }

  getPredictions(force: boolean): PredictionType[] {
    if (!this.currentState.children) {
      return [];
    }
    if (!force && this.currentSteps < this.maxSteps) {
      if (Predictor.queue.length !== Predictor.queuePointer) {
        return [];
      }
    }
    const predictions = this.currentState.children
      .map(child => child.getBestOption([]))
      .filter(score => score) as PredictorScore[];
    const comparator = this.currentState.isBlackPlaying
      ? blackComparator
      : whiteComparator;
    predictions.sort(comparator);
    return predictions.map((prediction: PredictorScore) => ({
      move: alignmentDiff(
        this.currentState.alignment,
        // prediction[prediction.length - 1].alignment
        prediction[0].alignment
      ),
      moves: prediction.length,
      score: prediction.score,
      state: prediction.state
    }));
  }
  sendPrediction(force: boolean) {
    const response: PredictionResponse = {
      predictions: this.getPredictions(force),
      ratio: this.currentSteps / this.maxSteps,
      queue: Predictor.queue.length + Predictor.priorityQueue.length
    };
    this.stream.add(response);
  }
}

export const predictor = new Predictor();
