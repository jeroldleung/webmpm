import * as ti from "taichi.js";
import Grid from "./grid";
import { userInteraction, parameterControl } from "./control";

export default class MPM {
  constructor() {
    this.material = [];
    this.grid = new Grid();
    this.dt = 0.0001;
  }

  determinant = ti.func((mat) => {
    return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
  });

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

  waterPressure = ti.func((material, p, E) => {
    let Jp = material.J[p];
    E = (E / 2000) * 900;
    let pressure = E * (Jp - 1);
    let stress =
      pressure *
      [
        [1.0, 0.0],
        [0.0, 1.0],
      ];
    return stress;
  });

  fixedCorotated = ti.func((material, p, E) => {
    let nu = 0.2; // Poisson's ratio
    let mu = E / (2 * (1 + nu)); // Lame parameters
    let la = (E * nu) / ((1 + nu) * (1 - 2 * nu)); // Lame parameters
    let Jp = this.determinant(material.F[p]);
    let svd = ti.svd2D(material.F[p]);
    let stress =
      (2 * mu * (material.F[p] - svd.U.matmul(svd.V.transpose()))).matmul(
        material.F[p].transpose(),
      ) +
      [
        [1.0, 0.0],
        [0.0, 1.0],
      ] *
        la *
        Jp *
        (Jp - 1);
    return stress;
  });

  computeStress = ti.func((material, p, E) => {
    let stress = [
      [1.0, 0.0],
      [0.0, 1.0],
    ];
    if (material.type == 0) {
      stress = this.waterPressure(material, p, E);
    } else if (material.type == 1) {
      stress = this.fixedCorotated(material, p, E);
    }
    return stress;
  });

  async init(objects) {
    this.material = objects;

    this.clearData = ti.classKernel(this, { grid: ti.template() }, (grid) => {
      for (let I of ti.ndrange(grid.n_grid, grid.n_grid)) {
        grid.grid_v[I] = [0, 0];
        grid.grid_m[I] = 0;
      }
    });

    this.particleToGrid = ti.classKernel(
      this,
      { material: ti.template(), grid: ti.template(), E: ti.f32 },
      (material, grid, E) => {
        for (let p of ti.range(material.n_particles)) {
          let base = ti.i32(material.x[p] * grid.inv_dx - 0.5);
          let fx = material.x[p] * grid.inv_dx - ti.f32(base);
          let stress = this.computeStress(material, p, E);
          let affine =
            -this.dt * material.p_vol * 4 * grid.inv_dx * grid.inv_dx * stress +
            material.p_mass * material.C[p];
          for (let i of ti.static(ti.range(3))) {
            for (let j of ti.static(ti.range(3))) {
              let offset = [i, j];
              let dpos = (ti.f32(offset) - fx) * grid.dx;
              let weight =
                this.quadraticKernel((fx - offset)[0]) * this.quadraticKernel((fx - offset)[1]);
              grid.grid_v[base + offset] +=
                weight * (material.p_mass * material.v[p] + affine.matmul(dpos));
              grid.grid_m[base + offset] += weight * material.p_mass;
            }
          }
        }
      },
    );

    this.updateGridVelocity = ti.classKernel(
      this,
      { grid: ti.template(), mouse_position: ti.types.vector(ti.f32, 2), click_strength: ti.f32 },
      (grid, mouse_position, click_strength) => {
        for (let I of ti.ndrange(grid.n_grid, grid.n_grid)) {
          let i = I[0];
          let j = I[1];
          if (grid.grid_m[I] > 0) {
            grid.grid_v[I] = (1 / grid.grid_m[I]) * grid.grid_v[I];
            grid.grid_v[I][1] -= this.dt * 50; // gravity
            // handle user click interaction
            let dist = grid.dx * I - mouse_position;
            grid.grid_v[I] += (dist / (0.01 + ti.norm(dist))) * this.dt * click_strength;
            // boundary handle
            if (i < 3 && grid.grid_v[I][0] < 0) {
              grid.grid_v[I][0] = 0;
            }
            if (i > grid.n_grid - 3 && grid.grid_v[I][0] > 0) {
              grid.grid_v[I][0] = 0;
            }
            if (j < 3 && grid.grid_v[I][1] < 0) {
              grid.grid_v[I][1] = 0;
            }
            if (j > grid.n_grid - 3 && grid.grid_v[I][1] > 0) {
              grid.grid_v[I][1] = 0;
            }
          }
        }
      },
    );

    this.gridToParticle = ti.classKernel(
      this,
      { material: ti.template(), grid: ti.template() },
      (material, grid) => {
        for (let p of ti.range(material.n_particles)) {
          let base = ti.i32(material.x[p] * grid.inv_dx - 0.5);
          let fx = material.x[p] * grid.inv_dx - ti.f32(base);
          let new_v = [0.0, 0.0];
          let new_C = [
            [0.0, 0.0],
            [0.0, 0.0],
          ];
          for (let i of ti.static(ti.range(3))) {
            for (let j of ti.static(ti.range(3))) {
              let offset = [i, j];
              let dpos = ti.f32(offset) - fx;
              let g_v = grid.grid_v[base + offset];
              let weight =
                this.quadraticKernel((fx - offset)[0]) * this.quadraticKernel((fx - offset)[1]);
              new_v = new_v + weight * g_v;
              new_C = new_C + 4 * grid.inv_dx * weight * g_v.outerProduct(dpos);
            }
          }
          material.v[p] = new_v;
          material.C[p] = new_C;
          material.x[p] = material.x[p] + this.dt * new_v;
          material.J[p] = (1.0 + this.dt * (new_C[0][0] + new_C[1][1])) * material.J[p];
          material.F[p] = (
            [
              [1.0, 0.0],
              [0.0, 1.0],
            ] +
            this.dt * material.C[p]
          ).matmul(material.F[p]);
        }
      },
    );
  }

  async reset() {
    for (let obj of this.material) {
      obj.init();
    }
  }

  async run() {
    for (let i = 0; i < parameterControl.getValue("n_substeps"); ++i) {
      this.clearData(this.grid);
      for (let obj of this.material) {
        this.particleToGrid(obj, this.grid, parameterControl.getValue("E"));
      }
      this.updateGridVelocity(
        this.grid,
        userInteraction.mousePosition,
        userInteraction.clickStrength,
      );
      for (let obj of this.material) {
        this.gridToParticle(obj, this.grid);
      }
    }
  }
}
