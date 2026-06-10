'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from '@/hooks/use-form';
import { useApp } from '@/store/app-context';
import { authService } from '@/services/auth';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, errors, isSubmitting } = useForm<typeof loginSchema>({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setErrorMessage(null);
    try {
      // Direct integration with Django REST JWT backend
      const response = await authService.login({
        email: data.email,
        password: data.password
      });
      login(response.access, response.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Incorrect credentials. Please verify your email and password.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-primary-800/5 dark:bg-gold-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-gold-500/5 dark:bg-primary-500/5 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md flex flex-col gap-8 z-10">
        {/* Brand Banner */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="w-16 h-16 rounded-2xl bg-primary-800 dark:bg-gold-500 flex items-center justify-center text-white dark:text-primary-950 font-bold text-2xl shadow-premium">
            BU
          </Link>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-sans text-surface-900 dark:text-white uppercase tracking-wider">
              Chapel Portal Login
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 font-display italic">
              Bowen University Chapel Management System
            </p>
          </div>
        </div>

        {/* Login Form Container Card */}
        <div className="bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 shadow-premium p-8 rounded-2xl flex flex-col gap-6">
          {errorMessage && (
            <Alert variant="error" description={errorMessage} />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Bowen University Email"
              type="email"
              placeholder="yourname@bowen.edu.ng"
              error={errors.email}
              {...register('email')}
              leftIcon={<span>👤</span>}
            />

            <div className="flex flex-col gap-1.5">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password}
                {...register('password')}
                leftIcon={<span>🔑</span>}
              />
              <div className="flex justify-end mt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-gold-600 hover:text-gold-500 dark:text-gold-400 dark:hover:text-gold-300"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full py-3.5 mt-2"
              isLoading={isSubmitting}
            >
              Sign In to Portal
            </Button>
          </form>
        </div>

        {/* Register navigation footer */}
        <p className="text-center text-xs text-surface-500 dark:text-surface-400">
          New to the Chapel system?{' '}
          <Link
            href="/register"
            className="font-bold text-gold-600 hover:text-gold-500 dark:text-gold-400 dark:hover:text-gold-300 hover:underline"
          >
            Create a Member Account
          </Link>
        </p>
      </div>
    </main>
  );
}
