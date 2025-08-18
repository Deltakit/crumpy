import {Circuit} from "./circuit/circuit.js"
import {draw} from "./draw/main_draw.js";
import {EditorState} from "./editor/editor_state.js";
import {initUrlCircuitSync} from "./editor/sync_url_to_state.js";

const CANVAS_W = 600;
const CANVAS_H = 300;

function createUIElements(el) {
    let defaultText = document.createElement('textarea');
    defaultText.id = 'txtDefaultCircuit';
    defaultText.setAttribute('style', 'display: none');
    defaultText.value = '[[[DEFAULT_CIRCUIT_CONTENT_LITERAL]]]';
    el.appendChild(defaultText);

    let importExportDiv = document.createElement('div');
    importExportDiv.id = 'divImportExport';
    importExportDiv.setAttribute('style', 'display: none');
    el.appendChild(importExportDiv);

    let txtStimCircuit = document.createElement('textarea');
    txtStimCircuit.id = 'txtStimCircuit';
    txtStimCircuit.setAttribute('style', 'width: 95vw; height: 300px; background-color: #FFFFB0');
    importExportDiv.appendChild(txtStimCircuit);

    let btnExport = document.createElement('button');
    btnExport.id = 'btnExport';
    btnExport.setAttribute('style', 'background-color: red');
    btnExport.textContent = '↑ Export to Stim Circuit ↑';
    importExportDiv.appendChild(btnExport);

    let btnImport = document.createElement('button');
    btnImport.id = 'btnImport';
    btnImport.setAttribute('style', 'background-color: red');
    btnImport.textContent = '↓ Import from Stim Circuit ↓';
    importExportDiv.appendChild(btnImport);

    let canvas = document.createElement('canvas');

    canvas.id = 'cvn';
    canvas.setAttribute('style', `width: ${CANVAS_W}px; height: ${CANVAS_H}px; border: 1px solid black; margin: 0; padding: 0;`);
    canvas.tabIndex = 0;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    el.appendChild(canvas);

    return {
        defaultText,
        importExportDiv,
        txtStimCircuit,
        btnExport,
        btnImport,
        canvas
    };
}

function render({ model, el }) {
    const getStim = () => model.get("stim")

    const {
        txtStimCircuit,
        btnExport,
        btnImport,
        canvas
    } = createUIElements(el);

    let editorState = /** @type {!EditorState} */ new EditorState(canvas);

    function exportCurrentState() {
        let validStimCircuit = editorState.copyOfCurCircuit().toStimCircuit().
            replaceAll('\nPOLYGON', '\n#!pragma POLYGON').
            replaceAll('\nERR', '\n#!pragma ERR').
            replaceAll('\nMARK', '\n#!pragma MARK');
        let txt = txtStimCircuit;
        txt.value = validStimCircuit + '\n';
        txt.focus();
        txt.select();
    }
    function commitInputAsCircuit() {
        let text = txtStimCircuit.value;
        let circuit = Circuit.fromStimCircuit(text);
        editorState.commit(circuit);
    }

    btnExport.addEventListener('click', _ev => {
        exportCurrentState();
    });
    btnImport.addEventListener('click', _ev => {
        commitInputAsCircuit();
    });

    // Changes to circuit on the Python/notebook side update the JS side
    model.on("change:stim", () => {
        txtStimCircuit.value = getStim();
        commitInputAsCircuit();
    });

    // Listeners on editor state that trigger redraws
    editorState.rev.changes().subscribe(() => {
        editorState.obs_val_draw_state.set(editorState.toSnapshot(undefined));
    });
    editorState.obs_val_draw_state.observable().subscribe(ds => requestAnimationFrame(() => {
        draw(editorState.canvas.getContext('2d'), ds);
    }));

    // Populate text area with initial stim and commit
    txtStimCircuit.value = getStim();
    commitInputAsCircuit();
}
export default { render };