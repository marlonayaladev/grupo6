import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: [
    'bg-cyan/15 text-cyan border border-cyan',
    'hover:bg-cyan/25 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]',
    'active:scale-95',
  ].join(' '),
  danger: [
    'bg-danger/15 text-danger border border-danger',
    'hover:bg-danger/25 hover:shadow-[0_0_20px_rgba(255,59,59,0.3)]',
    'active:scale-95',
  ].join(' '),
  ghost: [
    'bg-transparent text-textLight border border-army',
    'hover:border-cyan/50 hover:text-cyan',
    'active:scale-95',
  ].join(' '),
};

export default function Button({
  variant = 'primary',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
