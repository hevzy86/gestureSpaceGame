import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  isMoving?: boolean;
  what: any;
  soWhat: () => void;
  when: any;
};

const BoulderComponent = ({ isMoving, what, soWhat, when }: Props) => {
  const [xState, setXState] = useState(0);
  const [yState, setYState] = useState(0);
  const [rotation, setrotation] = useState(0);
  const boulderREf = useRef(null);
  const detectCollision = () => {
    if (boulderREf.current) {
      const boulder = (boulderREf.current as any).getBoundingClientRect();
      const didCollide =
        boulder.left + 30 < what.right &&
        boulder.right - 30 > what.left &&
        boulder.top + 30 < what.bottom &&
        boulder.bottom - 30 > what.top;
      if (didCollide) {
        soWhat();
      }
    }
  };
  useEffect(() => {
    detectCollision();
  }, [when]);

  useEffect(() => {
    setXState(Math.random() * (window.innerWidth - 80));
    setYState(-Math.random() * 100 - 100);
    setrotation(Math.random() * 360);
  }, []);

  return (
    <div
      ref={boulderREf}
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
