import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  youtubeId: string;
  channelId?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeat: 'off' | 'one' | 'all';
  shuffle: boolean;
  queue: Track[];
  queueIndex: number;
  likedTracks: Track[];
  playlists: Playlist[];
  
  // Player actions
  setCurrentTrack: (track: Track, queue?: Track[]) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setRepeat: (repeat: 'off' | 'one' | 'all') => void;
  setShuffle: (shuffle: boolean) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  // Liked tracks
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  
  // Playlist management
  createPlaylist: (name: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  getPlaylist: (playlistId: string) => Playlist | undefined;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 70,
      isMuted: false,
      repeat: 'off',
      shuffle: false,
      queue: [],
      queueIndex: 0,
      likedTracks: [],
      playlists: [],

      setCurrentTrack: (track, queue = []) =>
        set(() => ({
          currentTrack: track,
          queue: queue.length > 0 ? queue : [track],
          queueIndex: 0,
          currentTime: 0,
          isPlaying: true,
        })),

      setIsPlaying: (playing) => set(() => ({ isPlaying: playing })),

      setCurrentTime: (time) => set(() => ({ currentTime: time })),

      setDuration: (duration) => set(() => ({ duration })),

      setVolume: (volume) => set(() => ({ volume: Math.max(0, Math.min(100, volume)) })),

      setMuted: (muted) => set(() => ({ isMuted: muted })),

      setRepeat: (repeat) => set(() => ({ repeat })),

      setShuffle: (shuffle) => set(() => ({ shuffle })),

      nextTrack: () => {
        const state = get();
        if (state.queue.length === 0) return;

        let nextIndex = state.queueIndex + 1;
        if (nextIndex >= state.queue.length) {
          if (state.repeat === 'all') {
            nextIndex = 0;
          } else {
            set(() => ({ isPlaying: false }));
            return;
          }
        }

        const nextTrack = state.queue[nextIndex];
        set(() => ({
          currentTrack: nextTrack,
          queueIndex: nextIndex,
          currentTime: 0,
        }));
      },

      previousTrack: () => {
        const state = get();
        if (state.queue.length === 0) return;

        let prevIndex = state.queueIndex - 1;
        if (prevIndex < 0) {
          prevIndex = state.queue.length - 1;
        }

        const prevTrack = state.queue[prevIndex];
        set(() => ({
          currentTrack: prevTrack,
          queueIndex: prevIndex,
          currentTime: 0,
        }));
      },

      toggleLike: (track) =>
        set((state) => {
          const isLiked = state.likedTracks.some((t) => t.id === track.id);
          return {
            likedTracks: isLiked
              ? state.likedTracks.filter((t) => t.id !== track.id)
              : [...state.likedTracks, track],
          };
        }),

      isLiked: (trackId) => {
        const state = get();
        return state.likedTracks.some((t) => t.id === trackId);
      },

      createPlaylist: (name) =>
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              id: Date.now().toString(),
              name,
              tracks: [],
              createdAt: Date.now(),
            },
          ],
        })),

      addTrackToPlaylist: (playlistId, track) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  tracks: p.tracks.some((t) => t.id === track.id)
                    ? p.tracks
                    : [...p.tracks, track],
                }
              : p
          ),
        })),

      removeTrackFromPlaylist: (playlistId, trackId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  tracks: p.tracks.filter((t) => t.id !== trackId),
                }
              : p
          ),
        })),

      deletePlaylist: (playlistId) =>
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== playlistId),
        })),

      getPlaylist: (playlistId) => {
        const state = get();
        return state.playlists.find((p) => p.id === playlistId);
      },
    }),
    {
      name: 'player-store',
    }
  )
);
