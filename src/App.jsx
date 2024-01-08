import { useEffect, useState } from "react";
import { init } from "taichi.js";

import TopControlBar from "./components/TopControlBar.jsx";
import DisplayWindow from "./components/DisplayWindow.jsx";
import ControlSelection from "./components/ControlSelection.jsx";
import ParameterSlider from "./components/ParameterSlider.jsx";
import Introduction from "./components/Introduction.jsx";
import Footer from "./components/Footer.jsx";

import MPM from "./simulation/mpm.js";
import Renderer from "./simulation/renderer.js";
import Scene from "./simulation/scene.js";
import { CONTROL_ITEMS, PARAMETER_ITEMS } from "./simulation/config.js";
import { simulationControl, userInteraction, parameterControl } from "./simulation/control.js";

export default function App() {
  const [isRunning, setRunning] = useState(false);

  function handleSelection() {
    setRunning(!isRunning);
  }

  useEffect(() => {
    let returnFromMain = false;

    let main = async () => {
      await init();
      let mpm = new MPM();
      let scene = new Scene();
      let renderer = new Renderer();

      // register the state machine
      simulationControl.addState("play", () => { mpm.run(); }, "play"); // prettier-ignore
      simulationControl.addState("pause", () => {}, "pause"); // prettier-ignore
      simulationControl.addState("stop", () => { mpm.reset(); }, "pause"); // prettier-ignore
      simulationControl.addState("forward", () => { mpm.run(); }, "pause"); // prettier-ignore

      let frame = async () => {
        if (returnFromMain) return;
        simulationControl.run();
        renderer.render(scene);
        requestAnimationFrame(frame);
      };

      scene.create();
      await mpm.init(scene);
      mpm.reset();
      await frame();
    };

    main();

    return () => {
      returnFromMain = true;
    };
  }, [isRunning]);

  return (
    <div>
      <TopControlBar simulationControl={simulationControl} />
      <div className="flex py-8 place-content-center gap-4 flex-wrap">
        <DisplayWindow userInteraction={userInteraction} />
        <div className="flex flex-col sm:max-md:flex-row py-2 px-1 gap-8">
          <ControlSelection options={CONTROL_ITEMS} onSelectHandler={handleSelection} />
          <ParameterSlider options={PARAMETER_ITEMS} parameterControl={parameterControl} />
        </div>
      </div>
      <Introduction />
      <Footer />
    </div>
  );
}
