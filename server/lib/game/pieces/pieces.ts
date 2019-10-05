import { Piece } from "./piece";
import { Dame } from "./dame";
import { Pawn } from "./pawn";
export const whitePawn = new Pawn(false);
export const blackPawn = new Pawn(true);
export const whiteDame = new Dame(false);
export const blackDame = new Dame(true);

export class Pieces {
  static getPiece(sign: string): Piece | null {
    switch (sign) {
      case "w":
        return whitePawn;
      case "b":
        return blackPawn;
      case "W":
        return whiteDame;
      case "B":
        return blackDame;
      default:
        return null;
    }
  }
  static isMine(sign: string, meIsBlack: boolean): boolean {
    if (meIsBlack) {
      return sign === "b" || sign === "B";
    }
    return sign === "w" || sign === "W";
  }
  static isEnemy(sign: string, meIsBlack: boolean): boolean {
    if (meIsBlack) {
      return sign === "w" || sign === "W";
    }
    return sign === "b" || sign === "B";
  }
  static shouldPromote(piece: Piece, pos: number): boolean {
    if (piece === whitePawn) {
      return pos < 4;
    }
    if (piece === blackPawn) {
      return pos > 27;
    }
    return false;
  }
  static promote(piece: Piece): Piece {
    if (piece === whitePawn) {
      return whiteDame;
    }
    if (piece === blackPawn) {
      return blackDame;
    }
    return piece;
  }
}
