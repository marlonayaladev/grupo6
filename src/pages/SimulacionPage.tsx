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

export default function SimulacionPage() {
  const { id } = useParams<{ id: string }>();
  const { historial } = useSimulacionStore();
  const sim = historial.find((s) => s.id === id);
  const [loading, setLoading] = useState(true);
  const [showNacional, setShowNacional] = useState(false);
  const [showInstitucional, setShowInstitucional] = useState(false);
  const [recomendaciones, setRecomendaciones] = useState<string[]>([]);

  useEffect(() => {
    if (!sim) return;
    setLoading(true);
    setShowNacional(false);
    setShowInstitucional(false);

    const t1 = setTimeout(() => setShowNacional(true), 2000);
    const t2 = setTimeout(() => setShowInstitucional(true), 4000);
    const t3 = setTimeout(() => setLoading(false), 6000);

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

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-10 min-h-[80vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-54 h-54 border-4 border-army border-t-cyan rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/logo.png" alt="" className="w-54 h-54 object-contain animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-cyan mb-2">Analizando Simulación</p>
            <p className="text-xs text-textLight/40">Generando resultados con inteligencia artificial...</p>
          </div>
          <div className="w-64 h-1 bg-army/30 rounded-full overflow-hidden">
            <div className="h-full bg-cyan rounded-full" style={{ width: '100%', animation: 'loadingBar 6s linear forwards' }} />
          </div>
        </div>
        <style>{`@keyframes loadingBar { from { width: 0%; } to { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-full text-textLight px-4 sm:px-10 py-8 sm:py-10">
      <div className="flex items-center justify-end gap-3 mb-6">
        <Link to="/">
          <Button variant="ghost">Volver al Inicio</Button>
        </Link>
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
      </div>

      {/* Split: Nacional | Institucional */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
        {showNacional && (
          <div className="transition-opacity duration-700">
            <PanelEfectoNacional datos={datos} />
          </div>
        )}
        {showNacional && showInstitucional && (
          <div className="hidden lg:block w-px bg-army/40 self-stretch" />
        )}
        {showNacional && showInstitucional && (
          <div className="block lg:hidden h-px bg-army/40 my-2" />
        )}
        {showInstitucional && (
          <div className="transition-opacity duration-700">
            <PanelEfectoInstitucional datos={datos} />
          </div>
        )}
      </div>

      {showInstitucional && (
        <div className="mt-8 transition-opacity duration-700">
          <FichaResultados
            datos={datos}
            activos={sim.activosSeleccionados}
            amenazas={sim.amenazas}
            iniciativa={sim.iniciativa}
            recomendaciones={recomendaciones}
          />
        </div>
      )}
    </div>
  );
}
