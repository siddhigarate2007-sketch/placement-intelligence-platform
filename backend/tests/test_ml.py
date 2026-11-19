def test_ml_prediction_inference(client, student_token):
    payload = {
        "cgpa": 8.5,
        "tenth_percentage": 88.0,
        "twelfth_percentage": 85.0,
        "backlogs": 0,
        "aptitude_score": 80.0,
        "coding_score": 85.0,
        "technical_score": 82.0,
        "communication_score": 85.0,
        "internships_count": 1,
        "projects_count": 3,
        "certifications_count": 2
    }
    response = client.post(
        "/api/v1/predictions/predict",
        json=payload,
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_status"] in ["PLACED", "NOT_PLACED"]
    assert 0.0 <= data["placed_probability"] <= 1.0
    assert 0.0 <= data["readiness_score"] <= 100.0
    assert len(data["contributions"]) > 0
    assert len(data["top_strengths"]) > 0

def test_ml_model_comparison(client):
    response = client.get("/api/v1/ml/comparison")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert len(data["models"]) >= 5
    algorithms = [m["algorithm"] for m in data["models"]]
    assert "Random Forest" in algorithms or "Gradient Boosting" in algorithms or "Logistic Regression" in algorithms
