export default function HomeScreen({ onNavigate }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dash-bg">
      <div className="flex-1 flex items-center justify-center">
        <img src="/logo.png" alt="Logo" className="w-180 h-196 object-contain drop-shadow-2xl" />
      </div>

      <div className="flex items-end justify-center gap-6 pb-12 px-8">
        <button
          onClick={() => onNavigate('area')}
          className="w-72 h-20 py-5 px-6 text-base font-bold text-white bg-[#f4a261] hover:bg-[#e8944e] rounded-xl transition-all shadow-lg shadow-orange-500/20 border border-[#f4a261]/50"
        >
          Caracterizar amenazas
        </button>
        <button
          onClick={() => onNavigate('area')}
          className="w-80 h-20 py-5 px-6 text-base font-bold text-white bg-[#3b82f6] hover:bg-[#2563eb] rounded-xl transition-all shadow-lg shadow-blue-500/20 border border-[#3b82f6]/50"
        >
          Análisis cuantitativo y cualitativo de amenazas e intereses
        </button>
      </div>
    </div>
  );
}
