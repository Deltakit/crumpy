<div align="center">

# CrumPy

Visualize quantum circuits with error propagation in a Jupyter widget.

<img src="./_static/images/bit_flip_in_jupyter.png" alt="jupyter notebook cell with quantum circuit diagram output" width=400>

---

This package builds off of the existing circuit visualizations of
[Crumble](https://algassert.com/crumble), a stabilizer circuit editor and
sub-project of the open-source stabilizer circuit project
[Stim](https://github.com/quantumlib/Stim).

</div>

---

## Installation

**Requires:** Python 3.11+

```console
pip install crumpy
```

## Usage

CrumPy provides a convenient Jupyter widget that makes use of Crumble's ability
to generate quantum circuit timeline visualizations with Pauli propagation from
[Stim circuit specifications](https://github.com/quantumlib/Stim/blob/main/doc/file_format_stim_circuit.md#the-stim-circuit-file-format-stim).

### Using `CircuitWidget`

`CircuitWidget` takes a
[Stim circuit specification](https://github.com/quantumlib/Stim/blob/main/doc/file_format_stim_circuit.md#the-stim-circuit-file-format-stim)
in the form of a Python `str`. To convert from the official Stim package's
`stim.Circuit`, use `str(stim_circuit)`. If coming from another circuit type, it
is recommended to first convert to a `stim.Circuit` (e.g., with Stim's
[`stimcirq`](https://github.com/quantumlib/Stim/tree/main/glue/cirq) package),
then to `str`. Note that not all circuits may be convertible to Stim.

```python
from crumpy import CircuitWidget

your_circuit = """
H 0
CNOT 0 1
"""

circuit = CircuitWidget(stim=your_circuit)
circuit
```

<img src="./_static/images/circuit_epr_pair.png" alt="quantum circuit that creates EPR pair" width=175>

### Propagating Paulis

A useful feature of Crumble (and CrumPy) is the ability to propagate Paulis
through a quantum circuit. Propagation is done automatically based on the
specified circuit and Pauli markers. From the
[Crumble docs](https://github.com/quantumlib/Stim/tree/main/glue/crumble#readme):

> Propagating Paulis is done by placing markers to indicate where to add terms.
> Each marker has a type (X, Y, or Z) and an index (0-9) indicating which
> indexed Pauli product the marker is modifying.

Define a Pauli X, Y, or Z marker with the `#!pragma MARK_` instruction. Note
that for compatibility with Stim, the '`#!pragma `' is included as `MARK_` is
not considered a standard Stim instruction:

```python
z_error_on_qubit_2 = "#!pragma MARKZ(0) 2"
```

#### Legend

<img src="./_static/images/pauli_legend.svg" alt="jupyter notebook cell with quantum circuit diagram output" width=200>

#### Example

```python
circuit_with_error = """
#!pragma MARKX(0) 0
TICK
CNOT 0 1
TICK
H 0
"""

CircuitWidget(stim=circuit_with_error)
```

<img src="./_static/images/circuit_with_marker.png" alt="quantum circuit with Pauli propagation markers" width=200>

Notice how the single specified Pauli X marker propagates both through the
control and across the connector of the CNOT, and gets transformed into a Pauli
Z error when it encounters an H gate.

## Local Development

See the [contribution guidelines](.github/CONTRIBUTING.md) for a quick start
guide and Python best practices.

### Additional requirements

[npm/Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
(for bundling JavaScript); versions 11+/22+ recommended

### Project Layout

CrumPy makes use of the widget creation tool
[AnyWidget](https://anywidget.dev/). With AnyWidget, Python classes are able to
take JavaScript and display custom widgets in Jupyter environments. CrumPy
therefore includes both JavaScript and Python subparts:

```text
crumpy/
├── src/
│   ├── crumpy/
│   │   ├── __init__.py       # Python code for CircuitWidget
│   │   └── bundle.js         # Bundled JavaScript will appear here
│   └── js/
│       ├── crumble/          # Modified Crumble code
│       │   ├── main.js       # Main circuit visualization/setup
│       │   └── ...
│       └── package.json      # Bundling setup and scripts
├── tests/                    # Python tests
└── ...
```

`src/crumpy` contains the main Python package code.

`src/crumpy/__init__.py` contains the main class of the `crumpy` package,
`CircuitWidget`.

`src/js/crumble/` contains the modified Crumble circuit visualization code that
will be rendered in the `CircuitWidget` widget.

`src/js/crumble/main.js` contains the main circuit visualization and setup logic
in the form of the `render` function
[used by AnyWidget](https://anywidget.dev/en/afm/#anywidget-front-end-module-afm).

### Bundling

To create a Jupyter widget, AnyWidget takes in JavaScript as an ECMAScript
Module (ESM). **Any changes made to the JavaScript code that backs the circuit
visualization will require re-bundling** into one optimized ESM file.

To bundle the JavaScript:

1. Navigate to `src/js`
2. If you haven't yet, run `npm install` (this will install the
   [esbuild](https://esbuild.github.io/) bundler)
3. Run `npm run build` (or `npm run watch` for watch mode)

A new bundle should appear at `src/crumpy/bundle.js`.

**Note**: If you are working in a Jupyter notebook and re-bundle the JavaScript,
you may need to restart the notebook kernel and rerun any widget-displaying code
for the changes to take effect.

<!-- SPHINX-START -->

<!-- prettier-ignore-start -->
[actions-badge]:            https://github.com/Deltakit/crumpy/workflows/CI/badge.svg
[actions-link]:             https://github.com/Deltakit/crumpy/actions
[conda-badge]:              https://img.shields.io/conda/vn/conda-forge/crumpy
[conda-link]:               https://github.com/conda-forge/crumpy-feedstock
[github-discussions-badge]: https://img.shields.io/static/v1?label=Discussions&message=Ask&color=blue&logo=github
[github-discussions-link]:  https://github.com/Deltakit/crumpy/discussions
[pypi-link]:                https://pypi.org/project/crumpy/
[pypi-platforms]:           https://img.shields.io/pypi/pyversions/crumpy
[pypi-version]:             https://img.shields.io/pypi/v/crumpy
[rtd-badge]:                https://readthedocs.org/projects/crumpy/badge/?version=latest
[rtd-link]:                 https://crumpy.readthedocs.io/en/latest/?badge=latest

<!-- prettier-ignore-end -->
