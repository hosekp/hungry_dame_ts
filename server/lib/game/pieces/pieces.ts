import { Piece } from "./piece";
import { Dame } from "./dame";
import {Pawn} from "./pawn";
const whitePawn = new Pawn(false);
const blackPawn = new Pawn(true);
const whiteDame = new Dame(false);
const blackDame = new Dame(true);

export class Pieces {
  static getPiece(sign: string): Piece|null {
    switch (sign) {
      case "w":return whitePawn;
      case "b":return blackPawn;
      case "W":return whiteDame;
      case "B":return blackDame;
      default: return null;
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
}
