# SoundWave - Complete Setup Guide

A production-ready Apple Music-inspired music streaming application built with Next.js, React, TypeScript, and Tailwind CSS.

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- YouTube API Key (free)

### Step 1: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select an existing one
3. In the sidebar, go to "APIs & Services" → "Library"
4. Search for "YouTube Data API v3"
5. Click on it and press "Enable"
6. Go to "Credentials" tab
7. Click "Create Credentials" → "API Key"
8. Copy your API key

### Step 2: Configure Environment

The `.env.local` file is already created. Add your API key:

```bash
# .env.local
NEXT_PUBLIC_YOUTUBE_API_KEY=your_actual_api_key_here
```

**Important**: Do NOT commit this file to git. It's in `.gitignore` for security.

### Step 3: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the SoundWave app with the home page showing trending music!

## Project Structure

```
soundwave/
├── app/
│   ├── api/
│   │   └── stream/route.ts          # Audio streaming API endpoint
│   ├── playlist/[id]/page.tsx       # Playlist detail page
│   ├── layout.tsx                   # Root layout (sidebar + player)
│   ├── page.tsx                     # Home page
│   ├── search/page.tsx              # Search functionality
│   ├── explore/page.tsx             # Explore categories
│   ├── library/page.tsx             # User library
│   ├── liked/page.tsx               # Liked songs
│   └── globals.css                  # Global styles
│
├── components/
│   ├── Sidebar.tsx                  # Navigation sidebar
│   ├── PlayerBar.tsx                # Bottom player with controls
│   ├── SongCard.tsx                 # Song grid card
│   ├── TrackList.tsx                # Track list view
│   └── SongSkeleton.tsx             # Loading skeletons
│
├── lib/
│   ├── store.ts                     # Zustand state management
│   └── youtube.ts                   # YouTube API service
│
├── package.json                     # Dependencies
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── next.config.js                  # Next.js configuration
└── README.md                       # Full documentation
```

## Architecture Overview

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + custom animations
- **Icons**: Lucide React
- **State**: Zustand with localStorage persistence

### Data Flow
```
User Input
    ↓
React Component
    ↓
Zustand Store (State Management)
    ↓
YouTube API (Search/Metadata)
    ↓
Invidious API (Audio Streaming)
    ↓
HTML5 Audio Element
    ↓
User Output (Sound)
```

### Pages & Routes

#### `/` - Home
- Displays trending music from India
- Grid card layout with hover effects
- Play button, like button, and quick actions
- Loading skeletons during fetch

#### `/search` - Search
- Real-time search with 500ms debounce
- Toggle between grid and list views
- Direct play from results
- Add to playlist functionality

#### `/explore` - Explore Categories
- 6 curated music categories
- Bollywood, Punjabi, Indie, Classical, International, Hip Hop
- Automatic loading with error handling
- Responsive grid layout

#### `/library` - Your Library
- Create new playlists
- View all playlists and liked songs
- Quick access to collections
- Playlist statistics

#### `/liked` - Liked Songs
- Your favorite saved tracks
- Track list with duration and artist
- Remove from likes with heart button
- Continuous playlist

#### `/playlist/[id]` - Playlist Details
- View all songs in a playlist
- Delete entire playlist
- Full track information
- Play songs in order

## Features Explained

### 1. Music Search
- Powered by YouTube Data API v3
- Searches videos by query
- Fetches metadata: title, artist, duration, thumbnail
- Results cached in state management

### 2. Audio Streaming
- Primary: Invidious API (privacy-friendly YouTube proxy)
- Fallback: Direct YouTube streams
- Handled via `/api/stream` Next.js route
- Seamless playback through HTML5 audio element

### 3. Player Bar
- **Bottom Player**: Always visible with current track info
- **Expanded Player**: Full-screen view with large controls
- **Controls**: Play, pause, next, previous, seek, volume
- **Features**: Repeat (off/all/one), Shuffle, Mute

### 4. State Management
- Global store using Zustand
- Persisted to localStorage automatically
- Manages: current track, queue, volume, liked songs, playlists
- No need for Redux/Context API complexity

### 5. Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly buttons
- Adaptive grid layouts
- Full-screen player on all devices

### 6. UI/UX Details
- Glassmorphism design with backdrop blur
- Smooth transitions and animations
- Loading skeletons for better UX
- Error states and empty states
- Dark mode by default
- Gradient text and accents

## Usage Guide

### Playing Music

