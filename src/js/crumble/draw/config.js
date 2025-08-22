const pitch = 50;
const rad = 10;
const OFFSET_X = -pitch + Math.floor(pitch / 4) + 0.5;
const OFFSET_Y = -pitch + Math.floor(pitch / 4) + 0.5;
let indentCircuitLines = true;
let curveConnectors = true;

const setIndentCircuitLines = (newBool) => {
  if (typeof newBool !== "boolean") {
    throw new TypeError(`Expected a boolean, but got ${typeof newBool}`);
  }
  indentCircuitLines = newBool;
};

const setCurveConnectors = (newBool) => {
  if (typeof newBool !== "boolean") {
    throw new TypeError(`Expected a boolean, but got ${typeof newBool}`);
  }
  curveConnectors = newBool;
};

export {
  pitch,
  rad,
  OFFSET_X,
  OFFSET_Y,
  indentCircuitLines,
  curveConnectors,
  setIndentCircuitLines,
  setCurveConnectors,
};
