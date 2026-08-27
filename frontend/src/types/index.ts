// ── User & Auth ─────────────────────────────────────────────────────

export type UserRole = 'PLAYER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  username: string;
  email: string;
  role: UserRole;
  email_verified: boolean;
}

// ── Difficulty & Game Enums ──────────────────────────────────────────

export type MazeDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'LEGENDARY';

export type MazeAlgorithm =
  | 'RECURSIVE_BACKTRACKER'
  | 'PRIMS'
  | 'KRUSKALS'
  | 'WILSONS'
  | 'ALDOUS_BRODER';

export type GameStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'TIMED_OUT' | 'SAVED';

export type PowerUpType =
  | 'REVEAL_PATH'
  | 'FREEZE_TIMER'
  | 'TELEPORT'
  | 'WALL_BREAKER'
  | 'COMPASS'
  | 'SPEED_BOOST';

export type AchievementCategory =
  | 'PROGRESSION'
  | 'SPEED'
  | 'PERFECTION'
  | 'EXPLORER'
  | 'PERSISTENCE'
  | 'SOCIAL'
  | 'COLLECTOR'
  | 'LEGENDARY';

// ── Maze ────────────────────────────────────────────────────────────

export interface Position {
  row: number;
  col: number;
}

export interface CellWalls {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface Cell {
  row: number;
  col: number;
  walls: CellWalls;
  isStart: boolean;
  isEnd: boolean;
}

export interface Maze {
  id: string;
  name: string;
  width: number;
  height: number;
  difficulty: MazeDifficulty;
  algorithm: MazeAlgorithm;
  grid: Cell[][];
  start: Position;
  end: Position;
  createdAt: string;
}

// ── Game Session ─────────────────────────────────────────────────────

export interface GameSession {
  id: string;
  playerId: string;
  mazeId: string;
  status: GameStatus;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  movesCount: number;
  score: number;
  hintsUsed: number;
  powerUpsUsed: number;
  difficulty: MazeDifficulty;
  playerPosition: Position;
  maze?: Maze;
}

export interface MoveRequest {
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}

export interface SavedGame {
  id: string;
  slotNumber: number;
  description?: string;
  savedAt: string;
  thumbnailData?: string;
}

// ── Player Profile ─────────────────────────────────────────────────

export interface PlayerProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  totalScore: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesAbandoned: number;
  totalTimePlayedSeconds: number;
  totalMoves: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedAt?: string;
  preferredDifficulty?: MazeDifficulty;
  publicProfile: boolean;
  createdAt: string;
  winRatio: number;
  averageScore: number;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  preferredDifficulty?: MazeDifficulty;
  publicProfile?: boolean;
}

// ── Leaderboard ───────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  durationSeconds: number;
  movesCount: number;
  difficulty: MazeDifficulty;
  recordedAt: string;
}

// ── Achievements ──────────────────────────────────────────────────

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  category: AchievementCategory;
  points: number;
}

export interface PlayerAchievement {
  achievement: Achievement;
  unlockedAt: string;
  sessionId?: string;
}

// ── Game History ──────────────────────────────────────────────────

export interface GameHistory {
  id: string;
  sessionId: string;
  mazeId: string;
  mazeName?: string;
  result: 'WIN' | 'LOSS' | 'ABANDONED';
  score: number;
  durationSeconds: number;
  difficulty: MazeDifficulty;
  movesCount: number;
  recordedAt: string;
}

// ── API Utilities ─────────────────────────────────────────────────

export interface ApiError {
  title: string;
  detail: string;
  status: number;
  timestamp?: string;
  fieldErrors?: Record<string, string>;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ── Admin ─────────────────────────────────────────────────────────

export interface AdminUserSummary {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  active: boolean;
  emailVerified: boolean;
  gamesPlayed: number;
  totalScore: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface PlatformStats {
  totalUsers: number;
  activeUsersToday: number;
  activeUsersThisWeek: number;
  totalGamesPlayed: number;
  totalGamesToday: number;
  avgScoreAllTime: number;
  topDifficulty: MazeDifficulty;
}
