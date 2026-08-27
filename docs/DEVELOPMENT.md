# Developer Guide

Welcome to the Maze Runner Game project! This guide covers local setup, project structure, and coding standards.

## 1. Prerequisites for Local Development

If you prefer to run services natively instead of via Docker:
- **Java**: JDK 21 (Eclipse Temurin recommended)
- **Node.js**: v20 or v22
- **Maven**: 3.9+ (or use the included `./mvnw` wrapper)
- **Database**: PostgreSQL 16
- **Cache**: Redis 7

## 2. Local Setup Steps

### Backend
```bash
cd backend
# Ensure Postgres and Redis are running locally on default ports
./mvnw clean compile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
*Note: Flyway migrations will run automatically on startup.*

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 3. Project Structure

### Backend (`/backend/src/main/java/com/mazerunner`)
- `domain`: Entities, enums, value objects (Pure Java, no Spring deps if possible).
- `application`: Use cases, services, orchestrators.
- `infrastructure`: Spring Data JPA repositories, Redis clients, Security configs.
- `presentation`: REST Controllers, DTOs, WebSocket endpoints.

### Frontend (`/frontend/src`)
- `components`: Reusable UI (`ui/`) and layout (`layout/`) components.
- `pages`: Route-level container components.
- `services`: Axios API clients.
- `stores`: Zustand global state slices.
- `types`: TypeScript interfaces.
- `utils`: Helper functions.

## 4. Coding Standards

### Backend (Java)
- **Style**: Follows Google Java Style Guide. Enforced via `maven-checkstyle-plugin`.
- **Lombok**: Use `@RequiredArgsConstructor` for dependency injection. Avoid `@Data` on JPA Entities (use `@Getter`, `@Setter`, `@EqualsAndHashCode(of="id")`).
- **Tests**: 90% JaCoCo line coverage required. Integration tests must use Testcontainers.

### Frontend (TypeScript / React)
- **Strict Typing**: No `any`. Use generic types for API responses.
- **Hooks**: Keep business logic out of UI components. Use custom hooks (`useGame`, `useAuth`) connected to Zustand or React Query.
- **Styling**: Tailwind utility classes. Extract complex repeating class combinations using the `cn()` utility.
- **Linting**: Enforced via ESLint and Prettier.

## 5. Git Workflow

We use a standard Feature Branch workflow:
1. Branch from `main`: `git checkout -b feature/your-feature-name`
2. Commit using Conventional Commits:
   - `feat(...)`: A new feature
   - `fix(...)`: A bug fix
   - `docs(...)`: Documentation only changes
   - `chore(...)`: Build process or auxiliary tools
   - `test(...)`: Adding missing tests
3. Push and open a Pull Request against `main`.
4. CI will run Checkstyle, ESLint, Unit Tests, and SonarQube. All checks must pass.
