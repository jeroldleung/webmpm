export default class Particles {
  constructor(w, h, x, y, scale) {
    this.w = w
    this.h = h
    this.x = x
    this.y = y
    this.scale = scale
    this.nums = w * h
    this.pi = new Float32Array(this.nums * 2)
    for (let i = 0; i < this.nums; i++) {
      this.pi[i * 2 + 0] = Math.random()
      this.pi[i * 2 + 1] = Math.random()
    }
  }
}
