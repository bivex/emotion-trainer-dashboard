#!/bin/bash

# Emotion Trainer - Start All Servers
# This script starts both the frontend dev server and the image server

set -e

echo "🚀 Starting Emotion Trainer..."
echo ""

# Check if ports are already in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    fi
    return 0
}

# Kill any existing processes on our ports
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $FRONTEND_PID $IMAGE_PID 2>/dev/null
    wait $FRONTEND_PID $IMAGE_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start image server (port 3001)
echo "📸 Starting image server on port 3001..."
node server.cjs &
IMAGE_PID=$!
sleep 2

# Verify image server is running
if ! curl -s http://localhost:3001/health >/dev/null 2>&1; then
    echo "❌ Image server failed to start"
    kill $IMAGE_PID 2>/dev/null
    exit 1
fi
echo "✅ Image server running at http://localhost:3001"

# Start frontend dev server (port 3000)
echo ""
echo "🌐 Starting frontend dev server on port 3000..."
bun run dev &
FRONTEND_PID=$!
sleep 3

# Verify frontend is running
if ! curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "❌ Frontend server failed to start"
    kill $FRONTEND_PID $IMAGE_PID 2>/dev/null
    exit 1
fi
echo "✅ Frontend server running at http://localhost:3000"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  🎯 Emotion Trainer is ready!"
echo "  Frontend: http://localhost:3000"
echo "  Image API: http://localhost:3001/api/images"
echo "  Press Ctrl+C to stop both servers"
echo "═══════════════════════════════════════════════════════"
echo ""

# Wait for both processes
wait $FRONTEND_PID $IMAGE_PID
