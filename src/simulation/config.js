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
];

export const PARAMETER_ITEMS = [
  {
    name: "Young's modulus",
    id: "youngsModulus",
    minVal: 1000,
    maxVal: 9000,
    stepVal: 1000,
    defaultVal: 5000,
  },
  {
    name: "Bulk modulus",
    id: "bulkModulus",
    minVal: 100,
    maxVal: 1100,
    stepVal: 100,
    defaultVal: 800,
  },
];
