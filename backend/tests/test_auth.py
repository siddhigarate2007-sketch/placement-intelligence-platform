def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"

def test_login_success(client, student_token):
    response = client.post("/api/v1/auth/login", json={
        "email": "test_student@placement.edu",
        "password": "Student@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "STUDENT"
    assert data["email"] == "test_student@placement.edu"

def test_login_invalid_password(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "test_student@placement.edu",
        "password": "WrongPassword!"
    })
    assert response.status_code == 401
