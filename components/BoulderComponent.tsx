import React, { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  isMoving?: boolean;
};

const BoulderComponent = ({ isMoving }: Props) => {
  const [xState, setXState] = useState(0);
  const [yState, setYState] = useState(0);
  const [rotation, setrotation] = useState(0);

  useEffect(() => {
    setXState(Math.random() * (window.innerWidth - 80));
    setYState(-Math.random() * 100 - 100);
    setrotation(Math.random() * 360);
  }, []);

  return (
    <div
      className=""
      style={{
        left: xState,
        position: "absolute",
        top: yState,
        animation: "moveDown 10s linear forwards",
        animationPlayState: isMoving ? "running" : "paused",
      }}
    >
      <Image
        src="/met.png"
        alt={""}
        width={80}
        height={80}
        style={{ rotate: `${rotation}deg` }}
      />
    </div>
  );
};

export default BoulderComponent;
