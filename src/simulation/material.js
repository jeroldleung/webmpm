import * as ti from "taichi.js";

export default class Material {
  constructor(color) {
    this.n_particles = Number(document.getElementById("n_particles").value); // number of particles
    this.x = ti.Vector.field(2, ti.f32, [this.n_particles]); // position
    this.v = ti.Vector.field(2, ti.f32, [this.n_particles]); // velocity
    this.C = ti.Matrix.field(2, 2, ti.f32, [this.n_particles]); // affine velocity
    this.F = ti.Matrix.field(2, 2, ti.f32, this.n_particles); // deformation gradient
    this.J = ti.field(ti.f32, [this.n_particles]); // plastic deformation
    this.E = Number(document.getElementById("E").value); // Young's modulus
    this.nu = 0.2; // Poisson's ratio
    this.mu_0 = this.E / (2 * (1 + this.nu)); // Lame parameters
    this.lambda_0 = (this.E * this.nu) / ((1 + this.nu) * (1 - 2 * this.nu)); // Lame parameters
    this.p_vol = ((1 / parseFloat(document.getElementById("n_grid").value)) * 0.5) ** 2; // particle volume
    this.p_rho = 1; // particle density
    this.p_mass = this.p_vol * this.p_rho; // particle mass
    this.type = ti.field(ti.i32, [this.n_particles]); // material type
    this.color = color; // material color
  }

  computeStress = ti.func((p) => {
    let Jp = this.material[0].J[p];
    let pressure = 1e3 * (1 - Jp);
    let stress =
      -pressure *
      [
        [1.0, 0.0],
        [0.0, 1.0],
      ];
    return stress;
  });
}
