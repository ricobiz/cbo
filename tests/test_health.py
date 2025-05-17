
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    """Test that the health endpoint returns status ok"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_ping_endpoint():
    """Test that the ping endpoint works correctly"""
    response = client.get("/health/ping")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["message"] == "pong"
