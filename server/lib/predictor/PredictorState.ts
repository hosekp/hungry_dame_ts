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

export const blackPicker = (best: PredictorScore, now: PredictorScore) => {
  if (best.score === now.score) {
    return best.length < now.length ? best : now;
  }
  return best.score < now.score ? best : now;
};
export const whitePicker = (best: PredictorScore, now: PredictorScore) => {
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
      const result2 = this.enhance(piece.getPossibleJumps(pos, align), pos);
      return this.assignResult(result2, true);
    }
    const dames = this.findDamesOnTurn();
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
          this.enhance(dameProto.getPossibleJumps(pos, align), pos)
        );
      });
      pawns.forEach(pos => {
        result = result.concat(
          this.enhance(pawnProto.getPossibleJumps(pos, align), pos)
        );
      });
      return this.assignResult(result, false);
    }
  }

  move(piecePos: number, target: number): PredictorState {
    return super.move(piecePos, target) as PredictorState;
  }

  enhance(result: number[], source: number) {
    return result.map(target => this.move(source, target));
  }

  assignResult(children: PredictorState[], isJumping: boolean): void {
    this.children = children;
    if (isJumping) {
      for (let i = 0; i < children.length; i++) {
        Predictor.priorityQueue.push(children[i]);
      }
    } else {
      for (let i = 0; i < children.length; i++) {
        Predictor.queue.push(children[i]);
      }
    }
  }

  compute() {
    // console.log("Computing "+this.alignment.join("")+" "+(this.children && this.children.length));
    if (this.children === null) {
      return this.computeThis();
    }
    if (this.children.length === 0) {
      return;
    }
    this.children[0].compute();
  }

  computeThis() {
    this.assignValidMoves();
  }

  getBestOption(): PredictorScore {
    if (this.children&&this.children.length) {
      const scores = this.children.map(child => child.getBestOption());
      const comparator = this.isBlackPlaying ? blackPicker : whitePicker;
      const bestResult = scores.reduce(comparator);
      bestResult.push(this);
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
        return createScore([this], 100000000000, "w");
      }
      if (blackValue === 0) {
        return createScore([this], -100000000000, "b");
      }
      if (this.children.length === 0) {
        return createScore([this], 0, "=");
      }
      return createScore([this], blackValue - whiteValue);
    }
  }
}

export default PredictorState;
