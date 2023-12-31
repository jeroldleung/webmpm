import * as ti from "taichi.js";
import Grid from "./grid";
import { userInteraction, materialProperties } from "./control";

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

    this.particleToGrid = ti.classKernel(this, { bulkModulus: ti.f32 }, (bulkModulus) => {
      for (let p of ti.range(this.material[0].n_particles)) {
        let base = ti.i32(this.material[0].x[p] * this.grid.inv_dx - 0.5);
        let fx = this.material[0].x[p] * this.grid.inv_dx - ti.f32(base);
        let stress = this.material[0].computeStress(p, bulkModulus);
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

    this.updateGridVelocity = ti.classKernel(
      this,
      { mouse_position: ti.types.vector(ti.f32, 2), click_strength: ti.f32 },
      (mouse_position, click_strength) => {
        for (let I of ti.ndrange(this.grid.n_grid, this.grid.n_grid)) {
          let i = I[0];
          let j = I[1];
          if (this.grid.grid_m[I] > 0) {
            this.grid.grid_v[I] = (1 / this.grid.grid_m[I]) * this.grid.grid_v[I];
            this.grid.grid_v[I][1] -= this.dt * 50; // gravity
            // handle user click interaction
            let dist = this.grid.dx * I - mouse_position;
            this.grid.grid_v[I] += (dist / (0.01 + ti.norm(dist))) * this.dt * click_strength;
            // boundary handle
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
      },
    );

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
        this.material[0].J[p] =
          (1.0 + this.dt * (new_C[0][0] + new_C[1][1])) * this.material[0].J[p];
      }
    });
  }

  async reset() {
    for (let obj of this.material) {
      obj.init();
    }
  }

  async run() {
    for (let i = 0; i < this.n_substeps; ++i) {
      this.clearGridState();
      this.particleToGrid(materialProperties.getValue("bulkModulus"));
      this.updateGridVelocity(userInteraction.mousePosition, userInteraction.clickStrength);
      this.gridToParticle();
    }
  }
}
