import Material from "./material";

export default class Scene {
  constructor() {
    this.scene = document.getElementById("scenes").value;
    this.objects = [];
  }

  async create() {
    if (this.scene == "Water & Jelly & Snow") {
      this.objects.push(new Material([0.06, 0.46, 0.43, 1.0]));
    }
  }
}
