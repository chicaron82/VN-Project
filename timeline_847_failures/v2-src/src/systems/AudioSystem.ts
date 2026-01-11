/**
 * UV7 V2 AudioSystem
 *
 * Handles music and sound effect playback.
 *
 * Features:
 * - Background music with crossfade
 * - Sound effects with pooling
 * - Volume control (music/sfx separate)
 * - Mute/unmute
 * - Preloading support
 */

import type { GameSystem } from '../core/index.ts';
import { EventBus, eventBus } from '../core/EventBus.ts';
import { SettingsSystem, settingsSystem } from './SettingsSystem.ts';

export interface AudioSystemConfig {
  eventBus?: EventBus;
  settingsSystem?: SettingsSystem;
  musicBasePath?: string;
  sfxBasePath?: string;
  crossfadeDuration?: number;
}

interface AudioTrack {
  id: string;
  audio: HTMLAudioElement;
  loaded: boolean;
}

export class AudioSystem implements GameSystem {
  readonly name = 'AudioSystem';

  private eventBus: EventBus;
  private settings: SettingsSystem;
  private musicBasePath: string;
  private sfxBasePath: string;
  private crossfadeDuration: number;

  // Music state
  private currentMusic: AudioTrack | null = null;
  private nextMusic: AudioTrack | null = null;
  private musicVolume: number = 1;
  private musicMuted: boolean = false;

  // SFX state
  private sfxPool: Map<string, HTMLAudioElement[]> = new Map();
  private sfxVolume: number = 1;
  private sfxMuted: boolean = false;

  // Preloaded tracks
  private preloadedMusic: Map<string, AudioTrack> = new Map();
  private preloadedSfx: Map<string, HTMLAudioElement> = new Map();

