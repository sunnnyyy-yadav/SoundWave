# SoundWave - Apple Music-Inspired Music Streaming App

A modern, production-ready music streaming web application built with Next.js, TypeScript, Tailwind CSS, and the YouTube Data API. Features an Apple Music-inspired UI with dark mode, glassmorphism design, and full music player functionality.

## Features

### Core Features
- 🎵 **Stream Music**: Search and play music from YouTube via integrated API
- 🎨 **Apple Music UI**: Clean minimalist design with dark mode, glassmorphism, and smooth animations
- 📱 **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- 🔍 **Real-time Search**: Instant search results with YouTube Data API integration
- ❤️ **Like & Save**: Save favorite tracks locally
- 📝 **Playlists**: Create and manage custom playlists
- 🎵 **Persistent Player**: Bottom player bar with full controls and expandable view
- 📊 **Trending Music**: Discover trending songs from India and around the world
- 🌍 **Multi-category Explore**: Browse curated categories including Bollywood, Punjabi, Indie, etc.
- 💾 **Local Storage**: All data stored locally in browser (likes, playlists, metadata)

### Player Controls
- Play/Pause/Skip
- Seek bar with duration display
- Volume control with mute
- Repeat (off/all/one)
- Shuffle
- Full-screen expandable player view

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom animations
- **Icons**: Lucide React
- **State Management**: Zustand
- **API**: YouTube Data API v3
- **Storage**: Browser LocalStorage + IndexedDB ready

## Prerequisites

- Node.js 18+ 
- npm or yarn
- YouTube Data API Key (get it from [Google Cloud Console](https://console.cloud.google.com/))

## Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
# or
yarn install
```

### 2. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create an API key (Credentials → API Key)
5. Copy your API key

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

**Important**: The `NEXT_PUBLIC_` prefix makes it available in the browser. In production, consider using a backend proxy for better security.

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
soundwave/
├── app/
│   ├── api/
│   │   └── stream/           # Audio streaming endpoint
│   ├── layout.tsx            # Root layout with sidebar and player
│   ├── page.tsx              # Home page with trending music
│   ├── search/               # Search page
│   ├── explore/              # Explore categories
│   ├── library/              # User library & playlists
│   ├── liked/                # Liked songs page
│   └── playlist/[id]/        # Individual playlist page
│
├── components/
│   ├── Sidebar.tsx           # Main navigation sidebar
│   ├── PlayerBar.tsx         # Bottom player with controls
│   ├── SongCard.tsx          # Song card component
│   ├── TrackList.tsx         # Track list view
│   └── SongSkeleton.tsx      # Loading skeletons
│
├── lib/
│   ├── store.ts              # Zustand player state management
│   └── youtube.ts            # YouTube API integration
│
├── globals.css               # Global styles and animations
├── tailwind.config.ts        # Tailwind configuration
└── next.config.js            # Next.js configuration
```

## Usage

### Home Page
- View trending music from India
- Discover new artists and songs
- Click play to start listening

### Search
- Real-time search functionality
- Toggle between grid and list views
- Add tracks to playlists
- Like your favorite songs

### Explore
- Browse curated categories:
  - 🇮🇳 Bollywood Hits
  - 🎤 Punjabi Music
  - 🎸 Indie India
  - 🎹 Classical
  - 🌍 International Pop
  - 🎙️ Hip Hop

### Library
- View all liked songs
- Create custom playlists
- Manage playlist content
- Delete playlists

### Player
- **Bottom Player**: Always accessible with track info and basic controls
- **Expanded Player**: Click anywhere on the player to expand for full-screen view
- **Controls**: Play, pause, skip, seek, volume, repeat, shuffle
- **Playback**: Continuous playback with queue management

## Features in Detail

### State Management (Zustand)
- Global player state (current track, playback state, volume)
- Like/unlike tracks
- Playlist CRUD operations
- Local persistence via LocalStorage

### Search Integration
- Real-time YouTube search
- Duration fetching
- High-quality thumbnails
- Channel information

### Audio Streaming
- Uses Invidious API for audio extraction (privacy-friendly)
- Fallback to direct YouTube streams
- Seamless playback through HTML5 audio element
- Proper error handling

## Production Deployment

### On Vercel (Recommended)

```bash
# Deploy directly from GitHub
# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_YOUTUBE_API_KEY
```

### On Other Platforms

1. Build the app:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

### Production Notes

1. **API Key Security**: 
   - Rotate API keys regularly
   - Monitor YouTube API usage
   - Consider implementing backend proxy for sensitive operations

2. **Audio Streaming**:
   - Current implementation uses Invidious API for privacy
   - For production, consider using:
     - Dedicated YouTube proxy service
     - Your own yt-dlp server
     - Legally licensed music APIs

3. **Performance**:
   - Implement image optimization
   - Enable caching strategies
   - Use CDN for static assets
   - Monitor API quota usage

## Customization

### Change Color Scheme
Edit `tailwind.config.ts`:
```typescript
colors: {
  'accent-pink': '#EC4899',      // Change primary color
  'accent-purple': '#A855F7',    // Change secondary color
  'accent-blue': '#3B82F6',      // Change tertiary color
}
```

### Add More Categories
Edit `app/explore/page.tsx`:
```typescript
const EXPLORE_CATEGORIES = [
  { query: 'your query here', label: 'Category Name' },
  // Add more...
];
```

### Modify Player Colors
Edit `components/PlayerBar.tsx` and `components/SongCard.tsx` to change accent colors.

## Known Limitations

- Audio streaming relies on third-party services (Invidious)
- YouTube API has quota limits (1M units/day for free tier)
- Playlists stored locally (no cloud sync without backend)
- No user authentication (local storage only)

## Future Enhancements

- [ ] User authentication and cloud sync
- [ ] Lyrics integration with syncing
- [ ] Podcast support
- [ ] Offline download capability
- [ ] Social sharing features
- [ ] Equalizer and audio effects
- [ ] Queue management UI
- [ ] Recently played tracking
- [ ] Recommendations algorithm
- [ ] Dark/Light theme toggle

## Troubleshooting

### No audio playing
- Check YouTube API key in `.env.local`
- Verify API is enabled in Google Cloud Console
- Check browser console for CORS errors
- Try a different video

### Search not working
- Verify YouTube API quota hasn't exceeded
- Check API key permissions
- Clear browser cache and reload

### Playlists not persisting
- Check browser localStorage is enabled
- Clear storage and try again
- Check browser dev tools > Application > LocalStorage

## License

MIT - Feel free to use for personal and commercial projects

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify YouTube API configuration
4. Check GitHub issues

## Credits

- Inspired by Apple Music design
- YouTube Data API v3
- Built with Next.js, React, TypeScript, Tailwind CSS
- Icons from Lucide React
