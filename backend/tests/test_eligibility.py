def test_get_companies_and_jobs(client):
    response = client.get("/api/v1/companies/jobs")
    assert response.status_code == 200
    jobs = response.json()
    assert len(jobs) >= 2

def test_check_eligibility(client, student_token):
    jobs = client.get("/api/v1/companies/jobs").json()
    job_id = jobs[0]["id"]
    response = client.get(
        f"/api/v1/companies/jobs/{job_id}/check-eligibility",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "eligible" in data
    assert "criteria_results" in data
    assert "blocking_reasons" in data
