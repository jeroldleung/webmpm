export const CONTROL_ITEMS = [
  {
    name: "Scenes",
    id: "scenes",
    defaultValue: "Water & Jelly & Snow",
    values: ["Water & Jelly & Snow"],
  },
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

export const PARAMETER_ITEMS = [
  {
    name: "Young's modulus",
    id: "E",
    minVal: 1000,
    maxVal: 9000,
    stepVal: 1000,
    defaultVal: 5000,
  },
];
