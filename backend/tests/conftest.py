import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.core.security import create_access_token, get_password_hash
from app.models.user import User, Department
from app.models.student import Student

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="session")
def officer_token():
    db = SessionLocal()
    officer = db.query(User).filter(User.role == "OFFICER").first()
    db.close()
    return create_access_token(subject=officer.id if officer else 1, role="OFFICER")

@pytest.fixture(scope="session")
def student_token():
    db = SessionLocal()
    # Ensure test student exists
    student_user = db.query(User).filter(User.email == "test_student@placement.edu").first()
    if not student_user:
        dept = db.query(Department).first()
        student_user = User(
            email="test_student@placement.edu",
            hashed_password=get_password_hash("Student@123"),
            full_name="Test Student",
            role="STUDENT",
            department_id=dept.id if dept else None
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)

        student_prof = Student(
            user_id=student_user.id,
            roll_number="TEST001",
            department_id=dept.id if dept else 1,
            batch_year=2026,
            cgpa=8.0,
            tenth_percentage=80.0,
            twelfth_percentage=80.0,
            backlogs=0,
            aptitude_score=75.0,
            coding_score=75.0,
            technical_score=75.0,
            communication_score=75.0,
            placement_status="NOT_PLACED"
        )
        db.add(student_prof)
        db.commit()

    token = create_access_token(subject=student_user.id, role="STUDENT")
    db.close()
    return token
