import * as ti from "taichi.js";

export class MPM {
  constructor() {
    this.n_particles = Number(document.getElementById("n_particles").value);
    const n_grid_text = document.getElementById("n_grid").value;
    const value_index = n_grid_text.indexOf("x") - 1;
    this.n_grid = Number(n_grid_text.slice(0, value_index));
    this.dt = Number(document.getElementById("dt").value);
    this.n_substeps = Number(document.getElementById("n_substeps").value);
    this.E = Number(document.getElementById("E").value); // Young's modulus
    this.nu = 0.2; // Poisson's ratio
    this.mu_0 = this.E / (2 * (1 + this.nu));
    this.lambda_0 = (this.E * this.nu) / ((1 + this.nu) * (1 - 2 * this.nu)); // Lame parameters
    this.isCleanup = false;
  }

  compute_parameters() {
    this.mu_0 = this.E / (2 * (1 + this.nu));
    this.lambda_0 = (this.E * this.nu) / ((1 + this.nu) * (1 - 2 * this.nu)); // Lame parameters
  }

  async cleanup() {
    this.isCleanup = true;
    await ti.clearKernelScope();
  }

  async run() {
    await ti.init();

    let dx = 1 / this.n_grid;
    let inv_dx = this.n_grid;
    let p_vol = (dx * 0.5) ** 2;
    let p_rho = 1;
    let p_mass = p_vol * p_rho;
    let x = ti.Vector.field(2, ti.f32, [this.n_particles]); // position
    let v = ti.Vector.field(2, ti.f32, [this.n_particles]); // velocity
    let C = ti.Matrix.field(2, 2, ti.f32, [this.n_particles]); // affine vel field
    let F = ti.Matrix.field(2, 2, ti.f32, this.n_particles); // deformation gradient
    let material = ti.field(ti.i32, [this.n_particles]); // material id
    let Jp = ti.field(ti.f32, [this.n_particles]); // plastic deformation
    let grid_v = ti.Vector.field(2, ti.f32, [this.n_grid, this.n_grid]);
    let grid_m = ti.field(ti.f32, [this.n_grid, this.n_grid]);
    let mouse_position = ti.Vector.field(2, ti.f32, [1]);
    let click_strength = ti.field(ti.i32, [1]);

    let img_size = 512;
    let inv_img_size = 1 / img_size;
    let image = ti.Vector.field(4, ti.f32, [img_size, img_size]);
    let group_size = this.n_particles / 3;

    ti.addToKernelScope({
      n_particles: this.n_particles,
      n_grid: this.n_grid,
      dx,
      inv_dx,
      dt: this.dt,
      p_vol,
      p_rho,
      p_mass,
      x,
      v,
      C,
      F,
      material,
      Jp,
      grid_v,
      grid_m,
      image,
      img_size,
      group_size,
      mouse_position,
      click_strength,
    });

    let substep = ti.kernel((mu_0, lambda_0) => {
      for (let I of ti.ndrange(n_grid, n_grid)) {
        grid_v[I] = [0, 0];
        grid_m[I] = 0;
      }

      // Particle to grid
      for (let p of ti.range(n_particles)) {
        let base = ti.i32(x[p] * inv_dx - 0.5);
        let fx = x[p] * inv_dx - ti.f32(base);
        let w = [
          0.5 * (1.5 - fx) ** 2,
          0.75 - (fx - 1) ** 2,
          0.5 * (fx - 0.5) ** 2,
        ];
        F[p] = (
          [
            [1.0, 0.0],
            [0.0, 1.0],
          ] +
          dt * C[p]
        ).matmul(F[p]);
        let h = ti.f32(ti.max(0.1, ti.min(5, ti.exp(10 * (1.0 - Jp[p])))));
        if (material[p] == 1) {
          h = 0.3;
        }
        let mu = mu_0 * h;
        let la = lambda_0 * h;
        if (material[p] == 0) {
          mu = 0.0;
        }
        let svd = ti.svd2D(F[p]);
        let U = svd.U;
        let sig = svd.E;
        let V = svd.V;
        let J = 1.0;
        for (let d of ti.static(ti.range(2))) {
          let new_sig = sig[[d, d]];
          if (material[p] == 2) {
            // Plasticity
            new_sig = ti.min(ti.max(sig[[d, d]], 1 - 2.5e-2), 1 + 4.5e-3);
          }
          Jp[p] = (Jp[p] * sig[[d, d]]) / new_sig;
          sig[[d, d]] = new_sig;
          J = J * new_sig;
        }
        if (material[p] == 0) {
          F[p] =
            [
              [1.0, 0.0],
              [0.0, 1.0],
            ] * ti.sqrt(J);
        } else if (material[p] == 2) {
          F[p] = U.matmul(sig).matmul(V.transpose());
        }
        let stress =
          (2 * mu * (F[p] - U.matmul(V.transpose()))).matmul(F[p].transpose()) +
          [
            [1.0, 0.0],
            [0.0, 1.0],
          ] *
            la *
            J *
            (J - 1);
        stress = -dt * p_vol * 4 * inv_dx * inv_dx * stress;
        let affine = stress + p_mass * C[p];
        for (let i of ti.static(ti.range(3))) {
          for (let j of ti.static(ti.range(3))) {
            let offset = [i, j];
            let dpos = (ti.f32(offset) - fx) * dx;
            let weight = w[[i, 0]] * w[[j, 1]];
            grid_v[base + offset] +=
              weight * (p_mass * v[p] + affine.matmul(dpos));
            grid_m[base + offset] += weight * p_mass;
          }
        }
      }

      // Grid operation
      for (let I of ti.ndrange(n_grid, n_grid)) {
        let i = I[0];
        let j = I[1];
        if (grid_m[I] > 0) {
          grid_v[I] = (1 / grid_m[I]) * grid_v[I];
          grid_v[I][1] -= dt * 50; // gravity
          // handle user click interaction
          let dist = dx * I - mouse_position[0];
          grid_v[I] += (dist / (0.01 + ti.norm(dist))) * dt * click_strength[0];
          if (i < 3 && grid_v[I][0] < 0) {
            grid_v[I][0] = 0;
          }
          if (i > n_grid - 3 && grid_v[I][0] > 0) {
            grid_v[I][0] = 0;
          }
          if (j < 3 && grid_v[I][1] < 0) {
            grid_v[I][1] = 0;
          }
          if (j > n_grid - 3 && grid_v[I][1] > 0) {
            grid_v[I][1] = 0;
          }
        }
      }

      // Grid to particle
      for (let p of ti.range(n_particles)) {
        let base = ti.i32(x[p] * inv_dx - 0.5);
        let fx = x[p] * inv_dx - ti.f32(base);
        let w = [
          0.5 * (1.5 - fx) ** 2,
          0.75 - (fx - 1.0) ** 2,
          0.5 * (fx - 0.5) ** 2,
        ];
        let new_v = [0.0, 0.0];
        let new_C = [
          [0.0, 0.0],
          [0.0, 0.0],
        ];
        for (let i of ti.static(ti.range(3))) {
          for (let j of ti.static(ti.range(3))) {
            let dpos = ti.f32([i, j]) - fx;
            let g_v = grid_v[base + [i, j]];
            let weight = w[[i, 0]] * w[[j, 1]];
            new_v = new_v + weight * g_v;
            new_C = new_C + 4 * inv_dx * weight * g_v.outerProduct(dpos);
          }
        }
        v[p] = new_v;
        C[p] = new_C;
        x[p] = x[p] + dt * new_v;
      }
    });

    let reset = ti.kernel(() => {
      for (let i of ti.range(n_particles)) {
        let group_id = ti.i32(ti.floor(i / group_size));
        x[i] = [
          ti.random() * 0.2 + 0.3 + 0.1 * group_id,
          ti.random() * 0.2 + 0.05 + 0.32 * group_id,
        ];
        material[i] = group_id;
        v[i] = [0, 0];
        F[i] = [
          [1, 0],
          [0, 1],
        ];
        Jp[i] = 1;
        C[i] = [
          [0, 0],
          [0, 0],
        ];
      }
    });

    let render = ti.kernel(() => {
      for (let I of ti.ndrange(img_size, img_size)) {
        image[I] = [1.0, 1.0, 1.0, 1.0];
      }
      for (let i of ti.range(n_particles)) {
        let pos = x[i];
        let ipos = ti.i32(pos * img_size);
        let this_color = ti.f32([0, 0, 0, 0]);
        if (material[i] == 0) {
          this_color = [0.06, 0.46, 0.43, 1.0];
        } else if (material[i] == 1) {
          this_color = [0.97, 0.44, 0.44, 1.0];
        } else if (material[i] == 2) {
          this_color = [0.0, 0.71, 0.83, 1.0];
        }
        image[ipos] = this_color;
      }
    });

    let htmlCanvas = document.getElementById("result_canvas");
    let canvas = new ti.Canvas(htmlCanvas);

    let pause = false;
    let is_forwarding = false;
    let canvas_clicked = false;

    reset();

    let frame = async () => {
      if (window.shouldStop || this.isCleanup) {
        return;
      }
      // catch mouse down
      click_strength.set([0], 0);
      if (canvas_clicked) {
        click_strength.set([0], 200);
      }
      if (!pause || is_forwarding) {
        for (let i = 0; i < this.n_substeps; ++i) {
          substep(this.mu_0, this.lambda_0);
        }
        is_forwarding = false;
      }
      render();
      canvas.setImage(image);
      requestAnimationFrame(frame);
    };

    await frame();

    const stop = document.getElementById("stop");
    stop.addEventListener("click", () => {
      pause = true;
      reset();
    });

    const playpause = document.getElementById("playpause");
    playpause.addEventListener("click", () => {
      pause = !pause;
    });

    const forward = document.getElementById("forward");
    forward.addEventListener("click", () => {
      pause = true;
      is_forwarding = true;
    });

    const youngsmodulus = document.getElementById("E");
    youngsmodulus.addEventListener("change", () => {
      this.E = Number(youngsmodulus.value);
      this.compute_parameters();
    });

    htmlCanvas.addEventListener("mousemove", (event) => {
      // Get the mouse coordinates relative to the canvas
      const rect = htmlCanvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * inv_img_size;
      const y = (rect.bottom - event.clientY) * inv_img_size;
      mouse_position.set([0], [x, y]);
    });

    htmlCanvas.addEventListener("mousedown", () => {
      canvas_clicked = true;
    });

    htmlCanvas.addEventListener("mouseup", () => {
      canvas_clicked = false;
    });
  }
}
