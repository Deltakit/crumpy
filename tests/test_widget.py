# mypy: ignore-errors

from __future__ import annotations

import ipywidgets
import pytest
import traitlets

from crumpy import CircuitWidget


def test_basic_no_exception():
    """CircuitWidget should initialize without errors."""
    CircuitWidget(stim="H 0;", indentCircuitLines=False, curveConnectors=False)


def test_bad_stim_instruction_no_exception():
    """CircuitWidget should not raise an error if given any invalid stim instructions."""
    CircuitWidget(stim="H 0;thisIsNotAnInstruction 123;CNOT 0 1;")


def test_bad_trait_assignment_exception():
    """Assigning a non-string value to a CircuitWidget's stim should raise a TraitError."""
    widg = CircuitWidget()
    with pytest.raises(traitlets.TraitError):
        widg.stim = 123


def test_has_traits():
    """CircuitWidget should have the expected traits and sync metadata."""
    widg = CircuitWidget()
    assert widg.has_trait("stim")
    assert widg.has_trait("indentCircuitLines")
    assert widg.has_trait("curveConnectors")
    assert widg.trait_metadata("stim", "sync")
    assert widg.trait_metadata("indentCircuitLines", "sync")
    assert widg.trait_metadata("curveConnectors", "sync")


def test_use_case_dlink():
    """CircuitWidget should update its stim when linked to an IntSlider via ipywidgets.dlink."""

    def sliderToCircuit(slider_val):
        return "H 0;" * int(slider_val)

    circuit = CircuitWidget()
    slider_default_value = 1
    slider = ipywidgets.IntSlider(
        description="# of H gates", value=slider_default_value, min=0, max=30
    )
    ipywidgets.dlink((slider, "value"), (circuit, "stim"), sliderToCircuit)
    assert circuit.stim == sliderToCircuit(slider_default_value)

    new_slider_value = 5
    slider.value = new_slider_value
    assert circuit.stim == sliderToCircuit(new_slider_value)

    new_stim = "Y 0;"
    circuit.stim = new_stim
    assert circuit.stim == new_stim
