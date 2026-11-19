# Student Placement Intelligence & Career Readiness Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014.2%20App%20Router-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![Scikit-Learn](https://img.shields.io/badge/ML%20Engine-Scikit--Learn%20%7C%20XGBoost%20%7C%20SHAP-orange.svg)](https://scikit-learn.org)
[![Design System](https://img.shields.io/badge/Design%20System-Midnight%20Glass-7565F6.svg)](#design-system--midnight-glass)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions%20Passing-success.svg)](https://github.com)

An enterprise-grade, full-stack intelligence and career acceleration platform engineered for higher education institutions and engineering undergraduates. Features Explainable AI (SHAP), multi-model placement prediction, automated skill-gap diagnostics, ATS resume scanning, a 7-stage campus recruitment funnel, and comprehensive institute-level analytics.

---

## 📑 Academic Project Report

The complete 31-page academic case study report following university guidelines is available in the [`project-report/`](./project-report/) directory:

- 📄 **Official PDF Report:** [`project-report/Rohan_Dipak_Yadav_Project_Report.pdf`](./project-report/Rohan_Dipak_Yadav_Project_Report.pdf)
- 📝 **Editable Word Document:** [`project-report/Rohan_Dipak_Yadav_Project_Report.docx`](./project-report/Rohan_Dipak_Yadav_Project_Report.docx)
- 📊 **Validation & Audit Summary:** [`project-report/Report_Validation.md`](./project-report/Report_Validation.md)

### Student & Faculty Details
- **Lead Student:** Rohan Dipak Yadav (PRN: `24067971242005` | Roll No: `24213073`)
- **Team Members:** Bhosale Neha Laxman, More Anushka Shankar, Nikam Shrushti Deepak, Rasal Rohan Rajesh
- **Faculty Guide:** Prof. D.B. Hanchate
- **Head of Department:** Prof. P. M. Pondkule
- **Principal:** Dr. A. D. Jadhav
- **Institute:** Raosaheb Wangde Master Charitable Trust’s Dnyanshree Institute of Engineering and Technology, Satara
- **University:** Dr. Babasaheb Ambedkar Technological University, Lonere (Academic Year 2026–27)

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph UI ["Frontend (Next.js 14 + Midnight Glass)"]
        Landing["Landing Page"]
        StudentDash["Student Hub & Profile"]
        PredEngine["Interactive ML Simulator"]
        AssessHub["Assessments & AI Mock Interview"]
        RoadmapHub["6-Week Action Roadmap"]
        FunnelTracker["7-Stage Application Tracker"]
        OfficerPortal["Placement Officer Workspace"]
        FacultyPortal["Faculty Mentorship Hub"]
    end

    subgraph API ["Backend REST API (FastAPI v1)"]
        AuthRouter["JWT Auth & RBAC (PBKDF2)"]
        StudentRouter["Student Records & Portfolios"]
        MLRouter["Model Comparison & Inference"]
        AssessRouter["Timed Scoring Engine"]
        RecRouter["Weakness Diagnostic & Roadmap"]
        CompRouter["Eligibility Matrix Engine"]
        FunnelRouter["Application Funnel State Machine"]
    end

    subgraph ML ["Machine Learning Engine"]
        Dataset["Empirical Placement Benchmark (2500 Samples)"]
        Preprocessor["Imputation + Feature Engineering + StandardScaler"]
        Models["6 Models: LR | DT | RF | SVM | GB | XGBoost"]
        SHAP["SHAP (TreeExplainer & Contribution Vectors)"]
        Champion["Active Champion Model: LogisticRegression (93.8% Acc, 0.982 ROC-AUC)"]
    end

    subgraph Data ["Data Persistence"]
        DB[("PostgreSQL / SQLite Engine")]
        ModelsDisk[("Joblib Model Storage (.joblib)")]
    end

    UI -->|HTTPS / REST API| API
    API --> ML
    API --> DB
    ML --> ModelsDisk
```

---

## 🎨 Design System — Midnight Glass

The platform strictly adheres to an Apple-inspired **Midnight Glass** dark glassmorphism design system:

| Token | Hex / Value | Role |
|---|---|---|
| **Main Background** | `#080D19` | Deepest canvas background |
| **Secondary Background** | `#0C1424` | Surface navigation and sidebar layers |
| **Glass Surface** | `rgba(17, 28, 50, 0.70)` | Translucent glass cards with 22px blur |
| **Primary Violet** | `#7565F6` | Primary branding, buttons, and focus halos |
| **Cyan Accent** | `#22D3EE` | Key data points, active milestones, stats |
| **Soft Indigo** | `#A5B4FC` | Supporting metadata, chips, subtext |
| **Primary Text** | `#F8FAFC` | High-contrast crisp typography |
| **Secondary Text** | `#94A3B8` | Descriptive labels and table headers |
| **Success / Warning / Error** | `#34D399` / `#FBBF24` / `#FB7185` | Semantic feedback indicators |

---

## 🧠 Machine Learning Engine & Benchmark Comparison

All 6 algorithms were trained and cross-validated using **5-Fold Stratified Cross-Validation** on a realistic 2,500-sample empirical benchmark dataset.

> **Integrity Guarantee**: Zero fabricated accuracy or data leakage. Input features strictly exclude protected personal attributes (no gender, race, or religion).

### Benchmark Comparison Matrix

| Model Architecture | 5-Fold CV Accuracy | Test Accuracy | Precision | Recall | F1-Score | ROC-AUC | Status |
|---|---|---|---|---|---|---|---|
| **Logistic Regression** | 94.45% ± 0.53% | **93.8%** | **95.68%** | **96.84%** | **0.9626** | **0.9820** | 🏆 **Active Champion** |
| **XGBoost (XGBClassifier)** | 93.25% ± 1.26% | 93.0% | 94.35% | 97.33% | 0.9582 | 0.9761 | Candidate |
| **Gradient Boosting** | 92.75% ± 0.55% | 93.0% | 94.35% | 97.33% | 0.9582 | 0.9700 | Candidate |
| **Support Vector Machine (SVM)** | 94.80% ± 0.70% | 92.2% | 94.72% | 95.87% | 0.9530 | 0.9750 | Candidate |
| **Random Forest** | 91.90% ± 0.96% | 91.2% | 91.82% | 98.06% | 0.9484 | 0.9601 | Candidate |
| **Decision Tree** | 91.15% ± 0.82% | 90.0% | 91.14% | 97.33% | 0.9413 | 0.8944 | Candidate |

### Explainable AI (XAI) with SHAP
The platform uses **SHAP (SHapley Additive exPlanations)** to compute local feature contributions for every student:
- **Positive Drivers**: Factors increasing placement probability (e.g., Coding Score > 80, CGPA > 8.5).
- **Negative Drivers**: Disqualifiers lowering placement probability (e.g., Zero internships, active backlogs).

---

## 🚀 7-Stage Campus Recruitment Funnel

The platform tracks institutional recruitment through a state machine:

$$\text{REGISTERED} \longrightarrow \text{ELIGIBLE} \longrightarrow \text{APPLIED} \longrightarrow \text{APTITUDE} \longrightarrow \text{TECHNICAL} \longrightarrow \text{HR} \longrightarrow \text{SELECTED}$$

1. **Registered**: Total verified student cohort in the academic database.
2. **Eligible**: Filtered by deterministic company cutoff criteria (CGPA, backlogs, branch).
3. **Applied**: Student formally submitted their candidature for an active drive.
4. **Aptitude**: Round 1 online quantitative and logical screening.
5. **Technical**: Round 2 core computer science and live coding challenge.
6. **HR Round**: Behavioral and culture-fit panel interview.
7. **Selected**: Formal job offer confirmed and recorded in institutional analytics.

---

## 💻 Local Setup & Execution Guide

### Quick Start (Windows One-Click Launcher)
Double-click **`start-platform.bat`** in the root folder. It launches both the FastAPI backend and Next.js frontend in separate terminal windows.

---

### Manual Setup

#### Prerequisites
- Python 3.10+ (Python 3.12 or 3.15 recommended)
- Node.js 18+ (Node 20 or 22 recommended)

#### 1. Backend Setup (FastAPI)
```powershell
cd backend

# Install dependencies
pip install -r requirements.txt

# Run database migration and seed data
python app/utils/seed_data.py

# Launch FastAPI server (starts on http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```
*API Swagger Documentation is available at: [http://localhost:8000/docs](http://localhost:8000/docs)*

#### 2. Frontend Setup (Next.js 14)
```powershell
cd frontend

# Install dependencies
npm install

# Launch Next.js dev server (starts on http://localhost:3000)
npm run dev
```
*Access the user interface at: [http://localhost:3000](http://localhost:3000)*

---

## 🔑 Demo Personas & Credentials

| Role | Email | Password | Persona Description |
|---|---|---|---|
| **Student** | `rohan@student.edu` | `Student@123` | Rohan Dipak Yadav (Roll: 24213073) |
| **Student (Preparing)** | `priya@student.edu` | `Student@123` | Average CGPA (7.4), 6-week roadmap |
| **Student (Placed)** | `aarav@student.edu` | `Student@123` | Top performer (8.9 CGPA), SDE-1 offer |
| **Placement Officer** | `officer@placement.edu` | `Admin@123` | Full administrative control, funnel supervisor |
| **Faculty Mentor** | `faculty@placement.edu` | `Admin@123` | At-risk student flagging and remedial advisory |

---

## 🐳 Docker Production Deployment

Run the complete multi-container stack with PostgreSQL 16, FastAPI backend, and Next.js frontend:

```bash
docker-compose up --build
```
Services initialized:
- PostgreSQL 16: `localhost:5432`
- FastAPI REST Backend: `localhost:8000`
- Next.js Production Frontend: `localhost:3000`

---

## 🧪 Automated Test Suite

Run backend test verification using Pytest:

```powershell
pytest backend/tests -v
```

12 comprehensive tests cover:
- Authentication & PBKDF2 Password Hashing
- ML Pipeline, SHAP Explanations & Model Comparison
- Eligibility Rule Engine Matching
- Timed Assessments & Dynamic Grading
- Actionable Recommendations Generation & Roadmap Milestones
