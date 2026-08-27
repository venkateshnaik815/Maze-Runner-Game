import type { MazeDifficulty, PowerUpType } from '@/types';

// ── Routes ──────────────────────────────────────────────────────────
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  LOBBY: '/lobby',
  GAME: (sessionId: string) => `/game/${sessionId}`,
  PROFILE: '/profile',
  PROFILE_VIEW: (playerId: string) => `/profile/${playerId}`,
  LEADERBOARD: '/leaderboard',
  ACHIEVEMENTS: '/achievements',
  ADMIN: '/admin',
} as const;

// ── Local Storage Keys ──────────────────────────────────────────────
export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'maze_access_token',
  REFRESH_TOKEN: 'maze_refresh_token',
  USER: 'maze_user',
} as const;

// ── Difficulty Configuration ────────────────────────────────────────
export const DIFFICULTY_CONFIG: Record<
  MazeDifficulty,
  {
    label: string;
    gridSize: number;
    timeLimitSeconds: number;
    maxHints: number;
    scoreMultiplier: number;
    colorClass: string;
    badgeClass: string;
    description: string;
  }
> = {
  EASY: {
    label: 'Easy',
    gridSize: 10,
    timeLimitSeconds: 300,
    maxHints: 5,
    scoreMultiplier: 1.0,
    colorClass: 'text-green-400',
    badgeClass: 'difficulty-EASY',
    description: '10×10 grid · 5 min · 5 hints',
  },
  MEDIUM: {
    label: 'Medium',
    gridSize: 15,
    timeLimitSeconds: 240,
    maxHints: 3,
    scoreMultiplier: 1.5,
    colorClass: 'text-yellow-400',
    badgeClass: 'difficulty-MEDIUM',
    description: '15×15 grid · 4 min · 3 hints',
  },
  HARD: {
    label: 'Hard',
    gridSize: 20,
    timeLimitSeconds: 180,
    maxHints: 1,
    scoreMultiplier: 2.0,
    colorClass: 'text-orange-400',
    badgeClass: 'difficulty-HARD',
    description: '20×20 grid · 3 min · 1 hint',
  },
  EXPERT: {
    label: 'Expert',
    gridSize: 30,
    timeLimitSeconds: 120,
    maxHints: 0,
    scoreMultiplier: 3.0,
    colorClass: 'text-red-400',
    badgeClass: 'difficulty-EXPERT',
    description: '30×30 grid · 2 min · no hints',
  },
  LEGENDARY: {
    label: 'Legendary',
    gridSize: 40,
    timeLimitSeconds: 90,
    maxHints: 0,
    scoreMultiplier: 5.0,
    colorClass: 'text-purple-400',
    badgeClass: 'difficulty-LEGENDARY',
    description: '40×40 grid · 90 sec · no hints',
  },
};

// ── Power-Up Configuration ──────────────────────────────────────────
export const POWER_UP_CONFIG: Record<
  PowerUpType,
  { label: string; icon: string; description: string; durationSeconds: number }
> = {
  REVEAL_PATH: {
    label: 'Reveal Path',
    icon: '🗺️',
    description: 'Highlights the solution path for 5 seconds',
    durationSeconds: 5,
  },
  FREEZE_TIMER: {
    label: 'Freeze Timer',
    icon: '❄️',
    description: 'Pauses the countdown timer for 15 seconds',
    durationSeconds: 15,
  },
  WALL_BREAKER: {
    label: 'Wall Breaker',
    icon: '🔨',
    description: 'Remove one wall of your choice',
    durationSeconds: 0,
  },
  TELEPORT: {
    label: 'Teleport',
    icon: '✨',
    description: 'Teleports you to a random cell closer to the exit',
    durationSeconds: 0,
  },
  COMPASS: {
    label: 'Compass',
    icon: '🧭',
    description: 'Shows direction arrow toward exit for 10 seconds',
    durationSeconds: 10,
  },
  SPEED_BOOST: {
    label: 'Speed Boost',
    icon: '⚡',
    description: 'Increases animation speed for 20 seconds',
    durationSeconds: 20,
  },
};

// ── API Configuration ───────────────────────────────────────────────
export const API_BASE_URL = import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:8080';
export const WS_URL = import.meta.env['VITE_WS_URL'] ?? 'ws://localhost:8080';

// ── Pagination ──────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
export const LEADERBOARD_PAGE_SIZE = 50;

// ── Game Constants ──────────────────────────────────────────────────
export const MAX_SAVE_SLOTS = 5;
export const HINT_REVEAL_CELLS = 5;    // cells revealed per hint
export const HINT_SCORE_PENALTY = 50;
export const POWER_UP_SCORE_PENALTY = 25;
export const MOVE_PENALTY_THRESHOLD = 1.5; // penalty if moves > optimal * 1.5
