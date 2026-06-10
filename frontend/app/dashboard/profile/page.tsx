'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from '@/hooks/use-form';
import { useApp } from '@/store/app-context';
import { userService } from '@/services/users';
import Card, { CardBody, CardHeader } from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import FileUpload from '@/components/forms/file-upload';

const profileSchema = z.object({
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid university email' }),
  matric_no: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useApp();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, errors, isSubmitting } = useForm<typeof profileSchema>({
    schema: profileSchema,
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      matric_no: user?.matric_no || '',
    },
  });

  const onSubmit = async (data: ProfileValues) => {
    setSuccess(null);
    setError(null);
    try {
      // Connect to real PATCH /users/me/ backend API
      const updated = await userService.updateProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      });
      updateUser(updated);
      setSuccess('Profile details successfully updated on BUCMS servers!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to sync update details with server.');
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    setSuccess(null);
    setError(null);
    try {
      // Perform multi-part profile image upload directly to Cloudinary/local storage via Django
      const updated = await userService.uploadProfilePicture(file);
      updateUser({ profile_picture: updated.profile_picture });
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || 'File upload failed. Ensure image complies with size limits.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="border-b border-surface-200/60 dark:border-surface-800/60 pb-5">
        <h2 className="text-xl font-extrabold text-surface-900 dark:text-white">Profile settings</h2>
        <p className="text-xs text-surface-500 mt-1">Configure your personal records, matriculation credentials, and profile image.</p>
      </div>

      {success && <Alert variant="success" description={success} />}
      {error && <Alert variant="error" description={error} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left pane: Avatar Upload */}
        <div className="md:col-span-1">
          <Card className="bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50">
            <CardBody className="flex flex-col items-center gap-6">
              {/* Profile image display */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gold-500 shadow-md flex items-center justify-center bg-gold-50 dark:bg-gold-950/20 text-gold-600 font-bold text-3xl uppercase">
                {user?.profile_picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.first_name?.[0] || 'M'
                )}
              </div>

              <div className="text-center flex flex-col gap-0.5">
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase leading-none">
                  {user?.first_name} {user?.last_name}
                </h3>
                <span className="text-[10px] text-surface-400 font-semibold tracking-wider mt-1">{user?.matric_no || 'No Matric No'}</span>
              </div>

              <div className="w-full h-px bg-surface-100 dark:bg-surface-800" />

              <FileUpload
                label="Update Photo"
                accept="image/*"
                maxSizeMB={2}
                onFileSelect={handleProfilePictureUpload}
                previewType="image"
              />
            </CardBody>
          </Card>
        </div>

        {/* Right pane: Details Form */}
        <div className="md:col-span-2">
          <Card className="bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50">
            <CardHeader>
              <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                Personal Credentials
              </h3>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    error={errors.first_name}
                    {...register('first_name')}
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    error={errors.last_name}
                    {...register('last_name')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Matric Number"
                    type="text"
                    disabled
                    error={errors.matric_no}
                    {...register('matric_no')}
                    helperText="Matric number cannot be modified online. Contact admin."
                  />
                  <Input
                    label="University Email"
                    type="email"
                    error={errors.email}
                    {...register('email')}
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full py-3.5 mt-2"
                  isLoading={isSubmitting}
                >
                  Save Profile Settings
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
