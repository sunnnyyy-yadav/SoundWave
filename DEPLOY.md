# 🚀 Deployment Guide - SoundWave

Complete guide for deploying SoundWave to production environments.

---

## Local Verification Checklist

Before deploying, verify everything works locally:

```bash
# ✅ 1. Start development server
npm run dev
# Check: http://localhost:3000 loads

# ✅ 2. Test all pages
- Visit home page (should show trending)
- Try searching for a song
- Check explore page categories
- Open liked songs
- Create a playlist

# ✅ 3. Test player functionality
- Play a song (should show in player)
- Test pause/resume
- Check seek bar works
- Verify volume control
- Test repeat and shuffle

# ✅ 4. Test storage
- Refresh page (state should persist)
- Like a song (should stay after refresh)
- Create playlist (should persist)
- Clear localStorage (npm run dev, open DevTools)

# ✅ 5. Production build
npm run build
npm start
# Check: App works at http://localhost:3000
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended) ⭐

**Easiest & fastest deployment**

#### Setup

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/soundwave.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com/)
3. Click "New Project"
4. Connect GitHub repository
5. Configure environment variables:
   - Add `NEXT_PUBLIC_YOUTUBE_API_KEY`
6. Click Deploy

**That's it!** Your app is live at `soundwave.vercel.app`

#### Configuration

```
Framework: Next.js
Build Command: next build
Output Directory: .next
Node Version: 18.x (recommended)
```

#### Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
Key: NEXT_PUBLIC_YOUTUBE_API_KEY
Value: your_actual_api_key
Environments: Production, Preview, Development
```

---

### Option 2: AWS Amplify

#### Step 1: Build
```bash
npm run build
```

#### Step 2: Create Amplify App
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

#### Configuration File (amplify.yml)
```yaml
version: 1

frontend:
  phases:
    build:
      commands:
        - npm install
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

### Option 3: Railway

1. Go to [railway.app](https://railway.app/)
2. Create new project
3. Connect GitHub
4. Add environment variables
5. Deploy

Railway automatically detects Next.js and configures it.

---

### Option 4: Docker Deployment

#### Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
```

#### Build and Run

```bash
# Build image
docker build -t soundwave:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_YOUTUBE_API_KEY=your_key \
  soundwave:latest
```

#### Docker Compose

```yaml
version: '3.8'

services:
  soundwave:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_YOUTUBE_API_KEY=${YOUTUBE_API_KEY}
    restart: unless-stopped
```

---

### Option 5: Manual Server (VPS)

#### Server Setup

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone repository
git clone https://github.com/yourusername/soundwave.git
cd soundwave

# 4. Install dependencies
npm ci --only=production

# 5. Build application
npm run build

# 6. Setup PM2 (process manager)
npm install -g pm2
pm2 start npm --name "soundwave" -- start

# 7. Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/soundwave
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable and Start

```bash
sudo ln -s /etc/nginx/sites-available/soundwave \
  /etc/nginx/sites-enabled/

sudo systemctl restart nginx

# Verify running
pm2 status
```

---

## Environment Variables for Production

### Required
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
```

### Optional
```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=SoundWave

# Analytics (if using)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Sentry Error Tracking (if using)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

---

## Performance Optimization

### Build Size Analysis
```bash
npm run build
# Check: .next/static folder size

npm install -g @next/bundle-analyzer
# Add to next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
# Run: ANALYZE=true npm run build
```

### Image Optimization
- Already optimized via `next/image`
- Automatic srcset generation
- Format conversion (WebP)
- Lazy loading

### Caching Strategy
```javascript
// next.config.js
headers: async () => {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
}
```

---

## Security Checklist

- ✅ API key in `.env.local` only (not in git)
- ✅ HTTPS enabled on production domain
- ✅ Security headers configured
- ✅ CORS properly set
- ✅ Input validation on search
- ✅ No sensitive data in localStorage warnings
- ✅ Content Security Policy headers
- ✅ Rate limiting on API endpoint

### Security Headers

Add to `next.config.js`:

```javascript
headers: async () => {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ];
}
```

---

## Monitoring & Maintenance

### Monitoring Tools

1. **Vercel Analytics** (if using Vercel)
   - Real User Monitoring (RUM)
   - Core Web Vitals
   - Performance metrics

2. **Sentry** (Error tracking)
```bash
npm install @sentry/nextjs
```

3. **Google Analytics**
```bash
npm install gtag
```

### Log Monitoring

```bash
# View production logs (Vercel)
vercel logs

# View server logs (VPS)
pm2 logs soundwave
```

### YouTube API Quota Monitoring

- Check Google Cloud Console daily
- Set up quota alerts
- Monitor for unusual usage
- Keep API keys rotated

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Troubleshooting Deployment

### Issue: API Key Not Working
```bash
# Check env variable
echo $NEXT_PUBLIC_YOUTUBE_API_KEY

# Verify in deployment platform
# Restart application after changing env
```

### Issue: Build Fails
```bash
# Clear build cache
rm -rf .next .turbo node_modules

# Rebuild
npm install
npm run build
```

### Issue: High CPU Usage
```bash
# Check API quota usage
# Optimize database queries
# Enable caching headers
# Reduce update frequency
```

### Issue: 404 on Subpages
- Check routing configuration
- Verify `next.config.js`
- Ensure `app` directory structure is correct

---

## Rollback Procedure

### Vercel Rollback
1. Go to Vercel Dashboard
2. Select project
3. Go to Deployments
4. Click on previous deployment
5. Click "Redeploy"

### GitHub Rollback
```bash
git revert <commit-hash>
git push origin main
```

### Docker Rollback
```bash
docker tag soundwave:latest soundwave:previous
docker run -p 3000:3000 soundwave:previous
```

---

## Post-Deployment

### Testing Checklist
- [ ] All pages load correctly
- [ ] Search functionality works
- [ ] Player plays audio
- [ ] Playlists save properly
- [ ] Liked songs persist
- [ ] No console errors
- [ ] Mobile responsive works
- [ ] API responses are fast

### Performance Metrics

**Target Metrics:**
- FCP (First Contentful Paint): < 1.8s
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- TTFB (Time to First Byte): < 600ms

Check with:
- Vercel Analytics
- Google PageSpeed Insights
- WebPageTest

---

## Domain & SSL

### Setup Custom Domain

**Vercel:**
1. Go to Project Settings
2. Domains
3. Add your domain
4. Follow DNS setup instructions

**Other Platforms:**
1. Add CNAME record to DNS
2. Point to platform URL
3. Wait for verification (24-48 hours)

### SSL Certificate

- Vercel: Automatic (Let's Encrypt)
- AWS: Automatic or AWS Certificate Manager
- Manual: Use Let's Encrypt (certbot)

---

## Version Updates

### Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Major version updates (test carefully)
npm install next@latest
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Docker Guide**: https://docs.docker.com/
- **Nginx Guide**: https://nginx.org/en/docs/

---

## Quick Deploy Checklist

- [ ] YouTube API key obtained
- [ ] `.env.local` configured
- [ ] `npm run build` succeeds
- [ ] Local testing complete
- [ ] Code pushed to GitHub
- [ ] Deployment platform selected
- [ ] Environment variables set
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Monitoring setup
- [ ] Post-deployment tests pass

**You're ready to go live! 🚀**

---

Built with ❤️ by SoundWave Team
