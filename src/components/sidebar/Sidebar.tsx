import React, { useCallback, useState, useEffect } from "react";

import { GameStatus } from "../../../server/interfaces/game-status";
import { PredictionType } from "../../../server/interfaces/PredictionType";
import { PredictionResponse } from "../../../server/interfaces/PredictionResponse";

import { getPrediction } from "../../lib/gateway";
import Prediction from "./Prediction";

import "./Sidebar.css";

const getPredictionKey = (prediction: PredictionType) =>
  prediction.move.source + "_" + prediction.move.target;

type SidebarProps = {
  status: GameStatus;
};

const Sidebar: React.FC<SidebarProps> = ({ status }) => {
  const { gameEnded, alignment } = status;
  const [
    predictionResponse,
    setPredictionResponse
  ] = useState<PredictionResponse | null>(null);

  useEffect(() => {
    setPredictionResponse(null);
  }, [alignment]);
  const orderPrediction = useCallback(() => {
    getPrediction().then(result => {
      setPredictionResponse(result);
    });
  }, []);

  if (gameEnded != null || predictionResponse === null) {
    return <div className="Sidebar" >
      <button onClick={orderPrediction}>Get prediction</button>
    </div>;
  }
  return (
    <div className="Sidebar">
      <button onClick={orderPrediction}>Get prediction</button>
      <span>{Math.floor(predictionResponse.ratio * 100)} % Ratio</span>
      {predictionResponse.queue && (
        <div>{predictionResponse.queue} in Queue</div>
      )}
      <div>
        {predictionResponse.predictions.map(prediction => (
          <Prediction
            key={getPredictionKey(prediction)}
            prediction={prediction}
          />
        ))}
      </div>
    </div>
  );
};
export default Sidebar;
