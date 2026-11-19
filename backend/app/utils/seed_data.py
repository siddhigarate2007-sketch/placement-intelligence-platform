import json
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.user import User, Department
from app.models.student import Student, AcademicRecord, Skill, Internship, Project, Certification, Resume
from app.models.ml import ModelVersion, Prediction
from app.models.assessment import Assessment, Question
from app.models.placement import Company, JobOpportunity, EligibilityRule, Application
from app.models.audit import Notification

def seed_database():
    print("[Seed] Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).first():
            print("[Seed] Database already contains records. Skipping seed.")
            return

        print("[Seed] Seeding departments...")
        depts_data = [
            {"code": "CSE", "name": "Computer Science & Engineering", "description": "Software, AI, Systems"},
            {"code": "IT", "name": "Information Technology", "description": "Software, Cloud & Networking"},
            {"code": "ECE", "name": "Electronics & Communication", "description": "Hardware & Embedded Systems"},
            {"code": "AIDS", "name": "Artificial Intelligence & Data Science", "description": "Machine Learning & Big Data"}
        ]
        dept_map = {}
        for d in depts_data:
            dept = Department(**d)
            db.add(dept)
            db.commit()
            db.refresh(dept)
            dept_map[d["code"]] = dept

        print("[Seed] Seeding administrative & student users...")
        # Placement Officer
        officer = User(
            email="officer@placement.edu",
            hashed_password=get_password_hash("Admin@123"),
            full_name="Dr. Rajesh Raman",
            role="OFFICER",
            department_id=dept_map["CSE"].id
        )
        db.add(officer)

        # Faculty Mentor
        faculty = User(
            email="faculty@placement.edu",
            hashed_password=get_password_hash("Admin@123"),
            full_name="Prof. Sunita Rao",
            role="FACULTY",
            department_id=dept_map["CSE"].id
        )
        db.add(faculty)
        db.commit()

        # Seed Students
        # Student 1: High Performer (Placed)
        u_aarav = User(
            email="aarav@student.edu",
            hashed_password=get_password_hash("Student@123"),
            full_name="Aarav Sharma",
            role="STUDENT",
            department_id=dept_map["CSE"].id
        )
        db.add(u_aarav)
        db.commit()
        db.refresh(u_aarav)

        s_aarav = Student(
            user_id=u_aarav.id,
            roll_number="22CSE042",
            department_id=dept_map["CSE"].id,
            batch_year=2026,
            cgpa=8.9,
            tenth_percentage=91.0,
            twelfth_percentage=89.5,
            backlogs=0,
            aptitude_score=85.0,
            coding_score=88.0,
            technical_score=84.0,
            communication_score=86.0,
            internships_count=2,
            projects_count=3,
            certifications_count=2,
            placement_status="PLACED"
        )
        db.add(s_aarav)

        # Student 2: Average Student (Actively Preparing)
        u_priya = User(
            email="priya@student.edu",
            hashed_password=get_password_hash("Student@123"),
            full_name="Priya Patel",
            role="STUDENT",
            department_id=dept_map["IT"].id
        )
        db.add(u_priya)
        db.commit()
        db.refresh(u_priya)

        s_priya = Student(
            user_id=u_priya.id,
            roll_number="22IT078",
            department_id=dept_map["IT"].id,
            batch_year=2026,
            cgpa=7.4,
            tenth_percentage=81.0,
            twelfth_percentage=78.0,
            backlogs=0,
            aptitude_score=68.0,
            coding_score=58.0,
            technical_score=65.0,
            communication_score=74.0,
            internships_count=0,
            projects_count=1,
            certifications_count=1,
            placement_status="NOT_PLACED"
        )
        db.add(s_priya)

        # Student 3: At Risk Student (Needs intervention)
        u_rahul = User(
            email="rahul@student.edu",
            hashed_password=get_password_hash("Student@123"),
            full_name="Rahul Verma",
            role="STUDENT",
            department_id=dept_map["ECE"].id
        )
        db.add(u_rahul)
        db.commit()
        db.refresh(u_rahul)

        s_rahul = Student(
            user_id=u_rahul.id,
            roll_number="22ECE112",
            department_id=dept_map["ECE"].id,
            batch_year=2026,
            cgpa=6.3,
            tenth_percentage=68.0,
            twelfth_percentage=64.0,
            backlogs=2,
            aptitude_score=48.0,
            coding_score=42.0,
            technical_score=52.0,
            communication_score=55.0,
            internships_count=0,
            projects_count=1,
            certifications_count=0,
            placement_status="NOT_PLACED"
        )
        db.add(s_rahul)
        db.commit()
        db.refresh(s_aarav)
        db.refresh(s_priya)
        db.refresh(s_rahul)

        # Add Skills
        skills = [
            Skill(student_id=s_aarav.id, skill_name="Python", category="PROGRAMMING", proficiency="ADVANCED", verified=True),
            Skill(student_id=s_aarav.id, skill_name="React", category="FRAMEWORK", proficiency="ADVANCED", verified=True),
            Skill(student_id=s_aarav.id, skill_name="PostgreSQL", category="DATABASE", proficiency="INTERMEDIATE", verified=True),
            Skill(student_id=s_aarav.id, skill_name="Docker", category="TOOL", proficiency="INTERMEDIATE", verified=True),
            
            Skill(student_id=s_priya.id, skill_name="Java", category="PROGRAMMING", proficiency="INTERMEDIATE", verified=True),
            Skill(student_id=s_priya.id, skill_name="SQL", category="DATABASE", proficiency="INTERMEDIATE", verified=True),
            Skill(student_id=s_priya.id, skill_name="HTML/CSS", category="FRONTEND", proficiency="INTERMEDIATE", verified=True),
            
            Skill(student_id=s_rahul.id, skill_name="C++", category="PROGRAMMING", proficiency="BEGINNER", verified=False),
            Skill(student_id=s_rahul.id, skill_name="Embedded C", category="PROGRAMMING", proficiency="BEGINNER", verified=False)
        ]
        db.add_all(skills)

        # Add Projects
        p1 = Project(
            student_id=s_aarav.id,
            title="Distributed Microservices Cloud Gateway",
            description="High-throughput reverse proxy and auth gateway built with Go and Redis handling 50k req/sec.",
            technologies="Go, Redis, Docker, gRPC",
            github_url="https://github.com/aarav/cloud-gateway"
        )
        p2 = Project(
            student_id=s_priya.id,
            title="Student Attendance Management Portal",
            description="Web portal with role-based auth allowing faculty to track daily laboratory attendance.",
            technologies="Java Spring Boot, MySQL, Thymeleaf",
            github_url="https://github.com/priya/attendance-portal"
        )
        db.add_all([p1, p2])

        # Add Internships
        i1 = Internship(
            student_id=s_aarav.id,
            company_name="Innovate Labs Bangalore",
            role="Software Engineering Intern",
            duration_months=3,
            description="Developed backend REST APIs for automated compliance reporting.",
            verified=True
        )
        db.add(i1)

        print("[Seed] Seeding companies and job opportunities...")
        companies = [
            Company(name="Microsoft", industry="Software & Cloud", tier="TIER_1", location="Bangalore / Hyderabad", description="Global cloud and enterprise technology leader."),
            Company(name="Amazon", industry="E-commerce & AWS Cloud", tier="TIER_1", location="Bangalore / Chennai", description="World's largest e-commerce and cloud platform."),
            Company(name="Goldman Sachs", industry="Financial Technology", tier="TIER_1", location="Bangalore", description="Global investment banking, securities and asset management."),
            Company(name="Cisco", industry="Networking & Cybersecurity", tier="TIER_1", location="Bangalore", description="Worldwide leader in networking products and security."),
            Company(name="TCS Digital", industry="IT Consulting & Services", tier="TIER_2", location="Pune / Mumbai", description="Next-generation business solutions and consulting."),
            Company(name="Infosys Specialist", industry="IT Consulting", tier="TIER_2", location="Bangalore / Mysore", description="Powering business digital transformation.")
        ]
        db.add_all(companies)
        db.commit()

        # Job Opportunities & Eligibility
        c_msft = db.query(Company).filter(Company.name == "Microsoft").first()
        j_msft = JobOpportunity(
            company_id=c_msft.id,
            title="Software Development Engineer - 1",
            job_type="FULL_TIME",
            ctc_lpa=42.0,
            stipend_monthly=80000.0,
            location="Bangalore",
            description="Work on core Azure distributed infrastructure, building resilient high-scale systems.",
            deadline=datetime.now(timezone.utc) + timedelta(days=20),
            open_positions=8
        )
        db.add(j_msft)
        db.commit()
        db.refresh(j_msft)

        e_msft = EligibilityRule(
            job_id=j_msft.id,
            min_cgpa=8.0,
            min_tenth_percentage=75.0,
            min_twelfth_percentage=75.0,
            max_backlogs=0,
            allowed_departments=["CSE", "IT"],
            min_aptitude_score=75.0,
            min_coding_score=70.0,
            required_skills=["Python", "C++", "Java"]
        )
        db.add(e_msft)

        c_amzn = db.query(Company).filter(Company.name == "Amazon").first()
        j_amzn = JobOpportunity(
            company_id=c_amzn.id,
            title="Cloud Support Associate",
            job_type="FULL_TIME",
            ctc_lpa=28.5,
            stipend_monthly=50000.0,
            location="Hyderabad",
            description="Support enterprise cloud architecture on AWS, resolving architectural and performance bottlenecks.",
            deadline=datetime.now(timezone.utc) + timedelta(days=15),
            open_positions=12
        )
        db.add(j_amzn)
        db.commit()
        db.refresh(j_amzn)

        e_amzn = EligibilityRule(
            job_id=j_amzn.id,
            min_cgpa=7.0,
            min_tenth_percentage=65.0,
            min_twelfth_percentage=65.0,
            max_backlogs=0,
            allowed_departments=["CSE", "IT", "ECE"],
            min_aptitude_score=65.0,
            min_coding_score=55.0,
            required_skills=["SQL"]
        )
        db.add(e_amzn)

        c_tcs = db.query(Company).filter(Company.name == "TCS Digital").first()
        j_tcs = JobOpportunity(
            company_id=c_tcs.id,
            title="Digital Software Engineer",
            job_type="FULL_TIME",
            ctc_lpa=9.0,
            stipend_monthly=25000.0,
            location="Pan India",
            description="Design and implement modern cloud applications and AI-driven solutions.",
            deadline=datetime.now(timezone.utc) + timedelta(days=30),
            open_positions=35
        )
        db.add(j_tcs)
        db.commit()
        db.refresh(j_tcs)

        e_tcs = EligibilityRule(
            job_id=j_tcs.id,
            min_cgpa=6.5,
            min_tenth_percentage=60.0,
            min_twelfth_percentage=60.0,
            max_backlogs=1,
            allowed_departments=["CSE", "IT", "ECE", "AIDS"],
            min_aptitude_score=55.0,
            min_coding_score=45.0,
            required_skills=[]
        )
        db.add(e_tcs)

        # Applications
        app1 = Application(
            student_id=s_aarav.id,
            job_id=j_msft.id,
            status="SELECTED",
            current_round="Offer Released",
            feedback="Exceptional performance in system design and data structures rounds."
        )
        app2 = Application(
            student_id=s_priya.id,
            job_id=j_amzn.id,
            status="TECHNICAL",
            current_round="Technical Round 2 - AWS Fundamentals",
            feedback="Cleared Aptitude with 78%. Technical Round 1 cleared."
        )
        db.add_all([app1, app2])

        print("[Seed] Seeding assessments and questions...")
        # 1. Aptitude Assessment
        a_apt = Assessment(
            title="Campus Placement Aptitude Benchmark 2026",
            category="APTITUDE",
            difficulty="MEDIUM",
            duration_minutes=25,
            total_marks=25,
            passing_marks=15,
            instructions="Answer all questions. Calculators are not permitted. 5 marks per question."
        )
        db.add(a_apt)
        db.commit()
        db.refresh(a_apt)

        apt_questions = [
            Question(
                assessment_id=a_apt.id,
                question_text="A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
                question_type="MCQ",
                options=["120 metres", "150 metres", "180 metres", "324 metres"],
                correct_answer="150 metres",
                explanation="Speed = 60 * (5/18) = 50/3 m/sec. Length = Speed * Time = (50/3) * 9 = 150 metres.",
                topic="Quantitative - Time & Distance",
                marks=5
            ),
            Question(
                assessment_id=a_apt.id,
                question_text="A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, then the fraction of the work that is left is:",
                question_type="MCQ",
                options=["7/15", "8/15", "1/4", "1/10"],
                correct_answer="8/15",
                explanation="A's 1 day work = 1/15, B's 1 day work = 1/20. Together = (1/15 + 1/20) = 7/60. In 4 days = 4 * (7/60) = 7/15. Remaining = 1 - 7/15 = 8/15.",
                topic="Quantitative - Time & Work",
                marks=5
            ),
            Question(
                assessment_id=a_apt.id,
                question_text="If SOUTH-EAST becomes NORTH, NORTH-EAST becomes WEST and so on, what will WEST become?",
                question_type="MCQ",
                options=["NORTH-EAST", "SOUTH-EAST", "NORTH-WEST", "SOUTH-WEST"],
                correct_answer="SOUTH-EAST",
                explanation="Each direction rotates by 135 degrees clockwise. West rotated by 135 deg clockwise points to South-East.",
                topic="Logical Reasoning - Direction Sense",
                marks=5
            ),
            Question(
                assessment_id=a_apt.id,
                question_text="Find the missing number in the sequence: 4, 9, 25, 49, 121, ?",
                question_type="MCQ",
                options=["144", "169", "196", "225"],
                correct_answer="169",
                explanation="The sequence consists of squares of prime numbers: 2^2, 3^2, 5^2, 7^2, 11^2, 13^2 = 169.",
                topic="Logical Reasoning - Number Series",
                marks=5
            ),
            Question(
                assessment_id=a_apt.id,
                question_text="Choose the synonym of 'CANDID':",
                question_type="MCQ",
                options=["Secretive", "Frank", "Deceptive", "Arrogant"],
                correct_answer="Frank",
                explanation="Candid means truthful and straightforward; frank.",
                topic="Verbal Ability",
                marks=5
            )
        ]
        db.add_all(apt_questions)

        # 2. Technical Assessment
        a_tech = Assessment(
            title="Core CS Fundamentals & Engineering Benchmark",
            category="TECHNICAL",
            difficulty="MEDIUM",
            duration_minutes=30,
            total_marks=25,
            passing_marks=15,
            instructions="Tests DBMS, OS, Computer Networks, and OOP concepts."
        )
        db.add(a_tech)
        db.commit()
        db.refresh(a_tech)

        tech_questions = [
            Question(
                assessment_id=a_tech.id,
                question_text="Which normal form eliminates partial functional dependency on candidate keys?",
                question_type="MCQ",
                options=["1NF", "2NF", "3NF", "BCNF"],
                correct_answer="2NF",
                explanation="2NF requires the relation to be in 1NF and have no partial dependency (non-prime attributes fully dependent on prime keys).",
                topic="DBMS",
                marks=5
            ),
            Question(
                assessment_id=a_tech.id,
                question_text="What is the worst-case time complexity of searching in a Balanced Binary Search Tree (e.g., AVL or Red-Black Tree)?",
                question_type="MCQ",
                options=["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                correct_answer="O(log n)",
                explanation="Balanced trees maintain height proportional to log(n), guaranteeing O(log n) worst case search.",
                topic="Data Structures",
                marks=5
            ),
            Question(
                assessment_id=a_tech.id,
                question_text="In the TCP/IP stack, which protocol is connectionless and does not guarantee packet delivery?",
                question_type="MCQ",
                options=["TCP", "UDP", "HTTP", "BGP"],
                correct_answer="UDP",
                explanation="User Datagram Protocol (UDP) is a connectionless, best-effort transport layer protocol.",
                topic="Computer Networks",
                marks=5
            ),
            Question(
                assessment_id=a_tech.id,
                question_text="Which of the following conditions is NOT a required condition for a Deadlock to occur?",
                question_type="MCQ",
                options=["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
                correct_answer="Preemption Allowed",
                explanation="Deadlock requires 'No Preemption'. If preemption is allowed, deadlock cannot occur.",
                topic="Operating Systems",
                marks=5
            ),
            Question(
                assessment_id=a_tech.id,
                question_text="Which OOP principle allows a subclass to provide a specific implementation of a method declared in its parent class?",
                question_type="MCQ",
                options=["Encapsulation", "Polymorphism (Method Overriding)", "Abstraction", "Multiple Inheritance"],
                correct_answer="Polymorphism (Method Overriding)",
                explanation="Runtime polymorphism through method overriding allows subclasses to tailor behavior.",
                topic="Object Oriented Programming",
                marks=5
            )
        ]
        db.add_all(tech_questions)

        # 3. Coding Assessment
        a_code = Assessment(
            title="Algorithm & Problem Solving Assessment",
            category="CODING",
            difficulty="MEDIUM",
            duration_minutes=45,
            total_marks=20,
            passing_marks=10,
            instructions="Analyze algorithm efficiency and time/space constraints."
        )
        db.add(a_code)
        db.commit()
        db.refresh(a_code)

        code_questions = [
            Question(
                assessment_id=a_code.id,
                question_text="Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. What data structure achieves O(n) time complexity?",
                question_type="MCQ",
                options=["Sorting with Two Pointers O(n log n)", "Hash Map O(n)", "Nested Loop O(n^2)", "Stack O(n)"],
                correct_answer="Hash Map O(n)",
                explanation="Storing complements in a hash map allows single-pass lookup in O(1) average time, giving O(n) total runtime.",
                topic="Arrays & HashMaps",
                marks=10
            ),
            Question(
                assessment_id=a_code.id,
                question_text="Which algorithm is used to find the shortest path in a weighted graph with non-negative edge weights?",
                question_type="MCQ",
                options=["Bellman-Ford", "Dijkstra's Algorithm", "Kruskal's Algorithm", "Floyd-Warshall"],
                correct_answer="Dijkstra's Algorithm",
                explanation="Dijkstra's algorithm greedily explores minimum edge weights using a priority queue in O((V + E) log V).",
                topic="Graph Algorithms",
                marks=10
            )
        ]
        db.add_all(code_questions)

        # 4. Notifications
        notifs = [
            Notification(
                user_id=u_aarav.id,
                title="Placement Offer Confirmed!",
                message="Congratulations! Microsoft has officially released your offer letter for SDE-1.",
                type="SUCCESS",
                action_url="/dashboard/applications"
            ),
            Notification(
                user_id=u_priya.id,
                title="Amazon Drive Round 2 Scheduled",
                message="Your Technical Round 2 with Amazon AWS is scheduled for Friday at 11:00 AM.",
                type="INFO",
                action_url="/dashboard/applications"
            ),
            Notification(
                user_id=u_priya.id,
                title="Improvement Alert: Coding Benchmark",
                message="Your coding benchmark is currently 58%. Check your personalized roadmap to boost it above 65%.",
                type="WARNING",
                action_url="/dashboard/roadmap"
            ),
            Notification(
                user_id=u_rahul.id,
                title="At-Risk Academic & Placement Alert",
                message="Active backlogs detected. Please consult your faculty mentor and complete the foundational remedial modules.",
                type="ALERT",
                action_url="/dashboard/skill-gap"
            )
        ]
        db.add_all(notifs)

        # Register ML models in database
        comp_file = settings.MODEL_DIR / "model_comparison.json"
        if comp_file.exists():
            with open(comp_file, "r") as f:
                comp_data = json.load(f)
            for m in comp_data.get("models", []):
                mv = ModelVersion(
                    model_name=m["algorithm"],
                    version=m["version"],
                    algorithm=m["key"],
                    accuracy=m["test_accuracy"],
                    precision=m["test_precision"],
                    recall=m["test_recall"],
                    f1_score=m["test_f1"],
                    roc_auc=m["test_roc_auc"],
                    is_active=m["is_champion"],
                    parameters=m["parameters"],
                    metrics_report=m
                )
                db.add(mv)

        db.commit()
        print("[Seed] Successfully seeded all departments, users, students, companies, jobs, assessments, and notifications!")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
