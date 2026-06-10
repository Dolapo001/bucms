'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from '@/hooks/use-form';
import Card, { CardBody } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Table, { TableRow, TableCell } from '@/components/ui/table';
import Modal from '@/components/ui/modal';
import Alert from '@/components/ui/alert';
import EmptyState from '@/components/ui/empty-state';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  matric_number?: string;
  email: string;
  role: 'MEMBER' | 'ADMIN';
  username: string;
}

const userSchema = z.object({
  first_name: z.string().min(2, { message: 'First name is required' }),
  last_name: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid university email' }),
  matric_number: z.string().optional().refine((val) => !val || /^BU\d{2}[A-Z]{3}\d{4}$/i.test(val), {
    message: 'Matric number must follow Bowen format: e.g. BU21ICT1005',
  }),
  role: z.enum(['MEMBER', 'ADMIN'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
  username: z.string().min(4, { message: 'Username must be at least 4 characters' }),
});

type UserValues = z.infer<typeof userSchema>;

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([
    { id: 1, first_name: 'Chapel', last_name: 'Administrator', email: 'admin@bowen.edu.ng', role: 'ADMIN', username: 'admin' },
    { id: 2, first_name: 'Faith', last_name: 'Oluwatobiloba', matric_number: 'BU21ICT1005', email: 'student@bowen.edu.ng', role: 'MEMBER', username: 'member' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const { register, handleSubmit, errors, isSubmitting, reset } = useForm<typeof userSchema>({
    schema: userSchema,
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      matric_number: '',
      role: 'MEMBER',
      username: '',
    },
  });

  const handleOpenCreate = () => {
    reset();
    setModalOpen(true);
  };

  const onSubmit = (data: UserValues) => {
    const newUser: User = {
      id: Date.now(),
      ...data,
    };
    setUsers(prev => [...prev, newUser]);
    setAlertMessage('New member profile created successfully!');
    setModalOpen(false);
    reset();
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const handleToggleRole = (id: number) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, role: u.role === 'ADMIN' ? 'MEMBER' : 'ADMIN' } : u))
    );
    setAlertMessage('User role modified successfully!');
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteId(null);
    setAlertMessage('User profile deleted.');
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const filtered = users.filter(u => {
    return u.first_name.toLowerCase().includes(search.toLowerCase()) ||
           u.last_name.toLowerCase().includes(search.toLowerCase()) ||
           (u.matric_number && u.matric_number.toLowerCase().includes(search.toLowerCase())) ||
           u.email.toLowerCase().includes(search.toLowerCase());
  });

  const roleOptions = [
    { value: 'MEMBER', label: 'Student Member (MEMBER)' },
    { value: 'ADMIN', label: 'Chapel Administrator (ADMIN)' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-surface-900 dark:text-white font-sans">
            User Directory CMS
          </h2>
          <p className="text-xs text-surface-500">
            View registered student records, elevate administrative roles, and add new student accounts.
          </p>
        </div>
        <Button variant="gold" onClick={handleOpenCreate} className="text-xs uppercase font-bold tracking-wider">
          ➕ Register User
        </Button>
      </div>

      {alertMessage && <Alert variant="success" description={alertMessage} />}

      {/* Filter and Table */}
      <div className="flex flex-col gap-6">
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Search by name, email, or matric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No Members Found"
            description="No user account profile matched your search criteria."
            actionLabel="Register Member"
            onAction={handleOpenCreate}
          />
        ) : (
          <Table headers={['Member Name', 'Matriculation', 'Email Address', 'Chapel Role', 'Actions']}>
            {filtered.map(u => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-surface-900 dark:text-white">{u.first_name} {u.last_name}</span>
                    <span className="text-[10px] text-surface-400 font-semibold">@{u.username}</span>
                  </div>
                </TableCell>
                <TableCell>{u.matric_number || 'N/A (Staff/Admin)'}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === 'ADMIN' ? 'gold' : 'primary'}>{u.role}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleToggleRole(u.id)}
                      className="text-xs font-bold text-gold-500 hover:text-gold-650"
                    >
                      🔄 Toggle Role
                    </button>
                    {u.id !== 1 && (
                      <button
                        onClick={() => setDeleteId(u.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-650"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </div>

      {/* Register User Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register Chapel Member" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="e.g. Faith"
              error={errors.first_name}
              {...register('first_name')}
            />
            <Input
              label="Last Name"
              placeholder="e.g. Oluwatobiloba"
              error={errors.last_name}
              {...register('last_name')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Matric Number (If Student)"
              placeholder="e.g. BU21ICT1005"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Username"
              placeholder="e.g. faith123"
              error={errors.username}
              {...register('username')}
            />
            <Select
              label="Chapel Portal Role"
              options={roleOptions}
              error={errors.role}
              {...register('role')}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-surface-100 dark:border-surface-800/40 pt-5 mt-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" isLoading={isSubmitting}>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirm Deletion" size="sm">
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Are you absolutely sure you want to delete this profile? Students will lose access to their portal accounts immediately.
          </p>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>Confirm Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
