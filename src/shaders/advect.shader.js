export const advect_vs = `
attribute vec2 a_quad;

void main() {
  gl_Position = vec4(a_quad, 0.0, 1.0);
}
`

export const advect_fs = `
precision highp float;

uniform sampler2D u_pxTex;
uniform sampler2D u_pvNewTex;
uniform vec2 u_pTexDim;
uniform float u_dt;

void main() {
  vec2 texcoord = gl_FragCoord.xy / u_pTexDim;
  vec2 px = texture2D(u_pxTex, texcoord).xy;
  vec2 pv = texture2D(u_pvNewTex, texcoord).xy;
  vec2 new_px = px + pv * u_dt;
  
  gl_FragColor = vec4(new_px, 0.0, 1.0);
}
`
