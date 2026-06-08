import { type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  children,
  className = '',
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-surface border border-cyan/20 rounded-lg shadow-2xl max-w-2xl w-full mx-4 ${className}`}
        style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
