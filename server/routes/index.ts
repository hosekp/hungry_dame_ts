import { Application, Router } from "express";
import { postRestart } from "./post-restart";
import { putMove } from "./put-move";
import { getMoves } from "./get-moves";
import {wsPrediction} from "./ws-prediction";
import {postResetPrediction} from "./post-reset-prediction";

export const bindRoutes = (app: Application) => {
  const router = Router();
  router.post("/api/restart", postRestart);
  router.post("/api/reset-prediction", postResetPrediction);
  router.put("/api/move/:piece/:target", putMove);
  router.get("/api/moves/:piece", getMoves);
  router.ws("/api/prediction", wsPrediction);
  app.use("/", router);
};
