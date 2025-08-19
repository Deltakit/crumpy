"""
Copyright (c) 2025 Riverlane. All rights reserved.

crumpy: A python library for visualizing Crumble circuits in Jupyter
"""

# mypy: ignore-errors

from __future__ import annotations

import pathlib

import anywidget
import traitlets

__version__ = "0.0.0"

__all__ = ["__version__"]

bundler_output_dir = pathlib.Path(__file__).parent


class CircuitWidget(anywidget.AnyWidget):
    _esm = bundler_output_dir / "bundle.js"
    stim = traitlets.Unicode("").tag(sync=True)
