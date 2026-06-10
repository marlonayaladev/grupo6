import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulacionStore } from '../store/simulacionStore';
import { calcularResultados } from '../utils/simuladorMatematico';
import { generarRecomendacionesMock } from '../utils/mockIA';
import { InformePDF } from '../utils/generadorPDF';
import PanelEfectoInstitucional from './Simulacion/PanelEfectoInstitucional';
import PanelEfectoNacional from './Simulacion/PanelEfectoNacional';
import FichaResultados from './Simulacion/FichaResultados';
import Button from '../components/ui/Button';
import CargandoAnimado from '../components/ui/CargandoAnimado';
import Card from '../components/ui/Card';

const TIMING_NAC = [3000, 8000, 11000, 15000, 18000];
const TIMING_INST = [22000, 25000, 29000, 32000];
const TOTAL = 35000;

const cardIn = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function SkeletonCard({ texto }: { texto: string }) {
  return (
    <div className="border border-army/40 rounded-xl p-6 bg-surface/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-cyan/40 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-cyan/70">Generando...</span>
      </div>
      <p className="text-[10px] text-textLight/30 uppercase tracking-wider mb-3">{texto}</p>
      <div className="space-y-2">
        <div className="h-3 bg-army/20 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-army/20 rounded w-1/2 animate-pulse" />
        <div className="h-3 bg-army/20 rounded w-2/3 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="h-16 bg-army/20 rounded-lg animate-pulse" />
        <div className="h-16 bg-army/20 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export default function SimulacionPage() {
  const { id } = useParams<{ id: string }>();
  const { historial } = useSimulacionStore();
  const sim = historial.find((s) => s.id === id);
  const [recomendaciones, setRecomendaciones] = useState<string[]>([]);
  const [nacCount, setNacCount] = useState(0);
  const [instCount, setInstCount] = useState(0);
  const [nacCargando, setNacCargando] = useState(true);
  const [nacLoading, setNacLoading] = useState(false);
  const [instCargando, setInstCargando] = useState(false);
  const [instLoading, setInstLoading] = useState(false);
  const [fichaCargando, setFichaCargando] = useState(false);
  const [showFicha, setShowFicha] = useState(false);
  const [fichaLoading, setFichaLoading] = useState(false);

  useEffect(() => {
    if (!sim) return;
    setNacCount(0);
    setInstCount(0);
    setNacCargando(true);
    setNacLoading(false);
    setInstCargando(false);
    setInstLoading(false);
    setFichaCargando(false);
    setFichaLoading(false);
    setShowFicha(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setNacCargando(false), 2000));
    timers.push(setTimeout(() => setNacLoading(true), 2000));
    TIMING_NAC.forEach((t, i) => timers.push(setTimeout(() => { setNacLoading(false); setNacCount(i + 1); }, t)));

    timers.push(setTimeout(() => setInstCargando(true), 20000));
    timers.push(setTimeout(() => { setInstCargando(false); setInstLoading(true); }, 22000));
    TIMING_INST.forEach((t, i) => timers.push(setTimeout(() => { setInstLoading(false); setInstCount(i + 1); }, t)));

    timers.push(setTimeout(() => setFichaCargando(true), 34000));
    timers.push(setTimeout(() => { setFichaCargando(false); setFichaLoading(true); }, 36000));
    timers.push(setTimeout(() => { setFichaLoading(false); setShowFicha(true); }, 37000));

    generarRecomendacionesMock().then(setRecomendaciones);
    return () => timers.forEach(clearTimeout);
  }, [sim]);

  if (!sim) {
    return (
      <div className="px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <Link to="/"><Button variant="ghost">Volver al Inicio</Button></Link>
        </div>
      </div>
    );
  }

  const activos = sim.activosSeleccionados.map(() => ({ nivel_criticidad: 4 }));
  const amenazas = sim.amenazas.map(() => ({ nivel_impacto_base: 3 }));
  const datos = calcularResultados(activos, sim.iniciativa, amenazas, sim.ambito);

  return (
    <div className="min-h-full text-textLight px-4 sm:px-10 py-8 sm:py-10">
      <div className="flex items-center justify-end gap-3 mb-6">
        <Link to="/"><Button variant="ghost">Volver al Inicio</Button></Link>
        {showFicha && (
          <PDFDownloadLink
            document={<InformePDF datos={datos} activos={sim.activosSeleccionados} amenazas={sim.amenazas} iniciativa={sim.iniciativa} recomendaciones={recomendaciones} />}
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
        {/* Nacional */}
        <div>
          <AnimatePresence mode="wait">
            {nacCount > 0 ? (
              <motion.div key="nacional" layout variants={cardIn} initial="hidden" animate="visible">
                <PanelEfectoNacional
                  datos={datos}
                  showMapa={nacCount >= 1}
                  showCurva={nacCount >= 2}
                  showRadar={nacCount >= 3}
                  showImpacto={nacCount >= 4}
                  showIndicadores={nacCount >= 5}
                />
              </motion.div>
            ) : nacLoading ? (
              <motion.div key="nac-skeleton" initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
                <SkeletonCard texto="Efecto Nacional" />
              </motion.div>
            ) : nacCargando ? (
              <motion.div key="nac-cargando" initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
                <Card className="p-10 flex flex-col items-center justify-center min-h-[200px]">
                  <CargandoAnimado texto="Generando Efecto Nacional..." />
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Separador */}
        {(instCount > 0 || instLoading) && (
          <>
            <div className="hidden lg:block w-px bg-army/40 self-stretch" />
            <div className="block lg:hidden h-px bg-army/40 my-2" />
          </>
        )}

        {/* Institucional */}
        <div>
          <AnimatePresence mode="wait">
            {instCount > 0 ? (
              <motion.div key="institucional" layout variants={cardIn} initial="hidden" animate="visible">
                <PanelEfectoInstitucional
                  datos={datos}
                  showSemaforo={instCount >= 1}
                  showCalor={instCount >= 2}
                  showSerie={instCount >= 3}
                  showMetricas={instCount >= 4}
                />
              </motion.div>
            ) : instLoading ? (
              <motion.div key="inst-skeleton" initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
                <SkeletonCard texto="Efecto Institucional" />
              </motion.div>
            ) : instCargando ? (
              <motion.div key="inst-cargando" initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
                <Card className="p-10 flex flex-col items-center justify-center min-h-[200px]">
                  <CargandoAnimado texto="Generando Efecto Institucional..." />
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Ficha de Resultados */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {showFicha ? (
            <motion.div key="ficha" layout variants={cardIn} initial="hidden" animate="visible">
              <FichaResultados datos={datos} activos={sim.activosSeleccionados} amenazas={sim.amenazas} iniciativa={sim.iniciativa} recomendaciones={recomendaciones} />
            </motion.div>
          ) : fichaLoading ? (
            <motion.div key="ficha-skeleton" initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
              <SkeletonCard texto="Ficha de Resultados" />
            </motion.div>
          ) : fichaCargando ? (
            <motion.div key="ficha-cargando" initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
              <Card className="p-10 flex flex-col items-center justify-center min-h-[200px]">
                <CargandoAnimado texto="Generando Ficha de Resultados..." />
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
