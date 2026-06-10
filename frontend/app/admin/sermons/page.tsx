'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from '@/hooks/use-form';
import Card, { CardBody } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Table, { TableRow, TableCell } from '@/components/ui/table';
import Modal from '@/components/ui/modal';
import FileUpload from '@/components/forms/file-upload';
import Alert from '@/components/ui/alert';
import EmptyState from '@/components/ui/empty-state';

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  date: string;
  views: number;
  description: string;
}

const sermonSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  speaker: z.string().min(3, { message: 'Speaker name must be at least 3 characters' }),
  date: z.string().min(5, { message: 'Sermon date is required' }),
  description: z.string().min(10, { message: 'Sermon description must be at least 10 characters' }),
});

type SermonValues = z.infer<typeof sermonSchema>;

export default function AdminSermonsPage() {
  const [search, setSearch] = useState('');
  const [sermons, setSermons] = useState<Sermon[]>([
    { id: 1, title: 'Walking in the Light of Divine Wisdom', speaker: 'Rev. Dr. A. A. Olayinka', date: '2026-05-24', views: 342, description: 'Understanding the relationship between spiritual obedience and mental excellence on campus.' },
    { id: 2, title: 'The Discipline of Purposeful Focus', speaker: 'Pastor Mrs. D. O. Kolawole', date: '2026-05-17', views: 198, description: 'A dedicated address to all students on filtering distractions and pursuing outstanding academic records.' },
  ]);

  const [activeSermon, setActiveSermon] = useState<Sermon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const { register, handleSubmit, errors, isSubmitting, reset, setValue } = useForm<typeof sermonSchema>({
    schema: sermonSchema,
    defaultValues: {
      title: activeSermon?.title || '',
      speaker: activeSermon?.speaker || '',
      date: activeSermon?.date || '',
      description: activeSermon?.description || '',
    },
  });

  const handleOpenCreate = () => {
    setActiveSermon(null);
    reset();
    setModalOpen(true);
  };

  const handleOpenEdit = (sermon: Sermon) => {
    setActiveSermon(sermon);
    setValue('title', sermon.title);
    setValue('speaker', sermon.speaker);
    setValue('date', sermon.date);
    setValue('description', sermon.description);
    setModalOpen(true);
  };

  const onSubmit = (data: SermonValues) => {
    if (activeSermon) {
      // Edit
      setSermons(prev =>
        prev.map(s => (s.id === activeSermon.id ? { ...s, ...data } : s))
      );
      setAlertMessage('Sermon successfully updated!');
    } else {
      // Create new
      const newSermon: Sermon = {
        id: Date.now(),
        views: 0,
        ...data,
      };
      setSermons(prev => [newSermon, ...prev]);
      setAlertMessage('New sermon uploaded and broadcasted successfully!');
    }
    setModalOpen(false);
    reset();
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const handleDelete = (id: number) => {
    setSermons(prev => prev.filter(s => s.id !== id));
    setDeleteId(null);
    setAlertMessage('Sermon successfully deleted.');
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const filtered = sermons.filter(s => {
    return s.title.toLowerCase().includes(search.toLowerCase()) ||
           s.speaker.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-surface-900 dark:text-white font-sans">
            Sermon Archives CMS
          </h2>
          <p className="text-xs text-surface-500">
            Publish standard weekly audio messages, upload study guides, and track student listens.
          </p>
        </div>
        <Button variant="gold" onClick={handleOpenCreate} className="text-xs uppercase font-bold tracking-wider">
          ➕ Publish Sermon
        </Button>
      </div>

      {alertMessage && <Alert variant="success" description={alertMessage} />}

      {/* Search Filter and Table */}
      <div className="flex flex-col gap-6">
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Search by title or preacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No Sermons Found"
            description="No chapel sermons matched your search filters."
            actionLabel="Add New Sermon"
            onAction={handleOpenCreate}
          />
        ) : (
          <Table headers={['Sermon Details', 'Preacher', 'Date Published', 'Listens count', 'Actions']}>
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-surface-900 dark:text-white">{s.title}</span>
                    <span className="text-[10px] text-surface-400 font-semibold truncate max-w-[240px]">{s.description}</span>
                  </div>
                </TableCell>
                <TableCell>{s.speaker}</TableCell>
                <TableCell>{s.date}</TableCell>
                <TableCell>
                  <Badge variant="primary">{s.views} views</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="text-xs font-bold text-gold-500 hover:text-gold-650"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(s.id)}
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

      {/* CRUD Creation/Editing Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activeSermon ? 'Edit Sermon Profile' : 'Publish Weekly Sermon'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Sermon Title"
              placeholder="e.g. Walking in divine lights"
              error={errors.title}
              {...register('title')}
            />
            <Input
              label="Speaker / Preacher"
              placeholder="e.g. Rev. Dr. A. Olayinka"
              error={errors.speaker}
              {...register('speaker')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date Preached"
              type="date"
              error={errors.date}
              {...register('date')}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">Sermon Summary</label>
              <textarea
                placeholder="Details of the sermon..."
                className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-800 text-sm focus:outline-none focus:border-gold-500 bg-transparent min-h-[80px] resize-none"
                {...register('description')}
              />
              {errors.description && <span className="text-xs text-red-500 font-semibold">{errors.description}</span>}
            </div>
          </div>

          {/* Files drag and drop areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            <FileUpload
              label="Upload Audio File (MP3)"
              accept="audio/*"
              maxSizeMB={20}
              onFileSelect={() => {}}
              previewType="audio"
            />
            <FileUpload
              label="Upload Study Outline (PDF)"
              accept=".pdf"
              maxSizeMB={5}
              onFileSelect={() => {}}
              previewType="pdf"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-surface-100 dark:border-surface-800/40 pt-5 mt-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" isLoading={isSubmitting}>
              {activeSermon ? 'Save Updates' : 'Publish Audio'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirm Deletion" size="sm">
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Are you absolutely sure you want to delete this sermon from the central database? This action is permanent and will prevent students from listening.
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
