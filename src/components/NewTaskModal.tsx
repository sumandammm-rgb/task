import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ProjectCategory, TaskPriority, WorkspaceTask } from '../types';
import { GlassPanel } from './LiquidControls';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<WorkspaceTask, 'id'>) => void;
}

const PROJECTS: ProjectCategory[] = ['Spatial UI', 'Acoustic Lab', 'Architecture', 'Personal'];
const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'routine', label: 'Routine' },
];

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onCreateTask,
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [project, setProject] = useState<ProjectCategory>('Spatial UI');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueLabel, setDueLabel] = useState('Today · 17:00');
  const [scheduledToday, setScheduledToday] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState(30);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onCreateTask({
      title: trimmed,
      notes: notes.trim() || undefined,
      project,
      priority,
      dueLabel: dueLabel.trim() || 'Today',
      scheduledToday,
      completed: false,
      durationMinutes,
    });
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-task-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px]"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassPanel layer={2} className="rounded-[24px] p-6 sm:p-7">
          <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
            <div>
              <h2
                id="new-task-modal-title"
                className="font-display text-[20px] font-semibold tracking-[-0.015em] text-white/[0.92]"
              >
                New Workspace Task
              </h2>
              <p className="mt-0.5 text-[13px] text-white/[0.58]">
                Schedule an item directly into your studio queue.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] text-white/[0.7] hover:bg-white/[0.14] hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="task-title-input"
                className="block text-[12px] font-medium tracking-[0.01em] text-white/[0.64] mb-1.5"
              >
                Task Title
              </label>
              <input
                id="task-title-input"
                type="text"
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Refine refractive glass edge opacity..."
                className="obsidian-well w-full rounded-[12px] px-3.5 py-2.5 text-[15px] text-white/[0.92] placeholder:text-white/[0.38]"
              />
            </div>

            <div>
              <label
                htmlFor="task-notes-input"
                className="block text-[12px] font-medium tracking-[0.01em] text-white/[0.64] mb-1.5"
              >
                Notes
              </label>
              <textarea
                id="task-notes-input"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional context, specs, or reference notes"
                className="obsidian-well w-full rounded-[12px] px-3.5 py-2.5 text-[14px] text-white/[0.92] placeholder:text-white/[0.38] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="task-project-select"
                  className="block text-[12px] font-medium tracking-[0.01em] text-white/[0.64] mb-1.5"
                >
                  Collection
                </label>
                <select
                  id="task-project-select"
                  value={project}
                  onChange={(e) => setProject(e.target.value as ProjectCategory)}
                  className="obsidian-well w-full rounded-[12px] px-3 py-2.5 text-[14px] text-white/[0.92]"
                >
                  {PROJECTS.map((p) => (
                    <option key={p} value={p} className="bg-[#191b22] text-white">
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium tracking-[0.01em] text-white/[0.64] mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-[12px] bg-black/30 border border-white/[0.08]">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`py-1.5 rounded-[8px] text-[12px] font-medium transition-colors cursor-pointer ${
                        priority === p.value
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="task-due-input"
                  className="block text-[12px] font-medium tracking-[0.01em] text-white/[0.64] mb-1.5"
                >
                  Target Time
                </label>
                <input
                  id="task-due-input"
                  type="text"
                  value={dueLabel}
                  onChange={(e) => setDueLabel(e.target.value)}
                  className="obsidian-well w-full rounded-[12px] px-3.5 py-2 text-[14px] text-white/[0.92]"
                />
              </div>

              <div>
                <label
                  htmlFor="task-duration-input"
                  className="block text-[12px] font-medium tracking-[0.01em] text-white/[0.64] mb-1.5"
                >
                  Estimate (Minutes)
                </label>
                <input
                  id="task-duration-input"
                  type="number"
                  min={5}
                  max={240}
                  step={5}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 25)}
                  className="obsidian-well w-full rounded-[12px] px-3.5 py-2 text-[14px] font-mono-tabular text-white/[0.92]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2.5 text-[13px] text-white/[0.78] cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduledToday}
                  onChange={(e) => setScheduledToday(e.target.checked)}
                  className="h-4 w-4 rounded accent-[var(--ls-accent)]"
                />
                <span>Pin to Today&apos;s Overview Queue</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="btn-glass-secondary rounded-[10px] px-4 py-2 text-[13px] font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-specular-primary rounded-[10px] px-5 py-2 text-[13px] font-semibold text-white cursor-pointer"
              >
                Add Task
              </button>
            </div>
          </form>
        </GlassPanel>
      </div>
    </div>
  );
};
