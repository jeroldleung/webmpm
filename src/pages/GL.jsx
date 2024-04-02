import { useEffect } from "react";

export default function GL() {
  useEffect(() => {
    const gl = document.getElementById("glcanvas").getContext("webgl");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  });
  return (
    <div>
      <canvas id="glcanvas" width={512} height={512}></canvas>
    </div>
  );
}
