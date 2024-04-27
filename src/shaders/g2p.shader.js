export const g2p_vs = `
attribute vec2 a_quad;

void main() {
  gl_Position = vec4(a_quad, 0.0, 1.0);
}
`

export const g2p_fs = `
precision highp float;

uniform sampler2D u_pxTex;
uniform sampler2D u_gvNewTex;
uniform vec2 u_pTexDim;
uniform float u_gRes;
uniform vec2 u_offset;

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
  vec2 fx = px * u_gRes;
  vec2 base = floor(fx - 0.5);
  vec2 gx = base + u_offset;
  vec2 gx_pixel = (gx + 0.5) / u_gRes;
  vec2 gv = texture2D(u_gvNewTex, gx_pixel).xy;
  float w = weight(fx - gx);

  gl_FragColor = vec4(w * gv, 0.0, 1.0);
}
`
