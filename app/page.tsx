"use client";
import BoulderComponent from "@/components/BoulderComponent";
import GamelnfoOverlay from "@/components/GamelnfoOverlay";
import HandRecognizer from "@/components/HandRecognizer";
import RocketComponent from "@/components/RocketComponent";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [rocket, setRocket] = useState<any>();
  const rocketRef = useRef(null);
  const [rocketLeft, setrocketLeft] = useState(0);
  const [isDetected, setIsDetected] = useState(false);
  const [degrees, setdegrees] = useState(0);
  const [boulders, setBoulders] = useState<any[]>([]);
  const [isInvincible, setIsInvincible] = useState(false);
  const [isColliding, setIsColliding] = useState(false);
  const [detectCollisionTrigger, setDetectCollisionTrigger] =
    useState<number>(0);

  const [isLoading, setisLoading] = useState(false);
  const [distance, setDistance] = useState(0);

  let generationInterval: any;
  let removalInterval: any;
  let distanceInterval: any;

  useEffect(() => {
    if (isDetected) {
      distanceInterval = setInterval(() => {
        setDistance((prev) => prev + 1);
      }, 100);

      return () => {
        clearInterval(distanceInterval);
      };
    }
  }, [isDetected]);

  useEffect(() => {
    if (isDetected) {
      generationInterval = setInterval(() => {
        setBoulders((prev) => {
          let retArr = [...prev];
          for (let i = 0; i < 4; i++) {
            const now = Date.now();
            retArr = [
              ...retArr,
              {
                timestamp: now,
                key: `${now}-${Math.random()}`,
              },
            ];
          }
          return retArr;
        });
      }, 1000);

      removalInterval = setInterval(() => {
        const now = Date.now();
        setBoulders((prevArr) => {
          return prevArr.filter((b, idx) => {
            return now - b.timestamp < 5000;
          });
        });
      }, 5000);
    }

    return () => {
      clearInterval(generationInterval);
      clearInterval(removalInterval);
    };
  }, [isDetected]);

  useEffect(() => {
    setrocketLeft(window.innerWidth / 2);
  }, []);

  const setHandResults = (result: any) => {
    setIsDetected(result.isDetected);
    setdegrees(result.degrees);
    setisLoading(result.isLoading);
    if (result.degrees && result.degrees !== 0) {
      setDetectCollisionTrigger(Math.random());
      setrocketLeft((prev) => {
        // console.log(rocketLeft);
        // console.log(degrees);

        const returnValue = prev - result.degrees / 6;

        if (returnValue < 20) {
          return prev;
        }

        if (returnValue > window.innerWidth - 52) {
          return prev;
        }

        return returnValue;
      });
      setRocket((rocketRef.current as any).getBoundingClientRect());
    }
  };
  const collisionHandler = () => {
    if (!isInvincible) {
      console.log("!!Collision");
      setIsInvincible(true);
      setIsColliding(true);
      console.log("Collision" + isColliding);

      // setScore((prev) => prev - 10); // Decrease score on collision
      setTimeout(() => {
        setIsInvincible(false);
        setIsColliding(false);
      }, 1500);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div
        className={`absolute left-3 top-3 z-30 transition-all duration-500 ${
          isDetected ? "w-24" : "w-48"
        }`}
      >
        <HandRecognizer setHandResults={setHandResults} />
      </div>

      <div
        id="rocket-container"
        ref={rocketRef}
        style={{
          position: "absolute",
          left: rocketLeft,
          transition: "all",
          animationDuration: "10ms",
          marginTop: "500px",
        }}
      >
        <RocketComponent degrees={degrees} />
      </div>
      <div
        className={`absolute z-30 w-screen h-screen overflow-hidden boulder-shadow`}
      >
        {boulders.map((boulder, index) => (
          <BoulderComponent
            key={boulder.key}
            isMoving={isDetected}
            what={rocket}
            soWhat={collisionHandler}
            when={detectCollisionTrigger}
          />
        ))}
      </div>
      <GamelnfoOverlay
        info={{ isLoading, isDetected, isColliding, distance }}
      />
    </main>
  );
}
