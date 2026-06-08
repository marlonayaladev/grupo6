type Level = 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO';

interface BadgeProps {
  level: Level;
  className?: string;
}

const config: Record<Level, { bg: string; text: string; border: string }> = {
  CRÍTICO: {
    bg: 'bg-danger/20',
    text: 'text-danger',
    border: 'border-danger/40',
  },
  ALTO: {
    bg: 'bg-warning/20',
    text: 'text-warning',
    border: 'border-warning/40',
  },
  MEDIO: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
  },
  BAJO: {
    bg: 'bg-success/20',
    text: 'text-success',
    border: 'border-success/40',
  },
};

export default function Badge({ level, className = '' }: BadgeProps) {
  const c = config[level];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${c.bg} ${c.text} ${c.border} ${className}`}
    >
      {level}
    </span>
  );
}
