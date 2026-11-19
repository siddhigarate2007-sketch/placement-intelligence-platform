from typing import Dict, Any, List
from app.models.student import Student
from app.models.placement import JobOpportunity, EligibilityRule

class EligibilityService:
    @staticmethod
    def evaluate_eligibility(student: Student, job: JobOpportunity) -> Dict[str, Any]:
        rule = job.eligibility_rule
        if not rule:
            return {
                "eligible": True,
                "job_id": job.id,
                "job_title": job.title,
                "company_name": job.company.name if job.company else "Unknown",
                "criteria_results": {},
                "blocking_reasons": []
            }

        student_dept_code = student.department.code if student.department else ""
        student_skills = {s.skill_name.lower() for s in student.skills}

        criteria = {
            "cgpa": {
                "required": rule.min_cgpa,
                "actual": student.cgpa,
                "passed": student.cgpa >= rule.min_cgpa,
                "label": f"Minimum CGPA: {rule.min_cgpa}"
            },
            "tenth_percentage": {
                "required": rule.min_tenth_percentage,
                "actual": student.tenth_percentage,
                "passed": student.tenth_percentage >= rule.min_tenth_percentage,
                "label": f"Minimum 10th Percentage: {rule.min_tenth_percentage}%"
            },
            "twelfth_percentage": {
                "required": rule.min_twelfth_percentage,
                "actual": student.twelfth_percentage,
                "passed": student.twelfth_percentage >= rule.min_twelfth_percentage,
                "label": f"Minimum 12th Percentage: {rule.min_twelfth_percentage}%"
            },
            "backlogs": {
                "allowed_max": rule.max_backlogs,
                "actual": student.backlogs,
                "passed": student.backlogs <= rule.max_backlogs,
                "label": f"Maximum Active Backlogs: {rule.max_backlogs}"
            },
            "department": {
                "allowed": rule.allowed_departments,
                "actual": student_dept_code,
                "passed": (not rule.allowed_departments) or (student_dept_code in rule.allowed_departments),
                "label": f"Eligible Departments: {', '.join(rule.allowed_departments) if rule.allowed_departments else 'All'}"
            },
            "aptitude_score": {
                "required": rule.min_aptitude_score,
                "actual": student.aptitude_score,
                "passed": student.aptitude_score >= rule.min_aptitude_score,
                "label": f"Minimum Aptitude Benchmark: {rule.min_aptitude_score}"
            },
            "coding_score": {
                "required": rule.min_coding_score,
                "actual": student.coding_score,
                "passed": student.coding_score >= rule.min_coding_score,
                "label": f"Minimum Coding Benchmark: {rule.min_coding_score}"
            }
        }

        # Check required skills if specified
        missing_skills = []
        if rule.required_skills:
            for req in rule.required_skills:
                if req.lower() not in student_skills:
                    missing_skills.append(req)
            criteria["required_skills"] = {
                "required": rule.required_skills,
                "missing": missing_skills,
                "passed": len(missing_skills) == 0,
                "label": "Required Technical Skills"
            }

        blocking_reasons = []
        for key, res in criteria.items():
            if not res["passed"]:
                if key == "department":
                    blocking_reasons.append(f"Department '{student_dept_code}' is not included in eligible branches.")
                elif key == "backlogs":
                    blocking_reasons.append(f"Student has {student.backlogs} backlog(s), maximum permitted is {rule.max_backlogs}.")
                elif key == "cgpa":
                    blocking_reasons.append(f"CGPA {student.cgpa} is below requirement of {rule.min_cgpa}.")
                elif key == "tenth_percentage":
                    blocking_reasons.append(f"10th standard score ({student.tenth_percentage}%) is below {rule.min_tenth_percentage}%.")
                elif key == "twelfth_percentage":
                    blocking_reasons.append(f"12th standard score ({student.twelfth_percentage}%) is below {rule.min_twelfth_percentage}%.")
                elif key == "aptitude_score":
                    blocking_reasons.append(f"Aptitude benchmark score ({student.aptitude_score}) is below required cutoff ({rule.min_aptitude_score}).")
                elif key == "coding_score":
                    blocking_reasons.append(f"Coding benchmark score ({student.coding_score}) is below cutoff ({rule.min_coding_score}).")
                elif key == "required_skills":
                    blocking_reasons.append(f"Missing required skills: {', '.join(missing_skills)}.")

        is_eligible = len(blocking_reasons) == 0

        return {
            "eligible": is_eligible,
            "job_id": job.id,
            "job_title": job.title,
            "company_name": job.company.name if job.company else "Unknown",
            "criteria_results": criteria,
            "blocking_reasons": blocking_reasons
        }

eligibility_service = EligibilityService()
