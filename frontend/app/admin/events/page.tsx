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
import FileUpload from '@/components/forms/file-upload';
import Alert from '@/components/ui/alert';
import EmptyState from '@/components/ui/empty-state';

interface Program {
  id: number;
  title: string;
  location: string;
  start_time: string;
  recurrence: 'ONCE' | 'WEEKLY' | 'MONTHLY';
  banner: string;
}

const eventSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  location: z.string().min(3, { message: 'Location must be specified' }),
  start_time: z.string().min(5, { message: 'Start time is required' }),
  recurrence: z.enum(['ONCE', 'WEEKLY', 'MONTHLY'], {
    errorMap: () => ({ message: 'Please select recurrence interval' }),
  }),
});

type EventValues = z.infer<typeof eventSchema>;

export default function AdminEventsPage() {
  const [search, setSearch] = useState('');
  const [programs, setPrograms] = useState<Program[]>([
    { id: 1, title: 'Midweek Worship & Fellowship Encounter', location: 'University Worship Sanctuary', start_time: '2026-05-28T16:00', recurrence: 'WEEKLY', banner: '🎶' },
    { id: 2, title: 'Sunday Spiritual Refuel Convocation', location: 'University Worship Sanctuary', start_time: '2026-05-31T08:00', recurrence: 'WEEKLY', banner: '⛪' },
  ]);

  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const { register, handleSubmit, errors, isSubmitting, reset, setValue } = useForm<typeof eventSchema>({
    schema: eventSchema,
    defaultValues: {
      title: activeProgram?.title || '',
      location: activeProgram?.location || '',
      start_time: activeProgram?.start_time || '',
      recurrence: activeProgram?.recurrence || 'WEEKLY',
    },
  });

  const handleOpenCreate = () => {
    setActiveProgram(null);
    reset();
    setModalOpen(true);
  };

  const handleOpenEdit = (prog: Program) => {
    setActiveProgram(prog);
    setValue('title', prog.title);
    setValue('location', prog.location);
    setValue('start_time', prog.start_time.substring(0, 16));
    setValue('recurrence', prog.recurrence);
    setModalOpen(true);
  };

  const onSubmit = (data: EventValues) => {
    if (activeProgram) {
      setPrograms(prev =>
        prev.map(p => (p.id === activeProgram.id ? { ...p, ...data } : p))
      );
      setAlertMessage('Program calendar successfully updated!');
    } else {
      const newProgram: Program = {
        id: Date.now(),
        banner: data.recurrence === 'WEEKLY' ? '⛪' : '✨',
        ...data,
      };
      setPrograms(prev => [newProgram, ...prev]);
      setAlertMessage('New program published successfully!');
    }
    setModalOpen(false);
    reset();
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const handleDelete = (id: number) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
    setAlertMessage('Program calendar deleted successfully.');
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const filtered = programs.filter(p => {
    return p.title.toLowerCase().includes(search.toLowerCase()) ||
           p.location.toLowerCase().includes(search.toLowerCase());
  });

  const recurrenceOptions = [
    { value: 'ONCE', label: 'One Time Event (Once)' },
    { value: 'WEEKLY', label: 'Recurring Weekly' },
    { value: 'MONTHLY', label: 'Recurring Monthly' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-surface-900 dark:text-white font-sans">
            Chapel Schedule CMS
          </h2>
          <p className="text-xs text-surface-500">
            Publish weekly convocations, student fellowship schedules, and configure recurrence tags.
          </p>
        </div>
        <Button variant="gold" onClick={handleOpenCreate} className="text-xs uppercase font-bold tracking-wider">
          ➕ Publish Program
        </Button>
      </div>

      {alertMessage && <Alert variant="success" description={alertMessage} />}

      {/* Filter and Table */}
      <div className="flex flex-col gap-6">
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Search by program or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No Programs Found"
            description="No scheduled programs matched your search filters."
            actionLabel="Add Chapel Service"
            onAction={handleOpenCreate}
          />
        ) : (
          <Table headers={['Event Details', 'Location', 'Schedule Time', 'Recurrence', 'Actions']}>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{p.banner}</span>
                    <span className="font-bold text-surface-900 dark:text-white">{p.title}</span>
                  </div>
                </TableCell>
                <TableCell>{p.location}</TableCell>
                <TableCell>
                  {new Date(p.start_time).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
                  {new Date(p.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell>
                  <Badge variant={p.recurrence === 'ONCE' ? 'secondary' : 'gold'}>{p.recurrence}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="text-xs font-bold text-gold-500 hover:text-gold-650"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-650"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </div>

      {/* Modal Dialog */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={activeProgram ? 'Modify Program' : 'Publish New Chapel Service'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Program Title"
              placeholder="e.g. Sunday Refuel Assembly"
              error={errors.title}
              {...register('title')}
            />
            <Input
              label="Location Sanctuary"
              placeholder="e.g. Worship Sanctuary Annex B"
              error={errors.location}
              {...register('location')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Event Start Date & Time"
              type="datetime-local"
              error={errors.start_time}
              {...register('start_time')}
            />
            <Select
              label="Recurrence Mode"
              options={recurrenceOptions}
              error={errors.recurrence}
              {...register('recurrence')}
            />
          </div>

          {/* Banner Graphic Dropzone */}
          <div className="mt-2">
            <FileUpload
              label="Upload Banner Graphic (JPEG/PNG)"
              accept="image/*"
              maxSizeMB={5}
              onFileSelect={() => {}}
              previewType="image"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-surface-100 dark:border-surface-800/40 pt-5 mt-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" isLoading={isSubmitting}>
              {activeProgram ? 'Save Changes' : 'Schedule Program'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirm Deletion" size="sm">
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Are you sure you want to cancel and delete this chapel program schedule? This will pull it off student calendars instantly.
          </p>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>Confirm Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
