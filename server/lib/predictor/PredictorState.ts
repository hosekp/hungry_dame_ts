import { State } from "../game/state";
import { createScore, PredictorScore } from "./PredictorScore";
import {
  blackDame,
  blackPawn,
  Pieces,
  whiteDame,
  whitePawn
} from "../game/pieces/pieces";
import { Piece } from "../game/pieces/piece";
import { Alignment } from "../game/alignment";
import { Predictor } from "./Predictor";

export const blackPicker = (
  best: PredictorScore | null,
  now: PredictorScore | null
) => {
  if (!now || !best) return best || now;
  if (best.score === now.score) {
    return best.length < now.length ? best : now;
  }
  return best.score < now.score ? best : now;
};
export const whitePicker = (
  best: PredictorScore | null,
  now: PredictorScore | null
) => {
  if (!now || !best) return best || now;
  if (best.score === now.score) {
    return best.length < now.length ? best : now;
  }
  return best.score > now.score ? best : now;
};
export const blackComparator = (
  first: PredictorScore,
  second: PredictorScore
) => {
  if (first.score === second.score) {
    return first.length - second.length;
  }
  return first.score - second.score;
};
export const whiteComparator = (
  first: PredictorScore,
  second: PredictorScore
) => {
  if (first.score === second.score) {
    return first.length - second.length;
  }
  return second.score - first.score;
};
//----------------------------------------------------------------------------------------------------------------------
class PredictorState extends State {
  children: Array<PredictorState> | null = null;

  createState(
    alignment: Alignment,
    forcedPiece: number | null,
    isBlackPlaying: boolean
  ) {
    return new PredictorState(alignment, forcedPiece, isBlackPlaying);
  }

  assignValidMoves(): void {
    let result: Array<PredictorState> = [];
    const align = this.alignment;
    if (this.forcedPiece !== null) {
      const pos = this.forcedPiece;
      const piece = Pieces.getPiece(align[pos]) as Piece;
      //console.log("assignValidMoves".toLocaleUpperCase(), "forced");
      const result2 = this.enhance(piece.getPossibleJumps(pos, align), pos);
      return this.assignResult(result2, true);
    }
    const dames = this.findDamesOnTurn();
    // console.log("DAMES",dames);
    const dameProto = this.isBlackPlaying ? blackDame : whiteDame;
    if (dames.length > 0) {
      if (dames.some(pos => dameProto.canJump(pos, align))) {
        dames.forEach(pos => {
          if (dameProto.canJump(pos, align)) {
            result = result.concat(
              this.enhance(dameProto.getPossibleJumps(pos, align), pos)
            );
          }
        });
      }
      if (result.length > 0) {
        return this.assignResult(result, true);
      }
    }
    const pawnProto = this.isBlackPlaying ? blackPawn : whitePawn;
    const pawns = this.findPawnsOnTurn();
    // console.log("PAWNS",pawns);
    const canJump = pawns.some(pos => pawnProto.canJump(pos, align));
    if (canJump) {
      pawns.forEach(pos => {
        result = result.concat(
          this.enhance(pawnProto.getPossibleJumps(pos, align), pos)
        );
      });
      return this.assignResult(result, true);
    } else {
      dames.forEach(pos => {
        result = result.concat(
          this.enhance(dameProto.getPossibleMoves(pos, align), pos)
        );
      });
      pawns.forEach(pos => {
        result = result.concat(
          this.enhance(pawnProto.getPossibleMoves(pos, align), pos)
        );
      });
      return this.assignResult(result, false);
    }
  }

  move(piecePos: number, target: number): PredictorState {
    const result = super.move(piecePos, target) as PredictorState;
    return Predictor.states[result.id] || result;
  }

  enhance(result: number[], source: number) {
    return result.map(target => this.move(source, target));
  }

  assignResult(children: PredictorState[], isJumping: boolean): void {
    this.children = children;
    let queue;
    if (isJumping) {
      queue = Predictor.priorityQueue;
    } else {
      queue = Predictor.queue;
    }
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!Predictor.states[child.id]) {
        Predictor.states[child.id] = child;
        queue.push(child);
      }
    }
  }

  compute() {
    // console.log("COMPUTE", this.children && this.children.length, "CHILDREN");
    if (this.children === null) {
      return this.computeThis();
    }
    if (this.children.length === 0) {
      return;
    }
    const children = this.children;
    for (let i = 0; i < children.length; i++) {
      Predictor.priorityQueue.push(children[i]);
    }
  }

  computeThis() {
    const id = this.id;
    this.assignValidMoves();
    if (!this.children) {
      throw new Error("no children " + id);
    }
  }

  getBestOption(path: PredictorState[]): PredictorScore | null {
    if (path.includes(this)) {
      // console.log("ALREADY ON PATH");
      return null;
    }
    path = path.slice();
    path.push(this);
    if (this.children && this.children.length) {
      const scores = this.children.map(child => child.getBestOption(path));
      const comparator = this.isBlackPlaying ? blackPicker : whitePicker;
      const bestResult = scores.reduce(comparator);
      // console.log(
      //   "COMPARE",
      //   this.isBlackPlaying ? "black" : "white",
      //   scores.map(score => score.score),
      //   bestResult.score,
      //   bestResult.length,
      //   bestResult[bestResult.length - 1].alignment.join("")
      // );
      return bestResult;
    } else {
      let blackValue = 0;
      let whiteValue = 0;
      const align = this.alignment;
      for (let i = 0; i < 32; i++) {
        const piece = Pieces.getPiece(align[i]);
        if (piece === null) continue;
        if (piece.isBlack) {
          if (piece.isDame) {
            blackValue += 20;
          } else {
            blackValue += 8 + Math.floor(i / 8);
          }
        } else {
          if (piece.isDame) {
            whiteValue += 20;
          } else {
            whiteValue += 8 + Math.floor((31 - i) / 8);
          }
        }
      }
      if (whiteValue === 0) {
        return createScore(path, 100000000000, "w");
      }
      if (blackValue === 0) {
        return createScore(path, -100000000000, "b");
      }
      if (this.children && this.children.length === 0) {
        return createScore(path, 0, "=");
      }
      return createScore(path, blackValue - whiteValue);
    }
  }
}

export default PredictorState;
