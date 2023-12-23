import * as ti from "taichi.js";
import Grid from "./grid";

export default class MPM {
  constructor() {
    this.material = [];
    this.grid = new Grid();
    this.dt = Number(document.getElementById("dt").value);
    this.n_substeps = Number(document.getElementById("n_substeps").value);
  }

  quadraticKernel = ti.func((x) => {
    x = Math.abs(x);
    let res = 0.0;
    if (x >= 0.5 && x < 1.5) {
      res = 0.5 * (1.5 - x) ** 2;
    } else if (x < 0.5) {
      res = 0.75 - x ** 2;
    }
    return res;
  });

  async init(objects) {
    this.material = objects;

    this.clearGridState = ti.classKernel(this, () => {
      for (let I of ti.ndrange(this.grid.n_grid, this.grid.n_grid)) {
        this.grid.grid_v[I] = [0, 0];
        this.grid.grid_m[I] = 0;
      }
    });

    this.particleToGrid = ti.classKernel(this, () => {
      for (let p of ti.range(this.material[0].n_particles)) {
        let base = ti.i32(this.material[0].x[p] * this.grid.inv_dx - 0.5);
        let fx = this.material[0].x[p] * this.grid.inv_dx - ti.f32(base);
        this.material[0].F[p] = (
          [
            [1.0, 0.0],
            [0.0, 1.0],
          ] +
          this.dt * this.material[0].C[p]
        ).matmul(this.material[0].F[p]);
        let h = ti.f32(ti.max(0.1, ti.min(5, ti.exp(10 * (1.0 - this.material[0].Jp[p])))));
        if (this.material[0].type[p] == 1) {
          h = 0.3;
        }
        let mu = this.material[0].mu_0 * h;
        let la = this.material[0].lambda_0 * h;
        if (this.material[0].type[p] == 0) {
          mu = 0.0;
        }
        let svd = ti.svd2D(this.material[0].F[p]);
        let U = svd.U;
        let sig = svd.E;
        let V = svd.V;
        let J = 1.0;
        for (let d of ti.static(ti.range(2))) {
          let new_sig = sig[[d, d]];
          if (this.material[0].type[p] == 2) {
            // Plasticity
            new_sig = ti.min(ti.max(sig[[d, d]], 1 - 2.5e-2), 1 + 4.5e-3);
          }
          this.material[0].Jp[p] = (this.material[0].Jp[p] * sig[[d, d]]) / new_sig;
          sig[[d, d]] = new_sig;
          J = J * new_sig;
        }
        if (this.material[0].type[p] == 0) {
          this.material[0].F[p] =
            [
              [1.0, 0.0],
              [0.0, 1.0],
            ] * ti.sqrt(J);
        } else if (this.material[0].type[p] == 2) {
          this.material[0].F[p] = U.matmul(sig).matmul(V.transpose());
        }
        let stress =
          (2 * mu * (this.material[0].F[p] - U.matmul(V.transpose()))).matmul(
            this.material[0].F[p].transpose(),
          ) +
          [
            [1.0, 0.0],
            [0.0, 1.0],
          ] *
            la *
            J *
            (J - 1);
        let affine =
          -this.dt * this.material[0].p_vol * 4 * this.grid.inv_dx * this.grid.inv_dx * stress +
          this.material[0].p_mass * this.material[0].C[p];
        for (let i of ti.static(ti.range(3))) {
          for (let j of ti.static(ti.range(3))) {
            let offset = [i, j];
            let dpos = (ti.f32(offset) - fx) * this.grid.dx;
            let weight =
              this.quadraticKernel((fx - offset)[0]) * this.quadraticKernel((fx - offset)[1]);
            this.grid.grid_v[base + offset] +=
              weight * (this.material[0].p_mass * this.material[0].v[p] + affine.matmul(dpos));
            this.grid.grid_m[base + offset] += weight * this.material[0].p_mass;
          }
        }
      }
    });

    this.updateGridVelocity = ti.classKernel(this, () => {
      for (let I of ti.ndrange(this.grid.n_grid, this.grid.n_grid)) {
        let i = I[0];
        let j = I[1];
        if (this.grid.grid_m[I] > 0) {
          this.grid.grid_v[I] = (1 / this.grid.grid_m[I]) * this.grid.grid_v[I];
          this.grid.grid_v[I][1] -= this.dt * 50; // gravity
          if (i < 3 && this.grid.grid_v[I][0] < 0) {
            this.grid.grid_v[I][0] = 0;
          }
          if (i > this.grid.n_grid - 3 && this.grid.grid_v[I][0] > 0) {
            this.grid.grid_v[I][0] = 0;
          }
          if (j < 3 && this.grid.grid_v[I][1] < 0) {
            this.grid.grid_v[I][1] = 0;
          }
          if (j > this.grid.n_grid - 3 && this.grid.grid_v[I][1] > 0) {
            this.grid.grid_v[I][1] = 0;
          }
        }
      }
    });

    this.gridToParticle = ti.classKernel(this, () => {
      for (let p of ti.range(this.material[0].n_particles)) {
        let base = ti.i32(this.material[0].x[p] * this.grid.inv_dx - 0.5);
        let fx = this.material[0].x[p] * this.grid.inv_dx - ti.f32(base);
        let new_v = [0.0, 0.0];
        let new_C = [
          [0.0, 0.0],
          [0.0, 0.0],
        ];
        for (let i of ti.static(ti.range(3))) {
          for (let j of ti.static(ti.range(3))) {
            let offset = [i, j];
            let dpos = ti.f32(offset) - fx;
            let g_v = this.grid.grid_v[base + offset];
            let weight =
              this.quadraticKernel((fx - offset)[0]) * this.quadraticKernel((fx - offset)[1]);
            new_v = new_v + weight * g_v;
            new_C = new_C + 4 * this.grid.inv_dx * weight * g_v.outerProduct(dpos);
          }
        }
        this.material[0].v[p] = new_v;
        this.material[0].C[p] = new_C;
        this.material[0].x[p] = this.material[0].x[p] + this.dt * new_v;
      }
    });

    this.reset = ti.classKernel(this, () => {
      let group_size = this.material[0].n_particles / 3;
      for (let i of ti.range(this.material[0].n_particles)) {
        let group_id = ti.i32(ti.floor(i / group_size));
        this.material[0].x[i] = [
          ti.random() * 0.2 + 0.3 + 0.1 * group_id,
          ti.random() * 0.2 + 0.05 + 0.32 * group_id,
        ];
        this.material[0].type[i] = group_id;
        this.material[0].v[i] = [0, 0];
        this.material[0].F[i] = [
          [1, 0],
          [0, 1],
        ];
        this.material[0].Jp[i] = 1;
        this.material[0].C[i] = [
          [0, 0],
          [0, 0],
        ];
      }
    });

    this.reset();
  }

  async run() {
    for (let i = 0; i < this.n_substeps; ++i) {
      this.clearGridState();
      this.particleToGrid();
      this.updateGridVelocity();
      this.gridToParticle();
    }
  }
}
