#!/bin/bash
# Start KeyDB using Docker
# This is a drop-in replacement for Redis

if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not in PATH."
    exit 1
fi

echo "🚀 Starting KeyDB container..."
docker run --name bandhannova-keydb \
    -p 6379:6379 \
    -d eqalpha/keydb:latest

if [ $? -eq 0 ]; then
    echo "✅ KeyDB is running on port 6379"
    echo "connection string: redis://localhost:6379"
else
    echo "⚠️  Failed to start KeyDB (it might already be running?)"
    echo "Try: docker start bandhannova-keydb"
fi
