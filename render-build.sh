#!/usr/bin/env bash
# Render Build Script
# This script runs during Render deployment to:
# 1. Install backend dependencies
# 2. Install frontend dependencies & build the React app
# 3. Copy the React build output into backend/client/ so Express can serve it

set -e

echo ">>> Installing backend dependencies..."
cd backend
npm install

echo ">>> Installing frontend dependencies..."
cd ../frontend
npm install

echo ">>> Building React frontend..."
npm run build

echo ">>> Copying build to backend/client/..."
rm -rf ../backend/client
cp -r build ../backend/client

echo ">>> Build complete!"
