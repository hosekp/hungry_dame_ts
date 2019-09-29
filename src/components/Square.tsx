import React, { FC } from "react";

import "./Square.css";
import Piece from "./Piece";

type SquareProps = {
  sign: string;
  playable: boolean;
  index: number;
  allowed: boolean;
  onClick: any;
  selected: boolean;
};

const Square: FC<SquareProps> = ({
  sign,
  playable,
  index,
  allowed,
  onClick,
  selected
}: SquareProps) => {
  let piece = null;
  if (sign !== "-") {
    piece = <Piece selected={selected} sign={sign} playable={playable} />;
  }
  const className = "Square black" + (allowed ? " allowed" : "");
  return (
    <div
      className={className}
      onClick={() => onClick(index)}
    >
      {piece}
    </div>
  );
};
export const DummySquare: FC = () => {
  return <div className="Square dummy" />;
};
export default Square;
