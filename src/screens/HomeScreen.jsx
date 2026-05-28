export default function HomeScreen({ onNavigate }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dash-bg">
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 200 240" className="w-80 h-96 drop-shadow-2xl">
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#0a1628" />
            </linearGradient>
            <linearGradient id="shieldBorder" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4a261" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#f4a261" />
            </linearGradient>
          </defs>

          <path
            d="M100 10 L185 55 L185 120 Q185 180 100 230 Q15 180 15 120 L15 55 Z"
            fill="url(#shieldGrad)"
            stroke="url(#shieldBorder)"
            strokeWidth="4"
          />

          <path
            d="M100 10 L185 55 L185 120 Q185 180 100 230 Q15 180 15 120 L15 55 Z"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            transform="scale(0.92) translate(8, 10)"
          />

          <circle cx="100" cy="85" r="28" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.4" />
          <circle cx="100" cy="85" r="22" fill="none" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.3" />

          <text x="100" y="82" textAnchor="middle" fill="#00d4ff" fontSize="8" fontWeight="700" fontFamily="'Inter', sans-serif" letterSpacing="0.2em">
            REPÚBLICA
          </text>
          <text x="100" y="96" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900" fontFamily="'Inter', sans-serif" letterSpacing="0.15em">
            DEL PERÚ
          </text>

          <line x1="60" y1="115" x2="140" y2="115" stroke="#f4a261" strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="55" y1="118" x2="145" y2="118" stroke="#f4a261" strokeWidth="0.8" strokeOpacity="0.6" />

          <rect x="45" y="127" width="110" height="26" rx="4" fill="none" stroke="#f4a261" strokeWidth="1" strokeOpacity="0.4" />
          <text x="100" y="144" textAnchor="middle" fill="#f4a261" fontSize="10" fontWeight="800" fontFamily="'Inter', sans-serif" letterSpacing="0.15em">
            ESTRATÉGICA
          </text>

          <line x1="40" y1="163" x2="160" y2="163" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.15" />

          <text x="100" y="188" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="600" fontFamily="'Inter', sans-serif" letterSpacing="0.25em">
            VISIÓN ESTRATÉGICA
          </text>
        </svg>
      </div>

      <div className="flex items-end justify-center gap-6 pb-12 px-8">
        <button
          onClick={() => onNavigate('area')}
          className="w-64 h-20 py-5 px-6 text-base font-bold text-white bg-[#f4a261] hover:bg-[#e8944e] rounded-xl transition-all shadow-lg shadow-orange-500/20 border border-[#f4a261]/50"
        >
          Amenazas caracterizadas
        </button>
        <button
          onClick={() => onNavigate('area')}
          className="w-80 h-20 py-5 px-6 text-base font-bold text-white bg-[#3b82f6] hover:bg-[#2563eb] rounded-xl transition-all shadow-lg shadow-blue-500/20 border border-[#3b82f6]/50"
        >
          Análisis cuantitativo y cualitativo de amenazas e intereses
        </button>
        <button
          onClick={() => onNavigate('area')}
          className="w-64 h-20 py-5 px-6 text-base font-bold text-white bg-[#3b82f6] hover:bg-[#2563eb] rounded-xl transition-all shadow-lg shadow-blue-500/20 border border-[#3b82f6]/50"
        >
          Concepción estratégica
        </button>
      </div>
    </div>
  );
}
