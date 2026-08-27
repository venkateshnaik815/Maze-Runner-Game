import { useParams } from 'react-router-dom';

export default function GamePlayPage() {
  const { sessionId } = useParams();
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-4">Game Session: {sessionId}</h1>
      <div className="flex-1 bg-surface-100 border border-surface-200 rounded-xl flex items-center justify-center">
        <p className="text-slate-400">Maze renderer and gameplay engine coming in Phase 4.</p>
      </div>
    </div>
  );
}
