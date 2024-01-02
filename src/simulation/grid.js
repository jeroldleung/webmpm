import * as ti from "taichi.js";

export default class Grid {
  constructor() {
    this.n_grid = parseInt(document.getElementById("n_grid").value);
    this.dx = 1 / this.n_grid;
    this.inv_dx = this.n_grid;
    this.grid_v = ti.Vector.field(2, ti.f32, [this.n_grid, this.n_grid]);
    this.grid_m = ti.field(ti.f32, [this.n_grid, this.n_grid]);

    this.clear = ti.classKernel(this, () => {
      for (let I of ti.ndrange(this.n_grid, this.n_grid)) {
        this.grid_v[I] = [0, 0];
        this.grid_m[I] = 0;
      }
    });
  }
}
