import React from 'react';
import {PredictionType} from "../../../server/lib/predictor/PredictionType";

type PredictionProps={
  prediction:PredictionType
}

const texts={
  w:"Bílý MAT && tahů",
  b:"Černý MAT && tahů",
  "=":"PAT && tahů"
};

const Prediction:React.FC<PredictionProps> = ({prediction}) =>{
  let score = prediction.score.toString();
  if(prediction.state){
    score=texts[prediction.state].replace("&&", prediction.moves.toString());
  }
  return <div>{prediction.move.source}=>{prediction.move.target} {score}</div>
};
export default Prediction;