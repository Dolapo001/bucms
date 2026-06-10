'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { analyticsService } from '@/services/analytics';
import { AnalyticsStats } from '@/types';
import Card, { CardBody, CardHeader } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Loader from '@/components/ui/loader';

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        const stats = await analyticsService.getStats();
        if (active) {
          setData(stats);
        }
      } catch (err: any) {
        if (active) {
          setErrorMessage(err.message || 'Failed to sync admin console analytics.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchAnalytics();
    return () => {
      active = false;
    };
  }, []);

  const formatActivityTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-surface-900 dark:text-white font-sans">
            Institutional CMS Console
          </h2>
          <p className="text-xs text-surface-500">
            Monitor member registration, upload chapel audios, edit program calendars, and coordinate spiritual notices.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center py-12 gap-3">
          <Loader size="md" />
          <p className="text-sm text-surface-500 font-medium">Synchronizing administration console...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMessage && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
          <CardBody className="flex flex-col items-center py-8 gap-3 text-center">
            <span className="text-2xl">⚠️</span>
            <h4 className="text-sm font-bold text-red-800 uppercase tracking-widest">Analytics Connection Failure</h4>
            <p className="text-xs text-red-650 max-w-md">{errorMessage}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="text-xs mt-2">
              Refresh Feed
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Dynamic Data Content */}
      {!isLoading && !errorMessage && data && (
        <>
          {/* 2. Analytical Stat Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Card hoverEffect className="bg-white dark:bg-surface-900">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-950/20 text-gold-600 dark:text-gold-400 flex items-center justify-center text-xl">
                  👥
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-surface-900 dark:text-white">
                    {data.total_members}
                  </span>
                  <span className="text-xs text-surface-555 dark:text-surface-450 font-semibold uppercase tracking-wider">Members</span>
                </div>
              </CardBody>
            </Card>

            <Card hoverEffect className="bg-white dark:bg-surface-900">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-650 dark:text-primary-400 flex items-center justify-center text-xl">
                  📖
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-surface-900 dark:text-white">
                    {data.total_sermons}
                  </span>
                  <span className="text-xs text-surface-555 dark:text-surface-450 font-semibold uppercase tracking-wider">Audio Sermons</span>
                </div>
              </CardBody>
            </Card>

            <Card hoverEffect className="bg-white dark:bg-surface-900">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-455 flex items-center justify-center text-xl">
                  📢
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-surface-900 dark:text-white">
                    {data.total_announcements}
                  </span>
                  <span className="text-xs text-surface-555 dark:text-surface-450 font-semibold uppercase tracking-wider">Announcements</span>
                </div>
              </CardBody>
            </Card>

            <Card hoverEffect className="bg-white dark:bg-surface-900">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 flex items-center justify-center text-xl">
                  📅
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-surface-900 dark:text-white">
                    {data.total_events}
                  </span>
                  <span className="text-xs text-surface-555 dark:text-surface-450 font-semibold uppercase tracking-wider">Chapel Events</span>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 3. CRUD Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/admin/sermons" className="w-full">
              <Button variant="gold" className="w-full py-4 text-xs uppercase tracking-wider font-bold">
                ➕ Upload Sermon
              </Button>
            </Link>
            <Link href="/admin/events" className="w-full">
              <Button variant="primary" className="w-full py-4 text-xs uppercase tracking-wider font-bold">
                ➕ Create Program
              </Button>
            </Link>
            <Link href="/admin/announcements" className="w-full">
              <Button variant="outline" className="w-full py-4 text-xs uppercase tracking-wider font-bold">
                ➕ Pin Announcement
              </Button>
            </Link>
            <Link href="/admin/users" className="w-full">
              <Button variant="secondary" className="w-full py-4 text-xs uppercase tracking-wider font-bold">
                👥 Manage Members
              </Button>
            </Link>
          </div>

          {/* 4. Activity Logs and Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Activity Log */}
            <Card className="bg-white dark:bg-surface-900 lg:col-span-2">
              <CardHeader>
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                  📊 Central Activity Feed
                </h3>
              </CardHeader>
              <CardBody className="flex flex-col gap-4">
                {data.recent_activities.length === 0 ? (
                  <div className="py-8 text-center text-xs text-surface-450 italic">
                    No recent administrative activity logs recorded.
                  </div>
                ) : (
                  data.recent_activities.slice(0, 5).map((act, index) => (
                    <div key={index} className="flex gap-4 p-3 hover:bg-surface-50 dark:hover:bg-surface-850 rounded-xl transition-colors items-start">
                      <Badge variant={act.type === 'SERMON' ? 'primary' : act.type === 'MEMBER' ? 'gold' : 'success'}>
                        {act.type}
                      </Badge>
                      <div className="flex-1 flex flex-col gap-0.5 min-w-0 pr-4">
                        <p className="text-xs text-surface-700 dark:text-surface-300 font-semibold truncate">
                          {act.title}
                        </p>
                        <span className="text-[10px] text-surface-400 font-medium">
                          {act.details} | {formatActivityTime(act.created_at)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>

            {/* Quick Chapel Goals widgets */}
            <Card className="bg-white dark:bg-surface-900">
              <CardHeader>
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                  ⛪ Institutional Goals
                </h3>
              </CardHeader>
              <CardBody className="flex flex-col gap-5 justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold text-surface-600 dark:text-surface-400">
                      <span>Student Bible Discipleship</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-surface-200 dark:bg-surface-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gold-500 h-full w-[78%]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold text-surface-600 dark:text-surface-400">
                      <span>Chapel Choir Coverage</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-surface-200 dark:bg-surface-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary-800 h-full w-[92%]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold text-surface-600 dark:text-surface-400">
                      <span>Counseling Inquiries Solved</span>
                      <span>64%</span>
                    </div>
                    <div className="w-full bg-surface-200 dark:bg-surface-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[64%]" />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-surface-400 leading-relaxed italic text-center mt-3 border-t border-surface-100 dark:border-surface-800/40 pt-4">
                  "Excellence and Godliness: Nurturing student leadership profiles under biblical principles."
                </p>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
