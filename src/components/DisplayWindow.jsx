import { useEffect } from "react";

export default function DisplayWindow({ userInteraction }) {
  const getMousePosition = (event) => {
    // Get the mouse coordinates relative to the canvas
    const htmlCanvas = document.getElementById("result_canvas");
    const rect = htmlCanvas.getBoundingClientRect();
    const inv_img_size = 1 / htmlCanvas.width;
    const x = (event.clientX - rect.left) * inv_img_size;
    const y = (rect.bottom - event.clientY) * inv_img_size;
    userInteraction.setMousePosition(x, y);
  };

  const enableClickStrength = () => {
    userInteraction.setClickStrength(200);
  };

  const disableClickStrength = () => {
    userInteraction.setClickStrength(0);
  };

  useEffect(() => {
    const htmlCanvas = document.getElementById("result_canvas");
    htmlCanvas.addEventListener("mousemove", getMousePosition);
    htmlCanvas.addEventListener("mousedown", enableClickStrength);
    htmlCanvas.addEventListener("mouseup", disableClickStrength);
  });

  return (
    <div>
      <canvas
        id="result_canvas"
        className="w-full cursor-pointer"
        width={512}
        height={512}
      ></canvas>
    </div>
  );
}
