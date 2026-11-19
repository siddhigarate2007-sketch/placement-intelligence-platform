def test_get_assessments(client):
    response = client.get("/api/v1/assessments/")
    assert response.status_code == 200
    assessments = response.json()
    assert len(assessments) >= 1
    aptitude_test = next((a for a in assessments if a["category"] == "APTITUDE"), None)
    assert aptitude_test is not None
    assert len(aptitude_test["questions"]) > 0

def test_submit_assessment(client, student_token):
    # Fetch first assessment
    assessments = client.get("/api/v1/assessments/").json()
    first_id = assessments[0]["id"]
    
    # Submit responses
    payload = {
        "responses": {
            str(q["id"]): q["options"][0] if q["options"] else "Answer"
            for q in assessments[0]["questions"]
        }
    }
    response = client.post(
        f"/api/v1/assessments/{first_id}/submit",
        json=payload,
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert "percentage" in data
    assert "passed" in data
    assert len(data["detailed_results"]) == len(assessments[0]["questions"])

def test_mock_interview_evaluation(client, student_token):
    payload = {
        "target_role": "Full Stack Engineer",
        "interview_type": "HR",
        "answers": [
            {
                "question": "Tell me about a challenging situation you handled in a team project.",
                "answer": "In our final year project, the situation was a major database bottleneck under load. My task was to optimize queries. The action I took was implementing Redis caching and indexing foreign keys. As a result, response latency dropped by 65%."
            }
        ]
    }
    response = client.post(
        "/api/v1/assessments/mock-interview",
        json=payload,
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["overall_score"] <= 100
    assert len(data["strengths"]) > 0
