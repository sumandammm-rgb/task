import { useEffect, useState } from 'react';
import {
  DEFAULT_PREFERENCES,
  INITIAL_MEDIA_ASSETS,
  INITIAL_TASKS,
  WALLPAPER_OPTIONS,
} from './data/initialData';
import {
  MediaAsset,
  ScreenId,
  TaskPriority,
  WorkspacePreferences,
  WorkspaceTask,
} from './types';
import { soundEngine } from './utils/audio';
import { TopBar } from './components/TopBar';
import { NewTaskModal } from './components/NewTaskModal';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { PlannerScreen } from './components/screens/PlannerScreen';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { PreferencesScreen } from './components/screens/PreferencesScreen';

const STORAGE_KEY_TASKS = 'solstice_tasks_v1';
const STORAGE_KEY_PREFS = 'solstice_prefs_v1';
const STORAGE_KEY_ASSETS = 'solstice_assets_v1';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('overview');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [preferences, setPreferences] = useState<WorkspacePreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFS);
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [assets, setAssets] = useState<MediaAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ASSETS);
      return saved ? JSON.parse(saved) : INITIAL_MEDIA_ASSETS;
    } catch {
      return INITIAL_MEDIA_ASSETS;
    }
  });

  const [selectedAssetId, setSelectedAssetId] = useState<string>(INITIAL_MEDIA_ASSETS[0].id);

  // Focus Timer State
  const [timerPreset, setTimerPreset] = useState<number>(25);
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Ambient Soundscape State
  const [activeSoundscape, setActiveSoundscape] = useState<'harmonic' | 'rain' | 'sub' | null>(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      // ignore quota errors
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(preferences));
    } catch {
      // ignore quota errors
    }
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
    } catch {
      // ignore quota errors
    }
  }, [assets]);

  // Sync live Liquid Specular CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const accentMap = {
      azure: {
        main: '#007AFF',
        soft: 'rgba(0, 122, 255, 0.22)',
        border: 'rgba(0, 122, 255, 0.55)',
        glow: 'rgba(0, 122, 255, 0.35)',
        text: '#adc6ff',
      },
      indigo: {
        main: '#5E5CE6',
        soft: 'rgba(94, 92, 230, 0.24)',
        border: 'rgba(94, 92, 230, 0.58)',
        glow: 'rgba(94, 92, 230, 0.36)',
        text: '#c2c1ff',
      },
      mint: {
        main: '#30D158',
        soft: 'rgba(48, 209, 88, 0.20)',
        border: 'rgba(48, 209, 88, 0.55)',
        glow: 'rgba(48, 209, 88, 0.32)',
        text: '#6cff82',
      },
    }[preferences.accentTheme];

    root.style.setProperty('--ls-accent', accentMap.main);
    root.style.setProperty('--ls-accent-soft', accentMap.soft);
    root.style.setProperty('--ls-accent-border', accentMap.border);
    root.style.setProperty('--ls-accent-glow', accentMap.glow);
    root.style.setProperty('--ls-accent-text', accentMap.text);

    const blurMap = {
      subtle: { l0: '20px', l1: '26px', l2: '34px', s0: '150%', s1: '160%', s2: '170%' },
      standard: { l0: '40px', l1: '50px', l2: '60px', s0: '190%', s1: '200%', s2: '210%' },
      crystal: { l0: '56px', l1: '68px', l2: '80px', s0: '220%', s1: '230%', s2: '240%' },
    }[preferences.glassIntensity];

    root.style.setProperty('--ls-blur-l0', blurMap.l0);
    root.style.setProperty('--ls-blur-l1', blurMap.l1);
    root.style.setProperty('--ls-blur-l2', blurMap.l2);
    root.style.setProperty('--ls-sat-l0', blurMap.s0);
    root.style.setProperty('--ls-sat-l1', blurMap.s1);
    root.style.setProperty('--ls-sat-l2', blurMap.s2);
    root.style.setProperty('--ls-specular-opacity', preferences.specularEdges ? '0.35' : '0.08');
  }, [preferences]);

  // Focus Timer interval
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          soundEngine.playTactileClick(preferences.tactileAudio);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, preferences.tactileAudio]);

  const handleUpdatePreferences = (patch: Partial<WorkspacePreferences>) => {
    soundEngine.playTactileClick(preferences.tactileAudio);
    setPreferences((prev) => ({ ...prev, ...patch }));
  };

  const handleToggleTask = (id: string) => {
    soundEngine.playTactileClick(preferences.tactileAudio);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleQuickAddTask = (title: string) => {
    soundEngine.playTactileClick(preferences.tactileAudio);
    const newTask: WorkspaceTask = {
      id: `task-${Date.now()}`,
      title,
      project: 'Spatial UI',
      priority: 'medium',
      dueLabel: 'Today',
      scheduledToday: true,
      completed: false,
      durationMinutes: 25,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleCreateTask = (taskInput: Omit<WorkspaceTask, 'id'>) => {
    soundEngine.playTactileClick(preferences.tactileAudio);
    const newTask: WorkspaceTask = {
      ...taskInput,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    soundEngine.playTactileClick(preferences.tactileAudio);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCyclePriority = (id: string) => {
    soundEngine.playTactileClick(preferences.tactileAudio);
    const order: TaskPriority[] = ['high', 'medium', 'routine'];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = order[(order.indexOf(t.priority) + 1) % order.length];
        return { ...t, priority: next };
      })
    );
  };

  const handleToggleFavorite = (id: string) => {
    soundEngine.playTactileClick(preferences.tactileAudio);
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, favorite: !a.favorite } : a))
    );
  };

  const handleToggleSoundscape = (profile: 'harmonic' | 'rain' | 'sub') => {
    soundEngine.playTactileClick(preferences.tactileAudio);
    if (activeSoundscape === profile) {
      soundEngine.stopAmbient();
      setActiveSoundscape(null);
    } else {
      soundEngine.startAmbient(profile);
      setActiveSoundscape(profile);
    }
  };

  const activeWallpaper =
    WALLPAPER_OPTIONS.find((w) => w.id === preferences.wallpaper) ?? WALLPAPER_OPTIONS[0];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#07080B] text-[#e2e2eb]">
      {/* Fixed Full-Bleed Ambient Backdrop Canvas for Liquid Glass Refraction */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{ background: activeWallpaper.fallbackGradient }}
      >
        {activeWallpaper.imageUrl && (
          <img
            src={activeWallpaper.imageUrl}
            alt=""
            referrerPolicy="no-referrer"
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              preferences.focusDimming ? 'opacity-30' : 'opacity-65'
            }`}
          />
        )}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            preferences.focusDimming ? 'bg-[#07080B]/70' : 'bg-[#07080B]/35'
          }`}
        />
      </div>

      {/* Foreground Glass Workspace */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <TopBar
          activeScreen={activeScreen}
          onSelectScreen={(screen) => {
            soundEngine.playTactileClick(preferences.tactileAudio);
            setActiveScreen(screen);
          }}
          onOpenNewTask={() => {
            soundEngine.playTactileClick(preferences.tactileAudio);
            setIsNewTaskOpen(true);
          }}
          specularEdges={preferences.specularEdges}
        />

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-7 sm:px-8 lg:px-12">
          {activeScreen === 'overview' && (
            <OverviewScreen
              tasks={tasks}
              assets={assets}
              preferences={preferences}
              onUpdatePreferences={handleUpdatePreferences}
              onToggleTask={handleToggleTask}
              onQuickAddTask={handleQuickAddTask}
              onNavigate={(screen) => {
                soundEngine.playTactileClick(preferences.tactileAudio);
                setActiveScreen(screen);
              }}
              onInspectAsset={(assetId) => {
                soundEngine.playTactileClick(preferences.tactileAudio);
                setSelectedAssetId(assetId);
                setActiveScreen('library');
              }}
              timerSeconds={timerSeconds}
              timerPreset={timerPreset}
              timerRunning={timerRunning}
              onToggleTimer={() => {
                soundEngine.playTactileClick(preferences.tactileAudio);
                setTimerRunning((r) => !r);
              }}
              onResetTimer={() => {
                soundEngine.playTactileClick(preferences.tactileAudio);
                setTimerRunning(false);
                setTimerSeconds(timerPreset * 60);
              }}
              onChangePreset={(mins) => {
                soundEngine.playTactileClick(preferences.tactileAudio);
                setTimerRunning(false);
                setTimerPreset(mins);
                setTimerSeconds(mins * 60);
              }}
              activeSoundscape={activeSoundscape}
              onToggleSoundscape={handleToggleSoundscape}
            />
          )}

          {activeScreen === 'planner' && (
            <PlannerScreen
              tasks={tasks}
              preferences={preferences}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onCyclePriority={handleCyclePriority}
              onOpenNewTask={() => setIsNewTaskOpen(true)}
            />
          )}

          {activeScreen === 'library' && (
            <LibraryScreen
              assets={assets}
              preferences={preferences}
              selectedAssetId={selectedAssetId}
              onSelectAsset={(id) => {
                soundEngine.playTactileClick(preferences.tactileAudio);
                setSelectedAssetId(id);
              }}
              onToggleFavorite={handleToggleFavorite}
              activeSoundscape={activeSoundscape}
              onToggleSoundscape={handleToggleSoundscape}
            />
          )}

          {activeScreen === 'preferences' && (
            <PreferencesScreen
              preferences={preferences}
              onUpdatePreferences={handleUpdatePreferences}
              onResetDefaults={() => {
                soundEngine.playTactileClick(preferences.tactileAudio);
                setPreferences(DEFAULT_PREFERENCES);
              }}
            />
          )}
        </main>
      </div>

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}
