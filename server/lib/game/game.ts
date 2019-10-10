import { State } from "./state";
import { blackDame, Pieces, whiteDame } from "./pieces/pieces";
import { Alignment, createAlignment } from "./alignment";
import { GameStatus } from "../../interfaces/game-status";

const initialAlignment: Alignment = createAlignment(
  // "bBbBbbbBbbbb--------wwWwWwwwWwww"
  // "bbbbbbbbbbbb--------wwwwwwwwwwww"
  // "b-------------------wwwwwwwwwwww"
  // "----------w------b---W----------"
  "--------b-------ww----wwwwwwwwww"
);
const initialState: State = new State(initialAlignment, null, false);

export class Game {
  state: State = initialState;

  reset() {
    this.state = initialState;
  }

  findPlayablePieces(): Array<number> {
    if (this.state.forcedPiece !== null) return [this.state.forcedPiece];
    const align = this.state.alignment;
    const dames = this.state.findDamesOnTurn();
    if (dames.length > 0) {
      const dameProto = this.state.isBlackPlaying ? blackDame : whiteDame;
      if (dames.some(pos => dameProto.canJump(pos, align))) {
        return dames.filter(pos => dameProto.canJump(pos, align));
      }
    }
    const pieces = this.state.findPiecesOnTurn();
    const canJump = pieces.some(pos =>
      Pieces.getPiece(align[pos]).canJump(pos, align)
    );
    if (canJump) {
      return pieces.filter(pos =>
        Pieces.getPiece(align[pos]).canJump(pos, align)
      );
    } else {
      return pieces.filter(pos =>
        Pieces.getPiece(align[pos]).canMove(pos, align)
      );
    }
  }

  getPossibleMoves(pos: number): Array<number> {
    const align = this.state.alignment;
    const sign = align[pos];
    const piece = Pieces.getPiece(sign);
    if (piece === null || piece.isBlack !== this.state.isBlackPlaying)
      return [];
    const canJump = piece.canJump(pos, align);
    if (canJump) {
      return piece.getPossibleJumps(pos, align);
    } else {
      return piece.getPossibleMoves(pos, align);
    }
  }

  getStatus(): GameStatus {
    let playablePieces = this.findPlayablePieces();
    let gameEnded = null;
    if (playablePieces.length === 0) {
      if (this.state.isPat()) {
        gameEnded = "pat";
      } else {
        gameEnded = this.state.isBlackPlaying ? "black" : "white";
      }
    }
    return {
      alignment: this.state.alignment,
      isBlackPlaying: this.state.isBlackPlaying,
      playablePieces,
      gameEnded
    };
  }

  move(piecePos: number, target: number): string {
    const align = this.state.alignment;
    const piece = Pieces.getPiece(align[piecePos]);
    if (piece === null) {
      return `Missing piece on ${piecePos}`;
    }
    if (piece.isBlack !== this.state.isBlackPlaying) {
      return `Piece on ${piecePos} is not on turn`;
    }
    const moves = this.getPossibleMoves(piecePos);
    if (!moves.includes(target)) {
      return `Piece ${piecePos} cannot move to ${target}`;
    }
    this.state = this.state.move(piecePos, target);
    return null;
  }
}

export const game = new Game();
