interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  className = '',
  color = 'bg-cyan',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full h-2 bg-navy rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
