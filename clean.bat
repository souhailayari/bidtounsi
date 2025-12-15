@echo off
REM BidTounsi - Cleanup Script

echo.
echo =========================================
echo     BidTounsi - Project Cleanup
echo =========================================
echo.

echo Cleaning backend...
cd backend
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist package-lock.json del package-lock.json
cd ..

echo Cleaning frontend...
cd frontend
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist package-lock.json del package-lock.json
cd ..

echo.
echo =========================================
echo ✓ Project cleaned successfully!
echo =========================================
echo.
echo To reinstall dependencies:
echo   npm install
echo.

pause
