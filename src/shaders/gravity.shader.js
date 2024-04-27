export const gravity_vs = `
attribute vec2 a_quad;

void main() {
  gl_Position = vec4(a_quad, 0.0, 1.0);
}
`

export const gravity_fs = `
precision highp float;

uniform sampler2D u_gvTex;
uniform float u_gRes;
uniform float u_dt;

void main() {
  vec2 texcoord = gl_FragCoord.xy / u_gRes;
  vec2 gv = texture2D(u_gvTex, texcoord).xy;

  vec2 new_gv = gv + vec2(0.0, -9.8) * u_dt;

  gl_FragColor = vec4(new_gv, 0.0, 1.0);
}
`
