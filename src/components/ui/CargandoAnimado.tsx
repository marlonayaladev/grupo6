export default function CargandoAnimado({ texto }: { texto: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="flex gap-2">
        <span className="w-3 h-3 rounded-full bg-cyan/60 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-3 h-3 rounded-full bg-cyan/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-3 h-3 rounded-full bg-cyan/60 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-cyan/70">{texto}</p>
    </div>
  );
}
