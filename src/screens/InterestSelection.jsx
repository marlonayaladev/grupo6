import { useState } from 'react';
import { amenazasCaracterizadas } from '../data';

const interesesRecomendados = [
  'Soberanía Nacional de la Zona Fronteriza no delimitada, de reducido control o de herencia cultural de isla lacustre Taquile-Amantani.',
  'Control territorial de corredores económicos Desaguadero-Ilo.',
  'Control de Recursos Estratégicos de corredor San Juan del Oro-Macusani.',
  'Mantenimiento de aprobación del segmento aimara respecto a control gubernamental del Estado.',
  'Mantenimiento de capacidad de comercio internacional.',
];

export default function InterestSelection({ onGenerateMatrix, onBack }) {
  const [mode, setMode] = useState('idle');
  const [texts, setTexts] = useState(Array(5).fill(''));
  const [loading, setLoading] = useState(false);

  const allFilled = texts.every((t) => t.trim().length > 0);

  const handleRecommend = () => {
    setLoading(true);
    setTimeout(() => {
      setTexts([...interesesRecomendados]);
      setLoading(false);
      setMode('filled');
    }, 3000);
  };

  return (
    <div className="h-screen flex flex-col bg-dash-bg">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-dash-border p-6 overflow-y-auto">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#f97316] mb-5">
            Amenazas Caracterizadas
          </h2>
          <div className="space-y-4">
            {amenazasCaracterizadas.map((am) => (
              <div
                key={am.id}
                className="border border-dash-border rounded-xl p-4 bg-dash-surface/30"
              >
                <span className="text-xs font-bold text-dash-muted">
                  {String(am.id).padStart(2, '0')}
                </span>
                <p className="text-sm text-dash-text mt-1 leading-snug">{am.nombre}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {am.path.map((pid) => (
                    <span
                      key={pid}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-dash-border/50 text-dash-muted bg-white/5"
                    >
                      {pid}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-[0.15em] text-dash-text uppercase">
              Intereses Nacionales
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setMode('editing')}
                className="px-6 py-3 text-sm font-bold uppercase tracking-wider bg-dash-surface text-dash-text border-2 border-dash-border rounded-xl hover:border-dash-muted transition-all"
              >
                Redactar Intereses
              </button>
              <button
                onClick={handleRecommend}
                disabled={loading}
                className="px-6 py-3 text-sm font-bold uppercase tracking-wider bg-[#3b82f6] text-white border-2 border-[#2563eb] rounded-xl hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                Recomendar Intereses
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-dash-surface/50 border border-dash-border rounded-xl">
              <div className="w-2 h-2 bg-[#3b82f6] rounded-full animate-pulse" />
              <span className="text-sm text-dash-muted font-mono">
                Analizando escenarios políticos, económicos y sociales...
              </span>
            </div>
          )}

          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="border border-dash-border rounded-xl p-4 bg-dash-surface/30"
              >
                <span className="text-xs font-bold text-dash-muted uppercase tracking-wider mb-2 block">
                  Interés Nacional {i + 1}
                </span>
                {mode === 'editing' && !loading ? (
                  <textarea
                    value={texts[i]}
                    onChange={(e) => {
                      const next = [...texts];
                      next[i] = e.target.value;
                      setTexts(next);
                    }}
                    placeholder="Redacte el interés nacional..."
                    rows={3}
                    className="w-full bg-dash-bg border border-dash-border rounded-lg px-3 py-2 text-sm text-dash-text placeholder-dash-muted/50 focus:border-[#3b82f6] focus:outline-none resize-none transition-colors"
                  />
                ) : (
                  <p className="text-sm text-dash-text leading-snug min-h-[3rem]">
                    {texts[i] || (
                      <span className="text-dash-muted/40 italic">
                        Presione "Recomendar Intereses" o "Redactar Intereses" para comenzar
                      </span>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-24 flex items-center justify-center gap-6 border-t border-dash-border bg-dash-surface shrink-0 px-8">
        <button
          onClick={() => onGenerateMatrix(texts)}
          disabled={!allFilled}
          className={`px-12 py-4 text-base font-bold uppercase tracking-wider rounded-xl border-2 transition-all ${
            allFilled
              ? 'bg-[#ef4444] text-white border-[#dc2626] hover:bg-[#dc2626] shadow-lg shadow-red-500/20'
              : 'bg-dash-bg text-dash-muted/40 border-dash-border cursor-not-allowed'
          }`}
        >
          Generar Matriz
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-10 py-4 text-base font-semibold uppercase tracking-widest text-dash-muted hover:text-dash-text border-2 border-dash-border rounded-xl hover:border-dash-muted transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          VOLVER
        </button>
      </div>
    </div>
  );
}
