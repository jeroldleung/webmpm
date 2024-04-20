export default class Loader {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl");
    if (!this.gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      throw new Error("WebGL not available");
    }
    this.shaderProgram = null;
  }

  loadShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      alert("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  initShaderProgram(vsSource, fsSource) {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    this.gl.useProgram(shaderProgram);
    this.shaderProgram = shaderProgram;
  }

  initBuffers() {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    const vertices = [
      -0.5,
      0.5, // Vertex 1 (X, Y)
      -0.5,
      -0.5, // Vertex 2 (X, Y)
      0.5,
      -0.5, // Vertex 3 (X, Y)
      -0.5,
      0.5, // Vertex 4 (X, Y)
      0.5,
      -0.5, // Vertex 5 (X, Y)
      0.5,
      0.5, // Vertex 6 (X, Y)
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    let positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, "a_position");
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  drawScene() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6); // Draw the square
  }
}
