interface SectionHeaderProps {
  title: string;
  color?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  color = '#00D4FF',
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-4 mb-6 ${className}`}>
      <div className="w-1 h-8 rounded-full" style={{ backgroundColor: color }} />
      <h2 className="text-lg font-bold uppercase tracking-wider text-textLight">
        {title}
      </h2>
      <div className="flex-1 h-px bg-army" />
    </div>
  );
}
