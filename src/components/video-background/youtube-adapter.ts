/**
 * YouTube Video Adapter
 */

import { VideoAdapter, VideoAdapterOptions, VideoAdapterCallbacks, VideoState } from './video-adapter.js';
import { loadScript } from './utils.js';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export class YouTubeAdapter extends VideoAdapter {
  private player: any = null;
  private timeUpdateInterval: number | null = null;
  private apiReady = false;

  constructor(options: VideoAdapterOptions, callbacks: VideoAdapterCallbacks) {
    super(options, callbacks);
  }

  async init(): Promise<void> {
    // Load YouTube API
    await this.loadYouTubeAPI();

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

    // Build player vars
    const playerVars: any = {
      autoplay: this.options.autoplay ? 1 : 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
      loop: this.options.loop ? 1 : 0,
      playlist: this.options.loop ? this.videoId : undefined,
    };

    if (this.options.startAt > 0) {
      playerVars.start = this.options.startAt;
    }

    if (this.options.endAt > 0 && !this.options.loop) {
      playerVars.end = this.options.endAt;
    }

    // Determine host (cookie vs no-cookie)
    const host = this.options.noCookie
      ? 'https://www.youtube-nocookie.com'
      : 'https://www.youtube.com';

    // Create player with initial dimensions
    return new Promise((resolve, reject) => {
      try {
        this.player = new window.YT.Player(this.uid, {
          host,
          videoId: this.videoId,
          width: '100%',
          height: '100%',
          playerVars,
          events: {
            onReady: (event: any) => {
              this.onPlayerReady(event);
              resolve();
            },
            onStateChange: (event: any) => this.onPlayerStateChange(event),
            onError: (event: any) => this.onPlayerError(event),
          },
        });

        this.playerElement = iframe;
      } catch (error) {
        reject(error);
      }
    });
  }

  private async loadYouTubeAPI(): Promise<void> {
    if (window.YT && window.YT.Player) {
      this.apiReady = true;
      return;
    }

    return new Promise((resolve, reject) => {
      // Set up callback for when API is ready
      const originalCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        this.apiReady = true;
        if (originalCallback) originalCallback();
        resolve();
      };

      // Load the API script
      loadScript('https://www.youtube.com/iframe_api', 'youtube-api')
        .catch(reject);
    });
  }

  private onPlayerReady(event: any): void {
    // Set initial volume and mute state
    if (this.options.muted) {
      this.player.mute();
    } else {
      this.player.unMute();
      this.player.setVolume(this.options.volume * 100);
    }

    // Start time update polling
    this.startTimeUpdatePolling();

    // Get duration
    this._duration = this.player.getDuration();

    this.callbacks.onReady();
  }

  private onPlayerStateChange(event: any): void {
    const stateMap: Record<number, VideoState> = {
      [-1]: 'notstarted',
      [0]: 'ended',
      [1]: 'playing',
      [2]: 'paused',
      [3]: 'buffering',
      [5]: 'notstarted',
    };

    const state = stateMap[event.data] || 'notstarted';
    this.setState(state);

    // Fire specific callbacks
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        this.callbacks.onPlay();
        break;
      case window.YT.PlayerState.PAUSED:
        this.callbacks.onPause();
        break;
      case window.YT.PlayerState.ENDED:
        this.callbacks.onEnded();
        break;
    }
  }

  private onPlayerError(event: any): void {
    const errorMessages: Record<number, string> = {
      2: 'Invalid video ID',
      5: 'HTML5 player error',
      100: 'Video not found',
      101: 'Video not allowed to be played in embedded players',
      150: 'Video not allowed to be played in embedded players',
    };

    const message = errorMessages[event.data] || `YouTube error: ${event.data}`;
    this.callbacks.onError(new Error(message));
  }

  private startTimeUpdatePolling(): void {
    if (this.timeUpdateInterval) return;

    this.timeUpdateInterval = window.setInterval(() => {
      if (!this.player || !this.player.getCurrentTime) return;

      const currentTime = this.player.getCurrentTime();
      this._currentTime = currentTime;
      this.triggerTimeUpdate(currentTime);

      // Check custom end time for loop mode
      if (this.options.loop && this.options.endAt > 0) {
        this.checkEndAt(currentTime);
      }
    }, 250);
  }

  private stopTimeUpdatePolling(): void {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  async play(): Promise<void> {
    if (!this.player || !this.player.playVideo) return;
    this.player.playVideo();
  }

  pause(): void {
    if (!this.player || !this.player.pauseVideo) return;
    this.player.pauseVideo();
  }

  mute(): void {
    if (!this.player || !this.player.mute) return;
    this.player.mute();
    this._muted = true;
  }

  unmute(): void {
    if (!this.player || !this.player.unMute) return;
    this.player.unMute();
    this._muted = false;
    // Set volume when unmuting
    if (this.player.getVolume() === 0) {
      this.player.setVolume(this.options.volume * 100);
    }
  }

  setVolume(volume: number): void {
    if (!this.player || !this.player.setVolume) return;
    this.player.setVolume(Math.max(0, Math.min(1, volume)) * 100);
    this._volume = volume;
    this.triggerVolumeChange(volume);
  }

  getVolume(): number {
    if (!this.player || !this.player.getVolume) return 0;
    return this.player.getVolume() / 100;
  }

  seek(percent: number): void {
    if (!this.player || !this._duration) return;
    const time = (percent / 100) * this._duration;
    this.seekTo(time);
  }

  seekTo(seconds: number): void {
    if (!this.player || !this.player.seekTo) return;
    this.player.seekTo(seconds, true);
  }

  getCurrentTime(): number {
    if (!this.player || !this.player.getCurrentTime) return 0;
    return this.player.getCurrentTime();
  }

  getDuration(): number {
    if (!this.player || !this.player.getDuration) return 0;
    return this.player.getDuration();
  }

  destroy(): void {
    this.stopTimeUpdatePolling();

    if (this.player && this.player.destroy) {
      this.player.destroy();
      this.player = null;
    }

    this.playerElement = null;
  }
}
