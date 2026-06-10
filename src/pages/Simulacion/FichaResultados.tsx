import { motion } from 'framer-motion';
import type { SimulacionResult } from '../../utils/simuladorMatematico';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';

interface Props {
  datos: SimulacionResult;
  activos: string[];
  amenazas: string[];
  iniciativa: string | null;
  recomendaciones: string[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' as const },
  }),
};

export default function FichaResultados({ datos, activos, amenazas, iniciativa, recomendaciones }: Props) {
  const nivelRiesgo =
    datos.parametricas.riesgoGlobal < 0.33
      ? 'BAJO'
      : datos.parametricas.riesgoGlobal < 0.66
        ? 'MEDIO'
        : 'CRÍTICO';

  const colorRiesgo =
    nivelRiesgo === 'BAJO'
      ? 'text-success'
      : nivelRiesgo === 'MEDIO'
        ? 'text-warning'
        : 'text-danger';

  return (
    <div>
      <SectionHeader title="Ficha de Resultados" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Resumen de entrada */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5 sm:p-6 h-full">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-3">
              Parámetros de Entrada
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-textLight/50">Activos: </span>
                <span className="text-textLight">{activos.length} seleccionado(s)</span>
              </div>
              <div>
                <span className="text-textLight/50">Amenazas: </span>
                <span className="text-textLight">{amenazas.length} identificada(s)</span>
              </div>
              <div>
                <span className="text-textLight/50">Iniciativa: </span>
                <span className="text-textLight">{iniciativa || 'No especificada'}</span>
              </div>
              <div className="pt-2 border-t border-army/30">
                <span className="text-textLight/50">Nivel de Riesgo: </span>
                <span className={`font-bold ${colorRiesgo}`}>{nivelRiesgo}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Impacto económico */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5 sm:p-6 h-full">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-3">
              Impacto Económico Estimado
            </p>
            <div className="space-y-4">
              <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
                <p className="text-[10px] text-danger/70 uppercase tracking-wider">Nacional</p>
                <p className="text-lg sm:text-xl font-bold text-danger">
                  S/ {(datos.efecto_nacional.impacto_economico_total / 1_000_000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-surface border border-army/20 rounded-xl p-4">
                <p className="text-[10px] text-textLight/50 uppercase tracking-wider">Institucional</p>
                <p className="text-base sm:text-lg font-bold text-textLight">
                  S/ {(datos.efecto_institucional.impacto_economico / 1_000_000).toFixed(1)}M
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Indicadores clave */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5 sm:p-6 h-full">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-3">
              Indicadores Clave
            </p>
            <div className="space-y-3">
              {[
                { label: 'Disponibilidad Crítica', value: datos.efecto_nacional.disponibilidad_critica, color: 'bg-cyan' },
                { label: 'Confianza Ciudadana', value: datos.efecto_institucional.confianza_ciudadana, color: 'bg-success' },
                { label: 'Riesgo Global', value: datos.parametricas.riesgoGlobal * 100, color: 'bg-danger' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[10px] text-textLight/50 uppercase tracking-wider mb-1">
                    <span>{item.label}</span>
                    <span>{item.value.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${item.color} transition-all duration-1000`}
                      style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recomendaciones */}
      {recomendaciones.length > 0 && (
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5 sm:p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">
              Recomendaciones de Ciberseguridad
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recomendaciones.map((rec, i) => (
                <motion.div
                  key={i}
                  custom={4 + i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="bg-surface border border-army/30 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center text-[10px] font-bold text-cyan">
                      {i + 1}
                    </span>
                    <p className="text-xs text-textLight/80 leading-relaxed">{rec}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
