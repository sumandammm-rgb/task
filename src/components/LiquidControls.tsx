import React, { useState } from 'react';
import { Check, Image as ImageIcon } from 'lucide-react';

interface GlassPanelProps {
  children: React.ReactNode;
  layer?: 0 | 1 | 2;
  specular?: boolean;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  layer = 1,
  specular = true,
  className = '',
}) => {
  const layerClass =
    layer === 0 ? 'glass-layer-0' : layer === 2 ? 'glass-layer-2' : 'glass-layer-1';
  const edgeClass = specular ? 'specular-edge' : '';
  return (
    <div className={`${layerClass} ${edgeClass} ${className}`}>
      {children}
    </div>
  );
};

interface LiquidSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  activeColor?: 'accent' | 'mint';
  id?: string;
}

export const LiquidSwitch: React.FC<LiquidSwitchProps> = ({
  checked,
  onChange,
  label,
  activeColor = 'accent',
  id,
}) => {
  const activeBg =
    activeColor === 'mint'
      ? 'bg-[#30D158] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_0_12px_rgba(48,209,88,0.28)]'
      : 'bg-[var(--ls-accent)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_0_12px_var(--ls-accent-glow)]';

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[30px] w-[50px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ls-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080B] ${
        checked
          ? activeBg
          : 'bg-white/[0.1] shadow-[inset_0_1px_2px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.1)]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_-1px_1px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          checked ? 'translate-x-[20px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

interface SquircleCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export const SquircleCheckbox: React.FC<SquircleCheckboxProps> = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`group relative flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ls-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111319] ${
        checked
          ? 'bg-[var(--ls-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_8px_var(--ls-accent-glow)]'
          : 'bg-black/30 border border-white/20 hover:border-white/40'
      }`}
    >
      <Check
        className={`h-3.5 w-3.5 text-white stroke-[2.75] transition-all duration-150 ${
          checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      />
    </button>
  );
};

interface ResilientImageProps {
  src?: string;
  alt: string;
  fallbackGradient?: [string, string, string];
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackGradient = ['#111319', '#1D2948', '#0A0D14'],
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center overflow-hidden ${className}`}
        style={{
          background: `radial-gradient(circle at 25% 25%, ${fallbackGradient[1]}, transparent 65%), linear-gradient(135deg, ${fallbackGradient[0]}, ${fallbackGradient[2]})`,
        }}
      >
        <div className="flex flex-col items-center gap-2 text-white/40">
          <ImageIcon className="h-6 w-6 stroke-[1.5]" />
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
