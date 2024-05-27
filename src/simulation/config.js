export const CONTROL_ITEMS = [
  {
    name: "Scenes",
    id: "scenes",
    defaultValue: "Fluid-Solid Coupling",
    values: [
      "Water Dam Break",
      "Jelly Cubes",
      "Fluid-Solid Coupling",
      "Non-Sticky Fluid-Solid Coupling",
      "Sand",
    ],
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
    name: "Substeps",
    id: "n_substeps",
    minVal: 1,
    maxVal: 30,
    stepVal: 1,
    defaultVal: 25,
  },
  {
    name: "Young's modulus",
    id: "E",
    minVal: 100,
    maxVal: 2000,
    stepVal: 100,
    defaultVal: 1000,
  },
  {
    name: "Particle Size",
    id: "psize",
    minVal: 1,
    maxVal: 5,
    stepVal: 1,
    defaultVal: 2,
  },
];
