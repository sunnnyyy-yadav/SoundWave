'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Heart } from 'lucide-react';
import SongCard from '@/components/SongCard';
import SongSkeleton from '@/components/SongSkeleton';
import { Track, usePlayerStore } from '@/lib/store';
import { searchTracks } from '@/lib/youtube';

const TRENDING_SEARCHES = [
  'top bollywood songs 2025',
  'latest hindi music',
  'trending punjabi songs',
  'new indie artists',
];

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentTrack, isLiked, toggleLike } = usePlayerStore();

  useEffect(() => {
    const loadTrendingTracks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const results = await searchTracks(TRENDING_SEARCHES[0], 20);
        setTracks(results);
      } catch (err) {
        console.error('Failed to load tracks:', err);
        setError('Failed to load tracks. Check your YouTube API key.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingTracks();
  }, []);

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track, tracks);
  };

  const featured = tracks[0];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section with Large Track */}
      {featured && (
        <div className="relative h-screen lg:h-[600px] bg-gradient-to-br from-dark-secondary via-dark-bg to-dark-bg overflow-hidden group cursor-pointer"
          onClick={() => {
            setCurrentTrack(featured, tracks);
            setTimeout(() => {
              window.location.href = `/listen/${featured.id}`;
            }, 100);
          }}
        >
          {/* Background Image - Maximum HD Quality */}
          {featured.thumbnail && (
            <>
              <div className="absolute inset-0">
                <Image
                  src={featured.thumbnail}
                  alt={featured.title}
                  fill
                  priority
                  quality={100}
                  className="object-cover opacity-35 group-hover:opacity-45 transition-opacity duration-300"
                  sizes="100vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/80 to-transparent" />
            </>
          )}

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-6 md:p-12">
            <div className="max-w-2xl">
              <p className="text-accent-yellow font-semibold mb-2 md:mb-4">Now Trending</p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 truncate">
                {featured.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 truncate">
                by {featured.artist}
              </p>
              <p className="text-gray-400 mb-8 hidden md:block max-w-lg">
                Click to play and dive into the full experience
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => {
                    setCurrentTrack(featured, tracks);
                    setTimeout(() => {
                      window.location.href = `/listen/${featured.id}`;
                    }, 100);
                  }}
                  className="flex items-center gap-2 px-8 py-3 md:py-4 bg-accent-yellow hover:bg-accent-cyan text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
                >
                  <Play size={24} className="fill-current" />
                  <span>Play Now</span>
                </button>
                <button
                  onClick={() => toggleLike(featured)}
                  className={`flex items-center gap-2 px-8 py-3 md:py-4 rounded-full font-semibold transition-all border-2 ${
                    isLiked(featured.id)
                      ? 'bg-accent-yellow border-accent-yellow text-black'
                      : 'border-white/30 hover:border-white/60 text-white'
                  }`}
                >
                  <Heart size={24} className={isLiked(featured.id) ? 'fill-current' : ''} />
                  <span>{isLiked(featured.id) ? 'Liked' : 'Like'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 px-4 md:px-8 py-12 md:py-16">
        {error && (
          <div className="mb-8 rounded-lg bg-red-500/20 border border-red-500/50 p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Trending Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              🔥 Trending Now
            </h2>
            <Link href="/explore" legacyBehavior>
              <a className="text-accent-yellow hover:text-accent-cyan transition-colors text-sm font-semibold">
                See All →
              </a>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <SongSkeleton key={i} />
              ))}
            </div>
          ) : tracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {tracks.map((track) => (
                <SongCard
                  key={track.id}
                  track={track}
                  onPlay={() => handlePlayTrack(track)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No tracks available</p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 rounded-2xl bg-gradient-to-r from-accent-yellow/10 via-accent-cyan/10 to-accent-lime/10 border border-white/10 p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Why Choose MiX</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '🎵 Unlimited Streaming',
                desc: 'Stream millions of songs in high quality',
              },
              {
                title: '📝 Create Playlists',
                desc: 'Organize and share your favorite tracks',
              },
              {
                title: '❤️ Personalized',
                desc: 'Save your favorites and get recommendations',
              },
            ].map((feature, idx) => (
              <div key={idx} className="rounded-lg bg-dark-secondary/40 p-6">
                <p className="font-semibold mb-2 text-lg">{feature.title}</p>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Link */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Created with ❤️ by Sunny Yadav</p>
          <a
            href="https://www.instagram.com/sunnnyyy_________/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-accent-yellow/20 border border-accent-yellow hover:bg-accent-yellow/40 text-accent-yellow rounded-full transition-all font-semibold"
          >
            Follow on Instagram 📸
          </a>
        </div>
      </div>
    </div>
  );
}
