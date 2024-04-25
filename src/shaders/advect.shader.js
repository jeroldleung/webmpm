export const advectVert = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = 2.0;
}
`

export const advectFrag = `
precision mediump float;

void main() {
  gl_FragColor = vec4(1, 0, 0.5, 1);
}
`
