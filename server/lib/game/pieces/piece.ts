import {Alignment, PieceSign} from "../alignment";

export interface Piece {
  readonly isBlack: boolean;
  readonly isDame: boolean;
  readonly sign: PieceSign;

  canJump(position: number, alignment: Alignment): boolean;
  canMove(position: number, alignment: Alignment): boolean;
  getPossibleJumps(position: number, alignment: Alignment): Array<number>;
  getPossibleMoves(position: number, alignment: Alignment): Array<number>;
}
