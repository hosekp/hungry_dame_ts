import { Application, Router } from "express";
import { postRestart } from "./post-restart";
import { putMove } from "./put-move";
import { getMoves } from "./get-moves";
import { getPrediction } from "./get-prediction";

export const bindRoutes = (app: Application) => {
  const router = Router();
  router.post("/api/restart", postRestart);
  router.put("/api/move/:piece/:target", putMove);
  router.get("/api/moves/:piece", getMoves);
  router.get("/api/prediction", getPrediction);
  app.use("/", router);
};
