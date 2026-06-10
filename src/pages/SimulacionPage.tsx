import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useSimulacionStore } from '../store/simulacionStore';
import { calcularResultados } from '../utils/simuladorMatematico';
import { generarRecomendacionesMock } from '../utils/mockIA';
import { InformePDF } from '../utils/generadorPDF';
import PanelEfectoInstitucional from './Simulacion/PanelEfectoInstitucional';
import PanelEfectoNacional from './Simulacion/PanelEfectoNacional';
import FichaResultados from './Simulacion/FichaResultados';
import Button from '../components/ui/Button';

function GenerandoSkeleton({ titulo }: { titulo: string }) {
  return (
    <div className="border border-army/40 rounded-xl p-6 sm:p-8 bg-surface/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full bg-cyan/40 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-cyan/70">Generando...</span>
      </div>
      <p className="text-sm text-textLight/30 uppercase tracking-wider mb-4">{titulo}</p>
      <div className="space-y-3">
        <div className="h-4 bg-army/20 rounded-lg w-3/4 animate-pulse" />
        <div className="h-4 bg-army/20 rounded-lg w-1/2 animate-pulse" />
        <div className="h-4 bg-army/20 rounded-lg w-2/3 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="h-20 bg-army/20 rounded-lg animate-pulse" />
        <div className="h-20 bg-army/20 rounded-lg animate-pulse" />
        <div className="h-20 bg-army/20 rounded-lg animate-pulse" />
        <div className="h-20 bg-army/20 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export default function SimulacionPage() {
  const { id } = useParams<{ id: string }>();
  const { historial } = useSimulacionStore();
  const sim = historial.find((s) => s.id === id);
  const [step, setStep] = useState(0);
  const [recomendaciones, setRecomendaciones] = useState<string[]>([]);

  useEffect(() => {
    if (!sim) return;
    setStep(0);

    const t1 = setTimeout(() => setStep(1), 6000);
    const t2 = setTimeout(() => setStep(2), 12000);
    const t3 = setTimeout(() => setStep(3), 18000);

    generarRecomendacionesMock().then(setRecomendaciones);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [sim]);

  if (!sim) {
    return (
      <div className="px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
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

  return (
    <div className="min-h-full text-textLight px-4 sm:px-10 py-8 sm:py-10">
      <div className="flex items-center justify-end gap-3 mb-6">
        <Link to="/">
          <Button variant="ghost">Volver al Inicio</Button>
        </Link>
        {step >= 3 && (
          <PDFDownloadLink
            document={
              <InformePDF
                datos={datos}
                activos={sim.activosSeleccionados}
                amenazas={sim.amenazas}
                iniciativa={sim.iniciativa}
                recomendaciones={recomendaciones}
              />
            }
            fileName="Informe_Simulacion.pdf"
          >
            {({ loading: pdfLoading }) => (
              <span className="inline-flex items-center gap-2 rounded-lg font-bold uppercase tracking-wider text-xs px-4 py-2 bg-cyan/15 text-cyan border border-cyan hover:bg-cyan/25 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] active:scale-95 transition-all duration-200 cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {pdfLoading ? 'Generando...' : 'Descargar PDF'}
              </span>
            )}
          </PDFDownloadLink>
        )}
      </div>

      {/* Split: Nacional | Institucional */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
        {/* Nacional */}
        <div className="transition-opacity duration-700">
          {step >= 1 ? (
            <PanelEfectoNacional datos={datos} />
          ) : (
            <GenerandoSkeleton titulo="Efecto Nacional" />
          )}
        </div>

        {/* Separador */}
        {step >= 2 && (
          <>
            <div className="hidden lg:block w-px bg-army/40 self-stretch" />
            <div className="block lg:hidden h-px bg-army/40 my-2" />
          </>
        )}

        {/* Institucional */}
        <div className="transition-opacity duration-700">
          {step >= 2 ? (
            <PanelEfectoInstitucional datos={datos} />
          ) : (
            <GenerandoSkeleton titulo="Efecto Institucional" />
          )}
        </div>
      </div>

      {/* Ficha de Resultados */}
      <div className="mt-8 transition-opacity duration-700">
        {step >= 3 ? (
          <FichaResultados
            datos={datos}
            activos={sim.activosSeleccionados}
            amenazas={sim.amenazas}
            iniciativa={sim.iniciativa}
            recomendaciones={recomendaciones}
          />
        ) : (
          <GenerandoSkeleton titulo="Ficha de Resultados" />
        )}
      </div>
    </div>
  );
}
