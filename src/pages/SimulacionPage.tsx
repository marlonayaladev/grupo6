import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSimulacionStore } from '../store/simulacionStore';
import { calcularResultados } from '../utils/simuladorMatematico';
import PanelEfectoInstitucional from './Simulacion/PanelEfectoInstitucional';
import PanelEfectoNacional from './Simulacion/PanelEfectoNacional';
import FichaResultados from './Simulacion/FichaResultados';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

export default function SimulacionPage() {
  const { id } = useParams<{ id: string }>();
  const { historial } = useSimulacionStore();
  const sim = historial.find((s) => s.id === id);
  const [isPresenting, setIsPresenting] = useState(false);

  if (!sim) {
    return (
      <div className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Simulación no encontrada" />
          <Link to="/">
            <Button variant="ghost">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const activos = sim.activosSeleccionados.map((a) => ({ nivel_criticidad: 4 }));
  const amenazas = sim.amenazas.map(() => ({ nivel_impacto_base: 3 }));
  const datos = calcularResultados(activos, sim.iniciativa, amenazas, sim.ambito);

  if (isPresenting) {
    return (
      <div className="min-h-full text-textLight">
        {/* Botón salir — fixed top-right */}
        <button
          onClick={() => setIsPresenting(false)}
          className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-lg font-bold uppercase tracking-wider text-xs px-4 py-2 bg-danger/15 text-danger border border-danger hover:bg-danger/25 hover:shadow-[0_0_20px_rgba(255,59,59,0.3)] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          Salir de presentación
        </button>

        <div className="w-full flex flex-col gap-10 px-10 py-10">
          <SectionHeader title={`Simulación ${id?.slice(0, 8)} — Modo Presentación`} />
          <PanelEfectoInstitucional datos={datos} />
          <PanelEfectoNacional datos={datos} />
          <FichaResultados
            datos={datos}
            activos={sim.activosSeleccionados}
            amenazas={sim.amenazas}
            iniciativa={sim.iniciativa}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <SectionHeader title={`Simulación ${id?.slice(0, 8)}`} />

        <PanelEfectoInstitucional datos={datos} />
        <PanelEfectoNacional datos={datos} />
        <FichaResultados
          datos={datos}
          activos={sim.activosSeleccionados}
          amenazas={sim.amenazas}
          iniciativa={sim.iniciativa}
        />

        <div className="pt-4 border-t border-army flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost">Volver al Inicio</Button>
          </Link>
          <Button variant="primary" onClick={() => setIsPresenting(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
            Modo Presentación
          </Button>
        </div>
      </div>
    </div>
  );
}
