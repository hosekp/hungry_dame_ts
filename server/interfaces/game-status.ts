export interface GameStatus {
  alignment:Array<string>,
  isBlackPlaying:boolean,
  playablePieces:Array<number>
  gameEnded:string|null
}