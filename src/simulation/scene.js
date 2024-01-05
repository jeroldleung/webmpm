import Material from "./material";

export default class Scene {
  constructor() {
    this.scene = document.getElementById("scenes").value;
    this.objects = [];
  }

  async create() {
    switch (this.scene) {
      case "Water Dam Break":
        this.objects.push(new Material(0, 1, 0.5, [0.1, 0.1], [0.06, 0.46, 0.43, 1.0]));
        break;
      case "Jelly Cubes":
        this.objects.push(new Material(1, 2, 0.2, [0.3, 0.4], [0.97, 0.44, 0.44, 1.0]));
        break;
      case "Fluid-Solid Coupling":
        this.objects.push(new Material(0, 1, 0.4, [0.1, 0.1], [0.06, 0.46, 0.43, 1.0]));
        this.objects.push(new Material(1, 1, 0.2, [0.6, 0.3], [0.97, 0.44, 0.44, 1.0]));
        break;
      case "Non-Sticky Fluid-Solid Coupling":
        this.objects.push(new Material(0, 1, 0.4, [0.1, 0.1], [0.06, 0.46, 0.43, 1.0]));
        this.objects.push(new Material(1, 1, 0.2, [0.6, 0.3], [0.97, 0.44, 0.44, 1.0]));
        break;
    }
  }
}
