import { useState } from "react";
import { StopIcon, PlayIcon, PauseIcon, ForwardIcon } from "../assets/Icons.jsx";

export default function TopControlBar() {
  const [simulationState, changeSimulationState] = useState("play");
  function toggle() {
    simulationState == "play" ? changeSimulationState("pause") : changeSimulationState("play");
  }
  return (
    <div className="bg-gray-50 shadow py-4">
      <div className="flex items-center place-content-center gap-1">
        <button
          id="stop"
          onClick={() => {
            changeSimulationState("stop");
          }}
        >
          <StopIcon size="w-10 h-10" />
        </button>
        <button id="playpause" onClick={toggle}>
          {simulationState == "play" ? (
            <PauseIcon size="w-20 h-20" />
          ) : (
            <PlayIcon size="w-20 h-20" />
          )}
        </button>
        <button
          id="forward"
          onClick={() => {
            changeSimulationState("forward");
          }}
        >
          <ForwardIcon size="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
