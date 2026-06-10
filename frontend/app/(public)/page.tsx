'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Card, { CardBody } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export default function LandingPage() {
  const featuredAnnouncements = [
    {
      id: 1,
      title: 'First Semester Examination Midweek Prayer Vigil',
      content: 'In preparation for the upcoming examinations, the university chapel will host an institutional prayer vigil. Theme: Divine Knowledge and Memory.',
      category: 'GENERAL' as const,
      is_pinned: true,
      created_at: '2026-05-27',
    },
    {
      id: 2,
      title: 'Launch of New BUCMS Digital Sermons Archive',
      content: 'The Bowen Chapel is thrilled to announce the roll-out of the Bowen University Chapel Management System (BUCMS) providing instant audio streaming and sermon studies guides.',
      category: 'SPIRITUAL' as const,
      is_pinned: false,
      created_at: '2026-05-26',
    }
  ];

  const featuredSermons = [
    {
      id: 1,
      title: 'Walking in the Light of Divine Wisdom',
      speaker: 'Rev. Dr. A. A. Olayinka',
      date: '2026-05-24',
      views: 342,
      description: 'Understanding the relationship between spiritual obedience and mental excellence on campus.',
    },
    {
      id: 2,
      title: 'The Discipline of Purposeful Focus',
      speaker: 'Pastor Mrs. D. O. Kolawole',
      date: '2026-05-17',
      views: 198,
      description: 'A dedicated address to all students on filtering distractions and pursuing outstanding academic records.',
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Midweek Worship & Fellowship Encounter',
      date: 'Wed, May 28',
      time: '4:00 PM - 5:30 PM',
      location: 'University Worship Sanctuary',
      banner: '🎶',
    },
    {
      id: 2,
      title: 'Sunday Spiritual Refuel Convocation',
      date: 'Sun, May 31',
      time: '8:00 AM - 10:00 AM',
      location: 'University Worship Sanctuary',
      banner: '⛪',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-primary-950 text-white py-24 sm:py-32 border-b border-primary-900/30">
        {/* Soft background glows */}
        <div className="absolute top-[-30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gold-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-primary-800/15 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <Badge variant="gold" className="px-4 py-1.5 text-xs uppercase tracking-widest bg-gold-500/10 border-gold-500/20 text-gold-400 font-bold">
              Bowen University Chapel
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-tight max-w-4xl text-white">
              Nurturing <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-amber-300">Excellence & Godliness</span>
            </h1>

            <p className="text-base sm:text-lg text-primary-200/80 max-w-2xl leading-relaxed">
              Welcome to the Bowen University Chapel Portal. Explore uplifting sermons, keep track of midweek and Sunday services, access study guidelines, and connect with other believers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="gold" className="w-full sm:w-auto px-8 py-3.5 text-sm uppercase tracking-wider font-bold">
                  Enter Student Portal
                </Button>
              </Link>
              <Link href="/sermons" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-3.5 text-sm border-primary-700 hover:bg-primary-900 text-white uppercase tracking-wider">
                  Browse Sermons
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PINNED ANNOUNCEMENTS */}
      <section className="py-16 sm:py-24 bg-surface-50 dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-500">Notice Board</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-surface-900 dark:text-white">
                Latest Announcements
              </h2>
            </div>
            <Link href="/announcements" className="text-sm font-bold text-gold-600 hover:text-gold-500 dark:text-gold-400">
              View All Notices →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredAnnouncements.map((ann, idx) => (
              <Card key={ann.id} hoverEffect animate className="relative overflow-hidden border-l-4 border-l-gold-500">
                <CardBody className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={ann.category === 'SPIRITUAL' ? 'primary' : 'gold'}>
                      {ann.category}
                    </Badge>
                    {ann.is_pinned && <span className="text-xs font-bold text-gold-500">📌 Pinned</span>}
                  </div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white leading-snug">
                    {ann.title}
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed truncate-2-lines">
                    {ann.content}
                  </p>
                  <div className="h-px bg-surface-100 dark:bg-surface-800 my-2" />
                  <span className="text-xs text-surface-400 self-end">
                    Posted on {new Date(ann.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERMONS */}
      <section className="py-16 sm:py-24 bg-white dark:bg-surface-900 border-t border-b border-surface-200/50 dark:border-surface-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-500">Sermon Archives</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-surface-900 dark:text-white">
                Featured Audio Sermons
              </h2>
            </div>
            <Link href="/sermons" className="text-sm font-bold text-gold-600 hover:text-gold-500 dark:text-gold-400">
              Listen to Archive →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredSermons.map((sermon) => (
              <Card key={sermon.id} hoverEffect className="relative">
                <CardBody className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-950/20 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
                    📻
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <h3 className="text-base font-bold text-surface-900 dark:text-white truncate">
                      {sermon.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-surface-500">
                      <span className="font-bold text-surface-700 dark:text-surface-300 truncate">{sermon.speaker}</span>
                      <span>•</span>
                      <span>{new Date(sermon.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed line-clamp-2">
                      {sermon.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. UPCOMING EVENTS & PROGRAMS */}
      <section className="py-16 sm:py-24 bg-surface-50 dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-500">Weekly Events</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-surface-900 dark:text-white">
                Upcoming Chapel Programs
              </h2>
            </div>
            <Link href="/events" className="text-sm font-bold text-gold-600 hover:text-gold-500 dark:text-gold-400">
              View Calendar →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} hoverEffect className="relative bg-white dark:bg-surface-900 overflow-hidden">
                <CardBody className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-primary-100/10">
                    {event.banner}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-base font-bold text-surface-900 dark:text-white truncate">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-500">
                      <span className="font-bold text-gold-600 dark:text-gold-400">{event.date}</span>
                      <span>{event.time}</span>
                    </div>
                    <span className="text-[11px] text-surface-400 dark:text-surface-500 font-semibold uppercase tracking-wider truncate">
                      📍 {event.location}
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
