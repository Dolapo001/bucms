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

interface Announcement {
  id: number;
  title: string;
  category: 'GENERAL' | 'ACADEMIC' | 'SPIRITUAL' | 'EMERGENCY';
  content: string;
  is_pinned: boolean;
  created_at: string;
}

const annSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  category: z.enum(['GENERAL', 'ACADEMIC', 'SPIRITUAL', 'EMERGENCY'], {
    errorMap: () => ({ message: 'Please select a valid notice category' }),
  }),
  content: z.string().min(10, { message: 'Notice details must be at least 10 characters' }),
  is_pinned: z.boolean().default(false),
});

type AnnValues = z.infer<typeof annSchema>;

export default function AdminAnnouncementsPage() {
  const [search, setSearch] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, title: 'First Semester Examination Midweek Prayer Vigil', category: 'GENERAL', content: 'In preparation for the upcoming examinations, the university chapel will host an institutional prayer vigil.', is_pinned: true, created_at: '2026-05-27' },
    { id: 2, title: 'Launch of New BUCMS Digital Sermons Archive', category: 'SPIRITUAL', content: 'The Bowen Chapel is thrilled to announce the roll-out of the Bowen University Chapel Management System.', is_pinned: false, created_at: '2026-05-26' },
  ]);

  const [activeAnn, setActiveAnn] = useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const { register, handleSubmit, errors, isSubmitting, reset, setValue, values } = useForm<typeof annSchema>({
    schema: annSchema,
    defaultValues: {
      title: activeAnn?.title || '',
      category: activeAnn?.category || 'GENERAL',
      content: activeAnn?.content || '',
      is_pinned: activeAnn?.is_pinned || false,
    },
  });

  const handleOpenCreate = () => {
    setActiveAnn(null);
    reset();
    setModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setActiveAnn(ann);
    setValue('title', ann.title);
    setValue('category', ann.category);
    setValue('content', ann.content);
    setValue('is_pinned', ann.is_pinned);
    setModalOpen(true);
  };

  const onSubmit = (data: AnnValues) => {
    if (activeAnn) {
      setAnnouncements(prev =>
        prev.map(a => (a.id === activeAnn.id ? { ...a, ...data } : a))
      );
      setAlertMessage('Notice updated on central board successfully!');
    } else {
      const newAnn: Announcement = {
        id: Date.now(),
        created_at: new Date().toISOString().split('T')[0],
        ...data,
      };
      setAnnouncements(prev => [newAnn, ...prev]);
      setAlertMessage('Notice pinned and broadcasted successfully!');
    }
    setModalOpen(false);
    reset();
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const handleDelete = (id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    setDeleteId(null);
    setAlertMessage('Notice removed from central board.');
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const filtered = announcements.filter(a => {
    return a.title.toLowerCase().includes(search.toLowerCase()) ||
           a.category.toLowerCase().includes(search.toLowerCase());
  });

  const categoryOptions = [
    { value: 'GENERAL', label: 'General Announcement' },
    { value: 'ACADEMIC', label: 'Academic Directive' },
    { value: 'SPIRITUAL', label: 'Spiritual Events notice' },
    { value: 'EMERGENCY', label: 'Emergency Alert notice' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-surface-900 dark:text-white font-sans">
            Notice Board CMS
          </h2>
          <p className="text-xs text-surface-500">
            Post institutional announcements, pin exams vigils directives, and upload notice graphics banners.
          </p>
        </div>
        <Button variant="gold" onClick={handleOpenCreate} className="text-xs uppercase font-bold tracking-wider">
          ➕ Publish Notice
        </Button>
      </div>

      {alertMessage && <Alert variant="success" description={alertMessage} />}

      {/* Filter and Table */}
      <div className="flex flex-col gap-6">
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Search notices or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No Announcements Found"
            description="No chapel announcements matched your search filters."
            actionLabel="Post First Announcement"
            onAction={handleOpenCreate}
          />
        ) : (
          <Table headers={['Notice Details', 'Category', 'Pinned Board', 'Posted Date', 'Actions']}>
            {filtered.map(a => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-surface-900 dark:text-white">{a.title}</span>
                    <span className="text-[10px] text-surface-400 font-semibold truncate max-w-[240px]">{a.content}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={a.category === 'SPIRITUAL' ? 'primary' : a.category === 'GENERAL' ? 'gold' : 'danger'}>
                    {a.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  {a.is_pinned ? (
                    <span className="text-xs font-bold text-gold-500">📌 Pinned</span>
                  ) : (
                    <span className="text-xs text-surface-400">Regular Feed</span>
                  )}
                </TableCell>
                <TableCell>{a.created_at}</TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenEdit(a)}
                      className="text-xs font-bold text-gold-500 hover:text-gold-650"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(a.id)}
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={activeAnn ? 'Modify Board Notice' : 'Publish Institutional Announcement'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Notice Headline"
              placeholder="e.g. Prayer Vigil Guidelines"
              error={errors.title}
              {...register('title')}
            />
            <Select
              label="Notice Category"
              options={categoryOptions}
              error={errors.category}
              {...register('category')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">Notice Contents</label>
            <textarea
              placeholder="Full details of the announcement..."
              className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-800 text-sm focus:outline-none focus:border-gold-500 bg-transparent min-h-[100px] resize-none"
              {...register('content')}
            />
            {errors.content && <span className="text-xs text-red-500 font-semibold">{errors.content}</span>}
          </div>

          {/* Pin switch */}
          <div className="flex items-center gap-3 bg-surface-50 dark:bg-surface-950/20 p-4 rounded-xl border border-surface-150/40">
            <input
              type="checkbox"
              id="is_pinned"
              checked={values.is_pinned}
              onChange={(e) => setValue('is_pinned', e.target.checked)}
              className="w-4.5 h-4.5 rounded border-surface-300 text-gold-500 focus:ring-gold-500/20 cursor-pointer"
            />
            <label htmlFor="is_pinned" className="text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider cursor-pointer">
              📌 Pin this announcement to top of dashboard notices feed
            </label>
          </div>

          {/* Banner Graphic Dropzone */}
          <div className="mt-2">
            <FileUpload
              label="Upload Cover graphic (JPEG/PNG) - Optional"
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
              {activeAnn ? 'Save Updates' : 'Pin Notice'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirm Deletion" size="sm">
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Are you sure you want to delete this notice off the central notice board? This will remove it from all member dashboards instantly.
          </p>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>Confirm Deletion</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
