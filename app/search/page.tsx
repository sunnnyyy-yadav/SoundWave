'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import SongCard from '@/components/SongCard';
import TrackList from '@/components/TrackList';
import SongSkeleton from '@/components/SongSkeleton';
import { Track, usePlayerStore } from '@/lib/store';
import { searchTracks } from '@/lib/youtube';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { setCurrentTrack } = usePlayerStore();

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setTracks([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);
        const results = await searchTracks(searchQuery, 30);
        setTracks(results);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search tracks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePlayTrack = (track: Track, queue?: Track[]) => {
    setCurrentTrack(track, queue);
  };

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="sticky top-0 z-20 border-b border-dark-tertiary bg-dark-secondary/80 backdrop-blur-md px-4 md:px-6 py-6">
        <div className="max-w-2xl">
          <div className="relative">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search songs, artists, playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-dark-tertiary/60 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-pink focus:bg-dark-tertiary transition-all"
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 md:px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/50 p-4 text-red-200">
            {error}
          </div>
        )}

        {!hasSearched ? (
          <div className="text-center py-12">
            <SearchIcon size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">Start typing to search for music</p>
          </div>
        ) : isLoading ? (
          <>
            <div className="mb-6 flex gap-2">
              <button className="px-4 py-2 rounded-full bg-accent-pink text-white">
                Grid
              </button>
              <button className="px-4 py-2 rounded-full bg-dark-tertiary/40 text-gray-300 hover:bg-dark-tertiary/60">
                List
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <SongSkeleton key={i} />
              ))}
            </div>
          </>
        ) : tracks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No tracks found for "{searchQuery}"</p>
          </div>
        ) : (
          <>
            {/* View Mode Toggle */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-accent-pink text-white'
                    : 'bg-dark-tertiary/40 text-gray-300 hover:bg-dark-tertiary/60'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  viewMode === 'list'
                    ? 'bg-accent-pink text-white'
                    : 'bg-dark-tertiary/40 text-gray-300 hover:bg-dark-tertiary/60'
                }`}
              >
                List
              </button>
            </div>

            {/* Results */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {tracks.map((track) => (
                  <SongCard
                    key={track.id}
                    track={track}
                    onPlay={() => handlePlayTrack(track, tracks)}
                  />
                ))}
              </div>
            ) : (
              <TrackList
                tracks={tracks}
                onPlay={(track) => handlePlayTrack(track, tracks)}
              />
            )}

            <p className="mt-6 text-center text-sm text-gray-500">
              Found {tracks.length} tracks
            </p>
          </>
        )}
      </section>
    </div>
  );
}
