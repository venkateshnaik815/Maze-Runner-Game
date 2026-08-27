# 🧩 Maze Runner Game — Enterprise Platform

[![CI](https://github.com/venkateshnaik815/Maze-Runner-Game/actions/workflows/ci.yml/badge.svg)](https://github.com/venkateshnaik815/Maze-Runner-Game/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)](https://github.com/venkateshnaik815/Maze-Runner-Game)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-ready-326CE5)](https://kubernetes.io/)

> A **production-ready, cloud-native Maze Runner Game Platform** with procedural maze generation, real-time leaderboards, achievements, player profiles, admin dashboard, and enterprise-grade infrastructure.

---

## ✨ Features

| Category | Features |
|---|---|
| 🎮 **Gameplay** | 5 maze generation algorithms, 5 difficulty levels, timer, move counter, hints, save/load (5 slots) |
| ⚡ **Power-Ups** | Reveal Path, Freeze Timer, Wall Breaker, Teleport, Compass, Speed Boost |
| 🏆 **Progression** | 30+ achievements, global/daily/weekly leaderboards, score streaks, player stats |
| 👤 **Players** | JWT auth, player profiles, avatars, game history, replay viewer |
| 🛡️ **Admin** | User management, analytics dashboard, maze management, platform metrics |
| 📊 **Analytics** | Event tracking, DAU/MAU, session analytics, popular mazes, power-up usage |
| 🔐 **Security** | JWT + refresh token rotation, BCrypt, rate limiting, CSP headers, OWASP compliant |
| 🚀 **Infrastructure** | Docker Compose (dev), Kubernetes (prod), GitHub Actions CI/CD, Prometheus + Grafana |

---

## 🏗️ Architecture

```
React 18 + TypeScript  →  Nginx  →  Spring Boot (Java 21)  →  PostgreSQL 16
                                                            →  Redis 7
```

**Clean Architecture** (Domain → Application → Infrastructure → Presentation)

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for full architecture diagrams.

---

## 🚀 Quick Start

### Prerequisites
- **Docker** 24+ and **Docker Compose** 2.20+
- **Java 21** (for backend development)
- **Node.js 20+** (for frontend development)
- **Make** (optional, for `Makefile` shortcuts)

### Run with Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/venkateshnaik815/Maze-Runner-Game.git
cd Maze-Runner-Game

# Copy environment template
cp .env.example .env

# Start all services (backend + frontend + PostgreSQL + Redis)
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8080
# Swagger:   http://localhost:8080/swagger-ui
# Adminer:   http://localhost:8090 (DB admin)
# Grafana:   http://localhost:3001
```

### Run for Development

```bash
# Start infrastructure only (PostgreSQL + Redis)
make infra-up

# Start backend
make backend-dev

# Start frontend (in a new terminal)
make frontend-dev
```

---

## 🧪 Testing

```bash
# Run all backend tests (unit + integration)
make backend-test

# Run backend tests with coverage report
make backend-coverage

# Run frontend unit tests
make frontend-test

# Run E2E tests (Cypress)
make e2e-test

# Run all tests
make test-all
```

**Coverage targets**: ≥ 90% backend (JaCoCo) | ≥ 85% frontend (Vitest)

---

## 📁 Project Structure

```
maze-runner-platform/
├── backend/          # Spring Boot (Java 21) — REST API + WebSocket
├── frontend/         # React 18 + TypeScript — UI
├── k8s/              # Kubernetes manifests
├── .github/          # GitHub Actions CI/CD workflows
├── docs/             # Architecture, API, Deployment docs
├── docker-compose.yml
├── docker-compose.test.yml
├── Makefile
└── .env.example
```

---

## 📚 Documentation

| Doc | Description |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, diagrams, technology decisions |
| [API.md](docs/API.md) | REST API reference (also at `/swagger-ui` when running) |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Docker Compose + Kubernetes deployment guide |
| [DEVELOPMENT.md](docs/DEVELOPMENT.md) | Local setup, coding standards, PR guidelines |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | How to contribute |

---

## 🛠️ Technology Stack

**Frontend**: React 18, TypeScript 5, Vite 5, Tailwind CSS, Shadcn/UI, Zustand, TanStack Query, Framer Motion, Recharts, Vitest, Cypress

**Backend**: Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA, Spring Data Redis, Flyway, MapStruct, JJWT, JUnit 5, Testcontainers, JaCoCo

**Infrastructure**: PostgreSQL 16, Redis 7, Docker, Kubernetes, GitHub Actions, Nginx, Prometheus, Grafana, Loki

---

## 📜 License

[MIT License](LICENSE) — © 2026 Venkatesh Naik

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) before submitting pull requests.
