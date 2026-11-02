'use client';

import { Music, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TrackList from '@/components/TrackList';
import { usePlayerStore } from '@/lib/store';

interface PlaylistPageProps {
  params: {
    id: string;
  };
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
  const router = useRouter();
  const { getPlaylist, setCurrentTrack, deletePlaylist } = usePlayerStore();
  const playlist = getPlaylist(params.id);

  if (!playlist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Music size={48} className="mb-4 text-gray-600" />
        <p className="text-gray-400 mb-4">Playlist not found</p>
        <Link href="/library" legacyBehavior>
          <a className="text-accent-yellow hover:text-accent-cyan transition-colors">
            Back to Library
          </a>
        </Link>
      </div>
    );
  }

  const handlePlayTrack = (track: any, queue?: any[]) => {
    setCurrentTrack(track, queue);
  };

  const handleDeletePlaylist = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`
      )
    ) {
      deletePlaylist(params.id);
      router.push('/library');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden px-6 md:px-8 py-12">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent-blue/10 blur-3xl" />
        </div>

        <Link href="/library" className="inline-flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>

        <div className="flex items-start gap-6">
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple">
            <Music size={64} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-accent-yellow font-semibold mb-2">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {playlist.name}
            </h1>
            <p className="text-gray-400">
              {playlist.tracks.length}{' '}
              {playlist.tracks.length === 1 ? 'song' : 'songs'} •{' '}
              {(
                playlist.tracks.reduce((acc, track) => acc + track.duration, 0) /
                60
              ).toFixed(0)}{' '}
              minutes
            </p>
          </div>

          {/* Delete button */}
          <button
            onClick={handleDeletePlaylist}
            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete playlist"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-8 pb-12">
        {playlist.tracks.length === 0 ? (
          <div className="text-center py-12">
            <Music size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No songs in this playlist yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Add songs from search or explore pages
            </p>
          </div>
        ) : (
          <TrackList
            tracks={playlist.tracks}
            onPlay={handlePlayTrack}
          />
        )}
      </section>
    </div>
  );
}
