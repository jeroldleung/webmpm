import { useEffect } from "react";
import Simulator from "../scripts/Simulator";

export default function GL() {
  useEffect(() => {
    let mpm = new Simulator();
    mpm.step();
  });
  return (
    <div>
      <canvas id="glcanvas" width={512} height={512}></canvas>
    </div>
  );
}
