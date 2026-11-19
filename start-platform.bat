@echo off
title Student Placement Intelligence & Career Readiness Platform
echo =====================================================================
echo  Student Placement Intelligence & Career Readiness Platform Launcher
echo =====================================================================
echo.

set PROJECT_DIR=%~dp0
set BACKEND_DIR=%PROJECT_DIR%backend
set FRONTEND_DIR=%PROJECT_DIR%frontend
set PYTHON_EXE=%LOCALAPPDATA%\Python\pythoncore-3.15-64\python.exe

if not exist "%PYTHON_EXE%" (
    set PYTHON_EXE=python
)

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "Placement Backend (FastAPI)" cmd /k "cd /d "%BACKEND_DIR%" && "%PYTHON_EXE%" -m uvicorn app.main:app --reload --port 8000"

echo [2/2] Starting Next.js Frontend on http://localhost:3000 ...
start "Placement Frontend (Next.js)" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

echo.
echo =====================================================================
echo Both servers have been launched in separate terminal windows!
echo - Web App:      http://localhost:3000
echo - Swagger Docs: http://localhost:8000/docs
echo.
echo =====================================================================
echo.
pause
