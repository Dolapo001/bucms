'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from '@/hooks/use-form';
import { authService } from '@/services/auth';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid university email' }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, errors, isSubmitting } = useForm<typeof forgotPasswordSchema>({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await authService.requestPasswordReset(data.email);
      setSuccessMessage('Password reset link has been dispatched to your inbox.');
    } catch (err: any) {
      setErrorMessage(err.message || 'System failed to register request. Double check your email.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md flex flex-col gap-8 z-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="w-16 h-16 rounded-2xl bg-primary-800 dark:bg-gold-500 flex items-center justify-center text-white dark:text-primary-950 font-bold text-2xl shadow-premium">
            BU
          </Link>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-sans text-surface-900 dark:text-white uppercase tracking-wider">
              Request Reset Link
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 font-display italic">
              Bowen University Chapel Management System
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 shadow-premium p-8 rounded-2xl flex flex-col gap-6">
          {errorMessage && <Alert variant="error" description={errorMessage} />}
          {successMessage && <Alert variant="success" description={successMessage} />}

          <p className="text-sm text-surface-500 leading-relaxed text-center">
            Enter your university email address. If an account is associated with it, you will receive a secured link to verify and reset your credentials.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="student@bowen.edu.ng"
              error={errors.email}
              {...register('email')}
              leftIcon={<span>✉️</span>}
            />

            <Button
              type="submit"
              variant="gold"
              className="w-full py-3.5 mt-2"
              isLoading={isSubmitting}
            >
              Dispatch Recovery Link
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-surface-500 dark:text-surface-400">
          Remember credentials?{' '}
          <Link
            href="/login"
            className="font-bold text-gold-600 hover:text-gold-500 dark:text-gold-400 dark:hover:text-gold-300 hover:underline"
          >
            Sign In to Portal
          </Link>
        </p>
      </div>
    </main>
  );
}
