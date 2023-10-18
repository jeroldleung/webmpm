function Slider(props) {
  return (
    <div className="relative">
      <label className="py-1 text-stone-400 text-sm">{props.name}</label>
      <input
        type="range"
        min="0"
        max="5"
        step="0.5"
        className="w-full h-px bg-stone-400 accent-black appearance-none cursor-pointer"
      />
    </div>
  );
}

export default function MaterialParameters() {
  return (
    <div className="flex flex-col gap-1 sm:w-56">
      <p className="font-bold text-lg">PARAMETERS</p>
      <Slider name="Density" />
      <Slider name="Young's modulus" />
      <Slider name="Bulk modulus" />
    </div>
  );
}
