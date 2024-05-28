import * as ti from "taichi.js";

// material type 0: water
// material type 1: jelly

export default class Material {
  constructor(type, scale, density, center, color) {
    this.p_vol = parseFloat(document.getElementById("p_vol").value); // particle volume
    this.p_rho = density; // particle density
    this.p_mass = this.p_vol * this.p_rho; // particle mass
    this.scale = scale; // object scale
    this.n_particles = Math.floor(this.scale ** 2 / this.p_vol); // number of particles
    this.x = ti.Vector.field(2, ti.f32, this.n_particles); // position
    this.v = ti.Vector.field(2, ti.f32, this.n_particles); // velocity
    this.C = ti.Matrix.field(2, 2, ti.f32, this.n_particles); // affine velocity
    this.F = ti.Matrix.field(2, 2, ti.f32, this.n_particles); // deformation gradient
    this.J = ti.field(ti.f32, this.n_particles); // plastic deformation
    this.type = type; // material type
    this.color = color; // material color
    this.center = center; // material initial position
    this.vcs = ti.field(ti.f32, this.n_particles); // for sand
    this.ap = ti.field(ti.f32, this.n_particles); // for sand
    this.qp = ti.field(ti.f32, this.n_particles); // for sand
    this.enableVolPreserved = 0;
    if (document.getElementById("scenes").value == "Sand") {
      this.enableVolPreserved = 1;
    }

    this.init = ti.classKernel(this, () => {
      for (let i of ti.range(this.n_particles)) {
        this.x[i] = this.center + this.scale * [ti.random(), ti.random()];
        this.v[i] = [0, 0];
        this.F[i] = [
          [1, 0],
          [0, 1],
        ];
        this.J[i] = 1;
        this.C[i] = [
          [0, 0],
          [0, 0],
        ];
      }
    });
  }
}
