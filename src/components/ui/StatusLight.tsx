interface StatusLightProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function StatusLight({
  color = '#00C851',
  size = 12,
  className = '',
}: StatusLightProps) {
  return (
    <span
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-60"
        style={{ backgroundColor: color }}
      />
      <span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}
