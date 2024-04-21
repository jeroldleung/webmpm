import GLLoader from "./GLLoader.js";
import Particles from "./Particles.js";
import { pointVert } from "../shaders/point.vert.js";
import { pointFrag } from "../shaders/point.frag.js";
import { advectVert } from "../shaders/advect.vert.js";

export default class Simulator {
  constructor() {
    this.wgl = new GLLoader(document.getElementById("glcanvas"));
    this.particles = new Particles(0.3);

    this.positionBuffer = this.wgl.createBuffer(this.particles.getPosition());
    this.velocityTexture = this.wgl.createTexture(100, 100);

    this.wgl.createPrograms({
      transferToGrid: {
        vertexShader: pointVert,
        fragmentShader: pointFrag,
      },
      advect: {
        vertexShader: advectVert,
        fragmentShader: pointFrag,
      },
    });
  }

  step(time) {
    this.wgl
      .useProgram("transferToGrid")
      .enableAttribute("a_position")
      .bindBuffer(this.positionBuffer);

    this.wgl
      .useProgram("advect")
      .enableAttribute("a_position")
      .bindBuffer(this.positionBuffer)
      .setUniform("u_time", time * 0.0001);

    this.wgl.drawScene(this.particles.getCount());
  }

  simulate(time) {
    for (let i = 0; i < 10; i++) {
      this.step(time);
    }
  }
}
