'use client';

import React, { useState, useEffect } from 'react';
import { announcementService } from '@/services/announcements';
import { Announcement } from '@/types';
import Card, { CardBody } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Input from '@/components/ui/input';
import EmptyState from '@/components/ui/empty-state';
import Loader from '@/components/ui/loader';

export default function AnnouncementsPage() {
  const [search, setSearch] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic API fetching when search changes
  useEffect(() => {
    let active = true;
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        const res = await announcementService.getAnnouncements({ search });
        if (active) {
          setAnnouncements(res.results);
        }
      } catch (err: any) {
        if (active) {
          setErrorMessage(err.message || 'Unable to sync notice board with Bowen servers.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchAnnouncements();
    }, 400);

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [search]);

  return (
    <div className="bg-surface-50 dark:bg-surface-950 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Banner */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-500">Notice Board</span>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white font-sans">
            Chapel Announcements
          </h1>
          <p className="text-sm text-surface-500 leading-relaxed max-w-xl">
            Keep track of corporate chapel notifications, administrative notices, and event updates.
          </p>
        </div>

        {/* Filters */}
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader size="md" />
            <p className="text-xs text-surface-500 font-medium">Loading notice board...</p>
          </div>
        )}

        {/* Error Alert */}
        {!isLoading && errorMessage && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
            <CardBody className="flex flex-col items-center py-8 gap-2">
              <span className="text-2xl">⚠️</span>
              <h4 className="text-xs font-bold text-red-800 uppercase tracking-widest">Connection Failure</h4>
              <p className="text-xs text-red-650">{errorMessage}</p>
            </CardBody>
          </Card>
        )}

        {/* Announcements List */}
        {!isLoading && !errorMessage && (
          <div className="flex flex-col gap-6">
            {announcements.length === 0 ? (
              <EmptyState
                title="No Notices Found"
                description="No announcements matched your search terms. Try refining your search query."
                actionLabel="Clear Search"
                onAction={() => setSearch('')}
              />
            ) : (
              announcements.map((ann) => (
                <Card key={ann.id} hoverEffect animate className="relative border-l-4 border-l-gold-500 bg-white dark:bg-surface-900">
                  <CardBody className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="gold">
                        Notice
                      </Badge>
                      <div className="flex items-center gap-3 text-xs text-surface-400">
                        <span>Posted on {new Date(ann.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        {ann.is_pinned && <Badge variant="gold">📌 Pinned</Badge>}
                      </div>
                    </div>
                    <h2 className="text-lg font-bold text-surface-900 dark:text-white leading-snug">
                      {ann.title}
                    </h2>
                    <div className="text-sm text-surface-650 dark:text-surface-400 leading-relaxed whitespace-pre-wrap">
                      {ann.content}
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
