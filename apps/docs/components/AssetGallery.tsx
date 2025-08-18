'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Asset {
  id: string;
  kind: 'icon' | 'character' | 'shape' | 'background' | 'audio';
  description?: string;
  tags?: string[];
  variants: Array<{
    id: string;
    format: string;
    path: string;
    width?: number;
    height?: number;
  }>;
}

interface AssetGalleryProps {
  kind?: 'icon' | 'character' | 'shape' | 'background' | 'audio';
  showCode?: boolean;
}

export function AssetGallery({ kind, showCode = true }: AssetGalleryProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load manifest
    fetch('/assets/manifest.json')
      .then((res) => res.json())
      .then((data) => {
        const filtered = kind 
          ? data.assets.filter((a: Asset) => a.kind === kind)
          : data.assets;
        setAssets(filtered);
      })
      .catch(console.error);
  }, [kind]);

  const filteredAssets = assets.filter((asset) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      asset.id.toLowerCase().includes(term) ||
      asset.description?.toLowerCase().includes(term) ||
      asset.tags?.some((tag) => tag.toLowerCase().includes(term))
    );
  });

  const copyCode = (asset: Asset) => {
    const code = `import { useAsset } from '@/remotion/ui/assets/useAsset';

const { url } = useAsset('${asset.id}', '${asset.variants[0].id}');`;
    navigator.clipboard.writeText(code);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderAssetPreview = (asset: Asset) => {
    const variant = asset.variants[0];
    if (!variant) return null;

    if (asset.kind === 'icon' || asset.kind === 'shape') {
      return (
        <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
          <img
            src={`/assets/${variant.path}`}
            alt={asset.id}
            className="max-w-full max-h-full"
            style={{ filter: asset.kind === 'icon' ? 'var(--icon-filter)' : undefined }}
          />
        </div>
      );
    }

    if (asset.kind === 'background') {
      return (
        <div className="w-full h-32 rounded overflow-hidden">
          <img
            src={`/assets/${variant.path}`}
            alt={asset.id}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    if (asset.kind === 'character') {
      return (
        <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
          <img
            src={`/assets/${variant.path}`}
            alt={asset.id}
            className="max-w-full max-h-full"
          />
        </div>
      );
    }

    return (
      <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
        <span className="text-gray-500">Preview not available</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
        />
        <span className="text-sm text-gray-500">
          {filteredAssets.length} assets
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer dark:border-gray-700"
            onClick={() => setSelectedAsset(asset)}
          >
            {renderAssetPreview(asset)}
            <h3 className="mt-2 font-medium text-sm truncate">{asset.id}</h3>
            {asset.variants.length > 1 && (
              <span className="text-xs text-gray-500">
                {asset.variants.length} variants
              </span>
            )}
          </div>
        ))}
      </div>

      {selectedAsset && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedAsset.id}</h2>
                {selectedAsset.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedAsset.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Preview</h3>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
                  {renderAssetPreview(selectedAsset)}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Variants</h3>
                <div className="space-y-2">
                  {selectedAsset.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span className="text-sm font-mono">{variant.id}</span>
                      <span className="text-xs text-gray-500">
                        {variant.format.toUpperCase()}
                        {variant.width && variant.height && 
                          ` • ${variant.width}×${variant.height}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {showCode && (
                <div>
                  <h3 className="font-semibold mb-2">Usage</h3>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useAsset } from '@/remotion/ui/assets/useAsset';

const { url } = useAsset('${selectedAsset.id}', '${selectedAsset.variants[0].id}');`}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(selectedAsset)}
                      className="absolute top-2 right-2 px-3 py-1 bg-white dark:bg-gray-700 rounded text-sm"
                    >
                      {copiedId === selectedAsset.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {selectedAsset.tags && selectedAsset.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAsset.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}