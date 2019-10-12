import { GameStatus } from "../../server/interfaces/game-status";
import { PossibleMove } from "../../server/interfaces/possible-move";
import { PredictionResponse } from "../../server/interfaces/PredictionResponse";

const errorResponse = (response: Response): boolean => {
  if (response.status !== 200) {
    response.text().then(text => {
      throw new Error(text);
    });
    return true;
  }
  return false;
};
const readJson = async (response: Response) => {
  const result = await response.json();
  console.log(result);
  return result;
};

export const resetGame = async (): Promise<GameStatus | null> => {
  const response = await fetch("/api/restart", { method: "POST" });
  if (errorResponse(response)) return null;
  return await readJson(response);
};
export const getMoves = async (pos: number): Promise<PossibleMove | null> => {
  const response = await fetch("/api/moves/" + pos);
  if (errorResponse(response)) return null;
  return await readJson(response);
};
export const movePiece = async (
  start: number,
  target: number
): Promise<GameStatus | null> => {
  const response = await fetch(`/api/move/${start}/${target}`, {
    method: "PUT"
  });
  if (errorResponse(response)) return null;
  return await readJson(response);
};

export const bindPredictor = (
  onMessage: (response: PredictionResponse) => void
) => {
  const ws = new WebSocket("ws://localhost:5000/api/prediction");
  ws.onmessage = (evt: MessageEvent) => {
    const data: PredictionResponse = JSON.parse(evt.data);
    onMessage(data);
  };
  return () => ws.close();
};
