import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSimulacionStore } from '../store/simulacionStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ParticleCanvas from '../components/ParticleCanvas';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function LandingPage() {
  const historial = useSimulacionStore((s) => s.historial);
  const ultimas = historial.slice(-3).reverse();

  return (
    <div className="min-h-full bg-bg text-textLight relative">
      <ParticleCanvas />

      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl w-full text-center mb-12"
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.2em] text-cyan leading-tight">
              Sandbox Institucional
            </h1>
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-textLight/70 mt-2">
              de Resiliencia Digital
            </h2>
          </div>

          <p className="text-textLight/50 text-sm max-w-xl mx-auto mb-10">
            Simulación interactiva de escenarios de amenazas contra infraestructura crítica digital.
            Evalué riesgos, practique respuestas y analice resultados.
          </p>

          <Link to="/generar">
            <Button variant="primary" className="text-base px-10 py-4">
              Generar Situación
            </Button>
          </Link>
        </motion.div>

        {/* 3 tarjetas del historial */}
        {ultimas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-4xl w-full"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-army/40" />
              <span className="text-[10px] text-textLight/40 uppercase tracking-widest">Últimas Simulaciones</span>
              <div className="h-px flex-1 bg-army/40" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {ultimas.map((sim, i) => (
                <motion.div key={sim.id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                  <Link to={`/simulacion/${sim.id}`}>
                    <Card className="p-5 hover:border-cyan/40 transition-all cursor-pointer h-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-cyan font-mono">
                          {new Date(sim.fecha).toLocaleDateString('es-PE', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-[10px] text-textLight/30 font-mono">
                          {sim.id.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-textLight mb-2">
                        {sim.iniciativa || 'Sin iniciativa'}
                      </p>
                      <div className="flex gap-3 text-[10px] text-textLight/40">
                        <span>{sim.activosSeleccionados.length} activos</span>
                        <span>·</span>
                        <span>{sim.amenazas.length} amenazas</span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {ultimas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-md w-full"
          >
            <Card className="p-8 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-textLight/20">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-textLight/40 mb-1">No hay simulaciones aún</p>
              <p className="text-xs text-textLight/25">Genere su primera situación para ver resultados aquí</p>
            </Card>
          </motion.div>
        )}

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 flex gap-6"
        >
          {[
            { to: '/historial', label: 'Historial' },
            { to: '/biblioteca', label: 'Biblioteca' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs text-textLight/30 hover:text-cyan transition-colors uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
