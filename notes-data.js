/* Portfolio notes data (edit notes here, not in index.html).
   Add a new note: add another key below; the key must match the note's quick-review key (e.g. 'docker').
   Inside the backticks: write a backslash as \\ , a backtick as \` , and ${ as \${ */
window.NOTES_EMB = window.NOTES_EMB || {};

window.NOTES_EMB['docker'] = `# DOCKER — QUICK REFERENCE

## CORE IDEA

Docker packages an application with its dependencies so it runs consistently across different environments.

Without Docker: Application works on your laptop but may fail on another machine due to different Python versions or libraries.

With Docker: Same application environment can run on different machines.

\`\`\`text
  Dockerfile  →  Image  →  Container

  Dockerfile  = Instructions to build
  Image       = Application package/template
  Container   = Running instance of an image
\`\`\`

## DOCKER ARCHITECTURE

Docker uses a client-server architecture.

\`\`\`text
  Docker CLI  →  Docker Daemon  →  Images / Containers
\`\`\`

\`\`\`text
  Docker CLI       →  Commands entered by developer
  Docker Daemon    →  Builds and manages containers
  Docker Engine    →  Core platform that runs Docker
  Docker Registry  →  Stores and distributes images
\`\`\`

TRAP — Image and container are NOT the same:

\`\`\`text
  Image      = Blueprint
  Container = Running application created from image

  One image → Multiple containers
\`\`\`

## IMAGES + CONTAINERS

\`\`\`bash
docker pull python:3.12
\`\`\`

Downloads a Python image from Docker Hub.

\`\`\`bash
docker images
\`\`\`

Lists downloaded images.

\`\`\`bash
docker run python:3.12
\`\`\`

Creates and runs a container from the image.

\`\`\`bash
docker ps
docker ps -a
\`\`\`

Shows running containers / all containers.

\`\`\`bash
docker stop <container>
docker start <container>
docker rm <container>
docker rmi <image>
\`\`\`

Stops, starts and removes containers or images.

TRAP — Removing a container does not automatically remove its image.

## DOCKERFILE

Dockerfile = Instructions used to build a Docker image.

\`\`\`dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
\`\`\`

\`\`\`text
  FROM       →  Base image
  WORKDIR    →  Working directory inside container
  COPY       →  Copies files into image
  RUN        →  Executes command while building image
  CMD        →  Default command when container starts
  EXPOSE     →  Documents intended container port
\`\`\`

TRAP — RUN vs CMD:

\`\`\`text
  RUN → Executes during image BUILD.
  CMD → Executes when container STARTS.
\`\`\`

## BUILD + RUN

\`\`\`bash
docker build -t my-app .
\`\`\`

Builds an image using the Dockerfile in the current directory.

\`\`\`bash
docker run my-app
\`\`\`

Creates and starts a container from that image.

\`\`\`bash
docker run -d -p 8000:8000 my-app
\`\`\`

\`\`\`text
  -d       → Run in background
  -p       → Map host port to container port
  8000     → Host port
  8000     → Container port
\`\`\`

Now access the application at localhost:8000.

## VOLUMES + BIND MOUNTS

Containers are designed to be replaceable. Data stored only inside a container can be lost when it is removed.

Volumes provide persistent storage.

\`\`\`bash
docker volume create mydata
docker run -v mydata:/app/data my-app
\`\`\`

\`\`\`text
  Volume     → Managed by Docker
  Bind Mount → Maps a host directory into a container
\`\`\`

Used for database files, uploaded files and persistent application data.

## NETWORKING

Docker networking allows containers to communicate with each other.

\`\`\`text
  Frontend Container
          |
          |
    Backend Container
          |
          |
     Database Container
\`\`\`

Containers on the same user-defined Docker network can communicate using their container or service names.

TRAP — localhost inside a container refers to that same container, not automatically to another container.

## DOCKER COMPOSE

Docker Compose manages multiple containers using one YAML configuration file.

Example:

\`\`\`yaml
services:
  app:
    build: .
    ports:
      - "8000:8000"

  db:
    image: postgres:16
\`\`\`

\`\`\`bash
docker compose up
docker compose up -d
docker compose down
docker compose logs
\`\`\`

\`\`\`text
  docker compose up    → Start services
  docker compose up -d → Start in background
  docker compose down  → Stop and remove services
  docker compose logs  → View service logs
\`\`\`

Used when an application needs a frontend, backend and database together.

## ENVIRONMENT VARIABLES + SECRETS

Environment variables configure applications without hardcoding values.

\`\`\`bash
docker run -e APP_ENV=production my-app
\`\`\`

Example:

\`\`\`text
  APP_ENV=production
  PORT=8000
  DATABASE_URL=...
\`\`\`

TRAP — Never hardcode API keys, passwords or database credentials inside Dockerfiles or source code. Use appropriate secrets management.

## DOCKER HUB + REGISTRY

Docker Hub is an online registry used to store and share images.

\`\`\`bash
docker login
docker tag my-app username/my-app:v1
docker push username/my-app:v1
docker pull username/my-app:v1
\`\`\`

\`\`\`text
  docker login → Authenticate
  docker tag   → Assign image name and tag
  docker push  → Upload image
  docker pull  → Download image
\`\`\`

## DOCKER vs VIRTUAL MACHINE

\`\`\`text
  Docker:
  Application → Container Engine → Host OS → Hardware

  Virtual Machine:
  Application → Guest OS → Hypervisor → Host OS → Hardware
\`\`\`

\`\`\`text
  Docker → Lightweight, shares host OS kernel.
  VM     → Runs a separate guest operating system.
\`\`\`

## DEBUGGING CHEATSHEET

\`\`\`bash
docker ps
\`\`\`

Check running containers.

\`\`\`bash
docker logs <container>
\`\`\`

Check application logs.

\`\`\`bash
docker exec -it <container> bash
\`\`\`

Open a shell inside a running container (if Bash is installed).

\`\`\`bash
docker inspect <container>
\`\`\`

Inspect container configuration.

\`\`\`bash
docker stats
\`\`\`

Monitor container resource usage.

\`\`\`bash
docker system df
\`\`\`

Check Docker disk usage.

## MULTI-STAGE BUILDS

Multi-stage builds use multiple stages in a Dockerfile to create smaller production images.

\`\`\`dockerfile
FROM python:3.12 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.12-slim
COPY --from=builder /install /usr/local
WORKDIR /app
COPY . .
CMD ["python", "app.py"]
\`\`\`

\`\`\`text
  Builder stage     → Install dependencies.
  Final stage       → Contains only what is needed to run.
\`\`\`

Benefit → Smaller and cleaner production images.

## DOCKER SECURITY

\`\`\`text
  - Use trusted base images.
  - Avoid running applications as root.
  - Never store API keys inside images.
  - Keep images and dependencies updated.
  - Use .dockerignore.
  - Scan images for vulnerabilities.
\`\`\`

Example \`.dockerignore\`:

\`\`\`text
.env
.git
__pycache__
venv
node_modules
\`\`\`

## DOCKER IN AI/ML

Typical ML deployment workflow:

\`\`\`text
  ML Model
      |
  FastAPI Application
      |
  Dockerfile
      |
  Docker Image
      |
  Docker Container
      |
  AWS / Cloud Deployment
\`\`\`

Example use cases:

\`\`\`text
  Model Serving     → Run trained ML models.
  FastAPI           → Deploy prediction APIs.
  Streamlit         → Package ML web applications.
  Jupyter           → Run notebooks in isolated environments.
  PostgreSQL        → Run databases in containers.
\`\`\`

## INTERVIEW Q&A

Q: What is Docker?

A: Docker is a containerization platform that packages applications and their dependencies into containers.

Q: Image vs Container?

A: Image is a template; container is a running instance of that image.

Q: What is Dockerfile?

A: A text file containing instructions to build a Docker image.

Q: RUN vs CMD?

A: RUN executes during image building; CMD executes when the container starts.

Q: COPY vs ADD?

A: COPY copies files and directories. ADD also supports additional features such as extracting local tar archives.

Q: What is Docker Compose?

A: A tool for managing multiple containers using a YAML configuration file.

Q: What is a Docker Volume?

A: Persistent storage managed by Docker.

Q: Why use Docker in ML deployment?

A: It packages the model application and dependencies into a consistent environment, simplifying deployment.

Q: Docker vs Kubernetes?

A: Docker provides container building and running tools. Kubernetes orchestrates containers across a cluster.

## COMMON MISTAKES

\`\`\`text
  No .dockerignore              → Unnecessary files enter build context.
  Wrong port mapping            → Application inaccessible from host.
  Using localhost between       → Container-to-container connection fails.
  containers
  Hardcoded API keys            → Security risk.
  No persistent volume          → Data may be lost with container removal.
  Huge base image               → Larger image and slower deployment.
  No health checks              → Application failures harder to detect.
\`\`\`

## FINAL REVISION

Remember these relationships:

\`\`\`text
  Dockerfile     → Builds → Image
  Image          → Creates → Container
  Volume         → Persists → Data
  Network        → Connects → Containers
  Compose        → Manages → Multiple Containers
  Registry       → Stores → Images
  Port Mapping   → Exposes → Container Application
\`\`\`

**MOST IMPORTANT FOR AI/ML ENGINEERS:**

\`\`\`text
  Docker Basics
      ↓
  Images & Containers
      ↓
  Dockerfile
      ↓
  Port Mapping & Volumes
      ↓
  Docker Compose
      ↓
  FastAPI + ML Model Deployment
      ↓
  Docker Hub
      ↓
  AWS Deployment
\`\`\`
`;
