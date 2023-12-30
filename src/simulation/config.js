export const CONTROL_ITEMS = [
  {
    name: "Scenes",
    id: "scenes",
    defaultValue: "Water Dam Break",
    values: ["Water Dam Break"],
  },
  {
    name: "Particle Volume",
    id: "p_vol",
    defaultValue: 0.00001,
    values: [0.000001, 0.000003, 0.00001, 0.00003, 0.0001, 0.0003],
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
  {
    name: "Bulk modulus",
    id: "bulk_modulus",
    minVal: 0,
    maxVal: 1000,
    stepVal: 100,
    defaultVal: 800,
  },
];
