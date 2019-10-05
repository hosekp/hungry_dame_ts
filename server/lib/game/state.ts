import { Alignment, getDirection } from "./alignment";
import { Pieces } from "./pieces/pieces";

export class State {
  readonly alignment: Alignment;
  readonly forcedPiece: number | null;
  readonly isBlackPlaying: boolean;

  constructor(
    alignment: Alignment,
    forcedPiece: number | null,
    isBlackPlaying: boolean
  ) {
    this.alignment = alignment;
    this.forcedPiece = forcedPiece;
    this.isBlackPlaying = isBlackPlaying;
  }

  findPiecesOnTurn(): Array<number> {
    if (this.forcedPiece !== null) return [this.forcedPiece];
    const result: Array<number> = [];
    const align = this.alignment;
    const isBlack = this.isBlackPlaying;
    for (let i = 0; i < 32; i++) {
      if (Pieces.isMine(align[i], isBlack)) {
        result.push(i);
      }
    }
    return result;
  }
  findDamesOnTurn(): Array<number> {
    const result: Array<number> = [];
    const align = this.alignment;
    const dameSign = this.isBlackPlaying ? "B" : "W";
    for (let i = 0; i < 32; i++) {
      if (align[i] === dameSign) {
        result.push(i);
      }
    }
    return result;
  }
  move(piecePos: number, target: number): State {
    let piece = Pieces.getPiece(this.alignment[piecePos]);
    const direction = getDirection(piecePos, target);
    const newAlign = this.alignment.slice();
    const canJump = piece.canJump(piecePos, this.alignment);
    if (canJump) {
      let mover = piecePos;
      while (mover !== target) {
        newAlign[mover] = "-";
        mover = direction[mover];
      }
    } else {
      newAlign[piecePos] = "-";
    }
    newAlign[target] = piece.sign;
    if (canJump && piece.canJump(target, newAlign)) {
      if (Pieces.shouldPromote(piece, target)) {
        newAlign[target] = Pieces.promote(piece).sign;
      }
      return new State(newAlign, target, this.isBlackPlaying);
    }
    if (Pieces.shouldPromote(piece, target)) {
      newAlign[target] = Pieces.promote(piece).sign;
    }
    return new State(newAlign, null, !this.isBlackPlaying);
  }
  // checkEnd():string{
  //
  // }
}
