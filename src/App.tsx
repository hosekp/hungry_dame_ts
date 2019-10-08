import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { GameStatus } from "../server/interfaces/game-status";
import { movePiece, resetGame } from "./lib/gateway";
import Board from "./components/board/Board";
import Victory from "./components/Victory";
import Sidebar from "./components/sidebar/Sidebar";

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus | null>(null);
  const restart = useCallback(() => {
    resetGame().then(setStatus);
  }, []);
  useEffect(restart, []);
  // @ts-ignore
  window.alignment = status && status.alignment;
  const moveHandler = useCallback((start: number, target: number) => {
    movePiece(start, target).then(status => status && setStatus(status));
  }, []);
  if (status === null) return null;
  return (
    <div className="App">
      <div className="App__right">
        <Sidebar status={status} />
      </div>
      <div className="App__left">
        <Board
          onMove={moveHandler}
          alignment={status.alignment}
          playablePieces={status.playablePieces}
        />
      </div>
      <Victory end={status.gameEnded} onRestart={restart} />
    </div>
  );
};

export default App;