  // Fade interval
  private fadeInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: AudioSystemConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.settings = config.settingsSystem ?? settingsSystem;
    this.musicBasePath = config.musicBasePath ?? '/assets/music';
    this.sfxBasePath = config.sfxBasePath ?? '/assets/sfx';
    this.crossfadeDuration = config.crossfadeDuration ?? 1000;
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    this.loadSettingsVolumes();
    this.setupEventListeners();
  }

  destroy(): void {
    this.stopMusic();
    this.stopAllSfx();
    this.clearPreloaded();

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  // =========================================================================
  // MUSIC
  // =========================================================================

  /**
   * Play background music with optional crossfade
   */
  playMusic(trackId: string, loop = true): void {
    if (this.currentMusic?.id === trackId) {
      return; // Already playing
    }

    const track = this.getOrCreateMusicTrack(trackId);
    track.audio.loop = loop;
    track.audio.volume = this.musicMuted ? 0 : this.musicVolume;

    if (this.currentMusic) {
      // Crossfade
      this.nextMusic = track;
      this.startCrossfade();
    } else {
      // Direct play
      this.currentMusic = track;
      track.audio.play().catch((err) => {
        console.warn(`[AudioSystem] Failed to play music: ${trackId}`, err);
      });
    }

    this.eventBus.emit('audio:music:play', { trackId });
  }

  /**
   * Stop current music
   */
  stopMusic(fadeOut = true): void {
    if (!this.currentMusic) return;

    if (fadeOut) {
      this.fadeOutMusic(this.currentMusic, () => {
        this.currentMusic?.audio.pause();
        this.currentMusic = null;
      });
    } else {
      this.currentMusic.audio.pause();
      this.currentMusic = null;
    }

    this.eventBus.emit('audio:music:stop');
  }

  /**
   * Pause current music
   */
  pauseMusic(): void {
    this.currentMusic?.audio.pause();
  }

  /**
   * Resume current music
   */
  resumeMusic(): void {
    this.currentMusic?.audio.play().catch(() => {});
  }

  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic && !this.musicMuted) {
      this.currentMusic.audio.volume = this.musicVolume;
    }
  }

  /**
   * Mute/unmute music
   */
  setMusicMuted(muted: boolean): void {
    this.musicMuted = muted;
    if (this.currentMusic) {
      this.currentMusic.audio.volume = muted ? 0 : this.musicVolume;
    }
  }

  /**
   * Get current music track ID
   */
  getCurrentMusicId(): string | null {
    return this.currentMusic?.id ?? null;
  }

  // =========================================================================
  // SOUND EFFECTS
  // =========================================================================

  /**
   * Play a sound effect
   */
  playSfx(soundId: string): void {
    if (this.sfxMuted) return;

    const audio = this.getOrCreateSfxAudio(soundId);
    audio.volume = this.sfxVolume;
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn(`[AudioSystem] Failed to play sfx: ${soundId}`, err);
    });

    this.eventBus.emit('audio:sfx:play', { soundId });
  }

  /**
   * Stop all sound effects
   */
  stopAllSfx(): void {
    for (const pool of this.sfxPool.values()) {
      for (const audio of pool) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }

  /**
   * Set SFX volume (0-1)
   */
  setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Mute/unmute SFX
   */
  setSfxMuted(muted: boolean): void {
    this.sfxMuted = muted;
  }

  // =========================================================================
  // PRELOADING
  // =========================================================================

  /**
   * Preload music tracks
   */
  async preloadMusic(trackIds: string[]): Promise<void> {
    const promises = trackIds.map((id) => this.preloadMusicTrack(id));
    await Promise.all(promises);
  }

  /**
   * Preload sound effects
   */
  async preloadSfx(soundIds: string[]): Promise<void> {
    const promises = soundIds.map((id) => this.preloadSfxSound(id));
    await Promise.all(promises);
  }

  private async preloadMusicTrack(trackId: string): Promise<void> {
    if (this.preloadedMusic.has(trackId)) return;

    const track = this.createMusicTrack(trackId);

    return new Promise((resolve) => {
      track.audio.addEventListener('canplaythrough', () => {
        track.loaded = true;
        this.preloadedMusic.set(trackId, track);
        resolve();
      }, { once: true });

      track.audio.addEventListener('error', () => {
        console.warn(`[AudioSystem] Failed to preload music: ${trackId}`);
        resolve();
      }, { once: true });

      track.audio.load();
    });
  }

  private async preloadSfxSound(soundId: string): Promise<void> {
    if (this.preloadedSfx.has(soundId)) return;

    const audio = this.createSfxAudio(soundId);

    return new Promise((resolve) => {
      audio.addEventListener('canplaythrough', () => {
        this.preloadedSfx.set(soundId, audio);
        resolve();
      }, { once: true });

      audio.addEventListener('error', () => {
        console.warn(`[AudioSystem] Failed to preload sfx: ${soundId}`);
        resolve();
      }, { once: true });

      audio.load();
    });
  }

  /**
   * Clear all preloaded audio
   */
  clearPreloaded(): void {
    this.preloadedMusic.clear();
    this.preloadedSfx.clear();
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private loadSettingsVolumes(): void {
    this.musicVolume = this.settings.get('musicVolume');
    this.sfxVolume = this.settings.get('sfxVolume');
  }

  private setupEventListeners(): void {
    // Listen for scene music changes
    this.eventBus.on('scene:ready', () => {
      // Music is handled by SceneRunner callbacks
    });

    // Listen for settings changes
    this.settings.subscribe('musicVolume', (volume) => {
      this.setMusicVolume(volume);
    });

    this.settings.subscribe('sfxVolume', (volume) => {
      this.setSfxVolume(volume);
    });
  }

  private getOrCreateMusicTrack(trackId: string): AudioTrack {
    // Check preloaded first
    if (this.preloadedMusic.has(trackId)) {
      return this.preloadedMusic.get(trackId)!;
    }
    return this.createMusicTrack(trackId);
  }

  private createMusicTrack(trackId: string): AudioTrack {
    const audio = new Audio(`${this.musicBasePath}/${trackId}.mp3`);
    audio.preload = 'auto';
    return { id: trackId, audio, loaded: false };
  }

  private getOrCreateSfxAudio(soundId: string): HTMLAudioElement {
    // Check preloaded first
    if (this.preloadedSfx.has(soundId)) {
      // Clone for simultaneous playback
      const original = this.preloadedSfx.get(soundId)!;
      return original.cloneNode(true) as HTMLAudioElement;
    }

    // Check pool
    const pool = this.sfxPool.get(soundId);
    if (pool) {
      // Find available audio in pool
      const available = pool.find((a) => a.paused || a.ended);
      if (available) {
        return available;
      }
      // Add to pool if all are busy
      const newAudio = this.createSfxAudio(soundId);
      pool.push(newAudio);
      return newAudio;
    }

    // Create new pool
    const audio = this.createSfxAudio(soundId);
    this.sfxPool.set(soundId, [audio]);
    return audio;
  }

  private createSfxAudio(soundId: string): HTMLAudioElement {
    const audio = new Audio(`${this.sfxBasePath}/${soundId}.mp3`);
    audio.preload = 'auto';
    return audio;
  }

  private startCrossfade(): void {
    if (!this.currentMusic || !this.nextMusic) return;

    const fadeStep = 50; // ms
    const steps = this.crossfadeDuration / fadeStep;
    const volumeStep = this.musicVolume / steps;

    let currentVol = this.musicMuted ? 0 : this.musicVolume;
    let nextVol = 0;

    // Start next track at 0 volume
    this.nextMusic.audio.volume = 0;
    this.nextMusic.audio.play().catch(() => {});

    this.fadeInterval = setInterval(() => {
      currentVol = Math.max(0, currentVol - volumeStep);
      nextVol = Math.min(this.musicMuted ? 0 : this.musicVolume, nextVol + volumeStep);

      if (this.currentMusic) {
        this.currentMusic.audio.volume = currentVol;
      }
      if (this.nextMusic) {
        this.nextMusic.audio.volume = nextVol;
      }

      if (currentVol <= 0) {
        // Crossfade complete
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }

        this.currentMusic?.audio.pause();
        this.currentMusic = this.nextMusic;
        this.nextMusic = null;
      }
    }, fadeStep);
  }

  private fadeOutMusic(track: AudioTrack, onComplete: () => void): void {
    const fadeStep = 50;
    const steps = this.crossfadeDuration / fadeStep;
    const volumeStep = track.audio.volume / steps;

    const interval = setInterval(() => {
      track.audio.volume = Math.max(0, track.audio.volume - volumeStep);

      if (track.audio.volume <= 0) {
        clearInterval(interval);
        onComplete();
      }
    }, fadeStep);
  }
}

// Singleton instance
export const audioSystem = new AudioSystem();
