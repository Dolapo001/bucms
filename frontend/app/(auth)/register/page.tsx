'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from '@/hooks/use-form';
import { authService } from '@/services/auth';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

const registerSchema = z.object({
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  matric_number: z.string().optional().refine((val) => !val || /^BU\d{2}[A-Z]{3}\d{4}$/i.test(val), {
    message: 'Matric number must follow Bowen format: e.g. BU21ICT1005',
  }),
  email: z.string().email({ message: 'Please enter a valid university email' }),
  username: z.string().min(4, { message: 'Username must be at least 4 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, errors, isSubmitting } = useForm<typeof registerSchema>({
    schema: registerSchema,
    defaultValues: {
      first_name: '',
      last_name: '',
      matric_number: '',
      email: '',
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      // Backend registration call
      await authService.register(data);
      setSuccessMessage('Registration successful! Redirecting you to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Username or email might already be in use.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-primary-800/5 dark:bg-gold-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-gold-500/5 dark:bg-primary-500/5 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-lg flex flex-col gap-8 z-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="w-16 h-16 rounded-2xl bg-primary-800 dark:bg-gold-500 flex items-center justify-center text-white dark:text-primary-950 font-bold text-2xl shadow-premium">
            BU
          </Link>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-sans text-surface-900 dark:text-white uppercase tracking-wider">
              Create Member Account
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 font-display italic">
              Bowen University Chapel Management System
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 shadow-premium p-8 rounded-2xl flex flex-col gap-6">
          {errorMessage && <Alert variant="error" description={errorMessage} />}
          {successMessage && <Alert variant="success" description={successMessage} />}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                placeholder="e.g. Faith"
                error={errors.first_name}
                {...register('first_name')}
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="e.g. Oluwatobiloba"
                error={errors.last_name}
                {...register('last_name')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Matric Number"
                type="text"
                placeholder="e.g. BU21ICT1005 (Optional)"
                error={errors.matric_number}
                {...register('matric_number')}
              />
              <Input
                label="University Email"
                type="email"
                placeholder="e.g. student@bowen.edu.ng"
                error={errors.email}
                {...register('email')}
              />
            </div>

            <Input
              label="Choose Username"
              type="text"
              placeholder="e.g. faith123"
              error={errors.username}
              {...register('username')}
              leftIcon={<span>👤</span>}
            />

            <Input
              label="Choose Password"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              {...register('password')}
              leftIcon={<span>🔑</span>}
            />

            <Button
              type="submit"
              variant="gold"
              className="w-full py-3.5 mt-2"
              isLoading={isSubmitting}
            >
              Submit Registration
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-surface-500 dark:text-surface-400">
          Already have an account?{' '}
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
