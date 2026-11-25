import React from 'react';
import { Plus } from 'lucide-react';
import { ScreenId } from '../types';

interface TopBarProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onOpenNewTask: () => void;
  specularEdges: boolean;
}

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'planner', label: 'Planner' },
  { id: 'library', label: 'Library' },
  { id: 'preferences', label: 'Preferences' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onSelectScreen,
  onOpenNewTask,
  specularEdges,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full px-4 pt-3 sm:px-8 lg:px-12">
      <div
        className={`mx-auto flex max-w-[1440px] items-center justify-between gap-8 rounded-[16px] px-5 py-3 glass-layer-1 ${
          specularEdges ? 'specular-edge' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => onSelectScreen('overview')}
          className="font-display text-[17px] font-semibold tracking-[-0.02em] text-white/[0.94] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ls-accent)] rounded-md px-1"
        >
          Solstice Studio
        </button>

        <nav aria-label="Primary Workspace Screens" className="flex items-center gap-4 sm:gap-7 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectScreen(item.id)}
                className={`relative py-1.5 text-[14px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ls-accent)] rounded-md ${
                  isActive
                    ? 'text-white/[0.95]'
                    : 'text-white/[0.58] hover:text-white/[0.88]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-[var(--ls-accent)] shadow-[0_0_8px_var(--ls-accent-glow)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenNewTask}
            className="btn-specular-primary inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <Plus className="h-4 w-4 stroke-[2.25]" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
