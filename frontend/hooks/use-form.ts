'use client';

import { useState } from 'react';
import { z } from 'zod';

interface UseFormProps<T extends z.ZodType<any, any>> {
  schema: T;
  defaultValues: z.infer<T>;
}

export function useForm<T extends z.ZodType<any, any>>({
  schema,
  defaultValues,
}: UseFormProps<T>) {
  type FormValues = z.infer<T>;
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (name: keyof FormValues, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on edit
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const register = (name: keyof FormValues) => {
    return {
      name: name as string,
      value: (values[name] ?? '') as any,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setValue(name, e.target.value);
      },
    };
  };

  const handleSubmit = (onSubmit: (data: FormValues) => void | Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setErrors({});

      try {
        const parsed = schema.parse(values);
        await onSubmit(parsed);
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
          err.errors.forEach((issue) => {
            const path = issue.path[0] as keyof FormValues;
            if (path) {
              fieldErrors[path] = issue.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          console.error('Unhandled form submit error:', err);
        }
      } finally {
        setIsSubmitting(false);
      }
    };
  };

  const reset = () => {
    setValues(defaultValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    register,
    handleSubmit,
    setValue,
    reset,
  };
}

export default useForm;
