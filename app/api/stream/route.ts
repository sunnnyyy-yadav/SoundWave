import { NextRequest, NextResponse } from 'next/server';
import { Ytdl } from '@distube/ytdl-core';

const ytdl = new Ytdl();

async function getAudioUrl(videoId: string): Promise<{ url: string; mimeType: string }> {
  const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);

  // Prefer high-quality audio-only formats
  const audioFormats = info.formats
    .filter((f) => f.hasAudio && !f.hasVideo && f.url)
    .sort((a, b) => (b.audioBitrate ?? 0) - (a.audioBitrate ?? 0));

  if (audioFormats.length === 0) {
    throw new Error('No audio-only formats found');
  }

  const best = audioFormats[0];
  return {
    url: best.url!,
    mimeType: best.mimeType?.split(';')[0] ?? 'audio/mp4',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/stream?id=VIDEO_ID[&proxy=1]
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('id');
  const proxy = searchParams.get('proxy');

  if (!videoId) {
    return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
  }

  try {
    const { url: streamUrl, mimeType } = await getAudioUrl(videoId);

    // JSON mode — client plays CDN URL directly (fast, but may CORS in prod)
    if (!proxy) {
      return NextResponse.json({ url: streamUrl, mimeType });
    }

    // Proxy mode — pipe bytes through Next.js (avoids CORS/signed-URL issues)
    const rangeHeader = request.headers.get('range') ?? undefined;
    const upstreamHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Referer: 'https://www.youtube.com/',
      Origin: 'https://www.youtube.com',
    };
    if (rangeHeader) upstreamHeaders['Range'] = rangeHeader;

    const upstream = await fetch(streamUrl, { headers: upstreamHeaders });

    const headers = new Headers();
    for (const key of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
      const val = upstream.headers.get(key);
      if (val) headers.set(key, val);
    }
    // Force correct MIME if missing
    if (!headers.get('content-type')) headers.set('content-type', mimeType);
    headers.set('Cache-Control', 'no-store');
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (err: any) {
    console.error('[stream] failed:', err.message);
    return NextResponse.json(
      { error: 'Audio extraction failed', detail: err.message },
      { status: 502 }
    );
  }
}
