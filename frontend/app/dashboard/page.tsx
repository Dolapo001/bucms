'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/store/app-context';
import { announcementService } from '@/services/announcements';
import { programService } from '@/services/programs';
import { Announcement, Program } from '@/types';
import Card, { CardBody, CardHeader } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Loader from '@/components/ui/loader';

export default function MemberDashboard() {
  const { user } = useApp();
  const [pinnedNotices, setPinnedNotices] = useState<Announcement[]>([]);
  const [nextService, setNextService] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        // Fetch pinned announcements and upcoming schedules simultaneously
        const [noticesRes, programsRes] = await Promise.all([
          announcementService.getAnnouncements({ is_pinned: true }),
          programService.getPrograms({ upcoming: true })
        ]);

        if (active) {
          setPinnedNotices(noticesRes.results.slice(0, 3));
          
          // Next scheduled service is the closest upcoming program
          if (programsRes.results.length > 0) {
            setNextService(programsRes.results[0]);
          } else {
            setNextService(null);
          }
        }
      } catch (err: any) {
        if (active) {
          setErrorMessage(err.message || 'Unable to sync dashboard values with the backend.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();
    return () => {
      active = false;
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Welcoming Hero Panel */}
      <Card className="bg-gradient-to-r from-primary-900 to-primary-800 text-white overflow-hidden relative shadow-premium border-none">
        <div className="absolute right-[-5%] top-[-20%] w-64 h-64 rounded-full bg-gold-500/10 blur-2xl pointer-events-none" />
        <CardBody className="p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 min-w-0">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest leading-none">
              Welcome back
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              Shalom, {user?.first_name || 'Member'}!
            </h2>
            <p className="text-sm text-primary-200/80 leading-relaxed max-w-md">
              "Thy word is a lamp unto my feet, and a light unto my path." Keep track of your university spiritual schedules and outlines.
            </p>
          </div>

          <Link href="/dashboard/profile">
            <Button variant="gold" className="px-6 text-xs uppercase tracking-wider font-bold">
              👤 View Profile
            </Button>
          </Link>
        </CardBody>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader size="md" />
          <p className="text-sm text-surface-500 font-medium">Synchronizing portal records with the chapel servers...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMessage && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/35">
          <CardBody className="flex flex-col items-center gap-3 text-center py-8">
            <span className="text-3xl">⚠️</span>
            <h4 className="text-sm font-bold text-red-800 dark:text-red-400 uppercase tracking-wider">Sync Connection Failure</h4>
            <p className="text-xs text-red-650 dark:text-red-300 max-w-md">{errorMessage}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-2 text-xs">
              Retry Connection
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Dynamic Content loaded successfully */}
      {!isLoading && !errorMessage && (
        <>
          {/* 2. Quick Stat Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card hoverEffect className="bg-white dark:bg-surface-900">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-950/20 text-gold-600 dark:text-gold-400 flex items-center justify-center text-xl">
                  📖
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-surface-900 dark:text-white">Active</span>
                  <span className="text-xs text-surface-550 dark:text-surface-400 font-semibold uppercase">Study Outlines</span>
                </div>
              </CardBody>
            </Card>

            <Card hoverEffect className="bg-white dark:bg-surface-900">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-650 dark:text-primary-400 flex items-center justify-center text-xl">
                  📅
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-surface-900 dark:text-white">Live</span>
                  <span className="text-xs text-surface-550 dark:text-surface-400 font-semibold uppercase">Liturgical Events</span>
                </div>
              </CardBody>
            </Card>

            <Card hoverEffect className="bg-white dark:bg-surface-900">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-455 flex items-center justify-center text-xl">
                  📌
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-surface-900 dark:text-white">
                    {pinnedNotices.length}
                  </span>
                  <span className="text-xs text-surface-550 dark:text-surface-400 font-semibold uppercase">Pinned Notices</span>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 3. Splitted Panel list (Notices vs Upcoming services) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notices Board */}
            <Card className="bg-white dark:bg-surface-900">
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                  📢 Pinned Notices
                </h3>
                <Link href="/dashboard/announcements" className="text-xs font-bold text-gold-500 hover:underline">
                  View Board
                </Link>
              </CardHeader>
              <CardBody className="flex flex-col gap-4">
                {pinnedNotices.length === 0 ? (
                  <div className="py-8 text-center text-xs text-surface-450 italic">
                    No pinned announcements currently posted.
                  </div>
                ) : (
                  pinnedNotices.map((n) => (
                    <div key={n.id} className="p-3 bg-surface-50 dark:bg-surface-950/30 rounded-xl flex items-center justify-between border border-surface-100 dark:border-surface-800/40">
                      <div className="flex flex-col gap-0.5 min-w-0 pr-4">
                        <span className="text-xs font-bold text-surface-900 dark:text-white truncate">{n.title}</span>
                        <span className="text-[10px] text-surface-400">
                          {new Date(n.created_at).toLocaleDateString('en-US')}
                        </span>
                      </div>
                      <Badge variant="gold">
                        Notice
                      </Badge>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>

            {/* Next Scheduled Fellowship Service */}
            <Card className="bg-white dark:bg-surface-900">
              <CardHeader>
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                  ⛪ Next Fellowship Service
                </h3>
              </CardHeader>
              <CardBody className="flex flex-col gap-4 justify-between min-h-[170px]">
                {nextService ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-bold text-surface-900 dark:text-white leading-tight">
                      {nextService.title}
                    </span>
                    <div className="flex items-center gap-2.5 text-xs text-gold-650 dark:text-gold-400 font-bold mt-1">
                      <span>📅 {formatDate(nextService.event_date)}</span>
                      <span>•</span>
                      <span>⏰ {formatTime(nextService.event_date)}</span>
                    </div>
                    <span className="text-xs text-surface-450 dark:text-surface-500 mt-2 uppercase tracking-wider font-semibold">
                      📍 {nextService.venue}
                    </span>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-surface-450 italic">
                    No upcoming services scheduled at this time.
                  </div>
                )}
                <Link href="/dashboard/events" className="mt-auto">
                  <Button variant="secondary" className="w-full text-xs font-bold uppercase tracking-wider">
                    Browse Full Schedule
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
