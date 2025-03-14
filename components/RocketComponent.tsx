import { RocketIcon } from "lucide-react";
import React from "react";

type Props = {
  degrees: number;
 
};

function RocketComponent({ degrees }: Props) {
  return (
    <div className="rocket-shadow">
      <RocketIcon
        style={{
          transform: `rotate(${-45 - degrees / 3}deg)`,

          transition: "all",
          animationDuration: "10ms",
        }}
        className="fill-red-600"
        size={32}
      />
    </div>
  );
}

export default RocketComponent;
