'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Heart, MoreVertical, Music } from 'lucide-react';
import { Track } from '@/lib/store';
import { usePlayerStore } from '@/lib/store';
import { formatDuration } from '@/lib/youtube';

interface TrackListProps {
  tracks: Track[];
  onPlay: (track: Track, queue?: Track[]) => void;
}

export default function TrackList({ tracks, onPlay }: TrackListProps) {
  const { isLiked, toggleLike } = usePlayerStore();

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-gray-500">
          <Music width={48} height={48} />
        </div>
        <p className="text-gray-400">No tracks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="group flex items-center gap-4 rounded-lg p-3 hover:bg-dark-tertiary/40 transition-colors"
        >
          {/* Index */}
          <div className="w-8 text-center text-gray-400 group-hover:hidden">
            {index + 1}
          </div>

          {/* Play button */}
          <button
            onClick={() => onPlay(track, tracks)}
            className="hidden w-8 h-8 items-center justify-center rounded-full text-accent-pink hover:text-accent-purple group-hover:flex"
            aria-label="Play"
          >
            <Play size={16} className="ml-0.5" />
          </button>

          {/* Thumbnail */}
          <div className="relative h-10 w-10 flex-shrink-0 rounded overflow-hidden">
            {track.thumbnail && (
              <Image
                src={track.thumbnail}
                alt={track.title}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate hover:text-accent-pink transition-colors">
              {track.title}
            </p>
            <p className="text-sm text-gray-400 truncate">{track.artist}</p>
          </div>

          {/* Duration */}
          <div className="w-12 text-right text-sm text-gray-400">
            {formatDuration(track.duration)}
          </div>

          {/* Like button */}
          <button
            onClick={() => toggleLike(track)}
            className={`p-2 transition-colors ${
              isLiked(track.id)
                ? 'text-accent-pink'
                : 'text-gray-400 hover:text-white'
            }`}
            aria-label="Like"
          >
            <Heart
              size={18}
              className={isLiked(track.id) ? 'fill-current' : ''}
            />
          </button>

          {/* More options */}
          <button className="p-2 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
