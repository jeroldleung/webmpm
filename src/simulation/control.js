export const simulationControl = {
  currentState: "play",
  handlers: {},
  changeState: function (value) {
    this.currentState = value;
  },
  addState: function (state, task, nextState) {
    this.handlers[state] = [task, nextState];
  },
  run: function () {
    let currentEvent = this.handlers[this.currentState];
    currentEvent[0](); // run task
    this.changeState(currentEvent[1]);
  },
};

export const userInteraction = {
  mousePosition: [0.0, 0.0],
  clickStrength: 0,
  setMousePosition: function (x, y) {
    this.mousePosition = [x, y];
  },
  setClickStrength: function (value) {
    this.clickStrength = value;
  },
};
