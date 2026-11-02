'use client';

import { useEffect, useState } from 'react';
import SongCard from '@/components/SongCard';
import SongSkeleton from '@/components/SongSkeleton';
import { Track, usePlayerStore } from '@/lib/store';
import { searchTracks } from '@/lib/youtube';

const EXPLORE_CATEGORIES = [
  { query: 'top bollywood songs 2024', label: '🇮🇳 Bollywood Hits' },
  { query: 'punjabi songs 2024', label: '🎤 Punjabi Music' },
  { query: 'hindi indie artists', label: '🎸 Indie India' },
  { query: 'classical indian music', label: '🎹 Classical' },
  { query: 'international pop songs 2024', label: '🌍 International Pop' },
  { query: 'hip hop beats', label: '🎙️ Hip Hop' },
];

export default function ExplorePage() {
  const [categories, setCategories] = useState<
    Array<{
      label: string;
      tracks: Track[];
      isLoading: boolean;
    }>
  >([]);
  const { setCurrentTrack } = usePlayerStore();

  useEffect(() => {
    const loadCategories = async () => {
      const loadedCategories = EXPLORE_CATEGORIES.map((cat) => ({
        label: cat.label,
        tracks: [],
        isLoading: true,
      }));
      setCategories(loadedCategories);

      // Load each category
      for (let i = 0; i < EXPLORE_CATEGORIES.length; i++) {
        try {
          const results = await searchTracks(EXPLORE_CATEGORIES[i].query, 8);
          setCategories((prev) => {
            const updated = [...prev];
            updated[i] = {
              ...updated[i],
              tracks: results,
              isLoading: false,
            };
            return updated;
          });
        } catch (err) {
          console.error('Failed to load category:', err);
          setCategories((prev) => {
            const updated = [...prev];
            updated[i] = {
              ...updated[i],
              isLoading: false,
            };
            return updated;
          });
        }
      }
    };

    loadCategories();
  }, []);

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-6 md:px-8 py-12">
        <div>
          <p className="text-accent-yellow font-semibold mb-2">Discover</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Explore Music from
            <span className="block mt-2 bg-gradient-to-r from-accent-yellow via-accent-cyan to-accent-lime bg-clip-text text-transparent">
              Around the World
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover new artists and genres from India and beyond
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 md:px-8 space-y-12 pb-12">
        {categories.map((category, idx) => (
          <div key={idx}>
            <h2 className="text-2xl font-bold mb-6">{category.label}</h2>

            {category.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SongSkeleton key={i} />
                ))}
              </div>
            ) : category.tracks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.tracks.map((track) => (
                  <SongCard
                    key={track.id}
                    track={track}
                    onPlay={() => handlePlayTrack(track)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No tracks available
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
