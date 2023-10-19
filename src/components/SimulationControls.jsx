const controlItems = [
  {
    name: "Number of Particles",
    id: "n_particles",
    defaultValue: 9000,
    values: [3000, 6000, 9000, 12000, 15000],
  },
  {
    name: "Grid Resolution",
    id: "n_grid",
    defaultValue: "128 x 128",
    values: ["32 x 32", "64 x 64", "128 x 128"],
  },
  {
    name: "Time step",
    id: "dt",
    defaultValue: 0.0001,
    values: [0.0001],
  },
  {
    name: "Substeps",
    id: "n_substeps",
    defaultValue: 20,
    values: [10, 15, 20, 25, 30],
  },
  {
    name: "Collision method",
    id: "collision",
    defaultValue: "Single grid",
    values: ["Single grid"],
  },
];

function Picker({ controlItem, reset, setReset, setState }) {
  const valueOptions = controlItem.values.map((value) => (
    <option value={value}>{value}</option>
  ));
  return (
    <div>
      <label className="text-stone-400 text-sm text-center">
        {controlItem.name}
        <select
          id={controlItem.id}
          onChange={() => {
            setReset(!reset);
            setState("playing");
          }}
          defaultValue={controlItem.defaultValue}
          className="py-0.5 block w-full text-sm text-black bg-transparent border-0 border-b border-stone-400 focus:outline-none focus:ring-0 focus:border-black"
        >
          {valueOptions}
        </select>
      </label>
    </div>
  );
}

export default function SimulationControls({ reset, setReset, setState }) {
  const items = controlItems.map((item) => (
    <Picker
      controlItem={item}
      reset={reset}
      setReset={setReset}
      setState={setState}
    />
  ));
  return (
    <div className="flex flex-col gap-1 sm:w-56">
      <p className="font-bold text-lg">CONTROLS</p>
      {items}
    </div>
  );
}
