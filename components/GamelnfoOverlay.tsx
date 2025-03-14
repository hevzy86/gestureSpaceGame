import { Loader2, RocketIcon } from "lucide-react";
import React from "react";

type Props = { info: any };

function GamelnfoOverlay({ info }: Props) {
  const {
    isLoading,
    isDetected,
    isColliding,
    distance,
    isGameOver,
    livesRemainingState,
  } = info;

  const lives = [];
  for (let i = 0; i < livesRemainingState; i++) {
    lives.push(
      <RocketIcon
        key={i}
        size={20}
        className="fill-red-600"
      />
    );
  }

  return (
    <div
      className={`absolute z-30 h-screen w-screen flex items-center justify-center ${
        isColliding ? "border-[5px] border-red-600" : ""
      }`}
    >
      {isLoading && (
        <Loader2
          size={80}
          className="animate-spin"
        />
      )}
      {!isLoading &&
        !isDetected &&
        !isGameOver && (
          <div className="text-xl font-extrabold animate-pulse text-cyan-400">
            P A U S E D - N O H A N D S
          </div>
        )}
      {isGameOver && (
        <div className="text-xl font-extrabold animate-pulse text-cyan-400">
          G A M E O V E R
        </div>
      )}
      <div className="fixed top-6 right-6">{`Distance ${distance}`}</div>
      <div className="fixed top-12 right-6 flex gap-1">{lives}</div>
    </div>
  );
}

export default GamelnfoOverlay;