1. **From Home**: Click the play button on any trending track
2. **From Search**: Search for an artist/song, then click play
3. **From Explore**: Browse categories and click to play
4. **From Liked**: Click any liked song to play

### Managing Playlists

1. Go to Library (sidebar)
2. Click "Create Playlist"
3. Enter playlist name and confirm
4. Add songs using the "+" button on song cards
5. View playlist songs and delete if needed

### Like Songs

- Click the heart icon on any song card
- Songs appear in "Liked Songs" page
- Likes persist in browser storage

### Player Controls

- **Play/Pause**: Center button
- **Skip**: Forward/backward arrows
- **Seek**: Drag progress bar
- **Volume**: Right side volume slider
- **Repeat**: Click to cycle (off → all → one)
- **Shuffle**: Toggle random play order
- **Expand**: Click on player to expand to full screen

## Environment Variables

### Required
```
NEXT_PUBLIC_YOUTUBE_API_KEY=your_key_here
```

The `NEXT_PUBLIC_` prefix makes it available in the browser. Ideally, you should:

1. Keep API key private in production
2. Use a backend proxy for API calls
3. Implement rate limiting
4. Monitor quota usage

### Optional (for future features)
```
# For deployment
NEXT_PUBLIC_APP_URL=https://soundwave.example.com

# For analytics
NEXT_PUBLIC_ANALYTICS_ID=your_id_here
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Customization Guide

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  'accent-pink': '#EC4899',    // Primary color
  'accent-purple': '#A855F7',  // Secondary color
  'accent-blue': '#3B82F6',    // Tertiary color
  'dark-bg': '#000000',        // Background
  'dark-secondary': '#121212', // Cards
  'dark-tertiary': '#282828',  // Hover states
}
```

### Add Music Categories

Edit `app/explore/page.tsx`:

```typescript
const EXPLORE_CATEGORIES = [
  { query: 'top reggae music', label: '🎸 Reggae Vibes' },
  { query: 'lofi hip hop beats', label: '🎵 Lo-Fi' },
  // Add more...
];
```

### Change Default Volume

Edit `lib/store.ts`:

```typescript
volume: 70,  // Change this (0-100)
```

### Modify Player Appearance

- Edit `components/PlayerBar.tsx` for player styling
- Edit `components/SongCard.tsx` for song cards
- Edit `globals.css` for animations

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable: `NEXT_PUBLIC_YOUTUBE_API_KEY`
6. Deploy!

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Server

1. Build: `npm run build`
2. Deploy `.next` folder
3. Run: `npm start`
4. Use PM2 or similar for process management

## Troubleshooting

### Issue: No Audio Playing
**Solution:**
- Check YouTube API key in `.env.local`
- Verify API is enabled in Google Cloud Console
- Try refreshing the page
- Check browser console for errors

### Issue: Search Returns No Results
**Solution:**
- Verify YouTube API quota hasn't exceeded
- Check internet connection
- Try a different search query
- Clear browser cache

### Issue: Playlists Not Saving
**Solution:**
- Ensure localStorage is enabled in browser
- Check browser storage isn't full
- Try incognito mode to test
- Clear browser cache and try again

### Issue: Build Fails
**Solution:**
```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## Performance Tips

### Frontend Optimization
- Images are optimized via Next.js Image component
- Lazy loading on routes
- Client-side caching with Zustand + localStorage
- Debounced search to reduce API calls

### API Optimization
- Search results cached for 1 hour
- Only fetch video duration once
- Reuse stream URL until track changes

### Browser Storage
- LocalStorage used for state persistence
- ~5-10MB available per domain
- Automatically manages old data

## Security Considerations

1. **API Key**: Keep in `.env.local`, never commit
2. **CORS**: YouTube API handles cross-origin
3. **Audio Streams**: Using Invidious API (privacy-focused)
4. **User Data**: All data stored locally, no server tracking
5. **Content**: Only official YouTube videos

For production:
- Use a backend proxy for API calls
- Implement rate limiting
- Add CORS headers
- Monitor API usage

## Future Enhancements

- [ ] User authentication
- [ ] Cloud playlist sync
- [ ] Lyrics with sync
- [ ] Recommendations engine
- [ ] Social sharing
- [ ] Offline mode
- [ ] Equalizer
- [ ] Queue visualization
- [ ] Podcast support
- [ ] Artist pages

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

MIT - Free to use for personal and commercial projects

---

Built with ❤️ for music lovers. Enjoy SoundWave!
