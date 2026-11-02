'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Share2,
  MoreVertical,
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { usePlayerStore, Track } from '@/lib/store';
import { formatDuration } from '@/lib/youtube';

interface ListenPageProps {
  params: {
    id: string;
  };
}

export default function ListenPage({ params }: ListenPageProps) {
  const {
    currentTrack,
    setCurrentTrack,
    isPlaying,
    setIsPlaying,
    isLiked,
    toggleLike,
    queue,
    queueIndex,
    nextTrack,
    previousTrack,
    currentTime,
    duration,
  } = usePlayerStore();

  const trackId = params.id;
  // youtubeId is everything before the last '-timestamp' suffix
  // e.g. "YALvuUpY_b0-1793641084104" → "YALvuUpY_b0"
  const youtubeId = trackId.includes('-')
    ? trackId.split('-').slice(0, -1).join('-')
    : trackId;

  const [bgImage, setBgImage] = useState<string>('');
  const [bgVideo, setBgVideo] = useState<string>('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // The track to display — from Zustand or fetched fresh
  const track: Track | null =
    currentTrack?.id === trackId || currentTrack?.youtubeId === youtubeId
      ? currentTrack
      : null;

  // Next/upcoming from queue
  const nextUpcoming = queue.slice(queueIndex + 1, queueIndex + 4);

  // ── If no track in Zustand, fetch info and start playing ──────────────────
  useEffect(() => {
    if (track) return; // already loaded

    const fetchAndPlay = async () => {
      setTrackLoading(true);
      setError('');
      try {
        // Fetch video metadata from YouTube oEmbed (no API key needed)
        const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
        const res = await fetch(oEmbedUrl);
        if (!res.ok) throw new Error('Could not fetch track info');
        const data = await res.json();

        const freshTrack: Track = {
          id: trackId,
          youtubeId,
          title: data.title ?? 'Unknown Title',
          artist: data.author_name ?? 'Unknown Artist',
          thumbnail: `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
          duration: 0,
        };

        setCurrentTrack(freshTrack, [freshTrack]);
      } catch (e: any) {
        console.error('[listen] fetch error:', e);
        setError('Could not load track. Please go back and play a song.');
      } finally {
        setTrackLoading(false);
      }
    };

    fetchAndPlay();
  }, [youtubeId, trackId, track, setCurrentTrack]);

  // ── Set background image from thumbnail ───────────────────────────────────
  useEffect(() => {
    if (!youtubeId) return;
    setBgImage(`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`);
  }, [youtubeId]);

  // ── Background video: download 30-sec clip via /api/video-clip ────────────
  useEffect(() => {
    if (!youtubeId || bgVideo) return;

    const fetchVideoClip = async () => {
      setVideoLoading(true);
      try {
        const res = await fetch(`/api/video-clip?id=${youtubeId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.url) setBgVideo(data.url);
        }
      } catch (e) {
        console.warn('[listen] video clip fetch failed:', e);
      } finally {
        setVideoLoading(false);
      }
    };

    // Delay slightly so audio starts first
    const timer = setTimeout(fetchVideoClip, 1500);
    return () => clearTimeout(timer);
  }, [youtubeId, bgVideo]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (trackLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-accent-yellow border-t-transparent animate-spin" />
        <p className="text-gray-400">Loading track…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-4">
        <p className="text-red-400">{error}</p>
        <Link href="/" legacyBehavior>
          <a className="px-6 py-3 bg-accent-yellow text-black font-bold rounded-full">
            Back to Home
          </a>
        </Link>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-accent-yellow border-t-transparent animate-spin" />
        <p className="text-gray-400">Starting playback…</p>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-dark-bg overflow-hidden relative">
      {/* ── Background layer ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Video background (loaded async) */}
        {bgVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-110"
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        ) : bgImage ? (
          /* Fallback: blurred thumbnail */
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover blur-3xl opacity-20 scale-110"
            priority
            unoptimized
          />
        ) : null}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/50 to-dark-bg/90" />
      </div>

      {/* ── Header ── */}
      <div className="sticky top-0 z-40 border-b border-dark-tertiary/50 bg-dark-secondary/50 backdrop-blur-md px-4 md:px-8 py-4 flex items-center gap-4">
        <Link href="/" legacyBehavior>
          <a className="p-2 hover:bg-dark-tertiary rounded-full transition-colors">
            <ArrowLeft size={20} />
          </a>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-semibold truncate">{track.title}</h1>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
        </div>
        <button
          onClick={() => toggleLike(track)}
          className={`p-2 hover:bg-dark-tertiary rounded-full transition-colors ${
            isLiked(track.id) ? 'text-accent-yellow' : 'text-gray-400'
          }`}
        >
          <Heart size={20} className={isLiked(track.id) ? 'fill-accent-yellow' : ''} />
        </button>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Album Art */}
          <div className="flex justify-center lg:sticky lg:top-28">
            <div className="w-full max-w-sm">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 ring-accent-yellow/20">
                <Image
                  src={track.thumbnail}
                  alt={track.title}
                  fill
                  quality={100}
                  priority
                  unoptimized
                  className={`object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 400px"
                  onError={(e) => {
                    // Fallback chain: maxresdefault → hqdefault
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.src.includes('maxresdefault')) {
                      img.src = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Now Playing badge */}
                {isPlaying && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-accent-yellow/90 rounded-full">
                    <div className="flex gap-0.5 items-end h-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-1 bg-black rounded-sm animate-bounce"
                          style={{
                            height: `${8 + i * 3}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-black">Now Playing</span>
                  </div>
                )}
              </div>

              {/* ── Mini player controls (mirrors PlayerBar) ── */}
              <div className="mt-8 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-white truncate">{track.title}</h2>
                  <p className="text-gray-400 mt-1 truncate">{track.artist}</p>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="relative h-1.5 bg-dark-tertiary rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-yellow to-accent-cyan rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={previousTrack}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <SkipBack size={24} />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-accent-yellow hover:bg-accent-cyan text-black transition-all hover:scale-105 shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause size={28} className="fill-current" />
                    ) : (
                      <Play size={28} className="fill-current ml-1" />
                    )}
                  </button>

                  <button
                    onClick={nextTrack}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <SkipForward size={24} />
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => toggleLike(track)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                      isLiked(track.id)
                        ? 'border-accent-yellow text-accent-yellow'
                        : 'border-white/20 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Heart size={16} className={isLiked(track.id) ? 'fill-accent-yellow' : ''} />
                    <span className="text-sm">{isLiked(track.id) ? 'Liked' : 'Like'}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: track.title, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-gray-400 hover:text-white transition-colors"
                  >
                    <Share2 size={16} />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info + Upcoming */}
          <div className="space-y-10">
            {/* Track stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-dark-secondary/40 backdrop-blur-sm border border-white/10">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Duration</p>
                <p className="text-xl font-bold text-accent-yellow">{formatDuration(track.duration || duration)}</p>
              </div>
              <div className="p-5 rounded-2xl bg-dark-secondary/40 backdrop-blur-sm border border-white/10">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Artist</p>
                <p className="text-xl font-bold text-white truncate">{track.artist}</p>
              </div>
            </div>

            {/* Video background status */}
            {videoLoading && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-secondary/40 border border-accent-cyan/20 text-sm text-accent-cyan">
                <div className="w-4 h-4 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin flex-shrink-0" />
                <span>Loading video background…</span>
              </div>
            )}
            {bgVideo && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-secondary/40 border border-accent-yellow/20 text-sm text-accent-yellow">
                <span>🎬</span>
                <span>Video background loaded</span>
              </div>
            )}

            {/* Lyrics placeholder */}
            <div className="rounded-2xl bg-dark-secondary/40 backdrop-blur-sm p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4">✨ About this track</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {`🎵 "${track.title}"\nby ${track.artist}\n\nEnjoy the music ❤️\n\nStreaming via MiX — made with love by Sunny Yadav`}
              </p>
            </div>

            {/* Next & Upcoming */}
            <div>
              <h3 className="text-2xl font-bold mb-5">
                <span className="bg-gradient-to-r from-accent-yellow to-accent-cyan bg-clip-text text-transparent">
                  ▶ Up Next
                </span>
              </h3>

              {nextUpcoming.length > 0 ? (
                <div className="space-y-3">
                  {nextUpcoming.map((upTrack, idx) => (
                    <button
                      key={upTrack.id}
                      onClick={() => setCurrentTrack(upTrack)}
                      className="group w-full flex items-center gap-4 p-4 rounded-xl bg-dark-secondary/40 hover:bg-dark-secondary/70 border border-white/10 hover:border-accent-yellow/40 transition-all text-left"
                    >
                      <span className="text-lg font-bold text-accent-yellow min-w-[28px]">
                        #{idx + 1}
                      </span>
                      {upTrack.thumbnail && (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={upTrack.thumbnail}
                            alt={upTrack.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate group-hover:text-accent-yellow transition-colors">
                          {upTrack.title}
                        </p>
                        <p className="text-sm text-gray-400 truncate">{upTrack.artist}</p>
                      </div>
                      <Play
                        size={18}
                        className="text-gray-500 group-hover:text-accent-yellow transition-colors flex-shrink-0"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm py-4">
                  No upcoming tracks. Play songs from the home page to build a queue.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
