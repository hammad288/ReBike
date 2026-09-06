#!/usr/bin/env bash
# Render Build Script
# This script runs during Render deployment to:
# 1. Install backend dependencies
# 2. Install frontend dependencies & build the React app
# 3. Copy the React build output into Backend/client/ so Express can serve it

set -e

echo ">>> Installing backend dependencies..."
cd Backend
npm install

echo ">>> Installing frontend dependencies..."
cd ../frontend
npm install

echo ">>> Setting frontend env for production build..."
echo "REACT_APP_API_URL=" > .env

echo ">>> Building React frontend..."
npm run build

echo ">>> Copying build to Backend/client/..."
rm -rf ../Backend/client
cp -r build ../Backend/client

echo ">>> Build complete!"
