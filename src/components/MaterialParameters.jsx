import { useState } from "react";

const parameterItems = [
  {
    name: "Young's modulus",
    id: "E",
    minVal: 1000,
    maxVal: 9000,
    stepVal: 1000,
    defaultVal: 5000,
  },
];

function Slider({ item }) {
  const [currentVal, setCurrentVal] = useState(item.defaultVal);
  return (
    <div className="relative">
      <label className="py-1 text-stone-400 text-sm">
        {item.name}: {currentVal}
      </label>
      <input
        id={item.id}
        type="range"
        defaultValue={item.defaultVal}
        onChange={(e) => setCurrentVal(e.target.value)}
        min={item.minVal}
        max={item.maxVal}
        step={item.stepVal}
        className="w-full h-px bg-stone-400 accent-black appearance-none cursor-pointer"
      />
    </div>
  );
}

export default function MaterialParameters() {
  const items = parameterItems.map((item) => <Slider item={item} />);
  return (
    <div className="flex flex-col gap-1 sm:w-56">
      <p className="font-bold text-lg">PARAMETERS</p>
      {items}
    </div>
  );
}
