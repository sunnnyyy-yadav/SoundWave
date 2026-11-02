'use client';

import { useState } from 'react';
import { Plus, Music } from 'lucide-react';
import Link from 'next/link';
import { usePlayerStore } from '@/lib/store';

export default function LibraryPage() {
  const { playlists, createPlaylist, likedTracks } = usePlayerStore();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-6 md:px-8 py-12">
        <div>
          <p className="text-accent-yellow font-semibold mb-2">Your Library</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Library</h1>
          <p className="text-gray-400">
            {playlists.length} playlists • {likedTracks.length} liked songs
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-8 pb-12">
        {/* Create Playlist */}
        {isCreating ? (
          <div className="mb-8 rounded-lg bg-dark-tertiary/40 p-6">
            <h3 className="font-semibold mb-4">Create New Playlist</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Playlist name..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCreatePlaylist();
                }}
                autoFocus
                className="flex-1 bg-dark-secondary rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-pink"
              />
              <button
                onClick={handleCreatePlaylist}
                className="px-6 py-2 rounded-lg bg-accent-pink hover:bg-accent-purple transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-6 py-2 rounded-lg bg-dark-tertiary hover:bg-dark-tertiary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="mb-8 flex items-center gap-3 rounded-lg border border-dashed border-dark-tertiary p-6 text-gray-400 hover:border-accent-pink hover:text-accent-pink transition-colors"
          >
            <Plus size={24} />
            <span>Create Playlist</span>
          </button>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Liked Songs Card */}
          <Link href="/liked" legacyBehavior>
            <a className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-accent-yellow/20 to-accent-purple/20 border border-white/10 p-6 cursor-pointer hover:border-accent-yellow transition-all hover:shadow-lg">
              <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-accent-yellow to-accent-purple">
                <Music className="h-16 w-16 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Liked Songs</h3>
              <p className="text-gray-400">
                {likedTracks.length}{' '}
                {likedTracks.length === 1 ? 'song' : 'songs'}
              </p>
            </a>
          </Link>

          {/* Playlists */}
          {playlists.map((playlist) => (
            <Link key={playlist.id} href={`/playlist/${playlist.id}`} legacyBehavior>
              <a className="group relative overflow-hidden rounded-xl bg-dark-tertiary/40 hover:bg-dark-tertiary/60 p-6 cursor-pointer transition-all hover:shadow-lg border border-transparent hover:border-accent-yellow">
                <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/40 to-accent-purple/40">
                  <Music className="h-16 w-16 text-accent-yellow" />
                </div>
                <h3 className="mt-4 text-xl font-semibold truncate">
                  {playlist.name}
                </h3>
                <p className="text-gray-400">
                  {playlist.tracks.length}{' '}
                  {playlist.tracks.length === 1 ? 'song' : 'songs'}
                </p>
              </a>
            </Link>
          ))}
        </div>

          {playlists.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <Music size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No playlists yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Create one to organize your favorite songs
            </p>
            <a
              href="https://www.instagram.com/sunnnyyy_________/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-6 py-2 bg-accent-yellow/20 border border-accent-yellow hover:bg-accent-yellow/40 text-accent-yellow rounded-full transition-all font-semibold text-sm"
            >
              Follow Creator 💫
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
