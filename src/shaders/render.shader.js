export const render_vs = `
attribute vec2 a_pi;

uniform sampler2D u_pxNewTex;

void main() {
  vec2 px = texture2D(u_pxNewTex, a_pi).xy;

  gl_Position = vec4(px * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = 2.0;
}
`

export const render_fs = `
precision highp float;

void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
}
`
