export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
};

const cache = new Map<string, YouTubeVideo | null>();

export async function fetchYouTubeVideo(videoId: string) {
  if (!videoId) return null;
  if (cache.has(videoId)) return cache.get(videoId) ?? null;
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    cache.set(videoId, null);
    return null;
  }
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`,
  );
  if (!response.ok) {
    cache.set(videoId, null);
    throw new Error(`YouTube API error: ${response.status}`);
  }
  const data = (await response.json()) as {
    items?: Array<{ id: string; snippet?: any }>;
  };
  const item = data.items?.[0];
  if (!item || !item.snippet) {
    cache.set(videoId, null);
    return null;
  }
  const video: YouTubeVideo = {
    id: videoId,
    title: item.snippet.title ?? "YouTube Video",
    description: item.snippet.description ?? "",
    channelTitle: item.snippet.channelTitle ?? "",
  };
  cache.set(videoId, video);
  return video;
}

export async function searchYouTubeVideo(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return null;
  const cacheKey = `search:${trimmed}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    cache.set(cacheKey, null);
    return null;
  }
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(trimmed)}&key=${apiKey}`,
  );
  if (!response.ok) {
    cache.set(cacheKey, null);
    throw new Error(`YouTube Search API error: ${response.status}`);
  }
  const data = (await response.json()) as {
    items?: Array<{ id?: { videoId?: string }; snippet?: any }>;
  };
  const item = data.items?.[0];
  const videoId = item?.id?.videoId;
  if (!videoId) {
    cache.set(cacheKey, null);
    return null;
  }
  const video: YouTubeVideo = {
    id: videoId,
    title: item?.snippet?.title ?? "YouTube Video",
    description: item?.snippet?.description ?? "",
    channelTitle: item?.snippet?.channelTitle ?? "",
  };
  cache.set(cacheKey, video);
  cache.set(videoId, video);
  return video;
}
