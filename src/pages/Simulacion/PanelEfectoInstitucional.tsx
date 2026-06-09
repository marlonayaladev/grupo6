import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SimulacionResult } from '../../utils/simuladorMatematico';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';

interface Props {
  datos: SimulacionResult;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

function SemaforoRiesgo({ nivel }: { nivel: number }) {
  const color =
    nivel < 0.33 ? '#00C851' : nivel < 0.66 ? '#FFB800' : '#FF3B3B';
  const label =
    nivel < 0.33 ? 'BAJO' : nivel < 0.66 ? 'MEDIO' : 'CRÍTICO';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="80" height="160" viewBox="0 0 80 160">
        <rect x="15" y="0" width="50" height="150" rx="25" fill="#0A1628" stroke="#1B3A6B" strokeWidth="2" />
        <circle cx="40" cy="35" r="16" fill={nivel < 0.33 ? color : '#0D1F3C'} opacity={nivel < 0.33 ? 1 : 0.3} />
        <circle cx="40" cy="80" r="16" fill={nivel >= 0.33 && nivel < 0.66 ? color : '#0D1F3C'} opacity={nivel >= 0.33 && nivel < 0.66 ? 1 : 0.3} />
        <circle cx="40" cy="125" r="16" fill={nivel >= 0.66 ? color : '#0D1F3C'} opacity={nivel >= 0.66 ? 1 : 0.3} />
        {nivel >= 0.66 && <circle cx="40" cy="125" r="22" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />}
      </svg>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function MapaCalor({ datos }: { datos: SimulacionResult }) {
  const metricas = [
    { label: 'Continuidad Operacional', value: datos.efecto_nacional.disponibilidad_critica },
    { label: 'Disponibilidad de Servicios', value: Math.max(0, 100 - datos.parametricas.riesgoGlobal * 80) },
    { label: 'Integridad de Datos', value: Math.max(0, 100 - datos.parametricas.factorAmenaza * 18) },
    { label: 'Respuesta Institucional', value: Math.max(0, 100 - datos.parametricas.criticidadBase * 15) },
    { label: 'Comunicación Pública', value: datos.efecto_institucional.confianza_ciudadana },
    { label: 'Resiliencia del Sistema', value: Math.max(0, 100 - datos.parametricas.riesgoGlobal * 70) },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {metricas.map((m) => {
        const pct = Math.min(100, Math.max(0, m.value));
        const bg =
          pct > 70 ? 'bg-success/30' : pct > 40 ? 'bg-warning/30' : 'bg-danger/30';
        return (
          <div key={m.label} className={`rounded-lg p-2 sm:p-3 text-center ${bg}`}>
            <p className="text-[9px] sm:text-[10px] text-textLight/60 uppercase tracking-wider mb-1">
              {m.label}
            </p>
            <p className="text-base sm:text-lg font-bold text-textLight">{Math.round(pct)}%</p>
          </div>
        );
      })}
    </div>
  );
}

function MetricaCard({ label, valor, unidad, delay }: {
  label: string;
  valor: string | number;
  unidad: string;
  delay: number;
}) {
  return (
    <motion.div custom={delay} variants={fadeUp} initial="hidden" animate="visible">
      <Card className="p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] text-textLight/50 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-lg sm:text-xl font-bold text-textLight">
          {valor}
          <span className="text-xs text-textLight/40 ml-1">{unidad}</span>
        </p>
      </Card>
    </motion.div>
  );
}

export default function PanelEfectoInstitucional({ datos }: Props) {
  return (
    <div>
      <SectionHeader title="Efecto Institucional" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Semáforo */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="sm:col-span-1">
          <Card className="p-6 flex flex-col items-center">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Riesgo Global</p>
            <SemaforoRiesgo nivel={datos.parametricas.riesgoGlobal} />
          </Card>
        </motion.div>

        {/* Mapa de calor */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="sm:col-span-1">
          <Card className="p-4 sm:p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Mapa de Calor</p>
            <MapaCalor datos={datos} />
          </Card>
        </motion.div>

        {/* Gráfico */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="sm:col-span-2">
          <Card className="p-4 sm:p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Serie Temporal — Disponibilidad</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={datos.serie_temporal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B3A6B" />
                <XAxis
                  dataKey="dia"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={{ stroke: '#1B3A6B' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={{ stroke: '#1B3A6B' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1F3C',
                    border: '1px solid #1B3A6B',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#E8EDF5',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="disponibilidad"
                  stroke="#00D4FF"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="recuperacion"
                  stroke="#00C851"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* 6 tarjetas de métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <MetricaCard
          label="Impacto Económico"
          valor={`$${(datos.efecto_institucional.impacto_economico / 1_000_000).toFixed(1)}M`}
          unidad=""
          delay={3}
        />
        <MetricaCard
          label="Confianza Ciudadana"
          valor={datos.efecto_institucional.confianza_ciudadana.toFixed(1)}
          unidad="%"
          delay={4}
        />
        <MetricaCard
          label="Disponibilidad Crítica"
          valor={datos.efecto_nacional.disponibilidad_critica.toFixed(1)}
          unidad="%"
          delay={5}
        />
        <MetricaCard
          label="Riesgo Global"
          valor={(datos.parametricas.riesgoGlobal * 100).toFixed(1)}
          unidad="%"
          delay={6}
        />
        <MetricaCard
          label="Impacto Total Nacional"
          valor={`$${(datos.efecto_nacional.impacto_economico_total / 1_000_000_000).toFixed(1)}B`}
          unidad=""
          delay={7}
        />
        <MetricaCard
          label="Resiliencia del Sistema"
          valor={Math.max(0, 100 - datos.parametricas.riesgoGlobal * 70).toFixed(1)}
          unidad="%"
          delay={8}
        />
      </div>
    </div>
  );
}
