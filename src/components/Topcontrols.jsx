import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
} from "../assets/Icons.jsx";

function Stop({ setState }) {
  return (
    <button id="stop" onClick={() => setState("stoping")}>
      <StopIcon size="w-10 h-10" />
    </button>
  );
}

function PlayPause({ state, setState }) {
  function toggle() {
    state == "playing" ? setState("pausing") : setState("playing");
  }
  return (
    <button id="playpause" onClick={toggle}>
      {state == "playing" ? (
        <PauseIcon size="w-20 h-20" />
      ) : (
        <PlayIcon size="w-20 h-20" />
      )}
    </button>
  );
}

function Forward({ setState }) {
  return (
    <button id="forward" onClick={() => setState("forwarding")}>
      <ForwardIcon size="w-10 h-10" />
    </button>
  );
}

export default function TopControls({ state, setState }) {
  return (
    <div className="bg-gray-50 shadow py-4">
      <div className="flex items-center place-content-center gap-1">
        <Stop setState={setState} />
        <PlayPause state={state} setState={setState} />
        <Forward setState={setState} />
      </div>
    </div>
  );
}
