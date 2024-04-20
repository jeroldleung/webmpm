import { useEffect } from "react";
import Loader from "../scripts/Loader.js";
import { vsSource } from "../shaders/point.vert.js";
import { fsSource } from "../shaders/point.frag.js";

export default function GL() {
  useEffect(() => {
    let webgl = new Loader(document.getElementById("glcanvas"));
    webgl.initShaderProgram(vsSource, fsSource);
    webgl.initBuffers();
    webgl.drawScene();
  });
  return (
    <div>
      <canvas id="glcanvas" width={512} height={512}></canvas>
    </div>
  );
}
