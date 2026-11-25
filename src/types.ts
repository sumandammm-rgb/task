export type ScreenId = 'overview' | 'planner' | 'library' | 'preferences';

export type TaskPriority = 'high' | 'medium' | 'routine';

export type ProjectCategory = 'Spatial UI' | 'Acoustic Lab' | 'Architecture' | 'Personal';

export interface WorkspaceTask {
  id: string;
  title: string;
  notes?: string;
  project: ProjectCategory;
  priority: TaskPriority;
  dueLabel: string;
  scheduledToday: boolean;
  completed: boolean;
  durationMinutes: number;
}

export type MediaAssetKind = 'environments' | 'soundscapes' | 'hardware';

export interface MediaAsset {
  id: string;
  title: string;
  subtitle: string;
  kind: MediaAssetKind;
  imageUrl?: string;
  gradientColors: [string, string, string];
  dimensionsOrDuration: string;
  author: string;
  swatches: string[];
  description: string;
  soundProfile?: 'harmonic' | 'rain' | 'sub';
  favorite: boolean;
}

export type WallpaperId = 'obsidian-aurora' | 'marine-silicate' | 'indigo-silk';

export type AccentTheme = 'azure' | 'indigo' | 'mint';

export type GlassIntensity = 'subtle' | 'standard' | 'crystal';

export interface WorkspacePreferences {
  displayName: string;
  roleTitle: string;
  wallpaper: WallpaperId;
  accentTheme: AccentTheme;
  glassIntensity: GlassIntensity;
  specularEdges: boolean;
  tactileAudio: boolean;
  compactDensity: boolean;
  focusDimming: boolean;
  doNotDisturb: boolean;
  autoArchiveCompleted: boolean;
}
