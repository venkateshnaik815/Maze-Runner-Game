import { create } from 'zustand';
import type { GameSession, Maze, Position } from '@/types';

interface GameState {
  session: GameSession | null;
  maze: Maze | null;
  playerPosition: Position | null;
  movesCount: number;
  score: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  hintsUsed: number;
  powerUpsUsed: number;
  isGameOver: boolean;
  isVictory: boolean;
  revealedHintPath: Position[];

  // Actions
  setSession: (session: GameSession | null) => void;
  setMaze: (maze: Maze | null) => void;
  setPlayerPosition: (pos: Position) => void;
  setTimerSeconds: (seconds: number) => void;
  decrementTimer: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  incrementMoves: () => void;
  incrementHints: () => void;
  incrementPowerUps: () => void;
  setRevealedHintPath: (path: Position[]) => void;
  setGameOver: (isVictory: boolean) => void;
  resetGame: () => void;
}

const initialState = {
  session: null,
  maze: null,
  playerPosition: null,
  movesCount: 0,
  score: 0,
  timerSeconds: 0,
  isTimerRunning: false,
  hintsUsed: 0,
  powerUpsUsed: 0,
  isGameOver: false,
  isVictory: false,
  revealedHintPath: [] as Position[],
};

export const useGameStore = create<GameState>()((set) => ({
  ...initialState,

  setSession: (session) => set({ session }),
  setMaze: (maze) => set({ maze }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setTimerSeconds: (seconds) => set({ timerSeconds: seconds }),
  decrementTimer: () => set((state) => ({ timerSeconds: Math.max(0, state.timerSeconds - 1) })),
  startTimer: () => set({ isTimerRunning: true }),
  stopTimer: () => set({ isTimerRunning: false }),
  incrementMoves: () => set((state) => ({ movesCount: state.movesCount + 1 })),
  incrementHints: () => set((state) => ({ hintsUsed: state.hintsUsed + 1 })),
  incrementPowerUps: () => set((state) => ({ powerUpsUsed: state.powerUpsUsed + 1 })),
  setRevealedHintPath: (path) => set({ revealedHintPath: path }),
  setGameOver: (isVictory) => set({ isGameOver: true, isVictory, isTimerRunning: false }),
  resetGame: () => set(initialState),
}));
