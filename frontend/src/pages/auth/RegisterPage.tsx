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

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be under 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[@$!%*?&_#]/, 'Must contain a special character (@$!%*?&_#)'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: (data) => {
      setUser({
        id: data.user_id,
        username: data.username,
        email: data.email,
        role: data.role,
        emailVerified: data.email_verified,
        createdAt: new Date().toISOString(),
      });
      toast.success('Account created successfully!');
      navigate(ROUTES.LOBBY);
    },
    onError: (error) => {
      const fieldErrors = getFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          setError(field as keyof RegisterForm, { message: msg });
        });
      } else {
        toast.error(getErrorMessage(error));
      }
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate({
      username: data.username,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/20">
              M
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join the maze runners community</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Username"
                placeholder="player1"
                {...register('username')}
                error={errors.username?.message}
                autoComplete="username"
              />
              
              <Input
                label="Email"
                type="email"
                placeholder="player@maze.com"
                {...register('email')}
                error={errors.email?.message}
                autoComplete="email"
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                autoComplete="new-password"
                helperText="Min 8 chars, 1 uppercase, 1 number, 1 special."
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                className="w-full mt-6"
                isLoading={isSubmitting || registerMutation.isPending}
              >
                Sign Up
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-surface-200 mt-2 pt-6">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="text-primary-400 hover:text-primary-300 font-medium hover:underline transition-colors"
              >
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
