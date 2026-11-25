import React, { useMemo, useState } from 'react';
import { Heart, Search, Volume2, VolumeX } from 'lucide-react';
import {
  MediaAsset,
  MediaAssetKind,
  WorkspacePreferences,
} from '../../types';
import { GlassPanel, ResilientImage } from '../LiquidControls';

interface LibraryScreenProps {
  assets: MediaAsset[];
  preferences: WorkspacePreferences;
  selectedAssetId: string;
  onSelectAsset: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  activeSoundscape: 'harmonic' | 'rain' | 'sub' | null;
  onToggleSoundscape: (profile: 'harmonic' | 'rain' | 'sub') => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  assets,
  preferences,
  selectedAssetId,
  onSelectAsset,
  onToggleFavorite,
  activeSoundscape,
  onToggleSoundscape,
}) => {
  const [kindFilter, setKindFilter] = useState<'all' | MediaAssetKind>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (kindFilter !== 'all' && asset.kind !== kindFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          asset.title.toLowerCase().includes(q) ||
          asset.subtitle.toLowerCase().includes(q) ||
          asset.author.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [assets, kindFilter, searchQuery]);

  const inspectedAsset =
    assets.find((a) => a.id === selectedAssetId) ?? filteredAssets[0] ?? assets[0];

  return (
    <div className="space-y-6">
      {/* Header + Segmented Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between px-1">
        <div>
          <p className="text-[12px] font-medium tracking-[0.02em] text-white/[0.58]">
            Workspace / Creative Library
          </p>
          <h1 className="mt-1 font-display text-[32px] font-semibold tracking-[-0.025em] text-white/[0.94]">
            Media &amp; Soundscapes
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="obsidian-well flex items-center gap-2 rounded-[10px] px-3 py-1.5 w-full sm:w-52">
            <Search className="h-3.5 w-3.5 text-white/[0.45] shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              aria-label="Search library assets"
              className="w-full bg-transparent text-[13px] text-white/[0.92] placeholder:text-white/[0.38] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-[12px] bg-black/30 border border-white/[0.08]">
            {(
              [
                { id: 'all', label: 'All Assets' },
                { id: 'environments', label: 'Environments' },
                { id: 'soundscapes', label: 'Soundscapes' },
                { id: 'hardware', label: 'Hardware' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setKindFilter(tab.id)}
                className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  kindFilter === tab.id
                    ? 'bg-[var(--ls-accent)] text-white shadow-sm'
                    : 'text-white/[0.62] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content + Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Asset Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredAssets.length === 0 ? (
            <GlassPanel
              layer={1}
              specular={preferences.specularEdges}
              className="sm:col-span-2 rounded-[24px] p-12 text-center"
            >
              <p className="text-[15px] text-white/[0.7]">
                No media assets match your search criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setKindFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 btn-glass-secondary rounded-[10px] px-4 py-2 text-[13px] font-medium cursor-pointer"
              >
                Show All Assets
              </button>
            </GlassPanel>
          ) : (
            filteredAssets.map((asset) => {
              const isSelected = inspectedAsset?.id === asset.id;
              const isPlaying =
                asset.soundProfile !== undefined &&
                activeSoundscape === asset.soundProfile;

              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectAsset(asset.id);
                    }
                  }}
                  className={`group relative overflow-hidden rounded-[22px] text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ls-accent)] ${
                    isSelected
                      ? 'glass-layer-2 ring-2 ring-[var(--ls-accent)]'
                      : 'glass-layer-1 hover:-translate-y-0.5'
                  } ${preferences.specularEdges ? 'specular-edge' : ''}`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <ResilientImage
                      src={asset.imageUrl}
                      alt={asset.title}
                      fallbackGradient={asset.gradientColors}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07080B]/92 via-[#07080B]/25 to-transparent" />

                    {/* Top Right Quick Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {asset.soundProfile && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSoundscape(asset.soundProfile!);
                          }}
                          aria-label={isPlaying ? `Pause ${asset.title}` : `Play ${asset.title}`}
                          className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md border transition-colors cursor-pointer ${
                            isPlaying
                              ? 'bg-[var(--ls-accent)] border-white/30 text-white'
                              : 'bg-black/45 border-white/15 text-white/85 hover:bg-black/65'
                          }`}
                        >
                          {isPlaying ? (
                            <Volume2 className="h-3.5 w-3.5" />
                          ) : (
                            <VolumeX className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(asset.id);
                        }}
                        aria-label={
                          asset.favorite
                            ? `Remove ${asset.title} from favorites`
                            : `Add ${asset.title} to favorites`
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white/85 hover:bg-black/65 cursor-pointer"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 transition-colors ${
                            asset.favorite ? 'fill-[#FF453A] text-[#FF453A]' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-center gap-2 text-[11px] text-white/[0.66]">
                        <span className="capitalize">{asset.kind}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{asset.dimensionsOrDuration}</span>
                      </div>
                      <h3 className="mt-1 font-display text-[17px] font-semibold tracking-[-0.015em] text-white/[0.95]">
                        {asset.title}
                      </h3>
                      <p className="mt-0.5 text-[12px] text-white/[0.70] truncate">
                        {asset.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 4 Columns: Floating Glass Inspector */}
        {inspectedAsset && (
          <GlassPanel
            layer={1}
            specular={preferences.specularEdges}
            className="lg:col-span-4 rounded-[24px] p-6 space-y-5 lg:sticky lg:top-24"
          >
            <div>
              <p className="text-[11px] font-semibold tracking-[0.04em] text-white/[0.48]">
                Asset Inspector
              </p>
              <h2 className="mt-1 font-display text-[20px] font-semibold tracking-[-0.015em] text-white/[0.94]">
                {inspectedAsset.title}
              </h2>
              <p className="mt-1 text-[13px] text-white/[0.62]">
                {inspectedAsset.subtitle}
              </p>
            </div>

            <div className="overflow-hidden rounded-[16px] border border-white/[0.08] aspect-[16/10]">
              <ResilientImage
                src={inspectedAsset.imageUrl}
                alt={inspectedAsset.title}
                fallbackGradient={inspectedAsset.gradientColors}
                className="h-full w-full object-cover"
              />
            </div>

            <p className="text-[14px] leading-[1.55] text-white/[0.74]">
              {inspectedAsset.description}
            </p>

            {/* Specular Details Table */}
            <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
              <div className="flex items-center justify-between py-2.5 text-[13px]">
                <span className="text-white/[0.52]">Creator</span>
                <span className="font-medium text-white/[0.90]">{inspectedAsset.author}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 text-[13px]">
                <span className="text-white/[0.52]">Format</span>
                <span className="font-mono-tabular text-white/[0.90]">
                  {inspectedAsset.dimensionsOrDuration}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 text-[13px]">
                <span className="text-white/[0.52]">Category</span>
                <span className="capitalize text-white/[0.90]">{inspectedAsset.kind}</span>
              </div>
            </div>

            {/* Color Calibration Swatches */}
            <div>
              <p className="text-[12px] font-medium text-white/[0.54] mb-2.5">
                Color Calibration
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {inspectedAsset.swatches.map((hex) => (
                  <div key={hex} className="space-y-1.5">
                    <div
                      className="h-9 w-full rounded-[10px] border border-white/15 shadow-inner"
                      style={{ backgroundColor: hex }}
                    />
                    <p className="font-mono-tabular text-[11px] text-white/[0.6] text-center">
                      {hex}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspector Actions */}
            <div className="flex items-center gap-3 pt-1">
              {inspectedAsset.soundProfile && (
                <button
                  type="button"
                  onClick={() => onToggleSoundscape(inspectedAsset.soundProfile!)}
                  className="btn-specular-primary flex-1 inline-flex items-center justify-center gap-2 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold text-white cursor-pointer"
                >
                  {activeSoundscape === inspectedAsset.soundProfile ? (
                    <>
                      <Volume2 className="h-4 w-4" />
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-4 w-4" />
                      <span>Preview Audio</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleFavorite(inspectedAsset.id)}
                className="btn-glass-secondary flex-1 inline-flex items-center justify-center gap-2 rounded-[12px] px-4 py-2.5 text-[13px] font-medium cursor-pointer"
              >
                <Heart
                  className={`h-4 w-4 ${
                    inspectedAsset.favorite ? 'fill-[#FF453A] text-[#FF453A]' : ''
                  }`}
                />
                <span>{inspectedAsset.favorite ? 'Favorited' : 'Favorite'}</span>
              </button>
            </div>
          </GlassPanel>
        )}
      </div>
    </div>
  );
};
