import { Alignment } from "../game/alignment";

export type AlignmentDiff = { source: number; target: number };

export const alignmentDiff = (
  source: Alignment,
  target: Alignment
): AlignmentDiff => {
  let newOne: number = -1;
  const removals = [];
  for (let i = 0; i < 32; i++) {
    if (source[i] === target[i]) continue;
    if (source[i] === "-") {
      newOne = i;
    } else {
      removals.push(i);
    }
  }
  if (removals.length === 1) {
    return {
      source: removals[0],
      target: newOne
    };
  }
  const sourcePos = removals.reduce((first, second) => {
    return Math.abs(first - newOne) > Math.abs(second - newOne)
      ? first
      : second;
  });
  return {
    source: sourcePos,
    target: newOne
  };
};
