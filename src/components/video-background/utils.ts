/**
 * Utility functions for video-background component
 */

export type VideoType = 'youtube' | 'vimeo' | 'video';

export interface VideoInfo {
  type: VideoType;
  id: string;
  url: string;
  hash?: string; // For Vimeo unlisted videos
}

/**
 * Generates a unique ID for video instances
 */
export function generateUID(videoId: string): string {
  return `vbg-${videoId}-${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Detects video type from URL
 */
export function detectVideoType(url: string): VideoType | null {
  if (!url) return null;

  // YouTube patterns
  if (
    url.includes('youtube.com/watch') ||
    url.includes('youtube.com/embed') ||
    url.includes('youtu.be/') ||
    url.includes('youtube-nocookie.com')
  ) {
    return 'youtube';
  }

  // Vimeo patterns
  if (url.includes('vimeo.com/')) {
    return 'vimeo';
  }

  // Video file patterns
  const videoExtensions = ['.mp4', '.webm', '.ogv', '.ogg', '.mov', '.avi', '.mkv'];
  if (videoExtensions.some(ext => url.toLowerCase().includes(ext))) {
    return 'video';
  }

  return null;
}

/**
 * Extracts YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Extracts Vimeo video ID and optional hash from URL
 */
export function extractVimeoInfo(url: string): { id: string; hash?: string } | null {
  // Pattern: vimeo.com/{id} or vimeo.com/{id}/{hash}
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);

  if (match) {
    return {
      id: match[1],
      hash: match[2],
    };
  }

  return null;
}

/**
 * Parses video URL and extracts relevant information
 */
export function parseVideoUrl(url: string): VideoInfo | null {
  const type = detectVideoType(url);
  if (!type) return null;

  switch (type) {
    case 'youtube': {
      const id = extractYouTubeId(url);
      if (!id) return null;
      return { type, id, url };
    }
    case 'vimeo': {
      const info = extractVimeoInfo(url);
      if (!info) return null;
      return { type, id: info.id, url, hash: info.hash };
    }
    case 'video': {
      return { type, id: url, url };
    }
  }

  return null;
}

/**
 * Gets MIME type from video file extension
 */
export function getMimeType(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    ogg: 'video/ogg',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
  };

  return mimeTypes[extension || ''] || 'video/mp4';
}

/**
 * Checks if device is mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Parses aspect ratio string to width/height ratio
 */
export function parseAspectRatio(resolution: string): number {
  const parts = resolution.split(':').map(Number);
  if (parts.length === 2 && parts[0] && parts[1]) {
    return parts[0] / parts[1];
  }
  return 16 / 9; // Default
}

/**
 * Loads external script dynamically
 */
export function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}
