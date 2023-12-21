import { StopIcon, PauseIcon, ForwardIcon } from "../assets/Icons.jsx";

export default function TopControlBar() {
  return (
    <div className="bg-gray-50 shadow py-4">
      <div className="flex items-center place-content-center gap-1">
        <button id="stop">
          <StopIcon size="w-10 h-10" />
        </button>
        <button id="playpause">
          <PauseIcon size="w-20 h-20" />
        </button>
        <button id="forward">
          <ForwardIcon size="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
