import { useEffect, useState } from "react";
import {
  fetchYouTubeVideo,
  searchYouTubeVideo,
  type YouTubeVideo,
} from "@/services/youtube";

type LessonVideoProps = {
  videoId?: string;
  searchQuery?: string;
  title?: string;
};

export function LessonVideo({ videoId, searchQuery, title }: LessonVideoProps) {
  const [resolvedVideoId, setResolvedVideoId] = useState<string | null>(
    videoId ?? null,
  );
  const [info, setInfo] = useState<YouTubeVideo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const hasApiKey = Boolean(import.meta.env.VITE_YOUTUBE_API_KEY);

  useEffect(() => {
    let active = true;
    setError(null);
    setInfo(null);

    if (videoId) {
      setResolvedVideoId(videoId);
      setSearching(false);
      return () => {
        active = false;
      };
    }

    if (!searchQuery) {
      setResolvedVideoId(null);
      setSearching(false);
      if (!hasApiKey) {
        setError("Add a YouTube API key to show lesson videos.");
      }
      return () => {
        active = false;
      };
    }

    if (!hasApiKey) {
      setResolvedVideoId(null);
      setSearching(false);
      setError("Add a YouTube API key to show lesson videos.");
      return () => {
        active = false;
      };
    }

    setSearching(true);
    searchYouTubeVideo(searchQuery)
      .then((video) => {
        if (!active) return;
        setSearching(false);
        if (video) {
          setResolvedVideoId(video.id);
          setInfo(video);
        } else {
          setResolvedVideoId(null);
          setError("No video found for this lesson yet.");
        }
      })
      .catch((err) => {
        console.error(err);
        if (!active) return;
        setSearching(false);
        setResolvedVideoId(null);
        setError("Unable to find a lesson video right now.");
      });

    return () => {
      active = false;
    };
  }, [videoId, searchQuery, hasApiKey]);

  useEffect(() => {
    if (!resolvedVideoId) {
      setLoadingDetails(false);
      return;
    }

    if (!hasApiKey) {
      setLoadingDetails(false);
      return;
    }

    if (info?.id === resolvedVideoId) {
      setLoadingDetails(false);
      return;
    }

    let active = true;
    setLoadingDetails(true);
    fetchYouTubeVideo(resolvedVideoId)
      .then((data) => {
        if (!active) return;
        setLoadingDetails(false);
        if (data) {
          setInfo(data);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!active) return;
        setLoadingDetails(false);
        setError((prev) => prev ?? "Unable to load video details right now.");
      });

    return () => {
      active = false;
    };
  }, [resolvedVideoId, hasApiKey, info?.id]);

  const isLoading = searching || (resolvedVideoId && loadingDetails && !info);
  const iframeTitle = title ?? info?.title ?? "Lesson video";

  return (
    <div className="space-y-3">
      {resolvedVideoId ? (
        <div className="aspect-video overflow-hidden rounded-lg border bg-black">
          <iframe
            title={iframeTitle}
            src={`https://www.youtube.com/embed/${resolvedVideoId}?rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted/40 p-6 text-center text-sm text-foreground/60">
          {error ?? "Lesson video will appear here when available."}
        </div>
      )}
      <div className="rounded-md border bg-muted/40 p-3 text-sm text-foreground">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : info ? (
          <div className="space-y-1">
            <p className="font-semibold leading-tight">{info.title}</p>
            <p className="text-xs text-foreground/70">{info.channelTitle}</p>
            {info.description && (
              <p className="text-xs text-foreground/70 line-clamp-3">
                {info.description}
              </p>
            )}
          </div>
        ) : isLoading ? (
          <p className="text-foreground/70">Loading video details…</p>
        ) : hasApiKey ? (
          <p className="text-foreground/70">
            Lesson video is ready to play above.
          </p>
        ) : (
          <p className="text-foreground/70">
            Add a YouTube API key to load lesson video details.
          </p>
        )}
      </div>
    </div>
  );
}
