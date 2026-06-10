import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SimulacionResult } from '../../utils/simuladorMatematico';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import CargandoAnimado from '../../components/ui/CargandoAnimado';

interface Props {
  datos: SimulacionResult;
  showSemaforo: boolean;
  showCalor: boolean;
  showSerie: boolean;
  showMetricas: boolean;
}

const cardIn = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function SemaforoRiesgo({ nivel }: { nivel: number }) {
  const color = nivel < 0.33 ? '#00C851' : nivel < 0.66 ? '#FFB800' : '#FF3B3B';
  const label = nivel < 0.33 ? 'BAJO' : nivel < 0.66 ? 'MEDIO' : 'CRÍTICO';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="80" height="160" viewBox="0 0 80 160">
        <rect x="15" y="0" width="50" height="150" rx="25" fill="#0A1628" stroke="#1B3A6B" strokeWidth="2" />
        <circle cx="40" cy="35" r="16" fill={nivel < 0.33 ? color : '#0D1F3C'} opacity={nivel < 0.33 ? 1 : 0.3} />
        <circle cx="40" cy="80" r="16" fill={nivel >= 0.33 && nivel < 0.66 ? color : '#0D1F3C'} opacity={nivel >= 0.33 && nivel < 0.66 ? 1 : 0.3} />
        <circle cx="40" cy="125" r="16" fill={nivel >= 0.66 ? color : '#0D1F3C'} opacity={nivel >= 0.66 ? 1 : 0.3} />
        {nivel >= 0.66 && <circle cx="40" cy="125" r="22" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />}
      </svg>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
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
        const bg = pct > 70 ? 'bg-success/30' : pct > 40 ? 'bg-warning/30' : 'bg-danger/30';
        return (
          <div key={m.label} className={`rounded-lg p-2 sm:p-3 text-center ${bg}`}>
            <p className="text-[9px] sm:text-[10px] text-textLight/60 uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-base sm:text-lg font-bold text-textLight">{Math.round(pct)}%</p>
          </div>
        );
      })}
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  backgroundColor: '#0D1F3C',
  border: '1px solid #1B3A6B',
  borderRadius: 8,
  fontSize: 12,
  color: '#E8EDF5',
};

export default function PanelEfectoInstitucional({ datos, showSemaforo, showCalor, showSerie, showMetricas }: Props) {
  return (
    <div>
      <SectionHeader title="Efecto Institucional" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Semáforo */}
        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showSemaforo ? 1 : 0 }}>
          {showSemaforo ? (
            <Card className="p-6 flex flex-col items-center h-full">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Riesgo Global</p>
              <SemaforoRiesgo nivel={datos.parametricas.riesgoGlobal} />
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]">
              <CargandoAnimado texto="Generando semáforo..." />
            </Card>
          )}
        </motion.div>

        {/* Mapa de calor */}
        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showCalor ? 1 : 0 }}>
          {showCalor ? (
            <Card className="p-4 sm:p-6 h-full">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Mapa de Calor</p>
              <MapaCalor datos={datos} />
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]">
              <CargandoAnimado texto="Generando mapa de calor..." />
            </Card>
          )}
        </motion.div>

        {/* Gráfico */}
        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showSerie ? 1 : 0 }} className="sm:col-span-2">
          {showSerie ? (
            <Card className="p-4 sm:p-6 h-full">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Serie Temporal — Disponibilidad</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={datos.serie_temporal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1B3A6B" />
                  <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="disponibilidad" stroke="#00D4FF" strokeWidth={2} dot={false} animationDuration={1500} />
                  <Line type="monotone" dataKey="recuperacion" stroke="#00C851" strokeWidth={2} strokeDasharray="5 5" dot={false} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]">
              <CargandoAnimado texto="Generando serie temporal..." />
            </Card>
          )}
        </motion.div>
      </div>

      {/* 6 tarjetas de métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { show: showMetricas, label: 'Impacto Económico', value: `$${(datos.efecto_institucional.impacto_economico / 1_000_000).toFixed(1)}M` },
          { show: showMetricas, label: 'Confianza Ciudadana', value: `${datos.efecto_institucional.confianza_ciudadana.toFixed(1)}%` },
          { show: showMetricas, label: 'Disponibilidad Crítica', value: `${datos.efecto_nacional.disponibilidad_critica.toFixed(1)}%` },
          { show: showMetricas, label: 'Riesgo Global', value: `${(datos.parametricas.riesgoGlobal * 100).toFixed(1)}%` },
          { show: showMetricas, label: 'Impacto Total Nacional', value: `$${(datos.efecto_nacional.impacto_economico_total / 1_000_000_000).toFixed(1)}B` },
          { show: showMetricas, label: 'Resiliencia del Sistema', value: `${Math.max(0, 100 - datos.parametricas.riesgoGlobal * 70).toFixed(1)}%` },
        ].map((m, i) => (
          <motion.div key={m.label} layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: m.show ? 1 : 0 }}>
            {m.show ? (
              <Card className="p-3 sm:p-4">
                <p className="text-[9px] sm:text-[10px] text-textLight/50 uppercase tracking-wider mb-1">{m.label}</p>
                <p className="text-lg sm:text-xl font-bold text-textLight">{m.value}</p>
              </Card>
            ) : (
              <Card className="p-4 flex flex-col items-center justify-center min-h-[80px]">
                <CargandoAnimado texto="" />
              </Card>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
