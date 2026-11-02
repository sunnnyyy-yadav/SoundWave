import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';

const YT_DLP_PATHS = [
  '/Library/Frameworks/Python.framework/Versions/3.13/bin/yt-dlp',
  '/usr/local/bin/yt-dlp',
  '/usr/bin/yt-dlp',
  'yt-dlp',
];

function findYtDlp(): string {
  for (const p of YT_DLP_PATHS) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  return 'yt-dlp';
}

// Cache video clips by videoId (in memory, reuse within the same process)
const clipCache = new Map<string, string>();

function downloadClip(videoId: string, outPath: string, ytDlpBin: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // Pick a random start time between 30–90 seconds to get a "random frame"
    const randomStart = Math.floor(Math.random() * 60) + 30;

    const args = [
      '-f', 'bestvideo[height<=480][ext=mp4]/bestvideo[height<=480]/bestvideo[ext=mp4]/bestvideo',
      '--download-sections', `*${randomStart}-${randomStart + 30}`,
      '--force-keyframes-at-cuts',
      '--no-playlist',
      '-o', outPath,
      '--quiet',
      url,
    ];

    const proc = spawn(ytDlpBin, args);
    let stderr = '';
    proc.stderr.on('data', (d: Buffer) => (stderr += d.toString()));

    proc.on('close', (code: number) => {
      if (code === 0 && fs.existsSync(outPath)) {
        resolve();
      } else {
        reject(new Error(`yt-dlp exit ${code}: ${stderr.slice(0, 300)}`));
      }
    });

    proc.on('error', (e: Error) => reject(e));

    // 45 second timeout for video download
    setTimeout(() => {
      proc.kill();
      reject(new Error('yt-dlp video download timed out'));
    }, 45_000);
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('id');

  if (!videoId) {
    return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
  }

  // If already cached, return direct URL
  if (clipCache.has(videoId)) {
    return NextResponse.json({ url: `/api/video-clip/serve?id=${videoId}`, cached: true });
  }

  const ytDlp = findYtDlp();
  const tmpDir = path.join(os.tmpdir(), 'mix-clips');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const outPath = path.join(tmpDir, `${videoId}.mp4`);

  // If file already on disk (from a previous server run), use it
  if (fs.existsSync(outPath)) {
    clipCache.set(videoId, outPath);
    return NextResponse.json({ url: `/api/video-clip/serve?id=${videoId}` });
  }

  try {
    await downloadClip(videoId, outPath, ytDlp);
    clipCache.set(videoId, outPath);
    return NextResponse.json({ url: `/api/video-clip/serve?id=${videoId}` });
  } catch (err: any) {
    console.warn('[video-clip] download failed:', err.message);
    // Return no URL — client falls back to blurred thumbnail
    return NextResponse.json({ url: null, error: err.message }, { status: 200 });
  }
}
