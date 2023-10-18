import { useEffect, useState } from "react";
import TopControls from "./TopControls.jsx";
import Simulation from "./Simulation.jsx";
import { MPM } from "../runtime/mpm.js";

export default function Playground() {
  const [state, setState] = useState("playing");
  const [reset, setReset] = useState(false);
  useEffect(() => {
    const mpm = new MPM();
    mpm.run();
    return () => {
      mpm.cleanup();
    };
  }, [reset]);
  return (
    <div>
      <TopControls state={state} setState={setState} />
      <Simulation reset={reset} setReset={setReset} setState={setState} />
    </div>
  );
}
