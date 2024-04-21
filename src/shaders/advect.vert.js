export const advectVert = `
attribute vec2 a_position;
uniform float u_time;

void main() {
  vec2 new_pos = a_position + u_time * vec2(0.0, -9.8);
  gl_Position = vec4(new_pos, 0, 1);
  gl_PointSize = 2.0;
}
`;
