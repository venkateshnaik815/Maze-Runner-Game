# Deployment Guide

This document covers how to deploy the Maze Runner Game platform locally using Docker Compose, and prepares for production Kubernetes deployment.

## 1. Prerequisites

- Docker Engine 24.0+
- Docker Compose v2.20+
- (For Kubernetes) `kubectl`, Helm 3, and a running K8s cluster (e.g., minikube, EKS, GKE)

## 2. Environment Variables

Create a `.env` file in the root directory. Use `.env.example` as a template.

| Variable | Description | Default / Example |
|---|---|---|
| `POSTGRES_USER` | Database username | `maze_user` |
| `POSTGRES_PASSWORD` | Database password | `maze_password` |
| `POSTGRES_DB` | Database name | `maze_runner` |
| `JWT_SECRET` | 256-bit secret for signing JWTs | *(Must be generated)* |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `dev` |
| `VITE_API_BASE_URL` | Frontend API target | `http://localhost:8080` |

## 3. Local Deployment (Docker Compose)

The easiest way to run the entire stack locally is using the provided Docker Compose configuration.

```bash
# Start all services (Backend, Frontend, Postgres, Redis, Prometheus, Grafana, MailHog)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Access Points
- **Frontend App**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **API Swagger Docs**: http://localhost:8080/api/v1/swagger-ui.html
- **Database Adminer**: http://localhost:8081
- **MailHog (Emails)**: http://localhost:8025
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001

## 4. Production Build (Docker)

To build optimized production images:

```bash
# Build Backend (JRE 21, layered JAR)
docker build -t mazerunner-backend:latest ./backend

# Build Frontend (Nginx SPA)
docker build -t mazerunner-frontend:latest ./frontend
```

## 5. Kubernetes Deployment (Overview)

*(K8s manifests are planned for Phase 8)*

The production deployment strategy involves:
1. **StatefulSets**: PostgreSQL (with PersistentVolumeClaims) and Redis.
2. **Deployments**: Backend API (min 3 replicas, HPA based on CPU/RAM), Frontend Nginx.
3. **Services**: ClusterIP for internal routing, LoadBalancer/Ingress for public access.
4. **ConfigMaps/Secrets**: Managing environment variables and DB credentials securely.
5. **Init Containers**: Flyway migrations run as an init container or Kubernetes Job prior to Backend pod startup.
