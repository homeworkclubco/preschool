/**
 * Video Background Web Component
 * Supports YouTube, Vimeo, and HTML5 video backgrounds
 */

import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { VideoAdapter, VideoState } from './video-adapter.js';
import { HTML5Adapter } from './html5-adapter.js';
import { YouTubeAdapter } from './youtube-adapter.js';
import { VimeoAdapter } from './vimeo-adapter.js';
import {
  parseVideoUrl,
  generateUID,
  isMobile,
  parseAspectRatio,
  type VideoType,
} from './utils.js';

export class HcVideoBackground extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    .video-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    }

    .poster {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .poster.hidden {
      opacity: 0;
    }

    ::slotted(*) {
      position: relative;
      z-index: 1;
    }
  `;

  // Video source URL
  @property({ type: String })
  src = '';

  // Poster image
  @property({ type: String })
  poster = '';

  // Autoplay video
  @property({ type: Boolean })
  autoplay = true;

  // Mute video
  @property({ type: Boolean })
  muted = true;

  // Loop video
  @property({ type: Boolean })
  loop = true;

  // Play on mobile devices
  @property({ type: Boolean })
  mobile = true;

  // Lazy load video
  @property({ type: Boolean })
  lazy = false;

  // Initial volume (0-1)
  @property({ type: Number })
  volume = 1;

  // Start playback at X seconds
  @property({ type: Number, attribute: 'start-at' })
  startAt = 0;

  // End playback at X seconds
  @property({ type: Number, attribute: 'end-at' })
  endAt = 0;

  // Always play (ignore intersection observer)
  @property({ type: Boolean, attribute: 'always-play' })
  alwaysPlay = false;

  // Use privacy-friendly embeds (no cookies)
  @property({ type: Boolean, attribute: 'no-cookie' })
  noCookie = true;

  // Aspect ratio for sizing
  @property({ type: String })
  resolution = '16:9';

  // Fit video to exact container size
  @property({ type: Boolean, attribute: 'fit-box' })
  fitBox = false;

  // Force play on low battery mode
  @property({ type: Boolean, attribute: 'force-on-low-battery' })
  forceOnLowBattery = false;

  // Internal state
  @state()
  private adapter: VideoAdapter | null = null;

  @state()
  private currentState: VideoState = 'notstarted';

  @state()
  private isReady = false;

  @state()
  private posterVisible = true;

  @state()
  private isIntersecting = false;

  private videoContainer: HTMLElement | null = null;
  private uid = '';
  private intersectionObserver: IntersectionObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private touchStarted = false;

  // Read-only getters
  get playing(): boolean {
    return this.currentState === 'playing';
  }

  get paused(): boolean {
    return this.currentState === 'paused';
  }

  get currentTime(): number {
    return this.adapter?.getCurrentTime() ?? 0;
  }

  get duration(): number {
    return this.adapter?.getDuration() ?? 0;
  }

  get percentComplete(): number {
    const duration = this.duration;
    if (duration === 0) return 0;
    return (this.currentTime / duration) * 100;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setupObservers();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup();
  }

  updated(changedProperties: Map<string, any>): void {
    // Handle src changes
    if (changedProperties.has('src') && changedProperties.get('src') !== undefined) {
      this.reinitVideo();
    }

    // Handle volume changes
    if (changedProperties.has('volume')) {
      this.adapter?.setVolume(this.volume);
    }
  }

  render() {
    return html`
      <div class="video-container"></div>
      ${this.poster
        ? html`<img
            class="poster ${this.posterVisible ? '' : 'hidden'}"
            src="${this.poster}"
            alt=""
          />`
        : ''}
      <slot></slot>
    `;
  }

  firstUpdated(): void {
    this.videoContainer = this.shadowRoot?.querySelector('.video-container') as HTMLElement;
    // Initialize video after first render
    this.initVideo();
  }

  // Public API Methods

  /**
   * Play the video
   */
  async play(): Promise<void> {
    await this.adapter?.play();
  }

  /**
   * Pause the video
   */
  pause(): void {
    this.adapter?.pause();
  }

  /**
   * Mute the video
   */
  mute(): void {
    this.adapter?.mute();
    this.dispatchEvent(new CustomEvent('hc-video-mute', { detail: { instance: this } }));
  }

  /**
   * Unmute the video
   */
  unmute(): void {
    this.adapter?.unmute();
    this.dispatchEvent(new CustomEvent('hc-video-unmute', { detail: { instance: this } }));
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.adapter?.setVolume(this.volume);
  }

  /**
   * Get current volume (0-1)
   */
  getVolume(): number {
    return this.adapter?.getVolume() ?? 0;
  }

  /**
   * Seek to percentage (0-100)
   */
  seek(percent: number): void {
    this.adapter?.seek(percent);
  }

  /**
   * Seek to specific time in seconds
   */
  seekTo(seconds: number): void {
    this.adapter?.seekTo(seconds);
  }

  /**
   * Set start time
   */
  setStartAt(seconds: number): void {
    this.startAt = seconds;
  }

  /**
   * Set end time
   */
  setEndAt(seconds: number): void {
    this.endAt = seconds;
  }

  /**
   * Change video source
   */
  async setSource(url: string): Promise<void> {
    this.src = url;
  }

  /**
   * Soft play - only play if not already playing
   */
  async softPlay(): Promise<void> {
    if (!this.playing) {
      await this.play();
    }
  }

  /**
   * Soft pause - only pause if currently playing
   */
  softPause(): void {
    if (this.playing) {
      this.pause();
    }
  }

  // Private Methods

  private async initVideo(): Promise<void> {
    // Check if should play on mobile
    if (isMobile() && !this.mobile) {
      return;
    }

    // Parse video URL
    const videoInfo = parseVideoUrl(this.src);
    if (!videoInfo) {
      this.dispatchError(new Error('Invalid video URL'));
      return;
    }

    this.uid = generateUID(videoInfo.id);

    // Wait for container if lazy loading
    if (this.lazy && !this.isIntersecting) {
      return;
    }

    await this.createAdapter(videoInfo);
  }

  private async reinitVideo(): Promise<void> {
    this.cleanup();
    await this.initVideo();
  }

  private async createAdapter(videoInfo: any): Promise<void> {
    if (!this.videoContainer) {
      await this.updateComplete;
      this.videoContainer = this.shadowRoot?.querySelector('.video-container') as HTMLElement;
    }

    if (!this.videoContainer) return;

    const options = {
      element: this.videoContainer,
      uid: this.uid,
      videoId: videoInfo.id,
      autoplay: this.autoplay && (!this.lazy || this.isIntersecting),
      muted: this.muted,
      loop: this.loop,
      volume: this.volume,
      startAt: this.startAt,
      endAt: this.endAt,
      noCookie: this.noCookie,
    };

    const callbacks = {
      onReady: () => this.handleReady(),
      onPlay: () => this.handlePlay(),
      onPause: () => this.handlePause(),
      onEnded: () => this.handleEnded(),
      onTimeUpdate: (time: number) => this.handleTimeUpdate(time),
      onVolumeChange: (volume: number) => this.handleVolumeChange(volume),
      onStateChange: (state: VideoState) => this.handleStateChange(state),
      onError: (error: Error) => this.dispatchError(error),
    };

    try {
      switch (videoInfo.type) {
        case 'youtube':
          this.adapter = new YouTubeAdapter(options, callbacks);
          break;
        case 'vimeo':
          this.adapter = new VimeoAdapter(options, callbacks, videoInfo.hash);
          break;
        case 'video':
          this.adapter = new HTML5Adapter(options, callbacks);
          break;
      }

      await this.adapter?.init();
      this.resizePlayer();
    } catch (error) {
      this.dispatchError(error as Error);
    }
  }

  private setupObservers(): void {
    // Intersection Observer
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isIntersecting = entry.isIntersecting;

          if (entry.isIntersecting) {
            // Video entered viewport
            if (this.lazy && !this.adapter) {
              this.initVideo();
            } else if (this.shouldAutoResume()) {
              this.softPlay();
            }
          } else {
            // Video left viewport
            if (!this.alwaysPlay) {
              this.softPause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    this.intersectionObserver.observe(this);

    // Resize Observer
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this);
    } else {
      // Fallback to window resize
      window.addEventListener('resize', this.handleResize);
    }

    // Visibility change
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Low battery mode workaround
    if (this.forceOnLowBattery && isMobile()) {
      this.setupLowBatteryWorkaround();
    }
  }

  private setupLowBatteryWorkaround(): void {
    const handleTouch = () => {
      if (!this.touchStarted) {
        this.touchStarted = true;
        if (this.muted && this.shouldAutoResume()) {
          this.softPlay();
        }
        document.removeEventListener('touchstart', handleTouch);
      }
    };

    document.addEventListener('touchstart', handleTouch, { once: true });
  }

  private shouldAutoResume(): boolean {
    return this.isReady && (this.alwaysPlay || this.isIntersecting);
  }

  private handleResize = (): void => {
    requestAnimationFrame(() => {
      this.resizePlayer();
    });
  };

  private resizePlayer(): void {
    if (!this.adapter || !this.videoContainer) return;

    const playerElement = this.adapter.getPlayerElement();
    if (!playerElement) return;

    const containerWidth = this.videoContainer.offsetWidth;
    const containerHeight = this.videoContainer.offsetHeight;

    if (this.fitBox) {
      // Stretch to exact container size
      playerElement.style.width = `${containerWidth}px`;
      playerElement.style.height = `${containerHeight}px`;
      playerElement.style.top = '0';
      playerElement.style.left = '0';
      playerElement.style.transform = 'none';
    } else {
      // Cover mode - maintain aspect ratio and center
      const aspectRatio = parseAspectRatio(this.resolution);
      const containerRatio = containerWidth / containerHeight;

      let width: number, height: number;

      if (containerRatio > aspectRatio) {
        // Container is wider
        width = containerWidth;
        height = containerWidth / aspectRatio;
      } else {
        // Container is taller
        height = containerHeight;
        width = containerHeight * aspectRatio;
      }

      playerElement.style.width = `${width}px`;
      playerElement.style.height = `${height}px`;
      playerElement.style.top = '50%';
      playerElement.style.left = '50%';
      playerElement.style.transform = 'translate(-50%, -50%)';
    }

    this.dispatchEvent(
      new CustomEvent('hc-video-resize', {
        detail: { instance: this },
      })
    );
  }

  private handleVisibilityChange = (): void => {
    if (!document.hidden && this.shouldAutoResume()) {
      this.softPlay();
    }
  };

  private handleReady(): void {
    this.isReady = true;
    this.posterVisible = false;
    this.dispatchEvent(
      new CustomEvent('hc-video-ready', {
        detail: { instance: this },
      })
    );
  }

  private handlePlay(): void {
    this.currentState = 'playing';
    this.posterVisible = false;
    this.dispatchEvent(
      new CustomEvent('hc-video-play', {
        detail: { instance: this },
      })
    );
  }

  private handlePause(): void {
    this.currentState = 'paused';
    this.dispatchEvent(
      new CustomEvent('hc-video-pause', {
        detail: { instance: this },
      })
    );
  }

  private handleEnded(): void {
    this.currentState = 'ended';
    this.dispatchEvent(
      new CustomEvent('hc-video-ended', {
        detail: { instance: this },
      })
    );
  }

  private handleTimeUpdate(time: number): void {
    this.dispatchEvent(
      new CustomEvent('hc-video-time-update', {
        detail: { currentTime: time },
      })
    );
  }

  private handleVolumeChange(volume: number): void {
    this.dispatchEvent(
      new CustomEvent('hc-video-volume-change', {
        detail: { volume },
      })
    );
  }

  private handleStateChange(state: VideoState): void {
    this.currentState = state;
    this.dispatchEvent(
      new CustomEvent('hc-video-state-change', {
        detail: { state },
      })
    );
  }

  private dispatchError(error: Error): void {
    console.error('Video Background Error:', error);
    this.dispatchEvent(
      new CustomEvent('hc-video-error', {
        detail: { error },
      })
    );
  }

  private cleanup(): void {
    // Destroy adapter
    this.adapter?.destroy();
    this.adapter = null;

    // Cleanup observers
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    } else {
      window.removeEventListener('resize', this.handleResize);
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    this.isReady = false;
    this.posterVisible = true;
    this.currentState = 'notstarted';
  }
}

// Auto-register the custom element
customElements.define('hc-video-background', HcVideoBackground);
