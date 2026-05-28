import { useState } from 'react';
import { categories } from '../data';

const areasCriticas = [
  { id: 'z1', label: 'Huarango - San José de Lourdes (Cajamarca)' },
  { id: 'z2', label: 'Comaina (Amazonas)' },
  { id: 'z3', label: 'Santiago (Amazonas)' },
  { id: 'z4', label: 'Morona (Loreto)' },
  { id: 'z5', label: 'Napo Curaray (Loreto)' },
  { id: 'z6', label: 'Putumayo (Loreto)' },
  { id: 'z7', label: 'Trapecio Amazónico (Loreto)' },
  { id: 'z8', label: 'Yaquerana - Alto Tamaya (Loreto / Ucayali)' },
  { id: 'z9', label: 'Zona Ucayali / Purús-Breu (Ucayali)' },
  { id: 'z10', label: 'Yurúa (Ucayali)' },
  { id: 'z11', label: 'Purús (Ucayali)' },
  { id: 'z12', label: 'Iñapari (Madre de Dios)' },
  { id: 'z13', label: 'La Yarada Los Palos (Tacna)' },
];

function CategoryBlock({ category, filters, onToggle, onSelectAll }) {
  const items = category.items;
  const selectedCount = items.filter((i) => filters[i.id]).length;
  const allSelected = selectedCount === items.length;

  return (
    <div className="border border-dash-border rounded-xl overflow-hidden bg-dash-surface/30">
      <div className="w-full flex items-center justify-between px-6 py-5 bg-[#3b82f6]">
        <span className="text-base font-bold text-white uppercase tracking-wider">
          {category.name}
        </span>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-5xl font-bold text-dash-text">{itemCount(category)}</span>
          <button
            onClick={() => onSelectAll(category.id, !allSelected)}
            className="text-sm uppercase tracking-widest text-[#f97316] hover:text-[#ea580c] font-bold transition-colors"
          >
            {allSelected ? 'DESELECCIONAR TODAS' : 'SELECCIONAR TODAS'}
          </button>
        </div>

        <div className="space-y-1.5">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 px-4 py-2.5 rounded cursor-pointer hover:bg-white/5 transition-colors"
            >
              <input
                type="checkbox"
                checked={!!filters[item.id]}
                onChange={() => onToggle(category.id, item.id)}
                className="w-5 h-5 rounded border-dash-border accent-[#3b82f6] shrink-0"
              />
              <span className="text-sm font-semibold shrink-0 text-ring-0">
                {item.id}
              </span>
              <span className="text-sm text-dash-muted truncate">{item.nombre}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function itemCount(category) {
  const total = category.items.length;
  return total;
}

export default function FilterScreen({
  filters,
  onToggleItem,
  onSelectAll,
  onRecommendSelection,
  onGenerateRadial,
  onBack,
  areaCritica,
}) {
  const [area, setArea] = useState(areaCritica || '');

  return (
    <div className="h-screen flex flex-col bg-dash-bg">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-8xl mx-auto px-8 py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-4xl font-bold tracking-[0.15em] text-dash-text uppercase">
              CONCEPCIÓN ESTRATÉGICA
            </h1>
            <div className="flex items-center gap-6 mt-2">
              <span className="text-sm text-dash-muted uppercase tracking-wider font-medium">
                Análisis Cuantitativo
              </span>
              <span className="text-sm text-dash-muted uppercase tracking-wider font-medium">
                Amenazas Caracterizadas
              </span>
            </div>
          </div>

          <div className="mb-8 text-center">
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-[500px] mx-auto px-5 py-4 text-base font-semibold text-white bg-dash-surface border-2 border-dash-border rounded-xl focus:border-[#3b82f6] focus:outline-none transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '20px',
              }}
            >
              <option value="">Seleccione Área Crítica</option>
              {areasCriticas.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-10">
            {categories.map((cat) => (
              <CategoryBlock
                key={cat.id}
                category={cat}
                filters={filters[cat.id] || {}}
                onToggle={onToggleItem}
                onSelectAll={onSelectAll}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="h-24 flex items-center justify-center gap-6 border-t border-dash-border bg-dash-surface shrink-0 px-8">
        <button
          onClick={onRecommendSelection}
          className="px-12 py-4 text-base font-bold uppercase tracking-wider bg-[#f97316] text-white border-2 border-[#ea580c] rounded-xl hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-500/20"
        >
          RECOMENDAR SELECCIÓN
        </button>
        <button
          onClick={onGenerateRadial}
          className="px-12 py-4 text-base font-bold uppercase tracking-wider bg-[#ef4444] text-white border-2 border-[#dc2626] rounded-xl hover:bg-[#dc2626] transition-all shadow-lg shadow-red-500/20"
        >
          GENERAR RADIAL
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
