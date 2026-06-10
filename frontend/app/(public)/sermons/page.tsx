'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sermonService } from '@/services/sermons';
import { Sermon } from '@/types';
import Card, { CardBody } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import Loader from '@/components/ui/loader';

export default function SermonsPage() {
  const [search, setSearch] = useState('');
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamic API retrieval cycle on mount & search update
  useEffect(() => {
    let active = true;
    const fetchSermons = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        // Pass search query directly to Django rest_framework filters
        const res = await sermonService.getSermons({ search });
        
        if (active) {
          setSermons(res.results);
        }
      } catch (err: any) {
        if (active) {
          setErrorMessage(err.message || 'Unable to load sermon catalogue from BUCMS server.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    // Debounce search input to avoid excessive API spamming
    const delayDebounceFn = setTimeout(() => {
      fetchSermons();
    }, 400);

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [search]);

  // Audio Playback Handling
  const handlePlay = (sermon: Sermon) => {
    const audioSrc = sermon.audio_file;
    if (!audioSrc) {
      alert('This sermon does not contain an audio stream attachment.');
      return;
    }

    if (activeSermon?.id === sermon.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setActiveSermon(sermon);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.load();
        audioRef.current.play().catch((err) => console.log('Audio playback error:', err));
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  return (
    <div className="bg-surface-50 dark:bg-surface-950 py-16 sm:py-24 relative pb-32">
      {/* Hidden Audio Controller */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-500">Chapel Audios</span>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white font-sans">
            Sermon & Teachings Library
          </h1>
          <p className="text-sm text-surface-500 leading-relaxed max-w-xl">
            Stream inspiring messages, download theological guides, and search by speaker tags.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Search by title, speaker, or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader size="md" />
            <p className="text-xs text-surface-500 font-medium">Retrieving spiritual outlines...</p>
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

        {/* Sermon Cards Array */}
        {!isLoading && !errorMessage && (
          <div className="flex flex-col gap-6">
            {sermons.length === 0 ? (
              <EmptyState
                title="No Sermons Found"
                description="No messages matched your search parameters. Try searching for other speakers or topic titles."
                actionLabel="Clear Search"
                onAction={() => setSearch('')}
              />
            ) : (
              sermons.map((sermon) => {
                const isActive = activeSermon?.id === sermon.id;
                
                return (
                  <Card key={sermon.id} hoverEffect animate className="bg-white dark:bg-surface-900">
                    <CardBody className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 items-start">
                          <button
                            onClick={() => handlePlay(sermon)}
                            disabled={!sermon.audio_file}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0 transition-transform active:scale-95 shadow-sm
                              ${!sermon.audio_file ? 'opacity-50 cursor-not-allowed bg-surface-100 text-surface-400' : ''}
                              ${isActive && isPlaying
                                ? 'bg-gold-500 text-primary-950 animate-pulse'
                                : 'bg-gold-50 dark:bg-gold-950/20 text-gold-600 dark:text-gold-400'
                              }
                            `}
                          >
                            {isActive && isPlaying ? '⏸️' : '▶️'}
                          </button>

                          <div className="flex flex-col gap-1 min-w-0">
                            <h3 className="text-base font-bold text-surface-900 dark:text-white truncate">
                              {sermon.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-surface-500">
                              <span className="font-bold text-surface-700 dark:text-surface-300 truncate">
                                {sermon.speaker}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(sermon.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {sermon.document && (
                          <a
                            href={sermon.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-800 hover:bg-surface-100 text-xs font-semibold text-surface-600 dark:text-surface-450 dark:hover:bg-surface-850 flex items-center gap-1.5"
                          >
                            📄 Outline
                          </a>
                        )}
                      </div>

                      <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed ml-16">
                        {sermon.description}
                      </p>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Persistent Elegant Floating Audio Player Bar */}
      {activeSermon && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-t border-surface-200/50 dark:border-surface-800/50 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto rounded-t-3xl">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-primary-950 font-bold text-base flex-shrink-0 animate-spin" style={{ animationDuration: '4s' }}>
              🎵
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-surface-900 dark:text-white truncate">
                {activeSermon.title}
              </span>
              <span className="text-xs text-surface-400 truncate">
                {activeSermon.speaker}
              </span>
            </div>
          </div>

          {/* Slider and playback status */}
          <div className="flex-1 max-w-xl flex items-center gap-4">
            <span className="text-xs font-semibold text-surface-500">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-gold-500 h-1 rounded-full cursor-pointer bg-surface-200 dark:bg-surface-800"
            />
            <span className="text-xs font-semibold text-surface-500">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePlay(activeSermon)}
              className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-600 text-primary-950 flex items-center justify-center text-lg shadow-md active:scale-95 transition-transform"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                }
                setIsPlaying(false);
                setActiveSermon(null);
              }}
              className="text-xs font-semibold text-surface-400 hover:text-surface-600 px-2.5 py-2 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-lg"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
