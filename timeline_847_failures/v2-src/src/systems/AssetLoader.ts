/**
 * UV7 V2 AssetLoader
 *
 * Handles preloading and caching of game assets.
 *
 * Features:
 * - Image preloading with progress
 * - Audio preloading
 * - Asset caching
 * - Parallel loading with concurrency limit
 * - Error handling and retry
 */

import type { GameSystem } from '../core/index.ts';
import { EventBus, eventBus } from '../core/EventBus.ts';

export interface AssetManifest {
  images?: string[];
  audio?: string[];
  fonts?: string[];
  json?: string[];
}

interface LoadedAsset {
  url: string;
  type: 'image' | 'audio' | 'font' | 'json';
  data: HTMLImageElement | HTMLAudioElement | FontFace | unknown;
  loadedAt: number;
}

export interface AssetLoaderConfig {
  eventBus?: EventBus;
  basePath?: string;
  maxConcurrent?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class AssetLoader implements GameSystem {
  readonly name = 'AssetLoader';

  private eventBus: EventBus;
  private basePath: string;
  private maxConcurrent: number;
  private retryAttempts: number;
  private retryDelay: number;

  private cache = new Map<string, LoadedAsset>();
  private loadingPromises = new Map<string, Promise<LoadedAsset>>();

  constructor(config: AssetLoaderConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.basePath = config.basePath ?? '';
    this.maxConcurrent = config.maxConcurrent ?? 4;
    this.retryAttempts = config.retryAttempts ?? 2;
    this.retryDelay = config.retryDelay ?? 1000;
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    // Nothing to initialize
  }

  destroy(): void {
    this.clearCache();
  }

  // =========================================================================
  // MANIFEST LOADING
  // =========================================================================

  /**
   * Load all assets from a manifest
   */
  async loadManifest(manifest: AssetManifest): Promise<void> {
    const allAssets: Array<{ url: string; type: 'image' | 'audio' | 'font' | 'json' }> = [];

    if (manifest.images) {
      allAssets.push(...manifest.images.map((url) => ({ url, type: 'image' as const })));
    }
    if (manifest.audio) {
      allAssets.push(...manifest.audio.map((url) => ({ url, type: 'audio' as const })));
    }
    if (manifest.fonts) {
      allAssets.push(...manifest.fonts.map((url) => ({ url, type: 'font' as const })));
    }
    if (manifest.json) {
      allAssets.push(...manifest.json.map((url) => ({ url, type: 'json' as const })));
    }

    if (allAssets.length === 0) {
      this.eventBus.emit('assets:complete');
      return;
    }

    let loaded = 0;
    const total = allAssets.length;

    // Load with concurrency limit
    const chunks = this.chunkArray(allAssets, this.maxConcurrent);

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async ({ url, type }) => {
          try {
            await this.load(url, type);
          } catch {
            // Error already logged, continue with other assets
          }
          loaded++;
          this.eventBus.emit('assets:progress', { loaded, total });
        })
      );
    }

    this.eventBus.emit('assets:complete');
  }

  // =========================================================================
  // INDIVIDUAL ASSET LOADING
  // =========================================================================

  /**
   * Load a single asset
   */
  async load(
    url: string,
    type: 'image' | 'audio' | 'font' | 'json'
  ): Promise<LoadedAsset> {
    const fullUrl = this.resolvePath(url);

    // Check cache
    if (this.cache.has(fullUrl)) {
      return this.cache.get(fullUrl)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(fullUrl)) {
      return this.loadingPromises.get(fullUrl)!;
    }

    // Start loading
    const loadPromise = this.loadWithRetry(fullUrl, type);
    this.loadingPromises.set(fullUrl, loadPromise);

    try {
      const asset = await loadPromise;
      this.cache.set(fullUrl, asset);
      return asset;
    } finally {
      this.loadingPromises.delete(fullUrl);
    }
  }

  /**
   * Load an image
   */
  async loadImage(url: string): Promise<HTMLImageElement> {
    const asset = await this.load(url, 'image');
    return asset.data as HTMLImageElement;
  }

  /**
   * Load audio
   */
  async loadAudio(url: string): Promise<HTMLAudioElement> {
    const asset = await this.load(url, 'audio');
    return asset.data as HTMLAudioElement;
  }

  /**
   * Load JSON
   */
  async loadJSON<T = unknown>(url: string): Promise<T> {
    const asset = await this.load(url, 'json');
    return asset.data as T;
  }

  // =========================================================================
  // CACHE MANAGEMENT
  // =========================================================================

  /**
   * Check if an asset is cached
   */
  isCached(url: string): boolean {
    return this.cache.has(this.resolvePath(url));
  }

  /**
   * Get a cached asset
   */
  getCached(url: string): LoadedAsset | undefined {
    return this.cache.get(this.resolvePath(url));
  }

  /**
   * Remove an asset from cache
   */
  uncache(url: string): void {
    this.cache.delete(this.resolvePath(url));
  }

  /**
   * Clear all cached assets
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { count: number; types: Record<string, number> } {
    const types: Record<string, number> = {};

    for (const asset of this.cache.values()) {
      types[asset.type] = (types[asset.type] ?? 0) + 1;
    }

    return {
      count: this.cache.size,
      types,
    };
  }

  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  private resolvePath(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url;
    }
    return `${this.basePath}${url}`;
  }

  private async loadWithRetry(
    url: string,
    type: 'image' | 'audio' | 'font' | 'json'
  ): Promise<LoadedAsset> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const data = await this.loadSingle(url, type);
        return {
          url,
          type,
          data,
          loadedAt: Date.now(),
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay);
        }
      }
    }

    console.error(`Failed to load asset: ${url}`, lastError);
    throw lastError;
  }

  private async loadSingle(
    url: string,
    type: 'image' | 'audio' | 'font' | 'json'
  ): Promise<HTMLImageElement | HTMLAudioElement | FontFace | unknown> {
    switch (type) {
      case 'image':
        return this.loadImageElement(url);
      case 'audio':
        return this.loadAudioElement(url);
      case 'font':
        return this.loadFontFace(url);
      case 'json':
        return this.loadJSONData(url);
    }
  }

  private loadImageElement(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  private loadAudioElement(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`));
      audio.src = url;
      audio.load();
    });
  }

  private async loadFontFace(url: string): Promise<FontFace> {
    // Extract font family name from URL
    const fontName = url.split('/').pop()?.split('.')[0] ?? 'CustomFont';
    const font = new FontFace(fontName, `url(${url})`);
    await font.load();
    document.fonts.add(font);
    return font;
  }

  private async loadJSONData(url: string): Promise<unknown> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${url} (${response.status})`);
    }
    return response.json();
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const assetLoader = new AssetLoader();
