import re
from typing import Dict, Any, List

KNOWN_TECH_SKILLS = [
    "python", "javascript", "typescript", "c++", "java", "sql", "html", "css",
    "react", "next.js", "node.js", "express", "fastapi", "django", "flask",
    "postgresql", "mongodb", "mysql", "redis", "docker", "kubernetes", "aws", "azure", "gcp",
    "git", "linux", "rest api", "graphql", "machine learning", "deep learning", "pandas",
    "numpy", "scikit-learn", "tensorflow", "pytorch", "tailwind css", "ci/cd", "agile"
]

CORE_RESUME_SECTIONS = {
    "education": ["education", "academic background", "academics", "qualifications"],
    "experience": ["experience", "work experience", "internships", "employment history"],
    "projects": ["projects", "technical projects", "academic projects", "personal projects"],
    "skills": ["skills", "technical skills", "core competencies", "technologies"],
    "certifications": ["certifications", "certificates", "courses", "licenses"],
    "summary": ["summary", "professional summary", "about me", "objective"]
}

class ResumeAnalyzerService:
    @staticmethod
    def analyze_text(resume_text: str) -> Dict[str, Any]:
        text_lower = resume_text.lower()
        
        # 1. Detect present and missing sections
        found_sections = []
        missing_sections = []
        for sec_name, keywords in CORE_RESUME_SECTIONS.items():
            if any(re.search(rf"\b{re.escape(kw)}\b", text_lower) for kw in keywords):
                found_sections.append(sec_name.title())
            else:
                missing_sections.append(sec_name.title())

        # 2. Extract technical skills
        parsed_skills = []
        for skill in KNOWN_TECH_SKILLS:
            # Word boundary regex search
            if re.search(rf"\b{re.escape(skill)}\b", text_lower):
                parsed_skills.append(skill.title())

        # 3. Assess impact and quantification (looking for %, $, metrics, numbers)
        quantifiable_metrics_count = len(re.findall(r"\b\d+%\b|\b\d+\b", resume_text))
        
        # 4. Compute ATS Score
        # Section coverage (40%), Skill richness (30%), Quantifiable achievements (20%), Length/Formatting (10%)
        section_score = (len(found_sections) / len(CORE_RESUME_SECTIONS)) * 40.0
        skill_score = min(30.0, (len(parsed_skills) / 8.0) * 30.0)
        metric_score = min(20.0, (quantifiable_metrics_count / 5.0) * 20.0)
        word_count = len(resume_text.split())
        length_score = 10.0 if 250 <= word_count <= 800 else 6.0
        
        ats_score = round(section_score + skill_score + metric_score + length_score, 1)
        ats_score = max(20.0, min(98.0, ats_score))

        # 5. Generate actionable suggestions
        suggestions = []
        if "Certifications" in missing_sections:
            suggestions.append("Add a verified Certifications section (AWS, Coursera, HackerRank) to demonstrate continuous learning.")
        if "Projects" in missing_sections:
            suggestions.append("Add a detailed Projects section with live demo URLs, GitHub repositories, and tech stack tags.")
        if quantifiable_metrics_count < 3:
            suggestions.append("Incorporate quantifiable impact in project bullets (e.g. 'Reduced API response latency by 35%').")
        if len(parsed_skills) < 6:
            suggestions.append("Include more explicit modern tech keywords (e.g. Docker, PostgreSQL, REST APIs, Git) for ATS filtering.")
        if word_count < 250:
            suggestions.append("Resume content appears brief. Expand on technical project implementation details and architectural choices.")
        elif word_count > 900:
            suggestions.append("Resume exceeds ideal single-page length for campus placements. Keep descriptions concise and bullet-pointed.")

        return {
            "ats_score": ats_score,
            "word_count": word_count,
            "found_sections": found_sections,
            "missing_sections": missing_sections,
            "parsed_skills": parsed_skills,
            "suggestions": suggestions
        }

resume_analyzer = ResumeAnalyzerService()
