export default class GLLoader {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl");
    if (!this.gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      throw new Error("WebGL not available");
    }
    this.gl.getExtension("OES_texture_float"); // for type of gl.FLOAT in texImage2d()
    this.shaderPrograms = {};
    this.currentProgram = null;
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
    }
  }

  createTexture(width, height) {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      width,
      height,
      0,
      this.gl.RGBA,
      this.gl.FLOAT,
      null,
    );
    return texture;
  }

  createBuffer(data) {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    return positionBuffer;
  }

  bindBuffer(buffer) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    return this;
  }

  useProgram(programName) {
    this.gl.useProgram(this.shaderPrograms[programName]);
    this.currentProgram = programName;
    return this;
  }

  enableAttribute(attributeName) {
    const shaderProgram = this.shaderPrograms[this.currentProgram];
    let attributeLocation = this.gl.getAttribLocation(shaderProgram, attributeName);
    this.gl.enableVertexAttribArray(attributeLocation);
    this.gl.vertexAttribPointer(attributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    return this;
  }

  setUniform(uniformName, data) {
    const shaderProgram = this.shaderPrograms[this.currentProgram];
    let uniformLocation = this.gl.getUniformLocation(shaderProgram, uniformName);
    this.gl.uniform1f(uniformLocation, data);
    return this;
  }

  drawScene(numberOfParticles) {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.POINTS, 0, numberOfParticles);
  }
}
