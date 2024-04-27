export const p2g_vs = `
attribute vec2 a_quad;

void main() {
  gl_Position = vec4(a_quad, 0.0, 1.0);
}
`

export const p2g_fs = `
precision highp float;

uniform sampler2D u_pxTex;
uniform vec2 u_pTexDim;
uniform float u_dt;

float quadraticBSpline(float r) {
  r = abs(r);
  float res = 0.0;
  if (r >= 0.5 && r < 1.5) {
    res = 0.5 * pow(1.5 - r, 2.0);
  } else if (r < 0.5) {
    res = 0.75 - pow(r, 2.0);
  }
  return res;
}

float weight(vec2 v) {
  return quadraticBSpline(v.x) * quadraticBSpline(v.y);
}

void main() {
  vec2 texcoord = gl_FragCoord.xy / u_pTexDim;
  vec2 px = texture2D(u_pxTex, texcoord).xy;
  vec2 new_px = px + vec2(0.0, -9.8) * u_dt;
  
  gl_FragColor = vec4(new_px, 0.0, 1.0);
}
`
