export const g2p_vs = `
attribute vec2 a_pi;

uniform sampler2D u_pxNewTex;

void main() {
  vec2 px = texture2D(u_pxNewTex, a_pi).xy;
  gl_Position = vec4(px * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = 2.0;
}
`

export const g2p_fs = `
precision highp float;

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
  gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
}
`
