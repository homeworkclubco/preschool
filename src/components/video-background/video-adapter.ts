/**
 * Abstract base class for video adapters
 */

export type VideoState = 'notstarted' | 'playing' | 'paused' | 'ended' | 'buffering';

export interface VideoAdapterOptions {
  element: HTMLElement;
  uid: string;
  videoId: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  volume: number;
  startAt: number;
  endAt: number;
  noCookie: boolean;
}

export interface VideoAdapterCallbacks {
  onReady: () => void;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  onTimeUpdate: (currentTime: number) => void;
  onVolumeChange: (volume: number) => void;
  onStateChange: (state: VideoState) => void;
  onError: (error: Error) => void;
}

export abstract class VideoAdapter {
  protected element: HTMLElement;
  protected uid: string;
  protected videoId: string;
  protected options: VideoAdapterOptions;
  protected callbacks: VideoAdapterCallbacks;
  protected playerElement: HTMLElement | null = null;
  protected currentState: VideoState = 'notstarted';
  protected _currentTime = 0;
  protected _duration = 0;
  protected _volume = 1;
  protected _muted = true;

  constructor(options: VideoAdapterOptions, callbacks: VideoAdapterCallbacks) {
    this.element = options.element;
    this.uid = options.uid;
    this.videoId = options.videoId;
    this.options = options;
    this.callbacks = callbacks;
    this._volume = options.volume;
    this._muted = options.muted;
  }

  /**
   * Initialize the player
   */
  abstract init(): Promise<void>;

  /**
   * Play the video
   */
  abstract play(): Promise<void>;

  /**
   * Pause the video
   */
  abstract pause(): void;

  /**
   * Mute the video
   */
  abstract mute(): void;

  /**
   * Unmute the video
   */
  abstract unmute(): void;

  /**
   * Set volume (0-1)
   */
  abstract setVolume(volume: number): void;

  /**
   * Get current volume (0-1)
   */
  abstract getVolume(): number;

  /**
   * Seek to percentage (0-100)
   */
  abstract seek(percent: number): void;

  /**
   * Seek to specific time in seconds
   */
  abstract seekTo(seconds: number): void;

  /**
   * Get current playback time
   */
  abstract getCurrentTime(): number;

  /**
   * Get video duration
   */
  abstract getDuration(): number;

  /**
   * Destroy the player and cleanup
   */
  abstract destroy(): void;

  /**
   * Get the player DOM element
   */
  getPlayerElement(): HTMLElement | null {
    return this.playerElement;
  }

  /**
   * Get current state
   */
  getState(): VideoState {
    return this.currentState;
  }

  /**
   * Set state and trigger callback
   */
  protected setState(state: VideoState): void {
    if (this.currentState !== state) {
      this.currentState = state;
      this.callbacks.onStateChange(state);
    }
  }

  /**
   * Trigger time update callback
   */
  protected triggerTimeUpdate(time: number): void {
    this._currentTime = time;
    this.callbacks.onTimeUpdate(time);
  }

  /**
   * Trigger volume change callback
   */
  protected triggerVolumeChange(volume: number): void {
    this._volume = volume;
    this.callbacks.onVolumeChange(volume);
  }

  /**
   * Check if video should stop at endAt time
   */
  protected checkEndAt(currentTime: number): void {
    if (this.options.endAt > 0 && currentTime >= this.options.endAt) {
      this.pause();
      if (this.options.loop) {
        this.seekTo(this.options.startAt);
        this.play();
      }
    }
  }
}
