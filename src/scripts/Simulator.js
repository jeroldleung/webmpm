import Loader from "./Loader.js";
import { pointVert } from "../shaders/point.vert.js";
import { pointFrag } from "../shaders/point.frag.js";

export default class Simulator {
  constructor() {
    this.wgl = new Loader(document.getElementById("glcanvas"));
    this.wgl.createBuffers();
    this.wgl.createPrograms({
      transferToGrid: {
        vertexShader: pointVert,
        fragmentShader: pointFrag,
        attributes: "a_position",
      },
    });
  }

  step() {
    this.wgl.useProgram("transferToGrid");
    this.wgl.drawScene();
  }
}
