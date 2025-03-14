import { Loader2 } from "lucide-react";
import React from "react";

type Props = { info: any };

function GamelnfoOverlay({ info }: Props) {
  const { isLoading, isDetected, isColliding, distance } = info;

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
      {!isLoading && !isDetected && (
        <div className="text-xl font-extrabold animate-pulse text-cyan-400">
          P A U S E D - N O H A N D S
        </div>
      )}
      <div className="fixed top-6 right-6">{`Distance ${distance}`}</div>
    </div>
  );
}

export default GamelnfoOverlay;
