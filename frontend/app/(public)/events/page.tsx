'use client';

import React, { useState, useEffect } from 'react';
import { programService } from '@/services/programs';
import { Program } from '@/types';
import Card, { CardBody } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Input from '@/components/ui/input';
import Tabs from '@/components/ui/tabs';
import EmptyState from '@/components/ui/empty-state';
import Loader from '@/components/ui/loader';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('UPCOMING');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tabs = [
    { id: 'UPCOMING', label: 'Upcoming Services' },
    { id: 'PAST', label: 'Past Services' },
  ];

  // Dynamic API fetching when search or tab switches
  useEffect(() => {
    let active = true;
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        const params: Record<string, any> = { search };
        if (activeTab === 'UPCOMING') {
          params.upcoming = 'true';
        } else {
          params.past = 'true';
        }

        const res = await programService.getPrograms(params);
        if (active) {
          setPrograms(res.results);
        }
      } catch (err: any) {
        if (active) {
          setErrorMessage(err.message || 'Unable to sync chapel calendar with server.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPrograms();
    }, 400);

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [search, activeTab]);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
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
    <div className="bg-surface-50 dark:bg-surface-950 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-500">Chapel Schedule</span>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white font-sans">
            Programs & Events Calendar
          </h1>
          <p className="text-sm text-surface-500 leading-relaxed max-w-xl">
            Participate in our student fellowships, midweek worships, and Sunday convocations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-5">
          <div className="w-full max-w-md">
            <Input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<span>🔍</span>}
            />
          </div>
          
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader size="md" />
            <p className="text-xs text-surface-500 font-medium">Retrieving chapel calendar...</p>
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

        {/* Events Grid */}
        {!isLoading && !errorMessage && (
          <div className="flex flex-col gap-6">
            {programs.length === 0 ? (
              <EmptyState
                title="No Programs Found"
                description="No chapel events matched your criteria. Try refining your calendar search terms."
                actionLabel="Reset Search"
                onAction={() => {
                  setSearch('');
                  setActiveTab('UPCOMING');
                }}
              />
            ) : (
              programs.map((prog) => (
                <Card key={prog.id} hoverEffect animate className="bg-white dark:bg-surface-900 overflow-hidden">
                  <CardBody className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Event Emblem / Image */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary-50 dark:bg-primary-950/20 text-3xl flex items-center justify-center flex-shrink-0 shadow-sm border border-primary-100/10">
                      {prog.banner_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={prog.banner_image} alt="Banner" className="w-full h-full object-cover" />
                      ) : (
                        '⛪'
                      )}
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={activeTab === 'UPCOMING' ? 'success' : 'secondary'}>
                          {activeTab === 'UPCOMING' ? 'Upcoming' : 'Past'}
                        </Badge>
                      </div>
                      
                      <h2 className="text-lg font-bold text-surface-900 dark:text-white leading-snug truncate">
                        {prog.title}
                      </h2>
                      
                      <p className="text-sm text-surface-550 dark:text-surface-400 leading-relaxed">
                        {prog.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs font-semibold text-surface-500 mt-2">
                        <span className="flex items-center gap-1.5">
                          📅 {formatDate(prog.event_date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          ⏰ {formatTime(prog.event_date)}
                        </span>
                      </div>
                      
                      <span className="text-xs font-semibold text-gold-600 dark:text-gold-400 mt-1 uppercase tracking-wider">
                        📍 {prog.venue}
                      </span>
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
