import { motion } from 'framer-motion';
import { Award, Lock, Zap, Target, Timer, Compass, Ghost } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

// Mock Data
const ACHIEVEMENTS = [
  { id: '1', title: 'First Steps', description: 'Complete your first maze on any difficulty.', icon: Target, locked: false, color: 'text-green-400', bg: 'bg-green-500/20' },
  { id: '2', title: 'Speed Demon', description: 'Finish a medium maze with at least 50% time remaining.', icon: Timer, locked: false, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: '3', title: 'Pathfinder', description: 'Complete a hard maze without using any hints.', icon: Compass, locked: false, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: '4', title: 'Legendary Runner', description: 'Clear a legendary maze. Only for the brave.', icon: Award, locked: true, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { id: '5', title: 'Flawless Execution', description: 'Complete a maze making 0 incorrect turns.', icon: Zap, locked: true, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { id: '6', title: 'Ghost Mode', description: 'Finish a maze in under 30 seconds.', icon: Ghost, locked: true, color: 'text-slate-100', bg: 'bg-slate-500/20' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200 } },
};

export default function AchievementsPage() {
  const unlockedCount = ACHIEVEMENTS.filter(a => !a.locked).length;
  const progressPercent = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-surface-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-primary-400" />
            Achievements
          </h1>
          <p className="text-slate-400 mt-1">Unlock badges by completing special challenges in the maze.</p>
        </div>
        
        <div className="bg-surface-100 p-4 rounded-xl border border-surface-200 min-w-[250px]">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-slate-300">Completion</span>
            <span className="text-lg font-bold text-primary-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-surface-300 rounded-full h-2.5">
            <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-right">{unlockedCount} of {ACHIEVEMENTS.length} unlocked</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {ACHIEVEMENTS.map((achievement) => (
          <motion.div key={achievement.id} variants={itemVariants}>
            <Card className={`h-full transition-all duration-300 ${achievement.locked ? 'opacity-60 grayscale hover:grayscale-0' : 'hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-900/20'}`}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${achievement.locked ? 'bg-surface-300' : achievement.bg}`}>
                  {achievement.locked ? (
                    <Lock className="w-6 h-6 text-slate-500" />
                  ) : (
                    <achievement.icon className={`w-7 h-7 ${achievement.color}`} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{achievement.title}</h3>
                  {achievement.locked ? (
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Locked</span>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">Unlocked</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 leading-relaxed">{achievement.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
