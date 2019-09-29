import {moveLeftDown, moveLeftUp, moveRightDown, moveRightUp} from "./pieces/constants";

export type PieceSign = "w"|"W"|"b"|"B"|"-";
export type Alignment = Array<PieceSign>;

export const createAlignment = (alignment:string):Alignment => {
  return alignment.split("") as Alignment
};

export const getDirection = (start:number,target:number):Array<number>=>{
  const d4=target%4-start%4;
  if(d4<0){
    //left
    return target<start?moveLeftUp:moveLeftDown;
  }
  if(d4>0){
    //right
    return target<start?moveRightUp:moveRightDown;
  }
  if(start%8>3){
    // start is at even row - same goes right
    return target<start?moveRightUp:moveRightDown;
  }else{
    // start is at odd row - same goes left
    return target<start?moveLeftUp:moveLeftDown;
  }
};