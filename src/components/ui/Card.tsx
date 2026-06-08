import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export default function Card({
  glow = false,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-surface border border-cyan/20 rounded-lg
        ${glow ? 'shadow-[0_0_15px_rgba(0,212,255,0.1)]' : ''}
        ${className}
      `}
      style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
      {...props}
    >
      {children}
    </div>
  );
}
