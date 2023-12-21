export default function DisplayWindow() {
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
