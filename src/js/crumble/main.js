import { Circuit } from "./circuit/circuit.js";
import { draw } from "./draw/main_draw.js";
import { EditorState } from "./editor/editor_state.js";
import { setIndentCircuitLines, setCurveConnectors } from "./draw/config.js";

const CANVAS_W = 600;
const CANVAS_H = 300;

function initCanvas(el) {
  let canvas = document.createElement("canvas");

  canvas.id = "cvn";
  canvas.setAttribute(
    "style",
    `border: 1px solid black; margin: 0; padding: 0;`,
  );
  canvas.tabIndex = 0;
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  el.appendChild(canvas);

  return canvas;
}

function render({ model, el }) {
  const traitlets = {
    getStim: () => model.get("stim"),
    getIndentCircuitLines: () => model.get("indentCircuitLines"),
    getCurveConnectors: () => model.get("curveConnectors"),
  };

  const canvas = initCanvas(el);

  let editorState = /** @type {!EditorState} */ new EditorState(canvas);

  const exportCurrentState = () =>
    editorState
      .copyOfCurCircuit()
      .toStimCircuit()
      .replaceAll("\nPOLYGON", "\n#!pragma POLYGON")
      .replaceAll("\nERR", "\n#!pragma ERR")
      .replaceAll("\nMARK", "\n#!pragma MARK");
  function commitStimCircuit(stim_str) {
    let circuit = Circuit.fromStimCircuit(stim_str);
    editorState.commit(circuit);
  }

  // Changes to circuit on the Python/notebook side update the JS
  model.on("change:stim", () => commitStimCircuit(traitlets.getStim()));
  model.on("change:indentCircuitLines", () => {
    setIndentCircuitLines(traitlets.getIndentCircuitLines());
    editorState.force_redraw();
  });
  model.on("change:curveConnectors", () => {
    setCurveConnectors(traitlets.getCurveConnectors());
    editorState.force_redraw();
  });

  // Listeners on editor state that trigger redraws
  editorState.rev.changes().subscribe(() => {
    editorState.obs_val_draw_state.set(editorState.toSnapshot(undefined));
  });
  editorState.obs_val_draw_state.observable().subscribe((ds) =>
    requestAnimationFrame(() => {
      draw(editorState.canvas.getContext("2d"), ds);
    }),
  );

  // Configure initial settings and stim
  setIndentCircuitLines(traitlets.getIndentCircuitLines());
  setCurveConnectors(traitlets.getCurveConnectors());
  commitStimCircuit(traitlets.getStim());
}
export default { render };
