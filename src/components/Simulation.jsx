import SimulationControls from "./SimulationControls.jsx";
import MaterialParameters from "./MaterialParameters.jsx";

function Display() {
  return (
    <div id="display">
      <canvas
        id="result_canvas"
        className="w-full cursor-pointer"
        width={512}
        height={512}
      ></canvas>
    </div>
  );
}

function Controls({ reset, setReset, setState }) {
  return (
    <div className="flex flex-col sm:max-md:flex-row py-2 px-1 gap-8">
      <SimulationControls
        reset={reset}
        setReset={setReset}
        setState={setState}
      />
      <MaterialParameters />
    </div>
  );
}

export default function Simulation({ reset, setReset, setState }) {
  return (
    <div className="flex py-8 place-content-center gap-4 flex-wrap">
      <Display />
      <Controls reset={reset} setReset={setReset} setState={setState} />
    </div>
  );
}
