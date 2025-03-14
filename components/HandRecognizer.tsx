import {
  FilesetResolver,
  HandLandmarker,
  HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import React, { useEffect, useRef } from "react";

type Props = {
  setHandResults: (result: any) => void;
};
let detectionInterval: any;
function HandRecognizer({ setHandResults }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initVideoAndModel();
    return ()=>{
        clearInterval(detectionInterval);
    };
  }, []);
  const initVideoAndModel = async () => {
    setHandResults({ isLoading: true });
    const video = videoRef.current;
    if (!video) return;
    await initVideo(video);
    const handLandmarker = await initModel();

    detectionInterval = setInterval(() => {
      const detections = handLandmarker.detectForVideo(video, Date.now());
      processDetections(detections, setHandResults);
    }, 1000/30);
    setHandResults({ isLoading: false });
  };
  return (
    <div>
      <video
        className="-scale-x-1 bottom-2 border-stone-800 rounded-lg"
        ref={videoRef}
        autoPlay
        muted
      ></video>
    </div>
  );
}

export default HandRecognizer;


async function initVideo(video: HTMLVideoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  video.srcObject = stream;
  video.addEventListener("loadeddata", () => {
    video.play();
  });
}
async function initModel() {
  const wasm = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const handLandmarker = await HandLandmarker.createFromOptions(wasm, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 2,
  });

  return handLandmarker;
}
function processDetections(
  detections: HandLandmarkerResult,
  setHandResults: (result: any) => void
) {
  if (detections && detections.handedness.length > 1) {
    const rightIndex =
      detections.handedness[0][0].categoryName === "Right" ? 0 : 1;
    const leftIndex = rightIndex === 0 ? 1 : 0;

    const { x: leftX, y: leftY, z: leftZ } = detections.landmarks[leftIndex][6];
    const {
      x: rightX,
      y: rightY,
      z: rightZ,
    } = detections.landmarks[rightIndex][6];

    const tilt = (rightY - leftY) / (rightX - leftX);
    // const degrees = (Math.atan (tilt) *180) / Math.PI;|

    const degrees = (Math.atan(tilt) * 180) / Math.PI;
    setHandResults({ isDetected: true, tilt, degrees });
  } else {
    setHandResults({ isDetected: false, tilt: 0, degrees: 0 });
  }
  //   console.log(detections);
}
