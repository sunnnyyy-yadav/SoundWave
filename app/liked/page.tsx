'use client';

import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import TrackList from '@/components/TrackList';
import { usePlayerStore } from '@/lib/store';

export default function LikedPage() {
  const { likedTracks, setCurrentTrack } = usePlayerStore();

  const handlePlayTrack = (track: any, queue?: any[]) => {
    setCurrentTrack(track, queue);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden px-6 md:px-8 py-12">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent-pink/10 blur-3xl" />
        </div>

        <div className="flex items-start gap-6">
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-yellow to-accent-cyan">
            <Heart size={64} className="text-white fill-white" />
          </div>
          <div>
            <p className="text-accent-yellow font-semibold mb-2">Your Library</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Liked Songs</h1>
            <p className="text-gray-400">
              {likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'} •{' '}
              {(
                likedTracks.reduce((acc, track) => acc + track.duration, 0) / 60
              ).toFixed(0)}{' '}
              minutes
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-8 pb-12">
        {likedTracks.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No liked songs yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Start liking songs to build your collection
            </p>
          </div>
        ) : (
          <TrackList
            tracks={likedTracks}
            onPlay={handlePlayTrack}
          />
        )}
      </section>
    </div>
  );
}
