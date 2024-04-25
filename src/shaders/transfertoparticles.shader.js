export const transferToParticlesVert = `

void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}
`

export const transferToParticlesFrag = `
precision mediump float;

void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1);
}
`
