import React, { FC } from "react";
import "./Piece.css";

type PieceProps = {
  selected: boolean;
  sign: string;
  playable: boolean;
};

const Piece: FC<PieceProps> = ({ selected, sign, playable }: PieceProps) => {
  const isDame = sign === "W" || sign === "B";
  const isBlack = sign === "b" || sign === "B";
  let className =
    "Piece" +
    (isDame ? " dame" : "") +
    (isBlack ? " black" : "") +
    (selected ? " selected" : "") +
    (playable ? " playable" : "");
  return (
    <div className={className}>
      {isDame && <div className="Piece--minor" />}
    </div>
  );
};

export default Piece;
