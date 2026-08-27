import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info, Trophy, Clock, Target, ArrowRight } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DIFFICULTY_CONFIG } from '@/constants';
import { type MazeDifficulty } from '@/types';
import { ROUTES, formatDuration } from '@/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function GameLobbyPage() {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<MazeDifficulty | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = (difficulty: MazeDifficulty) => {
    setIsStarting(true);
    // Simulate API call to create session
    setTimeout(() => {
      navigate(`/game/session-${Date.now()}`);
    }, 1000);
  };

  const difficulties = Object.entries(DIFFICULTY_CONFIG) as [MazeDifficulty, typeof DIFFICULTY_CONFIG[MazeDifficulty]][];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-primary-500">Maze</span> Runner
          </h1>
          <p className="text-slate-400 text-lg">Select a difficulty level to begin your challenge.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-100 p-3 rounded-xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Your Rank</p>
              <p className="text-sm font-bold text-white">#1,204</p>
            </div>
          </div>
          <div className="w-px h-8 bg-surface-200" />
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Win Rate</p>
              <p className="text-sm font-bold text-white">68%</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
      >
        {difficulties.map(([key, config]) => {
          const isSelected = selectedDifficulty === key;
          
          return (
            <motion.div key={key} variants={itemVariants}>
              <Card 
                className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden relative group
                  ${isSelected ? `ring-2 ring-${config.colorClass.replace('text-', '')} shadow-${config.colorClass.replace('text-', '')}/20` : 'hover:border-slate-600'}
                `}
                onClick={() => setSelectedDifficulty(key)}
              >
                {/* Background glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${config.colorClass.replace('text-', '')}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={key === 'EASY' ? 'success' : key === 'MEDIUM' ? 'warning' : key === 'HARD' ? 'danger' : key === 'EXPERT' ? 'danger' : 'info'} className="uppercase">
                      {config.label}
                    </Badge>
                    <span className={`text-2xl font-bold ${config.colorClass}`}>
                      {config.scoreMultiplier}x
                    </span>
                  </div>
                  <CardTitle className="text-xl">Grid {config.gridSize}×{config.gridSize}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-300">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      Time Limit: <span className="text-white ml-1 font-mono">{formatDuration(config.timeLimitSeconds)}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <Info className="w-4 h-4 mr-2 text-slate-400" />
                      Hints Allowed: <span className="text-white ml-1 font-mono">{config.maxHints === 0 ? 'None' : config.maxHints}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 border-t border-surface-200 pt-3">
                    {config.description}
                  </p>
                </CardContent>

                <CardFooter className="pt-0 relative z-10">
                  <Button 
                    className={`w-full ${isSelected ? 'bg-primary-600 hover:bg-primary-500 text-white' : 'bg-surface-200 hover:bg-surface-300 text-slate-300'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        setSelectedDifficulty(key);
                      } else {
                        handleStartGame(key);
                      }
                    }}
                    isLoading={isStarting && isSelected}
                  >
                    {isSelected ? (
                      <>Start Match <ArrowRight className="w-4 h-4 ml-1" /></>
                    ) : (
                      'Select'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Featured Daily Challenge (Mocked) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12"
      >
        <Card className="bg-gradient-to-r from-surface-100 to-primary-950/30 border-primary-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Trophy className="w-32 h-32 text-primary-500" />
          </div>
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="info" className="bg-blue-500/20 text-blue-400 border-blue-500/30">DAILY CHALLENGE</Badge>
                <span className="text-sm font-medium text-slate-400">Resets in 14:23:05</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">The Labyrinth of Shadows</h3>
              <p className="text-slate-300 max-w-xl">
                Compete against everyone else on the exact same 25x25 maze. 
                Zero hints allowed. Top 10 players win exclusive badges.
              </p>
            </div>
            <Button size="lg" className="shrink-0 group">
              Play Daily Challenge 
              <Play className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" fill="currentColor" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
