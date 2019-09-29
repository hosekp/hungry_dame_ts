import {Alignment, PieceSign} from "../alignment";
import { Pieces } from "./pieces";
import { pawnBlackMoves, pawnWhiteMoves } from "./constants";
import {Piece} from "./piece";

export class Pawn implements Piece{
  readonly isBlack: boolean;
  readonly sign: PieceSign;
  constructor(isBlack: boolean) {
    this.isBlack = isBlack;
    this.sign=isBlack?"b":"w";
  }

  canJump(position: number, alignment: Alignment): boolean {
    const movesGroups = (this.isBlack ? pawnBlackMoves : pawnWhiteMoves)[
      position
      ];
    for (let i = 0; i < movesGroups.length; i++) {
      const moveGroup = movesGroups[i];
      if (
        Pieces.isEnemy(alignment[moveGroup[0]], this.isBlack) &&
        alignment[moveGroup[1]] === "-"
      ) {
        return true;
      }
    }
    return false;
  }
  canMove(position: number, alignment: Alignment): boolean {
    const movesGroups = (this.isBlack ? pawnBlackMoves : pawnWhiteMoves)[
      position
      ];
    for (let i = 0; i < movesGroups.length; i++) {
      if (alignment[movesGroups[i][0]] === "-") {
        return true;
      }
    }
    return false;
  }
  getPossibleJumps(position: number, alignment: Alignment): Array<number> {
    const result: Array<number> = [];
    const movesGroups = (this.isBlack ? pawnBlackMoves : pawnWhiteMoves)[
      position
      ];
    for (let i = 0; i < movesGroups.length; i++) {
      const moveGroup = movesGroups[i];
      if (
        Pieces.isEnemy(alignment[moveGroup[0]], this.isBlack) &&
        alignment[moveGroup[1]] === "-"
      ) {
        result.push(moveGroup[1]);
      }
    }
    return result;
  }
  getPossibleMoves(position: number, alignment: Alignment): Array<number> {
    const result: Array<number> = [];
    const movesGroups = (this.isBlack ? pawnBlackMoves : pawnWhiteMoves)[
      position
      ];
    for (let i = 0; i < movesGroups.length; i++) {
      const moveGroup = movesGroups[i];
      if (alignment[moveGroup[0]] === "-") {
        result.push(moveGroup[0]);
      }
    }
    return result;
  }
}
