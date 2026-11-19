from typing import List, Dict, Any
from app.models.student import Student

class RecommendationService:
    @staticmethod
    def generate_recommendations(student: Student) -> List[Dict[str, Any]]:
        recs = []

        # 1. Aptitude Weakness
        if student.aptitude_score < 65:
            recs.append({
                "category": "APTITUDE",
                "severity": "HIGH" if student.aptitude_score < 50 else "MEDIUM",
                "title": "Quantitative & Logical Aptitude Mastery",
                "description": f"Current aptitude score is {student.aptitude_score}/100. Most tier-1 recruiters filter out candidates scoring below 65% in Round 1.",
                "actionable_steps": [
                    "Complete 15 daily practice problems on Time & Work, Speed & Distance, and Probability.",
                    "Practice 2 syllogism and data interpretation sets every morning.",
                    "Take the timed 30-minute Mock Aptitude Assessment on this platform weekly."
                ],
                "target_score_improvement": 15.0
            })

        # 2. Weak Coding
        if student.coding_score < 65:
            recs.append({
                "category": "CODING",
                "severity": "HIGH" if student.coding_score < 50 else "MEDIUM",
                "title": "Data Structures & Algorithmic Problem Solving",
                "description": f"Coding proficiency is currently {student.coding_score}/100. Technical rounds at product companies require strong proficiency in arrays, trees, and graphs.",
                "actionable_steps": [
                    "Implement 5 medium LeetCode/HackerRank problems weekly focusing on HashMaps, Two Pointers, and Binary Trees.",
                    "Practice code modularity, edge-case handling, and time/space complexity analysis.",
                    "Submit 1 coding assessment per week in the Assessment Center."
                ],
                "target_score_improvement": 20.0
            })

        # 3. Poor Communication
        if student.communication_score < 70:
            recs.append({
                "category": "COMMUNICATION",
                "severity": "MEDIUM",
                "title": "Professional Communication & Behavioral Interviewing",
                "description": f"Communication readiness is at {student.communication_score}/100. Effective articulate communication is critical during HR and technical panel defense.",
                "actionable_steps": [
                    "Practice answering common HR questions using the STAR (Situation, Task, Action, Result) methodology.",
                    "Record 2-minute video pitch explaining your flagship technical project.",
                    "Complete an AI Mock Interview session focusing on confidence and verbal clarity."
                ],
                "target_score_improvement": 12.0
            })

        # 4. No Internship
        if student.internships_count == 0:
            recs.append({
                "category": "INTERNSHIP",
                "severity": "HIGH",
                "title": "Practical Industry Experience & Internship Acceleration",
                "description": "Zero internships recorded. Having verifiable industry experience increases recruiter shortlisting probability by 3.2x.",
                "actionable_steps": [
                    "Apply to at least 5 curated internships listed in the Opportunities tab this week.",
                    "Contribute to open-source software repositories or participate in a virtual work simulation.",
                    "Publish a production-grade full-stack project with documentation and deployed URL."
                ],
                "target_score_improvement": 18.0
            })

        # 5. Weak Resume / Projects
        if student.projects_count < 2:
            recs.append({
                "category": "RESUME",
                "severity": "MEDIUM",
                "title": "Portfolio Enhancement & Full-Stack Flagship Project",
                "description": f"Currently only {student.projects_count} project(s) listed. Recruiters look for at least 2 robust, demonstrable end-to-end applications.",
                "actionable_steps": [
                    "Build a modern SaaS or AI-enabled application with authentication, database persistence, and API integration.",
                    "Host the application on Vercel/Render with automated GitHub Actions CI/CD.",
                    "Run your updated CV through the Resume Analyzer to reach an ATS score of 85+."
                ],
                "target_score_improvement": 15.0
            })

        # 6. Interview Performance
        recs.append({
            "category": "INTERVIEW",
            "severity": "LOW",
            "title": "System Design & Technical Interview Rehearsal",
            "description": "Prepare for technical panel grilling by reviewing database indexing, REST design, OOP concepts, and clean architecture.",
            "actionable_steps": [
                "Review core CS fundamentals: Operating Systems, DBMS (ACID, Indexes), and Computer Networks.",
                "Conduct a mock interview with a peer or mentor in the placement cell.",
                "Draft concise explanations for architectural decisions made in your flagship project."
            ],
            "target_score_improvement": 10.0
        })

        return recs

    @staticmethod
    def generate_personalized_roadmap(student: Student, target_role: str = "Full Stack Software Engineer") -> Dict[str, Any]:
        stages = [
            {
                "week": 1,
                "title": "Foundation & Core CS Principles",
                "milestones": [
                    {
                        "id": "w1-m1",
                        "title": "Quantitative Aptitude Diagnostic",
                        "description": "Review percentages, profit/loss, time & work shortcuts.",
                        "duration_days": 2,
                        "is_completed": student.aptitude_score >= 70,
                        "practical_task": "Score at least 70% in Platform Aptitude Test #1"
                    },
                    {
                        "id": "w1-m2",
                        "title": "DBMS & SQL Query Optimization",
                        "description": "Master JOINs, GROUP BY, aggregations, and subqueries.",
                        "duration_days": 3,
                        "is_completed": True,
                        "practical_task": "Solve 10 LeetCode SQL challenges"
                    }
                ]
            },
            {
                "week": 2,
                "title": "Data Structures & Algorithmic Foundations",
                "milestones": [
                    {
                        "id": "w2-m1",
                        "title": "Linear Structures & Two-Pointers",
                        "description": "Arrays, Strings, Linked Lists, and Sliding Window techniques.",
                        "duration_days": 3,
                        "is_completed": student.coding_score >= 65,
                        "practical_task": "Solve 8 Array / String coding problems"
                    },
                    {
                        "id": "w2-m2",
                        "title": "Stacks, Queues, and Hash Maps",
                        "description": "Monotonic stacks, circular queues, and collision resolution.",
                        "duration_days": 4,
                        "is_completed": False,
                        "practical_task": "Implement LRU Cache from scratch"
                    }
                ]
            },
            {
                "week": 3,
                "title": "Advanced Problem Solving & System Architecture",
                "milestones": [
                    {
                        "id": "w3-m1",
                        "title": "Binary Trees, BSTs & Traversals",
                        "description": "DFS/BFS traversals, lowest common ancestor, path sum.",
                        "duration_days": 4,
                        "is_completed": False,
                        "practical_task": "Solve 6 Tree traversal problems"
                    },
                    {
                        "id": "w3-m2",
                        "title": "RESTful API & Database Architecture",
                        "description": "Design normalized schema, REST endpoints, and middleware auth.",
                        "duration_days": 3,
                        "is_completed": student.projects_count >= 1,
                        "practical_task": "Build and document a REST API with FastAPI or Express"
                    }
                ]
            },
            {
                "week": 4,
                "title": "Flagship Project & Portfolio Deployment",
                "milestones": [
                    {
                        "id": "w4-m1",
                        "title": "Production Deployment & CI/CD",
                        "description": "Containerize with Docker, configure GitHub Actions workflow.",
                        "duration_days": 4,
                        "is_completed": student.projects_count >= 2,
                        "practical_task": "Deploy live application with public URL and CI/CD"
                    },
                    {
                        "id": "w4-m2",
                        "title": "Resume ATS Optimization",
                        "description": "Structure resume with bullet points containing metrics and tech keywords.",
                        "duration_days": 3,
                        "is_completed": False,
                        "practical_task": "Achieve 85+ ATS score on platform resume analyzer"
                    }
                ]
            },
            {
                "week": 5,
                "title": "Mock Interviews & Behavioral Preparation",
                "milestones": [
                    {
                        "id": "w5-m1",
                        "title": "STAR Behavioral Rehearsal",
                        "description": "Draft 5 stories demonstrating leadership, conflict resolution, and technical problem solving.",
                        "duration_days": 3,
                        "is_completed": student.communication_score >= 75,
                        "practical_task": "Complete Mock HR Interview session"
                    },
                    {
                        "id": "w5-m2",
                        "title": "Technical Live Coding Simulation",
                        "description": "Practice thinking out loud and writing test cases during code writing.",
                        "duration_days": 4,
                        "is_completed": False,
                        "practical_task": "Simulate 45-minute timed technical interview"
                    }
                ]
            },
            {
                "week": 6,
                "title": "Company Drives & Final Placement Acceleration",
                "milestones": [
                    {
                        "id": "w6-m1",
                        "title": "Target Company Research & Criteria Check",
                        "description": "Check eligibility for Tier-1 drives and tailor applications.",
                        "duration_days": 3,
                        "is_completed": False,
                        "practical_task": "Submit 5 verified campus placement applications"
                    },
                    {
                        "id": "w6-m2",
                        "title": "Final Readiness Evaluation",
                        "description": "Run ML Placement Prediction to verify 85%+ readiness score.",
                        "duration_days": 4,
                        "is_completed": False,
                        "practical_task": "Achieve PLACED predicted status with high confidence"
                    }
                ]
            }
        ]

        total_milestones = sum(len(s["milestones"]) for s in stages)
        completed_milestones = sum(sum(1 for m in s["milestones"] if m["is_completed"]) for s in stages)
        progress_pct = round((completed_milestones / total_milestones) * 100.0, 1) if total_milestones > 0 else 0.0

        return {
            "title": f"6-Week {target_role} Placement Readiness Blueprint",
            "target_role": target_role,
            "estimated_weeks": 6,
            "progress_percentage": progress_pct,
            "stages": stages,
            "is_active": True
        }

recommendation_service = RecommendationService()
