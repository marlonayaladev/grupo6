interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function Spinner({
  size = 48,
  color = '#00D4FF',
  className = '',
}: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`animate-[radar-spin_2s_linear_infinite] ${className}`}
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray="180 80"
        opacity="0.3"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="4" fill={color} />
    </svg>
  );
}
