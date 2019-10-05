import { Piece } from "./piece";
import { Alignment, PieceSign } from "../alignment";
import { dameJumps } from "./constants";
import { Pieces } from "./pieces";

export class Dame implements Piece {
  readonly isBlack: boolean;
  readonly sign: PieceSign;
  constructor(isBlack: boolean) {
    this.isBlack = isBlack;
    this.sign = isBlack ? "B" : "W";
  }

  canJump(position: number, alignment: Alignment): boolean {
    const jumpsGroups = dameJumps[position];
    let piece;
    for (let i = 0; i < jumpsGroups.length; i++) {
      let jumpGroup = jumpsGroups[i];
      for (let j = 0; j < jumpGroup.length - 1; j++) {
        piece = alignment[jumpGroup[j]];
        if (piece !== "-") {
          if (Pieces.isMine(piece, this.isBlack)) break;
          if (alignment[jumpGroup[j + 1]] === "-") {
            return true;
          }
          break;
        }
      }
    }
    return false;
  }
  canMove(position: number, alignment: Alignment): boolean {
    const jumpsGroups = dameJumps[position];
    for (let i = 0; i < jumpsGroups.length; i++) {
      if (alignment[jumpsGroups[i][0]] === "-") {
        return true;
      }
    }
    return false;
  }
  getPossibleJumps(position: number, alignment: Alignment): Array<number> {
    const result: Array<number> = [];
    const jumpsGroups = dameJumps[position];
    for (let i = 0; i < jumpsGroups.length; i++) {
      let jumpGroup = jumpsGroups[i];
      for (let j = 0; j < jumpGroup.length - 1; j++) {
        const piece = alignment[jumpGroup[j]];
        if (piece !== "-") {
          if (Pieces.isMine(piece, this.isBlack)) break;
          if (alignment[jumpGroup[j + 1]] === "-") {
            result.push(jumpGroup[j + 1]);
            for (let a = j + 2; a < jumpGroup.length; a++) {
              if (alignment[jumpGroup[a]] === "-") {
                result.push(jumpGroup[a]);
              } else {
                break;
              }
            }
          }
          break;
        }
      }
    }
    return result;
  }
  getPossibleMoves(position: number, alignment: Alignment): Array<number> {
    const result: Array<number> = [];
    const jumpsGroups = dameJumps[position];
    let piece;
    for (let i = 0; i < jumpsGroups.length; i++) {
      let jumpGroup = jumpsGroups[i];
      for (let j = 0; j < jumpGroup.length; j++) {
        piece = alignment[jumpGroup[j]];
        if (piece !== "-") break;
        result.push(jumpGroup[j]);
      }
    }
    return result;
  }
}
