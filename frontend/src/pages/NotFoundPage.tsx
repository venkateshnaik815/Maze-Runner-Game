import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center space-y-6 bg-surface">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-primary-500">404</h1>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Lost in the Maze</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
      </div>
      <Link to={ROUTES.LOBBY}>
        <Button size="lg">Return to Safety</Button>
      </Link>
    </div>
  );
}
