'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Heart, Plus } from 'lucide-react';
import { Track } from '@/lib/store';
import { usePlayerStore } from '@/lib/store';

interface SongCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  showActions?: boolean;
}

export default function SongCard({
  track,
  onPlay,
  showActions = true,
}: SongCardProps) {
  const { isLiked, toggleLike, createPlaylist, playlists } = usePlayerStore();
  const [showPlaylistMenu, setShowPlaylistMenu] = React.useState(false);

  const handleAddToPlaylist = (playlistId: string) => {
    const { addTrackToPlaylist } = usePlayerStore.getState();
    addTrackToPlaylist(playlistId, track);
    setShowPlaylistMenu(false);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-dark-tertiary/40 backdrop-blur-sm transition-all duration-300 hover:bg-dark-tertiary/60 hover:shadow-lg">
      {/* Image */}
      <div className="relative overflow-hidden bg-dark-tertiary aspect-square">
        {track.thumbnail && (
          <Image
            src={track.thumbnail}
            alt={track.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}

        {/* Overlay with play button */}
        {showActions && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-sm">
            <button
              onClick={() => {
                onPlay(track);
                // Redirect to listen page
                setTimeout(() => {
                  window.location.href = `/listen/${track.id}`;
                }, 100);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-yellow hover:bg-accent-cyan transition-all duration-200 shadow-lg hover:shadow-glow"
              aria-label="Play"
            >
              <Play size={20} className="text-black ml-0.5" />
            </button>
            <button
              onClick={() => toggleLike(track)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                isLiked(track.id)
                  ? 'bg-accent-yellow text-black'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              aria-label="Like"
            >
              <Heart
                size={20}
                className={isLiked(track.id) ? 'fill-current' : ''}
              />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white"
                aria-label="Add to playlist"
              >
                <Plus size={20} />
              </button>

              {/* Playlist dropdown */}
              {showPlaylistMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg bg-dark-secondary/95 backdrop-blur-md border border-dark-tertiary shadow-lg z-10">
                  {playlists.length === 0 ? (
                    <div className="p-3 text-sm text-gray-400">
                      No playlists yet
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto">
                      {playlists.map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() => handleAddToPlaylist(playlist.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-dark-tertiary/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {playlist.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="p-4">
        <h3 className="font-semibold text-white truncate hover:text-accent-pink transition-colors line-clamp-2">
          {track.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
      </div>
    </div>
  );
}
