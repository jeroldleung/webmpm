import * as ti from "taichi.js";

export default class Renderer {
  constructor() {
    this.img_size = 512;
    this.image = ti.Vector.field(4, ti.f32, [this.img_size, this.img_size]);
    this.canvas = new ti.Canvas(document.getElementById("result_canvas"));

    this.clear = ti.classKernel(this, () => {
      for (let I of ti.ndrange(this.img_size, this.img_size)) {
        this.image[I] = [1.0, 1.0, 1.0, 1.0];
      }
    });

    this.draw = ti.classKernel(this, { object: ti.template() }, (object) => {
      for (let i of ti.range(object.n_particles)) {
        let pos = object.x[i];
        let ipos = ti.i32(pos * this.img_size);
        this.image[ipos] = object.color;
      }
    });
  }

  async render(scene) {
    this.clear();
    for (let obj of scene.objects) {
      await this.draw(obj);
    }
    this.canvas.setImage(this.image);
  }
}
