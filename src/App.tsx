import React, {useCallback, useEffect, useState} from "react";
import "./App.css";
import { GameStatus } from "../server/interfaces/game-status";
import {movePiece, resetGame} from "./lib/gateway";
import Board from "./components/Board";

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus | null>(null);
  useEffect(() => {
    resetGame().then(setStatus);
  }, []);
  const moveHandler=useCallback((start:number,target:number)=>{
    movePiece(start,target).then(status=>status && setStatus(status));
  },[]);
  if (status === null) return null;
  return (
    <div className="App">
      <Board
        onMove={moveHandler}
        alignment={status.alignment}
        playablePieces={status.playablePieces}
      />
    </div>
  );
};

export default App;
