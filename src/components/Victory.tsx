import React, { useEffect } from "react";

import "./Victory.css";

type VictoryProps = {
  end: string | null;
  onRestart: () => void;
};
const texts: { [key: string]: string } = {
  text_white: "Vítězství bílého hráče.",
  text_black: "Vítězství černého hráče.",
  text_pat: "Partie je nerozhodná.",
  header_white: "Vítězství",
  header_black: "Vítězství",
  header_pat: "Pat"
};

const Victory: React.FC<VictoryProps> = ({ end, onRestart }: VictoryProps) => {
  useEffect(() => {
    if (end) {
      window.confirm(texts["text_" + end]);
      onRestart();
    }
  }, [end, onRestart]);
  return null;
};
export default Victory;
