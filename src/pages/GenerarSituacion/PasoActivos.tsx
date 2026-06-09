import { useState } from 'react';
import { useSimulacionStore } from '../../store/simulacionStore';
import activosData from '../../mocks/activos.json';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';

interface Activo {
  id: string;
  nombre: string;
  categoria: 'infra' | 'estado';
  descripcion: string;
  nivel_criticidad: number;
}

const activos = activosData as Activo[];

const infra = activos.filter((a) => a.categoria === 'infra');
const estado = activos.filter((a) => a.categoria === 'estado');

const criticidadLabel: Record<number, string> = {
  1: 'Bajo',
  2: 'Medio-Bajo',
  3: 'Medio',
  4: 'Alto',
  5: 'Crítico',
};

const criticidadColor: Record<number, string> = {
  1: 'text-success',
  2: 'text-success',
  3: 'text-amber-400',
  4: 'text-warning',
  5: 'text-danger',
};

export default function PasoActivos() {
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const setActivosSeleccionados = useSimulacionStore((s) => s.setActivosSeleccionados);
  const setPasoActual = useSimulacionStore((s) => s.setPasoActual);

  const toggle = (id: string) => {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (lista: Activo[]) => {
    const allIds = lista.map((a) => a.id);
    const allSelected = allIds.every((id) => seleccionados.has(id));
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        allIds.forEach((id) => next.delete(id));
      } else {
        allIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const continuar = () => {
    setActivosSeleccionados(Array.from(seleccionados));
    setPasoActual(2);
  };

  const renderColumn = (titulo: string, lista: Activo[]) => {
    const countSelected = lista.filter((a) => seleccionados.has(a.id)).length;
    const allSelected = lista.length > 0 && countSelected === lista.length;

    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-textLight">
            {titulo}
          </h3>
          <button
            onClick={() => toggleAll(lista)}
            className="text-[10px] text-cyan/60 hover:text-cyan transition-colors uppercase tracking-wider"
          >
            {allSelected ? 'Deseleccionar' : 'Seleccionar'} todo
          </button>
        </div>
        <div className="space-y-2">
          {lista.map((activo) => {
            const selected = seleccionados.has(activo.id);
            return (
              <Card
                key={activo.id}
                className={`p-3 sm:p-4 cursor-pointer transition-all ${
                  selected
                    ? 'border-cyan shadow-[0_0_12px_rgba(0,212,255,0.15)]'
                    : 'border-army/50 hover:border-army'
                }`}
                onClick={() => toggle(activo.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                          selected
                            ? 'bg-cyan border-cyan'
                            : 'border-army bg-navy'
                        }`}
                      >
                        {selected && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#050E1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-textLight">
                        {activo.nombre}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-textLight/40 mt-1.5 leading-relaxed line-clamp-2">
                      {activo.descripcion}
                    </p>
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0 ${criticidadColor[activo.nivel_criticidad]}`}>
                    {criticidadLabel[activo.nivel_criticidad]}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <SectionHeader title="Selección de Activos Críticos" />

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
        {renderColumn('Infraestructura Crítica', infra)}
        {renderColumn('Sistemas del Estado', estado)}
      </div>

      <div className="flex items-center justify-between border-t border-army pt-6">
        <span className="text-xs text-textLight/40">
          {seleccionados.size} activo(s) seleccionado(s)
        </span>
        <Button
          variant="primary"
          disabled={seleccionados.size < 1}
          onClick={continuar}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
