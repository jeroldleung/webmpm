export default class Particles {
  constructor(x, y, scale) {
    this.numbers = 3000
    this.position = []
    this.velocity = []
    for (let i = 0; i < this.numbers; i++) {
      this.position[i * 2 + 0] = Math.random() * scale + x
      this.position[i * 2 + 1] = Math.random() * scale + y
      this.velocity[i * 2 + 0] = 0.0
      this.velocity[i * 2 + 1] = 0.0
    }
  }

  getPosition() {
    return this.position
  }

  getVelocity() {
    return this.velocity
  }

  getCount() {
    return this.numbers
  }
}
