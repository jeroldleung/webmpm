import Material from "./material";

export default class Scene {
  constructor() {
    this.scene = document.getElementById("scenes").value;
    this.objects = [];
  }

  async create() {
    if (this.scene == "Water Dam Break") {
      this.objects.push(new Material(0.5, [0.1, 0.1], [0.06, 0.46, 0.43, 1.0]));
    }
  }
}
