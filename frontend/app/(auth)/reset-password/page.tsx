'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from '@/hooks/use-form';
import { authService } from '@/services/auth';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password confirmation must be at least 6 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const tokenParam = searchParams.get('token') || '';

  const { register, handleSubmit, errors, isSubmitting } = useForm<typeof resetPasswordSchema>({
    schema: resetPasswordSchema,
    defaultValues: {
      token: tokenParam,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await authService.resetPassword({
        token: data.token,
        password: data.password,
      });
      setSuccessMessage('Credentials successfully updated. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'System failed to update credentials. Reset link may have expired.');
    }
  };

  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 shadow-premium p-8 rounded-2xl flex flex-col gap-6">
      {errorMessage && <Alert variant="error" description={errorMessage} />}
      {successMessage && <Alert variant="success" description={successMessage} />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Reset Verification Token"
          type="text"
          placeholder="Paste security code from inbox"
          error={errors.token}
          {...register('token')}
          leftIcon={<span>🔑</span>}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          error={errors.password}
          {...register('password')}
          leftIcon={<span>🔒</span>}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
          leftIcon={<span>🔒</span>}
        />

        <Button
          type="submit"
          variant="gold"
          className="w-full py-3.5 mt-2"
          isLoading={isSubmitting}
        >
          Update Credentials
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md flex flex-col gap-8 z-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="w-16 h-16 rounded-2xl bg-primary-800 dark:bg-gold-500 flex items-center justify-center text-white dark:text-primary-950 font-bold text-2xl shadow-premium">
            BU
          </Link>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-sans text-surface-900 dark:text-white uppercase tracking-wider">
              Establish New Credentials
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 font-display italic">
              Bowen University Chapel Management System
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 shadow-premium p-8 rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-gold-500 border-b-primary-800 border-r-transparent border-l-transparent border-3" />
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest">Loading Reset Form...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
