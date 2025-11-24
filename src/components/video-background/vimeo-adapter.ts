/**
 * Vimeo Video Adapter
 */

import { VideoAdapter, VideoAdapterOptions, VideoAdapterCallbacks, VideoState } from './video-adapter.js';
import { loadScript } from './utils.js';

declare global {
  interface Window {
    Vimeo: any;
  }
}

export class VimeoAdapter extends VideoAdapter {
  private player: any = null;
  private hash?: string;
  private initialPlay = false;

  constructor(options: VideoAdapterOptions, callbacks: VideoAdapterCallbacks, hash?: string) {
    super(options, callbacks);
    this.hash = hash;
  }

  async init(): Promise<void> {
    // Load Vimeo API
    await this.loadVimeoAPI();

    // Create iframe container
    const iframe = document.createElement('div');
    iframe.id = this.uid;
    iframe.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;
    this.element.appendChild(iframe);

    // Build Vimeo URL
    let vimeoUrl = `https://player.vimeo.com/video/${this.videoId}`;
    const params = new URLSearchParams({
      background: '1',
      autoplay: this.options.autoplay ? '1' : '0',
      loop: this.options.loop ? '1' : '0',
      muted: this.options.muted ? '1' : '0',
      dnt: this.options.noCookie ? '1' : '0',
      controls: '0',
      playsinline: '1',
    });

    vimeoUrl += `?${params.toString()}`;

    // Add hash for unlisted videos
    if (this.hash) {
      vimeoUrl += `#t=${this.options.startAt}s`;
    } else if (this.options.startAt > 0) {
      vimeoUrl += `#t=${this.options.startAt}s`;
    }

    // Create player
    try {
      this.player = new window.Vimeo.Player(iframe, {
        url: vimeoUrl,
        background: true,
        muted: this.options.muted,
        autoplay: this.options.autoplay,
        loop: this.options.loop,
        dnt: this.options.noCookie,
      });

      await this.setupEventListeners();
      this.playerElement = iframe;

      // Get duration
      this._duration = await this.player.getDuration();

      // Set initial volume
      if (!this.options.muted) {
        await this.player.setVolume(this.options.volume);
      }

      // Seek to start time if specified
      if (this.options.startAt > 0) {
        await this.player.setCurrentTime(this.options.startAt);
      }

      this.callbacks.onReady();
    } catch (error) {
      this.callbacks.onError(error as Error);
    }
  }

  private async loadVimeoAPI(): Promise<void> {
    if (window.Vimeo && window.Vimeo.Player) {
      return;
    }

    await loadScript('https://player.vimeo.com/api/player.js', 'vimeo-api');

    // Wait for Vimeo to be available
    return new Promise((resolve) => {
      const checkVimeo = () => {
        if (window.Vimeo && window.Vimeo.Player) {
          resolve();
        } else {
          setTimeout(checkVimeo, 50);
        }
      };
      checkVimeo();
    });
  }

  private async setupEventListeners(): Promise<void> {
    // Play event
    this.player.on('play', () => {
      this.setState('playing');
      this.callbacks.onPlay();
      this.initialPlay = true;
    });

    // Pause event
    this.player.on('pause', () => {
      this.setState('paused');
      this.callbacks.onPause();
    });

    // Ended event
    this.player.on('ended', () => {
      this.setState('ended');
      this.callbacks.onEnded();
    });

    // Time update event
    this.player.on('timeupdate', (data: any) => {
      const currentTime = data.seconds;
      this._currentTime = currentTime;
      this.triggerTimeUpdate(currentTime);

      // Check custom end time
      if (this.options.endAt > 0) {
        this.checkEndAt(currentTime);
      }
    });

    // Volume change event
    this.player.on('volumechange', (data: any) => {
      const volume = data.volume;
      this._volume = volume;
      this.triggerVolumeChange(volume);
    });

    // Buffering events
    this.player.on('bufferstart', () => {
      this.setState('buffering');
    });

    this.player.on('bufferend', () => {
      // Vimeo automatically resumes after buffering on initial load
      // We need to manually pause if autoplay is off and it's the first play
      if (!this.options.autoplay && !this.initialPlay) {
        this.player.pause().catch(() => {});
      }
    });

    // Error event
    this.player.on('error', (data: any) => {
      this.callbacks.onError(new Error(`Vimeo error: ${data.name || 'Unknown error'}`));
    });
  }

  async play(): Promise<void> {
    if (!this.player) return;

    try {
      await this.player.play();
    } catch (error) {
      this.callbacks.onError(error as Error);
    }
  }

  pause(): void {
    if (!this.player) return;
    this.player.pause().catch(() => {});
  }

  mute(): void {
    if (!this.player) return;
    this.player.setMuted(true).catch(() => {});
    this._muted = true;
  }

  unmute(): void {
    if (!this.player) return;
    this.player.setMuted(false).catch(() => {});
    this._muted = false;
    // Set volume when unmuting
    this.player.getVolume().then((volume: number) => {
      if (volume === 0) {
        this.player.setVolume(this.options.volume).catch(() => {});
      }
    });
  }

  setVolume(volume: number): void {
    if (!this.player) return;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.player.setVolume(clampedVolume).catch(() => {});
    this._volume = clampedVolume;
    this.triggerVolumeChange(clampedVolume);
  }

  getVolume(): number {
    return this._volume;
  }

  seek(percent: number): void {
    if (!this.player || !this._duration) return;
    const time = (percent / 100) * this._duration;
    this.seekTo(time);
  }

  seekTo(seconds: number): void {
    if (!this.player) return;
    this.player.setCurrentTime(seconds).catch(() => {});
  }

  getCurrentTime(): number {
    return this._currentTime;
  }

  getDuration(): number {
    return this._duration;
  }

  destroy(): void {
    if (this.player) {
      this.player.destroy().catch(() => {});
      this.player = null;
    }

    this.playerElement = null;
  }
}
