'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from '@/hooks/use-form';
import Card, { CardBody } from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

const contactSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid university email' }),
  category: z.enum(['COUNSEL', 'PRAYER', 'ADMIN'], {
    errorMap: () => ({ message: 'Please select a valid request category' }),
  }),
  message: z.string().min(10, { message: 'Message details must be at least 10 characters' }),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, errors, isSubmitting, reset } = useForm<typeof contactSchema>({
    schema: contactSchema,
    defaultValues: {
      fullName: '',
      email: '',
      category: 'PRAYER',
      message: '',
    },
  });

  const onSubmit = (data: ContactValues) => {
    setSuccess('Thank you! Your request/feedback has been sent. The chapel counseling team will reach out shortly.');
    reset();
    setTimeout(() => setSuccess(null), 5000);
  };

  const categories = [
    { value: 'PRAYER', label: 'Prayer Request' },
    { value: 'COUNSEL', label: 'Counseling Appointment' },
    { value: 'ADMIN', label: 'General / Administrative Support' },
  ];

  return (
    <div className="bg-surface-50 dark:bg-surface-950 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-10">
        {/* Contact Info Sidebar */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-500">Get in Touch</span>
            <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white font-sans">
              Contact & Counseling Support
            </h1>
            <p className="text-sm text-surface-500 leading-relaxed">
              Submit your private prayer requests, schedule professional counseling, or seek administrative help from the Bowen Chapel Team.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <div className="p-4 bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 rounded-xl flex items-start gap-3.5">
              <span className="text-xl">📍</span>
              <div className="flex flex-col text-xs leading-relaxed text-surface-650">
                <span className="font-bold text-surface-900 dark:text-white">Chapel Headquarters</span>
                <span>Bowen University Campus, Iwo, Osun State, Nigeria</span>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 rounded-xl flex items-start gap-3.5">
              <span className="text-xl">✉️</span>
              <div className="flex flex-col text-xs leading-relaxed text-surface-650">
                <span className="font-bold text-surface-900 dark:text-white">Direct Correspondence</span>
                <span>chapel@bowen.edu.ng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="flex-1 max-w-md w-full">
          <Card className="bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 p-6 sm:p-8">
            <h3 className="text-base font-bold text-surface-900 dark:text-white mb-6 uppercase tracking-wider">
              Submit Request / Feedback
            </h3>

            {success && <Alert variant="success" description={success} className="mb-5" />}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Faith Oluwatobiloba"
                error={errors.fullName}
                {...register('fullName')}
              />

              <Input
                label="University Email"
                type="email"
                placeholder="student@bowen.edu.ng"
                error={errors.email}
                {...register('email')}
              />

              <Select
                label="Select Category"
                options={categories}
                error={errors.category}
                {...register('category')}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Request Details / Message
                </label>
                <textarea
                  placeholder="Describe your prayer request, counseling requirements, or questions..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-1 bg-white dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400 min-h-[100px] resize-none
                    ${errors.message 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-surface-200 dark:border-surface-800 focus:border-gold-500 focus:ring-gold-500/20'
                    }
                  `}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="text-xs font-semibold text-red-500 animate-fadeIn">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="gold"
                className="w-full py-3.5 mt-2"
                isLoading={isSubmitting}
              >
                Send Request
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
