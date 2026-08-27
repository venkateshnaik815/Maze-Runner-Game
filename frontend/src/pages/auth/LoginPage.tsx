import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import AuthService from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants';
import { getErrorMessage, getFieldErrors } from '@/utils';

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      // Map API auth response to User store model
      setUser({
        id: data.user_id,
        username: data.username,
        email: data.email,
        role: data.role,
        emailVerified: data.email_verified,
        createdAt: new Date().toISOString(), // Fallback if not provided
      });
      toast.success('Welcome back!');
      navigate(ROUTES.LOBBY);
    },
    onError: (error) => {
      const fieldErrors = getFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          setError(field as keyof LoginForm, { message: msg });
        });
      } else {
        toast.error(getErrorMessage(error));
      }
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md animate-slide-up">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/20">
              M
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to enter the maze</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Username or Email"
                placeholder="player1 or player@maze.com"
                {...register('usernameOrEmail')}
                error={errors.usernameOrEmail?.message}
                autoComplete="username"
              />
              
              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  error={errors.password?.message}
                  autoComplete="current-password"
                />
                <div className="flex justify-end">
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="text-xs text-primary-400 hover:text-primary-300 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                isLoading={isSubmitting || loginMutation.isPending}
              >
                Log In
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-surface-200 mt-2 pt-6">
            <p className="text-sm text-slate-400">
              New to the maze?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="text-primary-400 hover:text-primary-300 font-medium hover:underline transition-colors"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
