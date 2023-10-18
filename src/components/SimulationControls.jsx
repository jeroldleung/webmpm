const NUMBER_OF_PARTICLES = {
  name: "Number of Particles",
  id: "n_particles",
  defaultValue: 9000,
  values: [3000, 6000, 9000, 12000, 15000],
};

const GRID_RESOLUTION = {
  name: "Grid Resolution",
  id: "n_grid",
  defaultValue: "128 x 128",
  values: ["32 x 32", "64 x 64", "128 x 128", "256 x 256"],
};

const TIME_STEP = {
  name: "Time step",
  id: "dt",
  defaultValue: 0.0001,
  values: [0.01, 0.001, 0.0001, 0.00001],
};

const SUBSTEPS = {
  name: "Substeps",
  id: "substeps",
  defaultValue: 20,
  values: [10, 20, 30, 40],
};

const COLLISION_METHOD = {
  name: "Collision method",
  id: "collision",
  defaultValue: "Single grid",
  values: ["Single grid", "Double grids"],
};

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
  return (
    <div className="flex flex-col gap-1 sm:w-56">
      <p className="font-bold text-lg">CONTROLS</p>
      <Picker
        controlItem={NUMBER_OF_PARTICLES}
        reset={reset}
        setReset={setReset}
        setState={setState}
      />
      <Picker controlItem={GRID_RESOLUTION} />
      <Picker controlItem={TIME_STEP} />
      <Picker controlItem={SUBSTEPS} />
      <Picker controlItem={COLLISION_METHOD} />
    </div>
  );
}
