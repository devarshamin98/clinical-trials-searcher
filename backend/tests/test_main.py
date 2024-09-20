import pytest
from fastapi.testclient import TestClient

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import app

client = TestClient(app)

# Mock data to be used in the tests
mock_search_request = {
    "disease": "Lung Cancer",
    "therapy": "Chemotherapy"
}

def test_search_trials_success():
    """Test the /api/search endpoint with valid input."""
    response = client.post("/api/search", json=mock_search_request)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "nct_number" in data[0]
    assert "title" in data[0]
    assert "status" in data[0]

def test_search_trials_invalid():
    """Test the /api/search endpoint with invalid input (empty request)."""
    response = client.post("/api/search", json={"disease": "", "therapy": ""})
    assert response.status_code == 400
    assert response.json()["detail"] == "Please provide a disease or therapy/drug to search."

def test_get_trial_success():
    """Test the /api/trial/{idx} endpoint with a valid index."""
    response = client.get("/api/trial/0")
    assert response.status_code == 200
    data = response.json()
    assert "protocolSection" in data

def test_get_trial_not_found():
    """Test the /api/trial/{idx} endpoint with an invalid index."""
    response = client.get("/api/trial/99999")  # Assuming 9999 is an out-of-bounds index
    assert response.status_code == 404
    assert response.json()["detail"] == "Trial not found."
