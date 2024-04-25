export const transferToGridVert = `
attribute vec2 a_position;
attribute vec2 a_velocity;

uniform sampler2D u_indexTexture;
uniform float u_gridSize;

varying vec2 v_position;
varying vec2 v_velocity;

void main() {
  vec2 textureCoordinates = texture2D(u_indexTexture, a_position).xy * u_gridSize;

  v_position = a_position;
  v_velocity = a_velocity;

  gl_Position = vec4(textureCoordinates * 2.0 - 1.0, 0.0, 1.0);
}
`

export const transferToGridFrag = `
precision mediump float;

varying vec2 v_position;
varying vec2 v_velocity;

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
  gl_FragColor = vec4(weight(v_position - gl_FragCoord.xy) * v_velocity, 0.0, 1);
}
`
