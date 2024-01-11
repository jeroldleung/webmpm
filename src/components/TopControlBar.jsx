import { useEffect, useState } from "react";
import { StopIcon, PlayIcon, PauseIcon, ForwardIcon } from "./Icons.jsx";

export default function TopControlBar({ simulationControl }) {
  const [state, setState] = useState(simulationControl.currentState);
  function changeState(value) {
    simulationControl.changeState(value);
    setState(value);
  }

  useEffect(() => {
    function handlepress(e) {
      if (e.key == "r") {
        changeState("stop");
      } else if (e.key == " ") {
        e.preventDefault();
        state == "play" ? changeState("pause") : changeState("play");
      } else if (e.key == "ArrowRight") {
        changeState("forward");
      }
    }
    window.addEventListener("keydown", handlepress);
    return () => {
      window.removeEventListener("keydown", handlepress);
    };
  });

  return (
    <div className="bg-gray-50 shadow py-4">
      <div className="flex items-center place-content-center gap-1">
        <button
          onClick={() => {
            changeState("stop");
          }}
          className="focus:outline-none"
        >
          <StopIcon size="w-10 h-10" />
        </button>
        <button
          onClick={() => {
            state == "play" ? changeState("pause") : changeState("play");
          }}
          className="focus:outline-none"
        >
          {state == "play" ? <PauseIcon size="w-20 h-20" /> : <PlayIcon size="w-20 h-20" />}
        </button>
        <button
          onClick={() => {
            changeState("forward");
          }}
          className="focus:outline-none"
        >
          <ForwardIcon size="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
