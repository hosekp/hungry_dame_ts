import React from 'react';

import "./Sidebar.css";
import {GameStatus} from "../../server/interfaces/game-status";

type SidebarProps={
  status:GameStatus
}

const Sidebar : React.FC<SidebarProps> = ({status})=>{
  const {gameEnded}=status;
  if(gameEnded!=null){
    return <div className="Sidebar" />;
  }
  return <div className="Sidebar" />;
};
export default Sidebar;