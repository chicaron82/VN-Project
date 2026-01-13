@echo off
title UV7 V2 Launcher
color 0f
cls

echo ========================================================
echo        UV7: Visual Novel Engine (V2 Clean Build)
echo ========================================================
echo.
echo    [1] Launching Local Server...
echo    [2] Double-Click 'index.html' won't work due to CORS.
echo    [3] This script handles the tech stuff for you.
echo.
echo ========================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit
)

:: Install dependencies if needed (quick check)
if not exist "node_modules" (
    echo [INFO] First run detected. Installing dependencies...
    call npm install
)

:: Run the preview server
echo [INFO] Starting UV7 Engine...
echo [INFO] Your browser should open automatically.
echo.
echo Press CTRL+C to stop the server when done.
echo.

call npm run preview
