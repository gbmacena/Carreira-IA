#!/bin/bash
echo "=== Worker Logs ==="
docker logs carreira-ai-worker-1 --tail 50 2>&1
