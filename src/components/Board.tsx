import React, { FC, useState, Fragment, useEffect } from "react";
import "./Board.css";
import Square, { DummySquare } from "./Square";
import { getMoves } from "../lib/gateway";
import { PossibleMove } from "../../server/interfaces/possible-move";

type BoardProps = {
  alignment: Array<string>;
  playablePieces: Array<number>;
  onMove: (start: number, target: number) => void;
};

const Board: FC<BoardProps> = ({
  alignment,
  playablePieces,
  onMove
}: BoardProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<PossibleMove | null>(null);

  useEffect(() => {
    if (playablePieces.length === 1) {
      setSelected(playablePieces[0]);
    }
  }, [playablePieces]);
  useEffect(() => {
    if (selected === null) return;
    getMoves(selected).then(setPossibleMoves);
  }, [selected]);

  const squares = alignment.map((sign, index) => {
    const allowed = possibleMoves ? possibleMoves.moves.includes(index) : false;
    const playable = playablePieces.includes(index);
    let onClick;
    if (allowed && selected !== null) {
      onClick = (target: number) => {
        setSelected(null);
        setPossibleMoves(null);
        onMove(selected, target);
      };
    } else if (playable) {
      onClick = setSelected;
    }
    return (
      <Fragment key={index}>
        {index % 8 < 4 && <DummySquare />}
        <Square
          sign={sign}
          playable={playable}
          allowed={allowed}
          index={index}
          onClick={onClick}
          selected={selected === index}
        />
        {index % 8 > 3 && <DummySquare />}
      </Fragment>
    );
  });

  return (
    <div className="Board__outer">
      <div className="Board">{squares}</div>
    </div>
  );
};

export default Board;
