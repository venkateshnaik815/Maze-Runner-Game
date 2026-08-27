import { motion } from 'framer-motion';
import { User as UserIcon, Settings, Calendar, Play, Trophy, XCircle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useAuthStore } from '@/stores/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatScore, formatDate, formatDurationLong } from '@/utils';

// Mock Data
const MOCK_STATS = {
  gamesPlayed: 142,
  gamesWon: 98,
  winRatio: 69,
  totalScore: 1450000,
  playTimeSeconds: 45000,
  bestStreak: 12,
};

const CHART_DATA = [
  { day: 'Mon', score: 12000 },
  { day: 'Tue', score: 18000 },
  { day: 'Wed', score: 15000 },
  { day: 'Thu', score: 25000 },
  { day: 'Fri', score: 22000 },
  { day: 'Sat', score: 38000 },
  { day: 'Sun', score: 45000 },
];

export default function PlayerProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-surface-100 rounded-2xl p-6 md:p-8 border border-surface-200 shadow-xl flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="w-32 h-32 rounded-full bg-surface-200 border-4 border-surface-300 flex items-center justify-center shrink-0 relative z-10">
          <UserIcon className="w-16 h-16 text-slate-400" />
          <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-surface-100" title="Online" />
        </div>
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white">{user?.username || 'Player1'}</h1>
              <p className="text-slate-400">{user?.email || 'player@maze.com'}</p>
            </div>
            <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" /> Edit Profile</Button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
            <Badge variant="success">Level 42</Badge>
            <Badge variant="warning">Grand Champion</Badge>
            <span className="flex items-center text-sm text-slate-400 ml-2">
              <Calendar className="w-4 h-4 mr-1" /> Joined {formatDate(user?.createdAt || new Date().toISOString())}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="space-y-6 lg:col-span-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" /> Lifetime Stats
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-surface-100/50">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Score</p>
              <p className="text-2xl font-black text-white">{formatScore(MOCK_STATS.totalScore)}</p>
            </Card>
            <Card className="p-4 bg-surface-100/50">
              <p className="text-slate-400 text-sm font-medium mb-1">Win Rate</p>
              <p className="text-2xl font-black text-white">{MOCK_STATS.winRatio}%</p>
            </Card>
            <Card className="p-4 bg-surface-100/50">
              <p className="text-slate-400 text-sm font-medium mb-1">Matches</p>
              <p className="text-2xl font-black text-white">{MOCK_STATS.gamesPlayed}</p>
            </Card>
            <Card className="p-4 bg-surface-100/50">
              <p className="text-slate-400 text-sm font-medium mb-1">Time Played</p>
              <p className="text-lg font-black text-white leading-loose">{formatDurationLong(MOCK_STATS.playTimeSeconds)}</p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Matches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-200/30">
                  <div className="flex items-center gap-3">
                    {i === 3 ? <XCircle className="w-5 h-5 text-red-400" /> : <Trophy className="w-5 h-5 text-green-400" />}
                    <div>
                      <p className="text-sm font-bold text-white">Expert Maze</p>
                      <p className="text-xs text-slate-400">{i} days ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${i === 3 ? 'text-slate-400' : 'text-primary-400'}`}>
                      {i === 3 ? 'Abandoned' : `+${formatScore(14500 - i * 1000)}`}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs">View Full History</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Chart & Activity */}
        <div className="space-y-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-primary-400" /> Performance Activity
          </h2>
          
          <Card className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white">Weekly Score Progression</h3>
                <p className="text-sm text-slate-400">Your points earned over the last 7 days</p>
              </div>
              <Badge variant="success" className="animate-pulse-green">Trending Up</Badge>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
                    itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
