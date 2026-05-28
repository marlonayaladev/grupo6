import { useState } from 'react';
import { categories } from '../data';

const areasCriticas = [
  { id: 'norte', label: 'Norte' },
  { id: 'noreste', label: 'Nororiente' },
  { id: 'centro', label: 'Centro' },
  { id: 'sur', label: 'Sur' },
  { id: 'frontera_sur', label: 'Frontera Sur' },
  { id: 'lima', label: 'Lima' },
];

function CategoryBlock({ category, filters, onToggle, onSelectAll }) {
  const [expanded, setExpanded] = useState(true);
  const items = category.items;
  const selectedCount = items.filter((i) => filters[i.id]).length;
  const allSelected = selectedCount === items.length;

  return (
    <div className="border border-dash-border rounded-xl overflow-hidden bg-dash-surface/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] transition-colors"
      >
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          {category.name}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-white/80 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-4xl font-bold text-dash-text">{itemCount(category)}</span>
          {expanded && (
            <button
              onClick={() => onSelectAll(category.id, !allSelected)}
              className="text-[10px] uppercase tracking-widest text-[#f97316] hover:text-[#ea580c] font-bold transition-colors"
            >
              {allSelected ? 'DESELECCIONAR TODAS' : 'SELECCIONAR TODAS'}
            </button>
          )}
        </div>

        {expanded && (
          <div className="space-y-0.5 max-h-44 overflow-y-auto">
            {items.map((item) => {
              const isExcluded = category.defaultExcluded?.includes(item.id);
              return (
                <label
                  key={item.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!filters[item.id]}
                    onChange={() => onToggle(category.id, item.id)}
                    className="w-3 h-3 rounded border-dash-border accent-[#3b82f6] shrink-0"
                  />
                  <span className={`text-[11px] font-semibold shrink-0 ${isExcluded ? 'text-[#ef4444]' : 'text-ring-0'}`}>
                    {item.id}
                  </span>
                  <span className="text-[10px] text-dash-muted truncate">{item.nombre}</span>
                  {isExcluded && (
                    <span className="text-[8px] text-[#ef4444] font-bold shrink-0">(EXCL)</span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function itemCount(category) {
  const included = category.items.filter((i) => !category.defaultExcluded?.includes(i.id)).length;
  const total = category.items.length;
  return included === total ? total : `${included}/${total}`;
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-base font-bold tracking-[0.15em] text-dash-text uppercase">
              CONCEPCIÓN ESTRATÉGICA
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-dash-muted uppercase tracking-wider font-medium">
                Análisis Cuantitativo
              </span>
              <span className="text-[11px] text-dash-muted uppercase tracking-wider font-medium">
                Amenazas Caracterizadas
              </span>
            </div>
          </div>

          <div className="mb-6">
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-72 px-4 py-3 text-sm font-semibold text-white bg-dash-surface border-2 border-dash-border rounded-xl focus:border-[#3b82f6] focus:outline-none transition-colors appearance-none cursor-pointer"
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

          <div className="grid grid-cols-6 gap-3">
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

      <div className="h-20 flex items-center justify-center gap-4 border-t border-dash-border bg-dash-surface shrink-0 px-8">
        <button
          onClick={onRecommendSelection}
          className="px-10 py-3.5 text-sm font-bold uppercase tracking-wider bg-[#f97316] text-white border-2 border-[#ea580c] rounded-xl hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-500/20"
        >
          8. RECOMENDAR SELECCIÓN
        </button>
        <button
          onClick={onGenerateRadial}
          className="px-10 py-3.5 text-sm font-bold uppercase tracking-wider bg-[#ef4444] text-white border-2 border-[#dc2626] rounded-xl hover:bg-[#dc2626] transition-all shadow-lg shadow-red-500/20"
        >
          GENERAR RADIAL
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-dash-muted hover:text-dash-text border-2 border-dash-border rounded-xl hover:border-dash-muted transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          VOLVER
        </button>
      </div>
    </div>
  );
}
