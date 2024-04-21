export default class Particles {
  constructor(scale) {
    this.numbers = 3000;
    this.position = [];
    for (let i = 0; i < this.numbers * 2; i++) {
      this.position[i] = Math.random() * scale - 0.5;
    }
  }

  getPosition() {
    return this.position;
  }

  getCount() {
    return this.numbers;
  }
}
