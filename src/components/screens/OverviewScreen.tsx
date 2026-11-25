import React, { useState } from 'react';
import {
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  MediaAsset,
  ScreenId,
  WorkspacePreferences,
  WorkspaceTask,
} from '../../types';
import { USER_AVATAR_URL } from '../../data/initialData';
import {
  GlassPanel,
  LiquidSwitch,
  ResilientImage,
  SquircleCheckbox,
} from '../LiquidControls';

interface OverviewScreenProps {
  tasks: WorkspaceTask[];
  assets: MediaAsset[];
  preferences: WorkspacePreferences;
  onUpdatePreferences: (patch: Partial<WorkspacePreferences>) => void;
  onToggleTask: (id: string) => void;
  onQuickAddTask: (title: string) => void;
  onNavigate: (screen: ScreenId) => void;
  onInspectAsset: (assetId: string) => void;
  timerSeconds: number;
  timerPreset: number;
  timerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onChangePreset: (minutes: number) => void;
  activeSoundscape: 'harmonic' | 'rain' | 'sub' | null;
  onToggleSoundscape: (profile: 'harmonic' | 'rain' | 'sub') => void;
}

function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  tasks,
  assets,
  preferences,
  onUpdatePreferences,
  onToggleTask,
  onQuickAddTask,
  onNavigate,
  onInspectAsset,
  timerSeconds,
  timerPreset,
  timerRunning,
  onToggleTimer,
  onResetTimer,
  onChangePreset,
  activeSoundscape,
  onToggleSoundscape,
}) => {
  const [quickTitle, setQuickTitle] = useState('');

  const todayTasks = tasks.filter((t) => t.scheduledToday);
  const completedCount = todayTasks.filter((t) => t.completed).length;
  const totalFocusMinutes = todayTasks
    .filter((t) => !t.completed)
    .reduce((acc, t) => acc + t.durationMinutes, 0);
  const featuredAssets = assets.filter((a) => a.imageUrl).slice(0, 2);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickTitle.trim();
    if (!trimmed) return;
    onQuickAddTask(trimmed);
    setQuickTitle('');
  };

  const progressRatio = Math.max(
    0,
    Math.min(1, 1 - timerSeconds / (timerPreset * 60))
  );

  return (
    <div className="space-y-6">
      {/* Editorial Welcome & Summary Row */}
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between px-1">
        <div className="max-w-2xl">
          <p className="text-[12px] font-medium tracking-[0.02em] text-white/[0.58]">
            {preferences.roleTitle} · Studio Overview
          </p>
          <h1 className="mt-1 font-display text-[32px] sm:text-[40px] font-semibold leading-[1.15] tracking-[-0.025em] text-white/[0.94] [text-wrap:balance]">
            Good evening, {preferences.displayName.split(' ')[0]}
          </h1>
        </div>

        <div className="flex items-center gap-6 text-[13px] text-white/[0.64]">
          <div>
            <span className="text-white/[0.45] mr-1.5">Completed Today</span>
            <span className="font-mono-tabular font-medium text-white/[0.92]">
              {completedCount}/{todayTasks.length}
            </span>
          </div>
          <span aria-hidden="true" className="text-white/20">
            /
          </span>
          <div>
            <span className="text-white/[0.45] mr-1.5">Remaining Focus</span>
            <span className="font-mono-tabular font-medium text-white/[0.92]">
              {totalFocusMinutes} min
            </span>
          </div>
        </div>
      </section>

      {/* Main Bento Grid: Dominant Focus Timer + Today's Queue + Environment Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left 7 Columns: Today's Priority Queue */}
        <GlassPanel
          layer={1}
          specular={preferences.specularEdges}
          className="lg:col-span-7 rounded-[24px] p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
              <div>
                <h2 className="font-display text-[20px] font-semibold tracking-[-0.015em] text-white/[0.92]">
                  Today&apos;s Queue
                </h2>
                <p className="text-[13px] text-white/[0.56] mt-0.5">
                  Tap any squircle to mark complete or open the full planner.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('planner')}
                className="btn-glass-secondary inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[12px] font-medium whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Open Planner</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Quick Capture Obsidian Well */}
            <form onSubmit={handleQuickSubmit} className="mt-4 flex gap-2.5">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Capture a priority task for today..."
                aria-label="Capture a priority task for today"
                className="obsidian-well flex-1 rounded-[12px] px-3.5 py-2.5 text-[14px] text-white/[0.92] placeholder:text-white/[0.38]"
              />
              <button
                type="submit"
                className="btn-glass-secondary rounded-[12px] px-4 py-2 text-[13px] font-medium whitespace-nowrap shrink-0 cursor-pointer"
              >
                Add
              </button>
            </form>

            {/* Inset Grouped Task Rows */}
            <ul className="mt-4 divide-y divide-white/[0.06]">
              {todayTasks.length === 0 ? (
                <li className="py-10 text-center text-[14px] text-white/[0.52]">
                  No tasks pinned for today yet. Add one above or schedule items in Planner.
                </li>
              ) : (
                todayTasks.map((task) => (
                  <li
                    key={task.id}
                    className={`flex items-start justify-between gap-4 rounded-[10px] px-2 transition-colors hover:bg-white/[0.04] ${
                      preferences.compactDensity ? 'py-2.5' : 'py-3.5'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="pt-0.5">
                        <SquircleCheckbox
                          checked={task.completed}
                          onChange={() => onToggleTask(task.id)}
                          label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-[15px] leading-[1.35] transition-colors ${
                            task.completed
                              ? 'line-through text-white/[0.40]'
                              : 'text-white/[0.92]'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-white/[0.52]">
                          <span>{task.project}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular">{task.dueLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              task.priority === 'high'
                                ? 'text-[#ffb4ab]'
                                : task.priority === 'medium'
                                ? 'text-[#adc6ff]'
                                : 'text-white/[0.52]'
                            }
                          >
                            {task.priority === 'high'
                              ? 'High Priority'
                              : task.priority === 'medium'
                              ? 'Medium'
                              : 'Routine'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="font-mono-tabular text-[12px] text-white/[0.48] whitespace-nowrap shrink-0 pt-0.5">
                      {task.durationMinutes}m
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Profile Strip Footer inside Card */}
          <div className="mt-4 pt-4 border-t border-white/[0.07] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <ResilientImage
                src={USER_AVATAR_URL}
                alt={preferences.displayName}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-white/20 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-white/[0.90] truncate">
                  {preferences.displayName}
                </p>
                <p className="text-[12px] text-white/[0.52] truncate">
                  {preferences.doNotDisturb ? 'Notifications Silenced' : 'Alerts Active'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('preferences')}
              className="text-[12px] font-medium text-[var(--ls-accent-text)] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Adjust Preferences
            </button>
          </div>
        </GlassPanel>

        {/* Right 5 Columns: Deep Focus Timer + Tactile Environment Switches */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Deep Focus Timer Panel */}
          <GlassPanel
            layer={1}
            specular={preferences.specularEdges}
            className="rounded-[24px] p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[20px] font-semibold tracking-[-0.015em] text-white/[0.92]">
                Focus Session
              </h2>
              <div className="flex items-center gap-1 p-1 rounded-[10px] bg-black/30 border border-white/[0.08]">
                {[25, 50, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onChangePreset(mins)}
                    className={`px-2.5 py-1 rounded-[7px] text-[12px] font-mono-tabular font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      timerPreset === mins
                        ? 'bg-[var(--ls-accent)] text-white shadow-sm'
                        : 'text-white/[0.58] hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-baseline justify-between gap-4">
              <div className="font-mono-tabular text-[52px] font-semibold leading-none tracking-[-0.03em] text-white/[0.95]">
                {formatTimer(timerSeconds)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleTimer}
                  className="btn-specular-primary inline-flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold text-white whitespace-nowrap cursor-pointer"
                >
                  {timerRunning ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Start</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onResetTimer}
                  aria-label="Reset focus timer"
                  className="btn-glass-secondary flex h-10 w-10 items-center justify-center rounded-[12px] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Subtle Refractive Progress Bar */}
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-black/35 border border-white/[0.06]">
              <div
                className="h-full rounded-full bg-[var(--ls-accent)] shadow-[0_0_10px_var(--ls-accent-glow)] transition-transform duration-300 origin-left"
                style={{ transform: `scaleX(${Math.max(0.02, progressRatio)})` }}
              />
            </div>
          </GlassPanel>

          {/* Tactile Environment Controls (iOS/macOS Inset Grouped Switches) */}
          <GlassPanel
            layer={1}
            specular={preferences.specularEdges}
            className="rounded-[24px] p-6 flex-1 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-[-0.015em] text-white/[0.92] pb-3 border-b border-white/[0.07]">
                Environment Controls
              </h2>

              <div className="divide-y divide-white/[0.06]">
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className="text-[14px] font-medium text-white/[0.90]">
                      Ambient Soundscape
                    </p>
                    <p className="text-[12px] text-white/[0.52]">
                      {activeSoundscape === 'harmonic'
                        ? 'Playing Silicate Harmonic Pad'
                        : 'Synthesized studio fifths drone'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleSoundscape('harmonic')}
                    aria-label={
                      activeSoundscape === 'harmonic'
                        ? 'Mute ambient soundscape'
                        : 'Play ambient soundscape'
                    }
                    className={`flex h-9 w-9 items-center justify-center rounded-[10px] border transition-colors cursor-pointer ${
                      activeSoundscape === 'harmonic'
                        ? 'bg-[var(--ls-accent-soft)] border-[var(--ls-accent-border)] text-white'
                        : 'bg-white/[0.06] border-white/[0.12] text-white/[0.7] hover:text-white'
                    }`}
                  >
                    {activeSoundscape === 'harmonic' ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className="text-[14px] font-medium text-white/[0.90]">
                      Focus Backdrop Dimming
                    </p>
                    <p className="text-[12px] text-white/[0.52]">
                      Lower ambient wallpaper luminance
                    </p>
                  </div>
                  <LiquidSwitch
                    checked={preferences.focusDimming}
                    onChange={(val) => onUpdatePreferences({ focusDimming: val })}
                    label="Focus Backdrop Dimming"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className="text-[14px] font-medium text-white/[0.90]">
                      Do Not Disturb
                    </p>
                    <p className="text-[12px] text-white/[0.52]">
                      Mute non-urgent studio alerts
                    </p>
                  </div>
                  <LiquidSwitch
                    checked={preferences.doNotDisturb}
                    onChange={(val) => onUpdatePreferences({ doNotDisturb: val })}
                    label="Do Not Disturb"
                    activeColor="mint"
                  />
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Bottom Featured Visual Studies Row */}
      <section aria-labelledby="featured-studies-heading" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2
            id="featured-studies-heading"
            className="font-display text-[20px] font-semibold tracking-[-0.015em] text-white/[0.92]"
          >
            Active Visual Studies
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('library')}
            className="text-[13px] font-medium text-[var(--ls-accent-text)] hover:underline cursor-pointer"
          >
            Browse All Assets
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredAssets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => onInspectAsset(asset.id)}
              className={`group relative overflow-hidden rounded-[24px] text-left glass-layer-1 transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ls-accent)] ${
                preferences.specularEdges ? 'specular-edge' : ''
              }`}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <ResilientImage
                  src={asset.imageUrl}
                  alt={asset.title}
                  fallbackGradient={asset.gradientColors}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080B]/90 via-[#07080B]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-2 text-[12px] text-white/[0.68]">
                    <span>{asset.author}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">{asset.dimensionsOrDuration}</span>
                  </div>
                  <h3 className="mt-1 font-display text-[19px] font-semibold tracking-[-0.015em] text-white/[0.95]">
                    {asset.title}
                  </h3>
                  <p className="mt-0.5 text-[13px] text-white/[0.72]">
                    {asset.subtitle}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
