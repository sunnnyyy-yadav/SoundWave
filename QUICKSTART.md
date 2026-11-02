# ⚡ SoundWave - Quick Start (5 Minutes)

## 1️⃣ Get YouTube API Key (2 min)

```
🌐 Visit: https://console.cloud.google.com/
📝 Steps:
  1. Create new project
  2. Enable YouTube Data API v3
  3. Create API Key in Credentials
  4. Copy your key
```

## 2️⃣ Configure App (1 min)

```bash
# Edit .env.local in project root
NEXT_PUBLIC_YOUTUBE_API_KEY=your_key_here
```

## 3️⃣ Start Development (1 min)

```bash
cd /Users/sunnyyadav/Kiro/quickbite-os/netflix/spotify
npm run dev
```

Open: http://localhost:3000

## 4️⃣ Test Features (1 min)

✅ Home page → Shows trending music
✅ Search → Type artist name
✅ Explore → Browse categories
✅ Create Playlist → Add songs
✅ Player → Click to play

---

## 🎯 Main Features

| Feature | How to Use |
|---------|-----------|
| **Search** | Type in search bar, click song to play |
| **Play Music** | Click play button on any song |
| **Playlists** | Go to Library → Create Playlist → Add songs |
| **Like Songs** | Click heart icon on any song |
| **Expand Player** | Click on player bar at bottom |
| **Skip Track** | Use forward/backward arrows |
| **Volume** | Right side of player bar |
| **Shuffle** | Toggle shuffle button |
| **Repeat** | Click repeat (off → all → one) |

---

## 📱 Navigation

- **🏠 Home** - Trending music from India
- **🔍 Search** - Find any song
- **🌍 Explore** - Browse genres & categories
- **📚 Library** - Your playlists
- **❤️ Liked Songs** - Saved tracks

---

## 🚀 Deploy to Production

### Option 1: Vercel (Easiest)
```
1. Push to GitHub
2. Go to vercel.com
3. Import repository
4. Add YouTube API key
5. Deploy! 🎉
```

### Option 2: Docker
```bash
docker build -t soundwave .
docker run -p 3000:3000 -e NEXT_PUBLIC_YOUTUBE_API_KEY=key soundwave
```

### Option 3: Manual
```bash
npm run build
npm start
```

---

## 🐛 Troubleshooting

**No songs showing?**
- Check YouTube API key in `.env.local`
- Verify API is enabled in Google Cloud
- Try refreshing page

**Can't hear audio?**
- Try different song
- Check volume not muted
- Check browser permissions

**Playlists not saving?**
- Enable localStorage in browser
- Try incognito mode
- Clear browser cache

---

## 📚 More Info

- **Setup Guide**: See `SETUP.md`
- **Deployment**: See `DEPLOY.md`
- **Full Docs**: See `README.md`

---

## 💡 Pro Tips

✨ All data saves locally - no login needed
✨ Search debounces after 500ms to save quota
✨ Click player to expand to full screen
✨ Playlists stored in browser localStorage
✨ Rotate API keys monthly for security

---

**That's it! You now have a fully functional music streaming app!** 🎵
