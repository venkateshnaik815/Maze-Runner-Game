# API Reference

## Base URL
All API requests should be prefixed with:
```
http://localhost:8080/api/v1
```

## Authentication
Most endpoints require a JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <your_access_token>
```

## Error Format (RFC 7807)
All API errors follow the RFC 7807 Problem Detail format:
```json
{
  "type": "https://api.maze-runner.app/errors/validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more fields are invalid",
  "fieldErrors": {
    "password": "Password must contain at least one uppercase letter"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## 1. Authentication (`/auth`)

### `POST /auth/register`
Creates a new player account.
- **Body**: `{ "username": "player1", "email": "p@example.com", "password": "..." }`
- **Response 201**: `AuthResponse` with JWT tokens.

### `POST /auth/login`
Authenticates a user.
- **Body**: `{ "usernameOrEmail": "player1", "password": "..." }`
- **Response 200**: `AuthResponse`.

### `POST /auth/refresh`
Rotates a refresh token.
- **Body**: `{ "refreshToken": "..." }`
- **Response 200**: `AuthResponse`.

### `POST /auth/logout`
Revokes all active refresh tokens for the user.
- **Headers**: `Authorization: Bearer ...`
- **Response 204**: No Content.

---

## 2. Player Profiles (`/players`)
*(To be implemented in Phase 5)*

### `GET /players/me`
Gets the authenticated user's profile.

### `PATCH /players/me`
Updates profile settings (bio, avatar, public visibility).

---

## 3. Mazes (`/mazes`)
*(To be implemented in Phase 3)*

### `GET /mazes`
Lists available daily/weekly challenge mazes.

### `POST /mazes/generate`
Generates a new on-demand maze (Admin only).

---

## 4. Game Sessions (`/games`)
*(To be implemented in Phase 4)*

### `POST /games/start`
Starts a new game session on a specific maze.

### `POST /games/{sessionId}/move`
Records a player movement and validates the path.

### `POST /games/{sessionId}/complete`
Submits a maze completion, calculates score, updates stats.

---

## 5. WebSockets (`/ws`)
*(To be implemented in Phase 4 & 6)*
- Connect to `ws://localhost:8080/api/v1/ws`
- Subscriptions:
  - `/topic/leaderboard/{difficulty}` - Real-time rank changes.
  - `/topic/achievements/{userId}` - Instant achievement unlock notifications.
