import * as ti from "taichi.js";
import Grid from "./grid";
import { userInteraction, parameterControl } from "./control";

export default class MPM {
  constructor() {
    this.material = [];
    this.grid = [];
    this.mappingGrid = {};
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

  singleGridUpdate = ti.func((grid, I, mouse_position, click_strength) => {
    let i = I[0];
    let j = I[1];
    if (grid.grid_m[I] > 0) {
      grid.grid_v[I] = (1 / grid.grid_m[I]) * grid.grid_v[I];
      grid.grid_n[I] = ti.normalized(grid.grid_n[I]);
      grid.grid_v[I][1] -= this.dt * 50; // gravity
      // user click interaction
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
  });

  async init(scene) {
    this.material = scene.objects;
    this.grid.push(new Grid());

    for (let i = 0; i < this.material.length; i++) {
      this.mappingGrid[i] = 0;
      if (i > 0 && scene.scene == "Non-Sticky Fluid-Solid Coupling") {
        this.grid.push(new Grid());
        this.mappingGrid[i] = i;
      }
    }

    this.clearData = ti.classKernel(this, () => {
      for (let I of ti.ndrange(this.grid[0].n_grid, this.grid[0].n_grid)) {
        for (let k of ti.static(ti.range(this.grid.length))) {
          this.grid[k].grid_v[I] = [0, 0];
          this.grid[k].grid_n[I] = [0, 0];
          this.grid[k].grid_m[I] = 0;
        }
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
              grid.grid_n[base + offset] += weight * material.p_mass * (ti.f32(offset) - fx);
            }
          }
        }
      },
    );

    this.updateGridVelocity = ti.classKernel(
      this,
      { mouse_position: ti.types.vector(ti.f32, 2), click_strength: ti.f32 },
      (mouse_position, click_strength) => {
        for (let I of ti.ndrange(this.grid[0].n_grid, this.grid[0].n_grid)) {
          for (let k of ti.static(ti.range(this.grid.length))) {
            this.singleGridUpdate(this.grid[k], I, mouse_position, click_strength);
          }
          // non-sticky coupling
          if (ti.static(this.grid.length > 1)) {
            let m1 = this.grid[0].grid_m[I];
            let m2 = this.grid[1].grid_m[I];
            if (m1 > 0.0 && m2 > 0.0) {
              let v1 = this.grid[0].grid_v[I];
              let v2 = this.grid[1].grid_v[I];
              let ni = ti.normalized(this.grid[0].grid_n[I] - this.grid[1].grid_n[I]); // grid normal
              let vir = v1 - v2; // grid responsed velocity
              if (ti.dot(vir, ni) > 0.0) {
                let v1n = ti.dot(v1, ni) * ni;
                let v2n = ti.dot(v2, ni) * ni;
                let v1t = v1 - v1n;
                let v2t = v2 - v2n;
                let slide = ti.max((m2 - m1) / (m1 + m2), 0.0); // adaptive sliding fractor
                let vi = (m1 * v1 + m2 * v2) / (m1 + m2);
                let v1t_new = (slide * m2 * (v1t - v2t)) / (m1 + m2);
                let v2t_new = (slide * m1 * (v2t - v1t)) / (m1 + m2);
                this.grid[0].grid_v[I] = vi + v1t_new;
                this.grid[1].grid_v[I] = vi + v2t_new;
              }
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
    for (let step = 0; step < parameterControl.getValue("n_substeps"); ++step) {
      this.clearData();
      this.material.forEach((element, index) => {
        this.particleToGrid(
          element,
          this.grid[this.mappingGrid[index]],
          parameterControl.getValue("E"),
        );
      });
      this.updateGridVelocity(userInteraction.mousePosition, userInteraction.clickStrength);
      this.material.forEach((element, index) => {
        this.gridToParticle(element, this.grid[this.mappingGrid[index]]);
      });
    }
  }
}
