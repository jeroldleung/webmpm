import GLLoader from './GLLoader.js'
import Particles from './Particles.js'
import { p2g_vs, p2g_fs } from '../shaders/p2g.shader.js'
import { gravity_vs, gravity_fs } from '../shaders/gravity.shader.js'
import { g2p_vs, g2p_fs } from '../shaders/g2p.shader.js'
import { advect_vs, advect_fs } from '../shaders/advect.shader.js'
import { render_vs, render_fs } from '../shaders/render.shader.js'

export default class Simulator {
  constructor() {
    this.wgl = new GLLoader(document.getElementById('glcanvas'))
    this.canvW = document.getElementById('glcanvas').width
    this.ps = new Particles(60, 60, 0.3, 0.5, 0.2)
    this.gRes = 100 // square grid
    this.dt = 0.0001

    this.frameBuf = this.wgl.createFrameBuf()
    this.piBuf = this.wgl.createBuf(this.ps.pi)
    this.quadBuf = this.wgl.createBuf(
      new Float32Array([-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
    )

    this.pxTexData = new Float32Array(this.ps.w * this.ps.h * 4)
    for (let i = 0; i < this.ps.w; i++) {
      for (let j = 0; j < this.ps.h; j++) {
        let k = 4 * (i * this.ps.w + j)
        this.pxTexData[k + 0] = Math.random() * this.ps.scale + this.ps.x
        this.pxTexData[k + 1] = Math.random() * this.ps.scale + this.ps.y
        this.pxTexData[k + 2] = 0.0
        this.pxTexData[k + 3] = 0.0
      }
    }

    // particle simulation state
    this.pxTex = this.wgl.createTex(this.ps.w, this.ps.h, this.pxTexData)
    this.pxNewTex = this.wgl.createTex(this.ps.w, this.ps.h, null)
    this.pvTex = this.wgl.createTex(this.ps.w, this.ps.h, null)
    this.pvNewTex = this.wgl.createTex(this.ps.w, this.ps.h, null)

    // grid simulation state
    this.gvTex = this.wgl.createTex(this.gRes, this.gRes, null)
    this.gvNewTex = this.wgl.createTex(this.gRes, this.gRes, null)

    this.wgl.createPrograms({
      p2g: [p2g_vs, p2g_fs],
      gravity: [gravity_vs, gravity_fs],
      g2p: [g2p_vs, g2p_fs],
      advect: [advect_vs, advect_fs],
      render: [render_vs, render_fs],
    })
  }

  swapTexture(object, t1, t2) {
    const tmp = object[t1]
    object[t1] = object[t2]
    object[t2] = tmp
  }

  step() {
    this.wgl.clear()

    this.wgl
      .bindFrameBuf(this.frameBuf)
      .viewport(0, 0, this.gRes, this.gRes)
      .useProgram('p2g')
      .bindBuffer('a_pi', this.piBuf)
      .bindTexture('u_pxTex', this.pxTex, 0)
      .bindTexture('u_pvTex', this.pvTex, 1)
      .setUniform1f('u_gRes', this.gRes)
      .drawToTexture(this.gvTex)
      .enableBlendAdd()

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.wgl.setUniform2f('u_offset', i, j).drawPoints(this.ps.nums)
      }
    }

    this.wgl.disableBlend()

    this.wgl
      .bindFrameBuf(this.frameBuf)
      .viewport(0, 0, this.gRes, this.gRes)
      .useProgram('gravity')
      .bindBuffer('a_quad', this.quadBuf)
      .bindTexture('u_gvTex', this.gvTex, 0)
      .setUniform1f('u_gRes', this.gRes)
      .setUniform1f('u_dt', this.dt)
      .drawToTexture(this.gvNewTex)
      .drawFullscreen()

    this.wgl
      .bindFrameBuf(this.frameBuf)
      .viewport(0, 0, this.ps.w, this.ps.h)
      .useProgram('g2p')
      .bindBuffer('a_quad', this.quadBuf)
      .bindTexture('u_pxTex', this.pxTex, 0)
      .bindTexture('u_gvNewTex', this.gvNewTex, 1)
      .setUniform2f('u_pTexDim', this.ps.w, this.ps.h)
      .setUniform1f('u_gRes', this.gRes)
      .drawToTexture(this.pvNewTex)
      .enableBlendAdd()

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.wgl.setUniform2f('u_offset', i, j).drawFullscreen()
      }
    }

    this.wgl.disableBlend()

    this.wgl
      .bindFrameBuf(this.frameBuf)
      .viewport(0, 0, this.ps.w, this.ps.h)
      .useProgram('advect')
      .bindBuffer('a_quad', this.quadBuf)
      .bindTexture('u_pxTex', this.pxTex, 0)
      .bindTexture('u_pvNewTex', this.pvNewTex, 1)
      .setUniform2f('u_pTexDim', this.ps.w, this.ps.h)
      .setUniform1f('u_dt', this.dt)
      .drawToTexture(this.pxNewTex)
      .drawFullscreen()

    this.wgl
      .bindFrameBuf(null)
      .viewport(0, 0, this.canvW, this.canvW)
      .useProgram('render')
      .bindBuffer('a_pi', this.piBuf)
      .bindTexture('u_pxNewTex', this.pxNewTex, 0)
      .drawPoints(this.ps.nums)

    this.swapTexture(this, 'pxTex', 'pxNewTex')
    this.swapTexture(this, 'pvTex', 'pvNewTex')
  }

  simulate() {
    for (let i = 0; i < 10; i++) {
      this.step()
    }
  }
}
