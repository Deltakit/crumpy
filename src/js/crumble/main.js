import { Circuit } from "./circuit/circuit.js";
import { draw } from "./draw/main_draw.js";
import { EditorState } from "./editor/editor_state.js";
import { initUrlCircuitSync } from "./editor/sync_url_to_state.js";

const CANVAS_W = 600;
const CANVAS_H = 300;

function initCanvas(el) {
  let canvas = document.createElement("canvas");

  canvas.id = "cvn";
  canvas.setAttribute(
    "style",
    `width: ${CANVAS_W}px; height: ${CANVAS_H}px; border: 1px solid black; margin: 0; padding: 0;`,
  );
  canvas.tabIndex = 0;
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  el.appendChild(canvas);

  return canvas;
}

function render({ model, el }) {
  const getStim = () => model.get("stim");

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
  model.on("change:stim", () => {
    commitStimCircuit(getStim());
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

  // Commit initial stim
  commitStimCircuit(getStim());
}
export default { render };
