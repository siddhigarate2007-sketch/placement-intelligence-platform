from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user
from app.models.user import User, Department
from app.models.student import Student
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists"
        )
    
    # Department lookup or creation
    dept_code = user_in.department_code or "CSE"
    dept = db.query(Department).filter(Department.code == dept_code).first()
    if not dept:
        dept = Department(
            name="Computer Science & Engineering" if dept_code == "CSE" else f"Department of {dept_code}",
            code=dept_code
        )
        db.add(dept)
        db.commit()
        db.refresh(dept)

    hashed_pw = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        role=user_in.role.upper(),
        department_id=dept.id,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # If student, create student profile
    if new_user.role == "STUDENT":
        roll_no = user_in.roll_number or f"22{dept.code}{new_user.id:03d}"
        student = Student(
            user_id=new_user.id,
            roll_number=roll_no,
            department_id=dept.id,
            batch_year=user_in.batch_year or 2026,
            cgpa=7.5,
            tenth_percentage=82.0,
            twelfth_percentage=80.0,
            backlogs=0,
            aptitude_score=68.0,
            coding_score=65.0,
            technical_score=66.0,
            communication_score=72.0,
            internships_count=0,
            projects_count=1,
            certifications_count=0
        )
        db.add(student)
        db.commit()

    token = create_access_token(subject=new_user.id, role=new_user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": new_user.role,
        "user_id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account is deactivated")

    token = create_access_token(subject=user.id, role=user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email
    }

@router.get("/me", response_model=UserResponse)
def get_current_profile(current_user: User = Depends(get_current_user)):
    return current_user
