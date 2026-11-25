import React from 'react';
import {
  AccentTheme,
  GlassIntensity,
  WallpaperId,
  WorkspacePreferences,
} from '../../types';
import { USER_AVATAR_URL, WALLPAPER_OPTIONS } from '../../data/initialData';
import { GlassPanel, LiquidSwitch, ResilientImage } from '../LiquidControls';

interface PreferencesScreenProps {
  preferences: WorkspacePreferences;
  onUpdatePreferences: (patch: Partial<WorkspacePreferences>) => void;
  onResetDefaults: () => void;
}

const ACCENT_OPTIONS: { id: AccentTheme; label: string; hex: string }[] = [
  { id: 'azure', label: 'Apple Azure', hex: '#007AFF' },
  { id: 'indigo', label: 'Electric Indigo', hex: '#5E5CE6' },
  { id: 'mint', label: 'Mint Green', hex: '#30D158' },
];

const INTENSITY_OPTIONS: { id: GlassIntensity; label: string }[] = [
  { id: 'subtle', label: 'Subtle' },
  { id: 'standard', label: 'Standard' },
  { id: 'crystal', label: 'Crystal' },
];

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({
  preferences,
  onUpdatePreferences,
  onResetDefaults,
}) => {
  return (
    <div className="mx-auto max-w-[920px] space-y-6">
      <div className="px-1">
        <p className="text-[12px] font-medium tracking-[0.02em] text-white/[0.58]">
          Workspace / System Preferences
        </p>
        <h1 className="mt-1 font-display text-[32px] font-semibold tracking-[-0.025em] text-white/[0.94]">
          Appearance &amp; Materiality
        </h1>
      </div>

      {/* Inset Grouped Table 1: Studio Profile */}
      <GlassPanel
        layer={1}
        specular={preferences.specularEdges}
        className="rounded-[24px] p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-5 border-b border-white/[0.07]">
          <ResilientImage
            src={USER_AVATAR_URL}
            alt={preferences.displayName}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-white/20 shrink-0"
          />
          <div>
            <h2 className="font-display text-[19px] font-semibold text-white/[0.94]">
              {preferences.displayName}
            </h2>
            <p className="text-[13px] text-white/[0.58]">{preferences.roleTitle}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="pref-display-name"
              className="block text-[12px] font-medium text-white/[0.62] mb-1.5"
            >
              Display Name
            </label>
            <input
              id="pref-display-name"
              type="text"
              value={preferences.displayName}
              onChange={(e) => onUpdatePreferences({ displayName: e.target.value })}
              className="obsidian-well w-full rounded-[12px] px-3.5 py-2.5 text-[14px] text-white/[0.92]"
            />
          </div>
          <div>
            <label
              htmlFor="pref-role-title"
              className="block text-[12px] font-medium text-white/[0.62] mb-1.5"
            >
              Studio Role
            </label>
            <input
              id="pref-role-title"
              type="text"
              value={preferences.roleTitle}
              onChange={(e) => onUpdatePreferences({ roleTitle: e.target.value })}
              className="obsidian-well w-full rounded-[12px] px-3.5 py-2.5 text-[14px] text-white/[0.92]"
            />
          </div>
        </div>
      </GlassPanel>

      {/* Inset Grouped Table 2: Ambient Canvas & Wallpaper */}
      <GlassPanel
        layer={1}
        specular={preferences.specularEdges}
        className="rounded-[24px] p-6 space-y-5"
      >
        <div>
          <h2 className="font-display text-[17px] font-semibold text-white/[0.92]">
            Ambient Canvas Backdrop
          </h2>
          <p className="text-[13px] text-white/[0.54] mt-0.5">
            Select the optical backdrop refracted beneath every translucent plane.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WALLPAPER_OPTIONS.map((wp) => {
            const active = preferences.wallpaper === wp.id;
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() => onUpdatePreferences({ wallpaper: wp.id as WallpaperId })}
                className={`group overflow-hidden rounded-[16px] text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ls-accent)] ${
                  active
                    ? 'ring-2 ring-[var(--ls-accent)] shadow-[0_12px_24px_-6px_var(--ls-accent-glow)]'
                    : 'border border-white/[0.12] hover:border-white/[0.28]'
                }`}
              >
                <div
                  className="aspect-[16/10] w-full overflow-hidden"
                  style={{ background: wp.fallbackGradient }}
                >
                  {wp.imageUrl && (
                    <ResilientImage
                      src={wp.imageUrl}
                      alt={wp.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <div className="bg-black/35 px-3.5 py-2.5">
                  <p className="text-[13px] font-medium text-white/[0.92]">{wp.name}</p>
                  <p className="text-[11px] text-white/[0.54] truncate">{wp.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </GlassPanel>

      {/* Inset Grouped Table 3: Liquid Specular Optics & Behavior */}
      <GlassPanel
        layer={1}
        specular={preferences.specularEdges}
        className="rounded-[24px] p-6"
      >
        <h2 className="font-display text-[17px] font-semibold text-white/[0.92] pb-3 border-b border-white/[0.07]">
          Optical &amp; Tactile Settings
        </h2>

        <div className="divide-y divide-white/[0.06]">
          {/* Accent Color Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
            <div>
              <p className="text-[14px] font-medium text-white/[0.90]">
                System Accent Color
              </p>
              <p className="text-[12px] text-white/[0.52]">
                Applied to primary buttons, focus rings, and active switches
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {ACCENT_OPTIONS.map((opt) => {
                const active = preferences.accentTheme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdatePreferences({ accentTheme: opt.id })}
                    className={`inline-flex items-center gap-2 rounded-[10px] px-3 py-1.5 text-[12px] font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-white/[0.12] border-white/[0.32] text-white'
                        : 'bg-black/25 border-white/[0.08] text-white/[0.64] hover:text-white'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: opt.hex }}
                    />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Glass Refraction Intensity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
            <div>
              <p className="text-[14px] font-medium text-white/[0.90]">
                Backdrop Refraction Intensity
              </p>
              <p className="text-[12px] text-white/[0.52]">
                Adjusts blur radius and chromatic saturation across glass layers
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-[10px] bg-black/30 border border-white/[0.08]">
              {INTENSITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdatePreferences({ glassIntensity: opt.id })}
                  className={`px-3 py-1 rounded-[7px] text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    preferences.glassIntensity === opt.id
                      ? 'bg-[var(--ls-accent)] text-white shadow-sm'
                      : 'text-white/[0.6] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specular Ridge Toggle */}
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-[14px] font-medium text-white/[0.90]">
                Specular Top-Edge Bevels
              </p>
              <p className="text-[12px] text-white/[0.52]">
                Render directional 90° refractive highlight along glass edges
              </p>
            </div>
            <LiquidSwitch
              checked={preferences.specularEdges}
              onChange={(val) => onUpdatePreferences({ specularEdges: val })}
              label="Specular Top-Edge Bevels"
            />
          </div>

          {/* Tactile Audio Feedback */}
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-[14px] font-medium text-white/[0.90]">
                Tactile Click Acoustics
              </p>
              <p className="text-[12px] text-white/[0.52]">
                Subtle low-amplitude acoustic impulse on switches and checkboxes
              </p>
            </div>
            <LiquidSwitch
              checked={preferences.tactileAudio}
              onChange={(val) => onUpdatePreferences({ tactileAudio: val })}
              label="Tactile Click Acoustics"
              activeColor="mint"
            />
          </div>

          {/* Compact Table Density */}
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-[14px] font-medium text-white/[0.90]">
                Compact Row Density
              </p>
              <p className="text-[12px] text-white/[0.52]">
                Tighten vertical spacing across task queues and planner tables
              </p>
            </div>
            <LiquidSwitch
              checked={preferences.compactDensity}
              onChange={(val) => onUpdatePreferences({ compactDensity: val })}
              label="Compact Row Density"
            />
          </div>
        </div>

        <div className="pt-5 mt-2 border-t border-white/[0.07] flex items-center justify-between gap-4">
          <p className="text-[12px] text-white/[0.48]">
            Changes apply immediately across every studio screen.
          </p>
          <button
            type="button"
            onClick={onResetDefaults}
            className="btn-glass-destructive rounded-[10px] px-4 py-2 text-[13px] font-medium cursor-pointer whitespace-nowrap"
          >
            Restore Defaults
          </button>
        </div>
      </GlassPanel>
    </div>
  );
};
