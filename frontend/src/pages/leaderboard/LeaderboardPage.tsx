import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DIFFICULTY_CONFIG } from '@/constants';
import type { MazeDifficulty, LeaderboardEntry } from '@/types';
import { formatScore, formatDuration, formatRelativeTime } from '@/utils';

// Mock data for visual presentation
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, playerId: 'p1', displayName: 'MazeMaster99', score: 145000, durationSeconds: 45, movesCount: 82, difficulty: 'EXPERT', recordedAt: new Date(Date.now() - 3600000).toISOString() },
  { rank: 2, playerId: 'p2', displayName: 'SpeedRunner', score: 142300, durationSeconds: 48, movesCount: 85, difficulty: 'EXPERT', recordedAt: new Date(Date.now() - 7200000).toISOString() },
  { rank: 3, playerId: 'p3', displayName: 'WallHugger', score: 138500, durationSeconds: 52, movesCount: 91, difficulty: 'EXPERT', recordedAt: new Date(Date.now() - 86400000).toISOString() },
  { rank: 4, playerId: 'p4', displayName: 'CasualGamer', score: 95000, durationSeconds: 65, movesCount: 110, difficulty: 'EXPERT', recordedAt: new Date(Date.now() - 172800000).toISOString() },
  { rank: 5, playerId: 'p5', displayName: 'Pathfinder', score: 92100, durationSeconds: 70, movesCount: 105, difficulty: 'EXPERT', recordedAt: new Date(Date.now() - 345600000).toISOString() },
  { rank: 6, playerId: 'p6', displayName: 'LostInSpace', score: 88000, durationSeconds: 85, movesCount: 130, difficulty: 'EXPERT', recordedAt: new Date(Date.now() - 400000000).toISOString() },
];

export default function LeaderboardPage() {
  const [difficulty, setDifficulty] = useState<MazeDifficulty>('EXPERT');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Global Rankings
          </h1>
          <p className="text-slate-400 mt-1">See how you stack up against the best maze runners in the world.</p>
        </div>
        
        <div className="flex gap-2">
          <Input 
            placeholder="Search player..." 
            className="w-64 bg-surface-100"
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
          <Button variant="outline" className="px-3">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(Object.keys(DIFFICULTY_CONFIG) as MazeDifficulty[]).map((level) => (
          <Button
            key={level}
            variant={difficulty === level ? 'primary' : 'secondary'}
            onClick={() => setDifficulty(level)}
            className="rounded-full px-6 whitespace-nowrap"
          >
            {DIFFICULTY_CONFIG[level].label}
          </Button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 items-end">
        {/* 2nd Place */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="text-center p-6 border-slate-400/30 bg-gradient-to-t from-surface-100 to-slate-500/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-400" />
            <div className="mx-auto w-16 h-16 bg-slate-400/20 rounded-full flex items-center justify-center mb-4 border-2 border-slate-400/50">
              <Medal className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{MOCK_LEADERBOARD[1].displayName}</h3>
            <p className="text-3xl font-black text-slate-300 mb-4">{formatScore(MOCK_LEADERBOARD[1].score)}</p>
            <div className="flex justify-center gap-4 text-sm text-slate-400 font-mono bg-surface-200/50 py-2 rounded-lg">
              <span>⏱ {formatDuration(MOCK_LEADERBOARD[1].durationSeconds)}</span>
              <span>👣 {MOCK_LEADERBOARD[1].movesCount}</span>
            </div>
          </Card>
        </motion.div>

        {/* 1st Place */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="text-center p-8 border-yellow-400/30 bg-gradient-to-t from-surface-100 to-yellow-500/10 relative overflow-hidden shadow-yellow-500/10 shadow-2xl z-10 md:-mt-8">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-yellow-400" />
            <div className="mx-auto w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mb-4 border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
            <Badge variant="warning" className="mb-2">Grand Champion</Badge>
            <h3 className="text-2xl font-bold text-white mb-1">{MOCK_LEADERBOARD[0].displayName}</h3>
            <p className="text-4xl font-black text-yellow-400 mb-4">{formatScore(MOCK_LEADERBOARD[0].score)}</p>
            <div className="flex justify-center gap-4 text-sm text-slate-400 font-mono bg-surface-200/80 py-2.5 rounded-lg border border-surface-200">
              <span>⏱ {formatDuration(MOCK_LEADERBOARD[0].durationSeconds)}</span>
              <span>👣 {MOCK_LEADERBOARD[0].movesCount}</span>
            </div>
          </Card>
        </motion.div>

        {/* 3rd Place */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="text-center p-6 border-orange-400/30 bg-gradient-to-t from-surface-100 to-orange-500/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-400" />
            <div className="mx-auto w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mb-4 border-2 border-orange-400/50">
              <Medal className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{MOCK_LEADERBOARD[2].displayName}</h3>
            <p className="text-3xl font-black text-orange-400 mb-4">{formatScore(MOCK_LEADERBOARD[2].score)}</p>
            <div className="flex justify-center gap-4 text-sm text-slate-400 font-mono bg-surface-200/50 py-2 rounded-lg">
              <span>⏱ {formatDuration(MOCK_LEADERBOARD[2].durationSeconds)}</span>
              <span>👣 {MOCK_LEADERBOARD[2].movesCount}</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Full Leaderboard Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-200 text-slate-300 font-medium border-b border-surface-300">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Player</th>
                  <th className="px-6 py-4 text-right">Score</th>
                  <th className="px-6 py-4 text-right">Time</th>
                  <th className="px-6 py-4 text-right">Moves</th>
                  <th className="px-6 py-4 text-right text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {MOCK_LEADERBOARD.slice(3).map((entry) => (
                  <tr key={entry.playerId} className="hover:bg-surface-200/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-400">#{entry.rank}</td>
                    <td className="px-6 py-4 font-bold text-white">{entry.displayName}</td>
                    <td className="px-6 py-4 text-right font-black text-primary-400">{formatScore(entry.score)}</td>
                    <td className="px-6 py-4 text-right font-mono text-slate-300">{formatDuration(entry.durationSeconds)}</td>
                    <td className="px-6 py-4 text-right font-mono text-slate-300">{entry.movesCount}</td>
                    <td className="px-6 py-4 text-right text-slate-500 text-xs">{formatRelativeTime(entry.recordedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-surface-200 flex justify-center">
            <Button variant="ghost">Load More</Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
