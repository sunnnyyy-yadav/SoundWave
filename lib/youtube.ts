import axios from 'axios';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    channelId: string;
  };
}

interface YouTubePlaylistItem {
  contentDetails: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    channelId: string;
  };
}

interface YouTubeVideoDetails {
  items: Array<{
    contentDetails: {
      duration: string;
    };
  }>;
}

export async function searchTracks(query: string, maxResults = 20) {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        key: YOUTUBE_API_KEY,
        relevanceLanguage: 'en',
      },
    });

    const tracks = response.data.items.map((item: YouTubeSearchResult) => {
      const videoId = item.id.videoId;
      return {
        id: `${videoId}-${Date.now()}`,
        youtubeId: videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        // Use maxresdefault for maximum HD quality, fallback to high/medium if not available
        thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        duration: 0,
        channelId: item.snippet.channelId,
      };
    });

    // Fetch duration for all videos
    const videoIds = tracks.map((t: any) => t.youtubeId).join(',');
    const durationResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'contentDetails',
        id: videoIds,
        key: YOUTUBE_API_KEY,
      },
    });

    const durations = durationResponse.data.items;
    tracks.forEach((track: any, index: number) => {
      if (durations[index]) {
        track.duration = parseDuration(durations[index].contentDetails.duration);
      }
    });

    return tracks;
  } catch (error) {
    console.error('YouTube search error:', error);
    throw error;
  }
}

export async function getTrendingTracks(region = 'IN', maxResults = 20) {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: 'trending music india latest hits',
        type: 'video',
        maxResults,
        key: YOUTUBE_API_KEY,
        regionCode: region,
        order: 'viewCount',
        relevanceLanguage: 'en',
      },
    });

    const tracks = response.data.items.map((item: YouTubeSearchResult) => {
      const videoId = item.id.videoId;
      return {
        id: `${videoId}-${Date.now()}`,
        youtubeId: videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        // Use maxresdefault for maximum HD quality
        thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        duration: 0,
        channelId: item.snippet.channelId,
      };
    });

    // Fetch duration for all videos
    const videoIds = tracks.map((t: any) => t.youtubeId).join(',');
    const durationResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'contentDetails',
        id: videoIds,
        key: YOUTUBE_API_KEY,
      },
    });

    const durations = durationResponse.data.items;
    tracks.forEach((track: any, index: number) => {
      if (durations[index]) {
        track.duration = parseDuration(durations[index].contentDetails.duration);
      }
    });

    return tracks;
  } catch (error) {
    console.error('YouTube trending error:', error);
    throw error;
  }
}

function parseDuration(duration: string): number {
  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const matches = duration.match(regex);

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (matches?.[1]) hours = parseInt(matches[1], 10);
  if (matches?.[2]) minutes = parseInt(matches[2], 10);
  if (matches?.[3]) seconds = parseInt(matches[3], 10);

  return hours * 3600 + minutes * 60 + seconds;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
