from __future__ import annotations

import importlib.metadata

import crumpy as m


def test_version():
    assert importlib.metadata.version("crumpy") == m.__version__
