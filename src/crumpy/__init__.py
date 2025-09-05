"""
Copyright (c) 2025 Riverlane. All rights reserved.

crumpy: A python library for visualizing Crumble circuits in Jupyter
"""

# mypy: ignore-errors
# pylint: disable=abstract-method

from __future__ import annotations

import pathlib

import anywidget
import traitlets

__version__ = "0.1.0"

__all__ = ["__version__"]

bundler_output_dir = pathlib.Path(__file__).parent


class CircuitWidget(anywidget.AnyWidget):
    """A Jupyter widget for displaying Crumble circuit diagrams.

    Attributes
    ----------
    stim : str
      Stim circuit to be drawn.
    indentCircuitLines : bool
      If circuit lines for subsequent qubits in the same row get indented when drawn.
      Defaults to True (matching Crumble).
    curveConnectors : bool
      If connectors (e.g., the line between control and target of a CNOT) can be drawn curved.
      Defaults to True (matching Crumble).
    """

    _esm = bundler_output_dir / "bundle.js"
    stim = traitlets.Unicode(default_value="", help="Stim circuit to be drawn").tag(
        sync=True
    )
    indentCircuitLines = traitlets.Bool(True).tag(sync=True)
    curveConnectors = traitlets.Bool(True).tag(sync=True)
