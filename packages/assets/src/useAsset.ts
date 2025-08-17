import { useState, useEffect, useMemo } from 'react';
import type { AssetMeta, AssetVariant, AssetManifest } from './manifest';
import { findAsset, findVariant, validateManifest } from './manifest';

export interface UseAssetOptions {
  baseUrl?: string;
  manifest?: AssetManifest;
  manifestUrl?: string;
}

export interface UseAssetResult {
  meta: AssetMeta | null;
  variant: AssetVariant | null;
  url: string | null;
  loading: boolean;
  error: Error | null;
}

const DEFAULT_BASE_URL = '/assets';
const DEFAULT_MANIFEST_URL = '/assets/manifest.json';

let cachedManifest: AssetManifest | null = null;

export const useAsset = (
  assetId: string,
  variantId?: string,
  options: UseAssetOptions = {}
): UseAssetResult => {
  const {
    baseUrl = DEFAULT_BASE_URL,
    manifest: providedManifest,
    manifestUrl = DEFAULT_MANIFEST_URL,
  } = options;

  const [manifest, setManifest] = useState<AssetManifest | null>(
    providedManifest || cachedManifest
  );
  const [loading, setLoading] = useState(!manifest);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (providedManifest) {
      setManifest(providedManifest);
      cachedManifest = providedManifest;
      setLoading(false);
      return;
    }

    if (cachedManifest) {
      setManifest(cachedManifest);
      setLoading(false);
      return;
    }

    const loadManifest = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(manifestUrl);
        if (!response.ok) {
          throw new Error(`Failed to load manifest: ${response.statusText}`);
        }
        
        const data = await response.json();
        const validatedManifest = validateManifest(data);
        
        cachedManifest = validatedManifest;
        setManifest(validatedManifest);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load manifest'));
      } finally {
        setLoading(false);
      }
    };

    loadManifest();
  }, [providedManifest, manifestUrl]);

  const result = useMemo(() => {
    if (!manifest) {
      return {
        meta: null,
        variant: null,
        url: null,
        loading,
        error,
      };
    }

    const asset = findAsset(manifest, assetId);
    if (!asset) {
      return {
        meta: null,
        variant: null,
        url: null,
        loading: false,
        error: new Error(`Asset not found: ${assetId}`),
      };
    }

    const variant = findVariant(asset, variantId);
    if (!variant) {
      return {
        meta: asset,
        variant: null,
        url: null,
        loading: false,
        error: new Error(`Variant not found: ${variantId} for asset ${assetId}`),
      };
    }

    const url = variant.path.startsWith('http')
      ? variant.path
      : `${baseUrl}/${variant.path}`;

    return {
      meta: asset,
      variant,
      url,
      loading: false,
      error: null,
    };
  }, [manifest, assetId, variantId, baseUrl, loading, error]);

  return result;
};

export const preloadAsset = async (url: string): Promise<void> => {
  if (url.endsWith('.svg') || url.endsWith('.png') || url.endsWith('.webp') || url.endsWith('.jpg')) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
      img.src = url;
    });
  }
  
  if (url.endsWith('.json')) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to preload JSON: ${url}`);
    }
    await response.json();
  }
  
  if (url.endsWith('.mp3') || url.endsWith('.wav')) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => reject(new Error(`Failed to preload audio: ${url}`));
      audio.src = url;
    });
  }
};

export const preloadAssets = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(url => preloadAsset(url)));
};

export const clearManifestCache = (): void => {
  cachedManifest = null;
};