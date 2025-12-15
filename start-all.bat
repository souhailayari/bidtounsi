@echo off
REM BidTounsi - Full Project Startup Script

echo.
echo =========================================
echo     BidTounsi - Startup Script
echo =========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB service...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB service is installed
) else (
    echo ✗ MongoDB service not found
    echo Please install MongoDB first
    pause
    exit /b 1
)

REM Start MongoDB if not running
tasklist /FI "IMAGENAME eq mongod.exe" 2>nul | find /I /N "mongod.exe">nul
if "%ERRORLEVEL%"=="1" (
    echo Starting MongoDB...
    net start MongoDB >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ MongoDB started
    ) else (
        echo ✓ MongoDB already running or requires admin
    )
) else (
    echo ✓ MongoDB is already running
)

REM Wait for MongoDB to start
timeout /t 2 /nobreak >nul

REM Kill any existing node processes on ports 3000 and 4000
echo Cleaning up ports...
taskkill /F /IM node.exe >nul 2>&1

REM Start Backend in a new window
echo.
echo Starting Backend (Port 4000)...
start "BidTounsi Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Frontend in a new window
echo.
echo Starting Frontend (Port 3000)...
start "BidTounsi Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================
echo ✓ BidTounsi is starting up!
echo =========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:4000
echo MongoDB:   mongodb://localhost:27017/bidtounsi
echo.
echo Close these windows to stop the servers.
echo =========================================
echo.

pause
