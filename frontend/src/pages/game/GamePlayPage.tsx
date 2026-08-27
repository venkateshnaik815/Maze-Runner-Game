import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Play, Pause, LogOut, Info, Trophy, Timer } from 'lucide-react';
import toast from 'react-hot-toast';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/auth.store';
import { generateMaze } from '@/utils/mazeGenerator';
import { formatDuration } from '@/utils';
import type { Maze, Position, MazeDifficulty } from '@/types';
import { DIFFICULTY_CONFIG } from '@/constants';

export default function GamePlayPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  
  // Game State
  const [maze, setMaze] = useState<Maze | null>(null);
  const [playerPos, setPlayerPos] = useState<Position>({ row: 0, col: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Initialize Maze
  useEffect(() => {
    // In a real app, we'd fetch the session/maze from backend
    // For this exact interface demo, we generate it locally
    const difficulty: MazeDifficulty = 'MEDIUM'; // Hardcode medium for demo, or infer from URL
    const newMaze = generateMaze(difficulty);
    setMaze(newMaze);
    setPlayerPos({ ...newMaze.start });
    setTimeElapsed(0);
    setMoves(0);
    setIsComplete(false);
  }, [sessionId]);

  // Timer Hook
  useEffect(() => {
    if (!maze || isPaused || isComplete) return;
    
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [maze, isPaused, isComplete]);

  // Movement Logic
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!maze || isPaused || isComplete) return;

    const currentCell = maze.grid[playerPos.row][playerPos.col];
    let newRow = playerPos.row;
    let newCol = playerPos.col;
    let moved = false;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (!currentCell.walls.top) { newRow--; moved = true; }
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (!currentCell.walls.right) { newCol++; moved = true; }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (!currentCell.walls.bottom) { newRow++; moved = true; }
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (!currentCell.walls.left) { newCol--; moved = true; }
        break;
      default:
        return; // Ignore other keys
    }

    if (moved) {
      e.preventDefault();
      setPlayerPos({ row: newRow, col: newCol });
      setMoves(m => m + 1);

      // Check Win Condition
      if (newRow === maze.end.row && newCol === maze.end.col) {
        setIsComplete(true);
        // Calculate score
        const config = DIFFICULTY_CONFIG[maze.difficulty];
        const baseScore = 1000 * config.scoreMultiplier;
        const timeBonus = Math.max(0, config.timeLimitSeconds - timeElapsed) * 10;
        setFinalScore(baseScore + timeBonus);
        
        toast.success(`Maze Completed! Score: ${baseScore + timeBonus}`, {
          icon: '🏆',
          duration: 5000,
        });
      }
    }
  }, [maze, playerPos, isPaused, isComplete, timeElapsed]);

  // Attach Keyboard Listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!maze) {
    return <div className="flex h-[80vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  }

  // Calculate Cell Size for responsiveness
  const maxBoardSize = 600; // max width/height in px
  const cellSize = Math.floor(maxBoardSize / maze.width);
  const boardWidth = cellSize * maze.width;
  const boardHeight = cellSize * maze.height;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* HUD (Heads Up Display) */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-surface-100 border border-surface-200 p-4 rounded-2xl shadow-lg gap-4">
        
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Player</p>
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {user?.username || 'Guest'}
            </p>
          </div>
          <div className="w-px h-8 bg-surface-200 hidden md:block"></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Difficulty</p>
            <Badge variant="warning">{maze.difficulty}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-12">
          <div className="text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <Timer className="w-3 h-3" /> Time
            </p>
            <p className={`text-2xl font-mono font-black ${DIFFICULTY_CONFIG[maze.difficulty].timeLimitSeconds - timeElapsed < 30 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {formatDuration(timeElapsed)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" /> Moves
            </p>
            <p className="text-2xl font-mono font-black text-primary-400">{moves}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setIsPaused(!isPaused)}
            disabled={isComplete}
          >
            {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button variant="danger" onClick={() => navigate('/lobby')}>
            <LogOut className="w-4 h-4 mr-2" /> Abandon
          </Button>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative flex justify-center items-center py-8">
        
        {/* The Maze */}
        <div 
          className="relative bg-surface-300 shadow-[0_0_50px_rgba(34,197,94,0.1)] transition-opacity duration-300"
          style={{ 
            width: boardWidth, 
            height: boardHeight,
            opacity: isPaused ? 0.3 : 1 
          }}
        >
          {/* Render Grid Walls */}
          {maze.grid.map((row, rIdx) => (
            row.map((cell, cIdx) => (
              <div 
                key={`${rIdx}-${cIdx}`}
                className="absolute box-border"
                style={{
                  top: rIdx * cellSize,
                  left: cIdx * cellSize,
                  width: cellSize,
                  height: cellSize,
                  borderTop: cell.walls.top ? '2px solid #334155' : 'none',
                  borderRight: cell.walls.right ? '2px solid #334155' : 'none',
                  borderBottom: cell.walls.bottom ? '2px solid #334155' : 'none',
                  borderLeft: cell.walls.left ? '2px solid #334155' : 'none',
                  backgroundColor: cell.isStart ? 'rgba(34,197,94,0.1)' : cell.isEnd ? 'rgba(245,158,11,0.1)' : 'transparent'
                }}
              >
                {cell.isStart && <div className="w-full h-full flex items-center justify-center text-[10px] text-green-500 opacity-50">START</div>}
                {cell.isEnd && <div className="w-full h-full flex items-center justify-center text-[10px] text-yellow-500 opacity-50">EXIT</div>}
              </div>
            ))
          ))}

          {/* Render Player */}
          {!isComplete && (
            <motion.div
              className="absolute z-10 flex items-center justify-center"
              initial={false}
              animate={{
                top: playerPos.row * cellSize,
                left: playerPos.col * cellSize,
              }}
              transition={{ type: "tween", duration: 0.1 }}
              style={{ width: cellSize, height: cellSize }}
            >
              <div className="w-2/3 h-2/3 bg-primary-500 rounded-sm shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            </motion.div>
          )}
        </div>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !isComplete && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="bg-surface-100/90 backdrop-blur-md p-8 rounded-2xl border border-surface-200 text-center shadow-2xl pointer-events-auto">
                <Pause className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Game Paused</h2>
                <p className="text-slate-400 mb-6">Take a breath. The timer is stopped.</p>
                <Button size="lg" className="w-full" onClick={() => setIsPaused(false)}>
                  <Play className="w-5 h-5 mr-2" /> Resume Game
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Victory Overlay */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            >
              <Card className="max-w-md w-full bg-surface-100/95 backdrop-blur-xl border-primary-500/30 text-center shadow-[0_0_50px_rgba(34,197,94,0.2)] pointer-events-auto">
                <div className="bg-gradient-to-br from-green-500/20 to-transparent p-8 pb-6">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">Maze Cleared!</h2>
                  <p className="text-green-400 font-medium">Outstanding performance.</p>
                </div>
                
                <div className="p-8 pt-4 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-200/50 p-3 rounded-lg border border-surface-300">
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Final Time</p>
                      <p className="text-xl font-mono text-white">{formatDuration(timeElapsed)}</p>
                    </div>
                    <div className="bg-surface-200/50 p-3 rounded-lg border border-surface-300">
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Moves</p>
                      <p className="text-xl font-mono text-white">{moves}</p>
                    </div>
                  </div>
                  
                  <div className="bg-surface-300/30 p-4 rounded-xl border border-primary-500/20">
                    <p className="text-sm text-slate-400 uppercase font-bold mb-1">Total Score Earned</p>
                    <p className="text-4xl font-black text-primary-400">{formatScore(finalScore)}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" className="flex-1" onClick={() => navigate('/lobby')}>
                      Back to Lobby
                    </Button>
                    <Button className="flex-1" onClick={() => window.location.reload()}>
                      Play Again
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="text-center text-slate-500 text-sm flex items-center justify-center gap-6">
        <span className="flex items-center gap-2"><kbd className="bg-surface-200 px-2 py-1 rounded text-slate-300 font-mono">W A S D</kbd> or <kbd className="bg-surface-200 px-2 py-1 rounded text-slate-300 font-mono">↑ ← ↓ →</kbd> to move</span>
      </div>
    </div>
  );
}
