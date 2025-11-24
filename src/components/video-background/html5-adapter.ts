/**
 * HTML5 Video Adapter
 */

import { VideoAdapter, VideoAdapterOptions, VideoAdapterCallbacks } from './video-adapter.js';
import { getMimeType } from './utils.js';

export class HTML5Adapter extends VideoAdapter {
  private video: HTMLVideoElement | null = null;

  constructor(options: VideoAdapterOptions, callbacks: VideoAdapterCallbacks) {
    super(options, callbacks);
  }

  async init(): Promise<void> {
    this.video = document.createElement('video');
    this.video.id = this.uid;
    this.video.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      object-fit: cover;
    `;

    // Set attributes
    this.video.muted = this.options.muted;
    this.video.loop = this.options.loop;
    this.video.playsInline = true;
    this.video.setAttribute('playsinline', '');

    if (this.options.autoplay) {
      this.video.autoplay = true;
    }

    // Lazy loading support
    this.video.loading = 'lazy';

    // Set source
    const source = document.createElement('source');
    source.src = this.videoId;
    source.type = getMimeType(this.videoId);
    this.video.appendChild(source);

    // Event listeners
    this.video.addEventListener('loadedmetadata', () => {
      this._duration = this.video!.duration;
      if (this.options.startAt > 0) {
        this.video!.currentTime = this.options.startAt;
      }
    });

    this.video.addEventListener('canplay', () => {
      this.callbacks.onReady();
    });

    this.video.addEventListener('play', () => {
      this.setState('playing');
      this.callbacks.onPlay();
    });

    this.video.addEventListener('pause', () => {
      this.setState('paused');
      this.callbacks.onPause();
    });

    this.video.addEventListener('ended', () => {
      this.setState('ended');
      this.callbacks.onEnded();
    });

    this.video.addEventListener('timeupdate', () => {
      const currentTime = this.video!.currentTime;
      this._currentTime = currentTime;
      this.triggerTimeUpdate(currentTime);
      this.checkEndAt(currentTime);
    });

    this.video.addEventListener('volumechange', () => {
      const volume = this.video!.volume;
      this._volume = volume;
      this._muted = this.video!.muted;
      this.triggerVolumeChange(volume);
    });

    this.video.addEventListener('waiting', () => {
      this.setState('buffering');
    });

    this.video.addEventListener('error', (e) => {
      const error = this.video!.error;
      this.callbacks.onError(
        new Error(error ? `Video error: ${error.message}` : 'Unknown video error')
      );
    });

    this.playerElement = this.video;
    this.element.appendChild(this.video);

    // Set initial volume (defer if muted for autoplay policy)
    if (!this.options.muted) {
      this.video.volume = this.options.volume;
    }
  }

  async play(): Promise<void> {
    if (!this.video) return;

    try {
      await this.video.play();
    } catch (error) {
      this.callbacks.onError(error as Error);
    }
  }

  pause(): void {
    if (!this.video) return;
    this.video.pause();
  }

  mute(): void {
    if (!this.video) return;
    this.video.muted = true;
    this._muted = true;
  }

  unmute(): void {
    if (!this.video) return;
    this.video.muted = false;
    this._muted = false;
    // Set volume when unmuting
    if (this.video.volume === 0) {
      this.video.volume = this.options.volume;
    }
  }

  setVolume(volume: number): void {
    if (!this.video) return;
    this.video.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.video?.volume ?? 0;
  }

  seek(percent: number): void {
    if (!this.video || !this._duration) return;
    const time = (percent / 100) * this._duration;
    this.seekTo(time);
  }

  seekTo(seconds: number): void {
    if (!this.video) return;

    // Use fastSeek if available for better performance
    if ('fastSeek' in this.video) {
      (this.video as any).fastSeek(seconds);
    } else {
      this.video.currentTime = seconds;
    }
  }

  getCurrentTime(): number {
    return this.video?.currentTime ?? 0;
  }

  getDuration(): number {
    return this.video?.duration ?? 0;
  }

  destroy(): void {
    if (this.video) {
      this.video.pause();
      this.video.src = '';
      this.video.load();
      this.video.remove();
      this.video = null;
    }
    this.playerElement = null;
  }
}
