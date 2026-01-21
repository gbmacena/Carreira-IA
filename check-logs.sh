#!/bin/bash
echo "=== Worker Logs ==="
docker logs assistente-ia-worker-1 --tail 50 2>&1
