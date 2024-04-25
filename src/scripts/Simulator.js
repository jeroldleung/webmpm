import GLLoader from './GLLoader.js'
import Particles from './Particles.js'
import {
  transferToGridVert,
  transferToGridFrag,
} from '../shaders/transfertogrid.shader.js'
import {
  transferToParticlesVert,
  transferToParticlesFrag,
} from '../shaders/transfertoparticles.shader.js'
import { advectVert, advectFrag } from '../shaders/advect.shader.js'

export default class Simulator {
  constructor() {
    this.wgl = new GLLoader(document.getElementById('glcanvas'))
    this.particles = new Particles(0.3, 0.3, 0.2)
    this.gridResolution = 100 // square grid
    this.gridSize = 1 / this.gridResolution

    this.indexData = new Float32Array(
      this.gridResolution * this.gridResolution * 4,
    )
    for (let i = 0; i < this.gridResolution; i++) {
      for (let j = 0; j < this.gridResolution; j++) {
        this.indexData[4 * (i * this.gridResolution + j) + 0] = i
        this.indexData[4 * (i * this.gridResolution + j) + 1] = j
        this.indexData[4 * (i * this.gridResolution + j) + 2] = 0.0
        this.indexData[4 * (i * this.gridResolution + j) + 3] = 0.0
      }
    }

    this.frameBuffer = this.wgl.createFrameBuffer()

    this.positionBuffer = this.wgl.createBuffer(this.particles.getPosition())
    this.velocityBuffer = this.wgl.createBuffer(this.particles.getVelocity())

    this.indexTexture = this.wgl.createTexture(
      this.gridResolution,
      this.gridResolution,
      this.indexData,
    )
    this.velocityTexture = this.wgl.createTexture(
      this.gridResolution,
      this.gridResolution,
      null,
    )

    this.wgl.createPrograms({
      transferToGrid: {
        vertexShader: transferToGridVert,
        fragmentShader: transferToGridFrag,
      },
      transferToParticles: {
        vertexShader: transferToParticlesVert,
        fragmentShader: transferToParticlesFrag,
      },
      advect: {
        vertexShader: advectVert,
        fragmentShader: advectFrag,
      },
    })
  }

  step(time) {
    this.wgl
      .bindFrameBuffer(this.frameBuffer)
      .viewport(0, 0, this.gridResolution, this.gridResolution)
      .useProgram('transferToGrid')
      .bindBuffer('a_position', this.positionBuffer)
      .bindBuffer('a_velocity', this.velocityBuffer)
      .bindTexture('u_velocityTexture', this.velocityTexture, 0)
      .bindTexture('u_indexTexture', this.indexTexture, 1)
      .setUniform1f('u_gridSize', this.gridSize)
      .frameBufferTexture2D(this.velocityTexture)

    this.wgl
      .bindFrameBuffer(this.frameBuffer)
      .viewport(0, 0, this.gridResolution, this.gridResolution)
      .useProgram('transferToParticles')
      .bindBuffer('a_position', this.positionBuffer)

    this.wgl
      .bindFrameBuffer(null)
      .viewport(0, 0, 512, 512)
      .useProgram('advect')
      .bindBuffer('a_position', this.positionBuffer)

    this.wgl.drawScene(this.particles.getCount())
  }

  simulate(time) {
    for (let i = 0; i < 10; i++) {
      this.step(time)
    }
  }
}
