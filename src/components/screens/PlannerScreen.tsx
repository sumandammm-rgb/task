import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Folder,
  Inbox,
  Search,
  Trash2,
} from 'lucide-react';
import {
  ProjectCategory,
  TaskPriority,
  WorkspacePreferences,
  WorkspaceTask,
} from '../../types';
import { GlassPanel, SquircleCheckbox } from '../LiquidControls';

interface PlannerScreenProps {
  tasks: WorkspaceTask[];
  preferences: WorkspacePreferences;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onCyclePriority: (id: string) => void;
  onOpenNewTask: () => void;
}

type FolderFilter =
  | { type: 'view'; value: 'all' | 'today' | 'scheduled' | 'completed' }
  | { type: 'project'; value: ProjectCategory };

const PROJECTS: ProjectCategory[] = ['Spatial UI', 'Acoustic Lab', 'Architecture', 'Personal'];

export const PlannerScreen: React.FC<PlannerScreenProps> = ({
  tasks,
  preferences,
  onToggleTask,
  onDeleteTask,
  onCyclePriority,
  onOpenNewTask,
}) => {
  const [folder, setFolder] = useState<FolderFilter>({ type: 'view', value: 'all' });
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      today: tasks.filter((t) => t.scheduledToday && !t.completed).length,
      scheduled: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      byProject: PROJECTS.reduce((acc, proj) => {
        acc[proj] = tasks.filter((t) => t.project === proj).length;
        return acc;
      }, {} as Record<ProjectCategory, number>),
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (folder.type === 'view') {
        if (folder.value === 'today' && !task.scheduledToday) return false;
        if (folder.value === 'scheduled' && task.completed) return false;
        if (folder.value === 'completed' && !task.completed) return false;
      } else {
        if (task.project !== folder.value) return false;
      }

      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesNotes = task.notes?.toLowerCase().includes(q) ?? false;
        const matchesProj = task.project.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNotes && !matchesProj) return false;
      }

      return true;
    });
  }, [tasks, folder, priorityFilter, searchQuery]);

  const activeFolderLabel =
    folder.type === 'project'
      ? folder.value
      : folder.value === 'all'
      ? 'All Tasks'
      : folder.value === 'today'
      ? 'Today'
      : folder.value === 'scheduled'
      ? 'Active Queue'
      : 'Completed';

  return (
    <div className="space-y-6">
      <div className="px-1">
        <p className="text-[12px] font-medium tracking-[0.02em] text-white/[0.58]">
          Workspace / Planner
        </p>
        <h1 className="mt-1 font-display text-[32px] font-semibold tracking-[-0.025em] text-white/[0.94]">
          Tasks &amp; Schedule
        </h1>
      </div>

      {/* macOS Split-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Inset Grouped Sidebar */}
        <GlassPanel
          layer={0}
          specular={preferences.specularEdges}
          className="lg:col-span-4 xl:col-span-3 rounded-[24px] p-4 space-y-5"
        >
          <div>
            <p className="px-2.5 pb-2 text-[11px] font-semibold tracking-[0.04em] text-white/[0.45]">
              Smart Views
            </p>
            <div className="space-y-1">
              {[
                { id: 'all' as const, label: 'All Tasks', icon: Inbox, count: counts.all },
                { id: 'today' as const, label: 'Today', icon: Calendar, count: counts.today },
                { id: 'scheduled' as const, label: 'Active Queue', icon: Folder, count: counts.scheduled },
                { id: 'completed' as const, label: 'Completed', icon: CheckCircle2, count: counts.completed },
              ].map((item) => {
                const Icon = item.icon;
                const active = folder.type === 'view' && folder.value === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFolder({ type: 'view', value: item.id })}
                    className={`w-full flex items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-[14px] font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--ls-accent-soft)] text-white shadow-[inset_0_0_0_1px_var(--ls-accent-border)]'
                        : 'text-white/[0.72] hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Icon className="h-4 w-4 shrink-0 opacity-80" />
                      <span className="truncate">{item.label}</span>
                    </span>
                    <span className="font-mono-tabular text-[12px] text-white/[0.58]">
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.07]">
            <p className="px-2.5 pb-2 text-[11px] font-semibold tracking-[0.04em] text-white/[0.45]">
              Collections
            </p>
            <div className="space-y-1">
              {PROJECTS.map((proj) => {
                const active = folder.type === 'project' && folder.value === proj;
                return (
                  <button
                    key={proj}
                    type="button"
                    onClick={() => setFolder({ type: 'project', value: proj })}
                    className={`w-full flex items-center justify-between gap-3 rounded-[12px] px-3 py-2 text-[14px] font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--ls-accent-soft)] text-white shadow-[inset_0_0_0_1px_var(--ls-accent-border)]'
                        : 'text-white/[0.72] hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{proj}</span>
                    <span className="font-mono-tabular text-[12px] text-white/[0.52]">
                      {counts.byProject[proj]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </GlassPanel>

        {/* Right Main Task Ledger */}
        <GlassPanel
          layer={1}
          specular={preferences.specularEdges}
          className="lg:col-span-8 xl:col-span-9 rounded-[24px] p-5 sm:p-6"
        >
          {/* Toolbar: Search + Segmented Priority Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.07]">
            <div>
              <h2 className="font-display text-[20px] font-semibold tracking-[-0.015em] text-white/[0.92]">
                {activeFolderLabel}
              </h2>
              <p className="text-[12px] text-white/[0.52] mt-0.5 font-mono-tabular">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'item' : 'items'} shown
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="obsidian-well flex items-center gap-2 rounded-[10px] px-3 py-1.5 w-full sm:w-56">
                <Search className="h-3.5 w-3.5 text-white/[0.45] shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter tasks..."
                  aria-label="Filter tasks"
                  className="w-full bg-transparent text-[13px] text-white/[0.92] placeholder:text-white/[0.38] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 p-1 rounded-[10px] bg-black/30 border border-white/[0.08]">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'high', label: 'High' },
                    { id: 'medium', label: 'Medium' },
                    { id: 'routine', label: 'Routine' },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriorityFilter(p.id)}
                    className={`px-2.5 py-1 rounded-[7px] text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      priorityFilter === p.id
                        ? 'bg-[var(--ls-accent)] text-white shadow-sm'
                        : 'text-white/[0.6] hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inset Grouped Task List */}
          {filteredTasks.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <p className="text-[15px] text-white/[0.72]">
                No tasks match your current filters.
              </p>
              <div className="flex items-center justify-center gap-3">
                {(searchQuery || priorityFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setPriorityFilter('all');
                    }}
                    className="btn-glass-secondary rounded-[10px] px-4 py-2 text-[13px] font-medium cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenNewTask}
                  className="btn-specular-primary rounded-[10px] px-4 py-2 text-[13px] font-semibold text-white cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className={`group flex items-start justify-between gap-4 rounded-[12px] px-2.5 transition-colors hover:bg-white/[0.04] ${
                    preferences.compactDensity ? 'py-3' : 'py-4'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="pt-0.5">
                      <SquircleCheckbox
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                        label={`Toggle "${task.title}"`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-[15px] font-medium leading-[1.35] ${
                          task.completed
                            ? 'line-through text-white/[0.40]'
                            : 'text-white/[0.92]'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.notes && (
                        <p className="mt-1 text-[13px] text-white/[0.56] line-clamp-2">
                          {task.notes}
                        </p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-white/[0.52]">
                        <span>{task.project}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{task.dueLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{task.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onCyclePriority(task.id)}
                      title="Click to cycle priority"
                      className={`rounded-[8px] px-2.5 py-1 text-[12px] font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                        task.priority === 'high'
                          ? 'bg-[#FF453A]/15 border-[#FF453A]/35 text-[#ffb4ab]'
                          : task.priority === 'medium'
                          ? 'bg-[#007AFF]/15 border-[#007AFF]/40 text-[#adc6ff]'
                          : 'bg-white/[0.05] border-white/[0.1] text-white/[0.64]'
                      }`}
                    >
                      {task.priority === 'high'
                        ? 'High'
                        : task.priority === 'medium'
                        ? 'Medium'
                        : 'Routine'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      aria-label={`Delete "${task.title}"`}
                      className="btn-glass-destructive flex h-8 w-8 items-center justify-center rounded-[8px] opacity-80 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </GlassPanel>
      </div>
    </div>
  );
};
