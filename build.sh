#!/bin/bash
# Build script for Vercel

echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Building frontend..."
npm run build

echo "Building backend..."
cd ../backend
npm install
npm run build

echo "Build completed!"
