export default class Loader {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl");
    if (!this.gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      throw new Error("WebGL not available");
    }
    this.shaderPrograms = {};
    this.programAttributes = {};
  }

  loadShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
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
      console.log(
        "Unable to initialize the shader program: " + this.gl.getProgramInfoLog(shaderProgram),
      );
      return null;
    }

    return shaderProgram;
  }

  createPrograms(programeParameters) {
    for (let name in programeParameters) {
      const vs = programeParameters[name].vertexShader;
      const fs = programeParameters[name].fragmentShader;
      this.shaderPrograms[name] = this.initShaderProgram(vs, fs);
      this.programAttributes[name] = programeParameters[name].attributes;
    }
  }

  createBuffers() {
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
  }

  useProgram(which) {
    const shaderProgram = this.shaderPrograms[which];
    const attributeName = this.programAttributes[which];

    this.gl.useProgram(shaderProgram);
    let attributeLocation = this.gl.getAttribLocation(shaderProgram, attributeName);
    this.gl.enableVertexAttribArray(attributeLocation);
    this.gl.vertexAttribPointer(attributeLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  drawScene() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6); // Draw the square
  }
}
