import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface-200 bg-surface/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link to={ROUTES.LOBBY} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">
              Maze Runner
            </span>
          </Link>

          {/* Primary Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
            <Link to={ROUTES.LOBBY} className="px-3 py-2 rounded-md hover:bg-surface-100 hover:text-white transition-colors">
              Lobby
            </Link>
            <Link to={ROUTES.LEADERBOARD} className="px-3 py-2 rounded-md hover:bg-surface-100 hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link to={ROUTES.ACHIEVEMENTS} className="px-3 py-2 rounded-md hover:bg-surface-100 hover:text-white transition-colors">
              Achievements
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to={ROUTES.ADMIN} className="px-3 py-2 rounded-md text-primary-400 hover:bg-primary-950 hover:text-primary-300 transition-colors">
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <Link to={ROUTES.PROFILE} className="text-sm font-medium hover:text-primary-400 transition-colors">
            {user?.username}
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
