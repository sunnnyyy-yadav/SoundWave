'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  ChevronUp,
} from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { formatDuration } from '@/lib/youtube';

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    isMuted,
    setMuted,
    repeat,
    setRepeat,
    shuffle,
    setShuffle,
    nextTrack,
    previousTrack,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPlayer, setExpandedPlayer] = useState(false);

  // Load stream when track changes
  useEffect(() => {
    if (!currentTrack) return;

    let cancelled = false;
    setIsLoading(true);
    setStreamUrl('');
    console.log(`[player] loading stream for: ${currentTrack.youtubeId}`);

    const load = async () => {
      try {
        // Get direct CDN URL (fast, no proxying needed)
        const res = await fetch(`/api/stream?id=${currentTrack.youtubeId}`);
        if (!res.ok) throw new Error(`stream API ${res.status}`);
        const data = await res.json();
        if (!data.url) throw new Error('No URL in response');
        if (!cancelled) {
          console.log('[player] got stream URL');
          setStreamUrl(data.url);
        }
      } catch (err) {
        console.warn('[player] direct URL failed, falling back to proxy:', err);
        if (!cancelled) {
          // Fallback: proxy mode
          setStreamUrl(`/api/stream?id=${currentTrack.youtubeId}&proxy=1`);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [currentTrack]);

  // Update audio element — fires whenever streamUrl changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    // Load the new source
    audio.load();

    if (isPlaying) {
      audio.play().catch((e) => console.warn('[player] play() blocked:', e));
    }
  }, [streamUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Just play/pause audio without reloading
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    if (isPlaying) {
      audio.play().catch((e) => console.warn('[player] play() blocked:', e));
    } else {
      audio.pause();
    }
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Handle audio events
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

  const handleCanPlay = () => setIsLoading(false);
  const handleWaiting = () => setIsLoading(true);
  const handleError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    console.error('[player] audio error:', (e.target as HTMLAudioElement).error);
    setIsLoading(false);
  };

  const handleEnded = () => {
    if (repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      nextTrack();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  if (!currentTrack) {
    return (
      <div className="border-t border-dark-tertiary bg-dark-secondary/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-center">
          <p className="text-gray-400">No track selected. Search to get started</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={streamUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onError={handleError}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Player Bar */}
      <div className="border-t border-dark-tertiary bg-dark-secondary/80 backdrop-blur-sm">
        {/* Progress bar */}
        <div className="px-6 pt-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime || 0}
            onChange={handleSeek}
            className="w-full h-1 bg-dark-tertiary rounded-lg appearance-none cursor-pointer transition-colors"
            style={{
              background: `linear-gradient(to right, #FFED4E 0%, #FFED4E ${
                duration ? (currentTime / duration) * 100 : 0
              }%, #1A1A1A ${duration ? (currentTime / duration) * 100 : 0}%, #1A1A1A 100%)`,
            }}
          />
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Player controls */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Track info */}
            <button
              onClick={() => setExpandedPlayer(!expandedPlayer)}
              className="flex items-center gap-4 flex-1 min-w-0 hover:opacity-80 transition-opacity"
            >
              {currentTrack.thumbnail && (
                <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">
                  {currentTrack.title}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </button>

            {/* Center controls */}
            <div className="flex items-center justify-center gap-4 px-4">
              {/* Previous */}
              <button
                onClick={previousTrack}
                className="p-2 hover:text-accent-yellow transition-colors"
                aria-label="Previous track"
              >
                <SkipBack size={20} />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-yellow hover:bg-accent-cyan hover:shadow-glow transition-all disabled:opacity-50"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isLoading ? (
                  <div className="animate-spin">
                    <span className="text-xs text-black">⟳</span>
                  </div>
                ) : isPlaying ? (
                  <Pause size={20} className="text-black" />
                ) : (
                  <Play size={20} className="text-black ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={nextTrack}
                className="p-2 hover:text-accent-yellow transition-colors"
                aria-label="Next track"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center justify-end gap-3 flex-1 px-4">
              {/* Shuffle */}
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 transition-colors ${
                  shuffle
                    ? 'text-accent-yellow'
                    : 'text-gray-300 hover:text-white'
                }`}
                aria-label="Toggle shuffle"
              >
                <Shuffle size={18} />
              </button>

              {/* Repeat */}
              <button
                onClick={() =>
                  setRepeat(
                    repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off'
                  )
                }
                className={`p-2 transition-colors relative ${
                  repeat !== 'off'
                    ? 'text-accent-yellow'
                    : 'text-gray-300 hover:text-white'
                }`}
                aria-label="Toggle repeat"
              >
                <Repeat size={18} />
                {repeat === 'one' && (
                  <span className="absolute bottom-1 right-1 text-xs font-bold">
                    1
                  </span>
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 hidden sm:flex">
                <button
                  onClick={() => setMuted(!isMuted)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseInt(e.target.value, 10));
                    if (isMuted && parseInt(e.target.value, 10) > 0) {
                      setMuted(false);
                    }
                  }}
                  className="w-20 h-1 bg-dark-tertiary rounded-lg appearance-none cursor-pointer accent-accent-yellow"
                />
              </div>

              {/* Expand player */}
              <button
                onClick={() => setExpandedPlayer(!expandedPlayer)}
                className="p-2 text-gray-300 hover:text-white transition-colors hidden sm:flex md:hidden"
              >
                <ChevronUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Player Modal */}
      {expandedPlayer && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col"
          onClick={() => setExpandedPlayer(false)}
        >
          <div
            className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setExpandedPlayer(false)}
              className="absolute top-6 right-6 p-2 text-white hover:text-accent-yellow transition-colors"
            >
              <ChevronUp size={24} />
            </button>

            {/* Large album art */}
            {currentTrack.thumbnail && (
              <div className="relative h-64 w-64 rounded-2xl overflow-hidden shadow-2xl mb-8">
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Track info */}
            <div className="text-center mb-8 max-w-md">
              <h2 className="text-3xl font-bold mb-2 truncate">
                {currentTrack.title}
              </h2>
              <p className="text-lg text-gray-300">{currentTrack.artist}</p>
            </div>

            {/* Progress */}
            <div className="w-full max-w-md mb-8">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime || 0}
                onChange={handleSeek}
                className="w-full h-2 bg-dark-tertiary rounded-lg appearance-none cursor-pointer accent-accent-yellow"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            {/* Large controls */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <button
                onClick={previousTrack}
                className="p-3 text-gray-300 hover:text-white transition-colors"
              >
                <SkipBack size={28} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isLoading}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-yellow hover:bg-accent-cyan hover:shadow-glow transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin">
                    <span className="text-black">⟳</span>
                  </div>
                ) : isPlaying ? (
                  <Pause size={32} className="text-black" />
                ) : (
                  <Play size={32} className="text-black ml-1" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-3 text-gray-300 hover:text-white transition-colors"
              >
                <SkipForward size={28} />
              </button>
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`p-3 transition-colors ${
                  shuffle
                    ? 'text-accent-yellow'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Shuffle size={24} />
              </button>

              <button
                onClick={() =>
                  setRepeat(
                    repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off'
                  )
                }
                className={`p-3 transition-colors relative ${
                  repeat !== 'off'
                    ? 'text-accent-yellow'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Repeat size={24} />
                {repeat === 'one' && (
                  <span className="absolute bottom-0 right-0 text-lg font-bold">
                    1
                  </span>
                )}
              </button>

              <button
                onClick={() => setMuted(!isMuted)}
                className="p-3 text-gray-300 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
