cd ../
CALL npm run build-frontend
CALL npm run move-built-frontend
cd backend

set DOCKER_BUILDKIT=1
docker build -f Dockerfile -o out . --no-cache