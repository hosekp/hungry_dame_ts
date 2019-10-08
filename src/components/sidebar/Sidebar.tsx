import React, { useCallback, useState } from "react";

import { GameStatus } from "../../../server/interfaces/game-status";
import { PredictionType } from "../../../server/lib/predictor/PredictionType";

import { getPredictions } from "../../lib/gateway";
import Prediction from "./Prediction";

import "./Sidebar.css";

type SidebarProps = {
  status: GameStatus;
};

const Sidebar: React.FC<SidebarProps> = ({ status }) => {
  const { gameEnded } = status;
  const [predictions, setPredictions] = useState<PredictionType[]>([]);

  const orderPrediction = useCallback(() => {
    getPredictions().then(result => {
      setPredictions(result);
    });
  }, []);

  if (gameEnded != null) {
    return <div className="Sidebar" />;
  }
  return (
    <div className="Sidebar">
      <button onClick={orderPrediction}>Get prediction</button>
      <div>
        {predictions.map(prediction => (
          <Prediction prediction={prediction} />
        ))}
      </div>
    </div>
  );
};
export default Sidebar;
