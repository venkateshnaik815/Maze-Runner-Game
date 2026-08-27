import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Spinner } from '@/components/ui/Spinner';
import { Navbar } from '@/components/layout/Navbar';

// ── Lazy-loaded pages ────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const GameLobbyPage = lazy(() => import('@/pages/lobby/GameLobbyPage'));
const GamePlayPage = lazy(() => import('@/pages/game/GamePlayPage'));
const PlayerProfilePage = lazy(() => import('@/pages/profile/PlayerProfilePage'));
const LeaderboardPage = lazy(() => import('@/pages/leaderboard/LeaderboardPage'));
const AchievementsPage = lazy(() => import('@/pages/achievements/AchievementsPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// ── Route Guards ──────────────────────────────────────────────────────

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}

function AdminRoute() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/lobby" replace />;
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}

function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/lobby" replace />;
  return <Outlet />;
}

// ── Loading Fallback ──────────────────────────────────────────────────

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-slate-400 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// ── App Component ─────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/lobby" replace />} />

          {/* Public-only routes (redirect to lobby if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected player routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/lobby" element={<GameLobbyPage />} />
            <Route path="/game/:sessionId" element={<GamePlayPage />} />
            <Route path="/profile" element={<PlayerProfilePage />} />
            <Route path="/profile/:playerId" element={<PlayerProfilePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
