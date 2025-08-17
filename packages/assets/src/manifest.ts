export type AssetKind = 'character' | 'icon' | 'shape' | 'background' | 'audio';

export type AssetFormat = 'svg' | 'json' | 'webp' | 'png' | 'wav' | 'mp3';

export type LicenseType = 'CC0' | 'CC-BY' | 'MIT' | 'Proprietary';

export interface AssetLicense {
  name: LicenseType;
  url?: string;
  attribution?: string;
}

export interface AssetAIMeta {
  prompt?: string;
  negativePrompt?: string;
  seed?: number;
  model?: string;
  upscaler?: string;
  post?: string;
}

export interface AssetVariant {
  id: string;
  format: AssetFormat;
  width?: number;
  height?: number;
  path: string;
  themable?: boolean;
  size?: number;
}

export interface AssetMeta {
  id: string;
  kind: AssetKind;
  version: string;
  tags: string[];
  description?: string;
  license: AssetLicense;
  author?: string;
  ai?: AssetAIMeta;
  variants: AssetVariant[];
}

export interface AssetManifest {
  pack: string;
  version: string;
  updatedAt: string;
  assets: AssetMeta[];
}

export const validateManifest = (manifest: unknown): AssetManifest => {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error('Invalid manifest: must be an object');
  }
  
  const m = manifest as any;
  
  if (typeof m.pack !== 'string') {
    throw new Error('Invalid manifest: pack must be a string');
  }
  
  if (typeof m.version !== 'string') {
    throw new Error('Invalid manifest: version must be a string');
  }
  
  if (typeof m.updatedAt !== 'string') {
    throw new Error('Invalid manifest: updatedAt must be a string');
  }
  
  if (!Array.isArray(m.assets)) {
    throw new Error('Invalid manifest: assets must be an array');
  }
  
  m.assets.forEach((asset: any, index: number) => {
    if (!asset.id || typeof asset.id !== 'string') {
      throw new Error(`Invalid asset at index ${index}: id must be a string`);
    }
    
    if (!asset.kind || !['character', 'icon', 'shape', 'background', 'audio'].includes(asset.kind)) {
      throw new Error(`Invalid asset at index ${index}: kind must be one of character, icon, shape, background, audio`);
    }
    
    if (!asset.version || typeof asset.version !== 'string') {
      throw new Error(`Invalid asset at index ${index}: version must be a string`);
    }
    
    if (!Array.isArray(asset.tags)) {
      throw new Error(`Invalid asset at index ${index}: tags must be an array`);
    }
    
    if (!asset.license || typeof asset.license !== 'object') {
      throw new Error(`Invalid asset at index ${index}: license must be an object`);
    }
    
    if (!Array.isArray(asset.variants) || asset.variants.length === 0) {
      throw new Error(`Invalid asset at index ${index}: variants must be a non-empty array`);
    }
    
    asset.variants.forEach((variant: any, vIndex: number) => {
      if (!variant.id || typeof variant.id !== 'string') {
        throw new Error(`Invalid variant at index ${vIndex} in asset ${asset.id}: id must be a string`);
      }
      
      if (!variant.format || !['svg', 'json', 'webp', 'png', 'wav', 'mp3'].includes(variant.format)) {
        throw new Error(`Invalid variant at index ${vIndex} in asset ${asset.id}: format must be one of svg, json, webp, png, wav, mp3`);
      }
      
      if (!variant.path || typeof variant.path !== 'string') {
        throw new Error(`Invalid variant at index ${vIndex} in asset ${asset.id}: path must be a string`);
      }
    });
  });
  
  return m as AssetManifest;
};

export const findAsset = (manifest: AssetManifest, assetId: string): AssetMeta | undefined => {
  return manifest.assets.find(asset => asset.id === assetId);
};

export const findVariant = (asset: AssetMeta, variantId?: string): AssetVariant | undefined => {
  if (!variantId) {
    return asset.variants[0];
  }
  return asset.variants.find(variant => variant.id === variantId);
};

export const getAssetsByKind = (manifest: AssetManifest, kind: AssetKind): AssetMeta[] => {
  return manifest.assets.filter(asset => asset.kind === kind);
};

export const getAssetsByTags = (manifest: AssetManifest, tags: string[]): AssetMeta[] => {
  return manifest.assets.filter(asset => 
    tags.some(tag => asset.tags.includes(tag))
  );
};