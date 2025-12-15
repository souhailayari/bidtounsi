#!/usr/bin/env pwsh
# BidTounsi - Full Project Startup Script (PowerShell)

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "     BidTounsi - Startup Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
Write-Host "🔍 Checking MongoDB service..." -ForegroundColor Yellow
$mongoService = Get-Service MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    Write-Host "✓ MongoDB service is installed" -ForegroundColor Green
    
    if ($mongoService.Status -eq "Stopped") {
        Write-Host "Starting MongoDB..." -ForegroundColor Yellow
        Start-Service MongoDB -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "✓ MongoDB started" -ForegroundColor Green
    } else {
        Write-Host "✓ MongoDB is already running" -ForegroundColor Green
    }
} else {
    Write-Host "✗ MongoDB not found - please install it first" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Kill existing node processes
Write-Host ""
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Verify MongoDB connection
Write-Host ""
Write-Host "⏳ Waiting for MongoDB to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Start Backend
Write-Host ""
Write-Host "🚀 Starting Backend (Port 4000)..." -ForegroundColor Green
Push-Location backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Pop-Location
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🚀 Starting Frontend (Port 3000)..." -ForegroundColor Green
Push-Location frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Pop-Location

# Display info
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✓ BidTounsi is starting up!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Access Points:" -ForegroundColor Yellow
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:   http://localhost:4000" -ForegroundColor White
Write-Host "   MongoDB:   mongodb://localhost:27017/bidtounsi" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Close the terminal windows to stop the servers." -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
