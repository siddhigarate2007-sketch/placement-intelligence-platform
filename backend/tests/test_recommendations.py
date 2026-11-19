def test_get_recommendations(client, student_token):
    response = client.get(
        "/api/v1/recommendations/",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    recs = response.json()
    assert len(recs) > 0
    categories = [r["category"] for r in recs]
    assert any(c in categories for c in ["APTITUDE", "CODING", "COMMUNICATION", "INTERNSHIP", "RESUME", "INTERVIEW"])

def test_get_and_toggle_roadmap(client, student_token):
    response = client.get(
        "/api/v1/recommendations/roadmap",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    roadmap = response.json()
    assert "stages" in roadmap
    assert len(roadmap["stages"]) == 6

    # Toggle first milestone
    first_milestone_id = roadmap["stages"][0]["milestones"][0]["id"]
    toggle_resp = client.post(
        f"/api/v1/recommendations/roadmap/milestone/{first_milestone_id}/toggle",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert toggle_resp.status_code == 200
    toggle_data = toggle_resp.json()
    assert "is_completed" in toggle_data
    assert "overall_progress_percentage" in toggle_data
