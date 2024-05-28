import Material from "./material";

export default class Scene {
  constructor() {
    this.scene = document.getElementById("scenes").value;
    this.objects = [];
  }

  async create() {
    switch (this.scene) {
      case "Water Dam Break":
        this.objects.push(new Material(0, 0.5, 1, [0.1, 0.1], [0.3, 0.8, 0.9, 1.0]));
        break;
      case "Jelly Cubes":
        this.objects.push(new Material(1, 0.2, 0.5, [0.1, 0.4], [0.3, 0.4, 0.8, 1.0]));
        this.objects.push(new Material(1, 0.2, 0.5, [0.4, 0.5], [0.6, 0.3, 0.7, 1.0]));
        this.objects.push(new Material(1, 0.2, 0.5, [0.7, 0.6], [0.2, 0.6, 0.4, 1.0]));
        break;
      case "Fluid-Solid Coupling":
        this.objects.push(new Material(0, 0.4, 1, [0.2, 0.1], [0.3, 0.8, 0.9, 1.0]));
        this.objects.push(new Material(1, 0.2, 0.5, [0.5, 0.6], [1.0, 0.7, 0.7, 1.0]));
        break;
      case "Non-Sticky Fluid-Solid Coupling":
        this.objects.push(new Material(0, 0.4, 1, [0.2, 0.1], [0.3, 0.8, 0.9, 1.0]));
        this.objects.push(new Material(1, 0.2, 0.5, [0.5, 0.6], [1.0, 0.7, 0.7, 1.0]));
        break;
      case "Sand":
        this.objects.push(new Material(2, 0.4, 1, [0.2, 0.1], [0.96, 0.74, 0.38, 1.0]));
        break;
      case "Sand without volume preserved":
        this.objects.push(new Material(2, 0.4, 1, [0.2, 0.1], [0.96, 0.74, 0.38, 1.0]));
        break;
    }
  }
}
