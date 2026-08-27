import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import AuthService from '@/services/auth.service';
import { ROUTES } from '@/constants';
import { getErrorMessage } from '@/utils';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetMutation = useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success('Reset link sent to your email.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    resetMutation.mutate(data.email);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md animate-slide-up">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-surface-200 flex items-center justify-center text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              {isSubmitted 
                ? "Check your email for a reset link." 
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="player@maze.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                
                <Button
                  type="submit"
                  className="w-full mt-4"
                  isLoading={isSubmitting || resetMutation.isPending}
                >
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setIsSubmitted(false)}
              >
                Try another email
              </Button>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t border-surface-200 mt-2 pt-6">
            <Link
              to={ROUTES.LOGIN}
              className="text-sm text-primary-400 hover:text-primary-300 font-medium hover:underline transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
