export const p2g_vs = `
attribute vec2 a_pi;

uniform sampler2D u_pxTex;
uniform sampler2D u_pvTex;
uniform int u_gRes;
uniform vec2 u_offset;

varying vec2 v_pv;
varying vec2 v_r;

void main() {
  float gRes = float(u_gRes);
  vec2 px = texture2D(u_pxTex, a_pi).xy;
  vec2 fx = px * gRes;
  vec2 base = floor(fx - 0.5);
  vec2 gx = base + u_offset;
  vec2 gx_pixel = (gx + 0.5) / gRes;

  v_pv = texture2D(u_pvTex, a_pi).xy;
  v_r = fx - gx;

  gl_Position = vec4(gx_pixel * 2.0 - 1.0, 0.0, 1.0);
}
`

export const p2g_fs = `
precision highp float;

varying vec2 v_pv;
varying vec2 v_r;

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
  float w = weight(v_r);
  
  gl_FragColor = vec4(w * v_pv, 0.0, 1.0);
}
`
