import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { SimulacionResult } from '../../utils/simuladorMatematico';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import CargandoAnimado from '../../components/ui/CargandoAnimado';

interface Props {
  datos: SimulacionResult;
  showSemaforo: boolean;
  showCalor: boolean;
  showSerie: boolean;
  showConfianza: boolean;
  showDegradacion: boolean;
  showRanking: boolean;
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

function MedidorConfianza({ value }: { value: number }) {
  const angle = -90 + (value / 100) * 180;
  const color = value > 70 ? '#00C851' : value > 40 ? '#FFB800' : '#FF3B3B';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="160" height="100" viewBox="0 0 160 100">
        <path d="M 10 90 A 70 70 0 0 1 150 90" fill="none" stroke="#1B3A6B" strokeWidth="8" strokeLinecap="round" />
        <path
          d="M 10 90 A 70 70 0 0 1 150 90"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 220} 220`}
          className="transition-all duration-1000"
        />
        <circle cx="80" cy="90" r="4" fill={color} />
        <line
          x1="80" y1="90"
          x2={80 + 50 * Math.cos((angle * Math.PI) / 180)}
          y2={90 + 50 * Math.sin((angle * Math.PI) / 180)}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <text x="80" y="80" textAnchor="middle" fill={color} fontSize="18" fontWeight="bold">{Math.round(value)}%</text>
      </svg>
      <span className="text-[10px] text-textLight/50 uppercase tracking-wider">Confianza Interna</span>
    </div>
  );
}

function MapaCalorInstitucional({ datos }: { datos: SimulacionResult }) {
  const e = datos.efecto_institucional;
  const metricas = [
    { label: 'Continuidad Operativa', value: e.continuidad_operativa },
    { label: 'Disponibilidad Sistema', value: e.disponibilidad_sistema },
    { label: 'Mando y Control', value: e.mando_control },
    { label: 'Logística', value: e.logistica },
    { label: 'Administrativa', value: e.administrativa },
    { label: 'Comunicaciones', value: e.comunicaciones },
    { label: 'Resp. Cibernética', value: e.respuesta_cibernetica },
    { label: 'Adopción Digital', value: e.adopcion_digital },
    { label: 'Resistencia Personal', value: e.resistencia_personal },
    { label: 'Capacitación', value: e.capacitacion },
    { label: 'Riesgo Reputacional', value: e.riesgo_reputacional },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
      {metricas.map((m) => {
        const pct = Math.min(100, Math.max(0, m.value));
        const intensity = pct / 100;
        const bg = pct > 70
          ? `rgba(0,200,81,${0.15 + intensity * 0.25})`
          : pct > 40
          ? `rgba(255,184,0,${0.15 + intensity * 0.25})`
          : `rgba(255,59,59,${0.15 + intensity * 0.25})`;
        return (
          <div key={m.label} className="rounded-lg p-2 text-center" style={{ backgroundColor: bg }}>
            <p className="text-[8px] sm:text-[9px] text-textLight/60 uppercase tracking-wider leading-tight">{m.label}</p>
            <p className="text-sm font-bold text-textLight">{Math.round(pct)}%</p>
          </div>
        );
      })}
    </div>
  );
}

function DegradacionOperativa({ datos }: { datos: SimulacionResult }) {
  const e = datos.efecto_institucional;
  const data = [
    { area: 'Continuidad', degradacion: 100 - e.continuidad_operativa },
    { area: 'Sistema', degradacion: 100 - e.disponibilidad_sistema },
    { area: 'Mando', degradacion: 100 - e.mando_control },
    { area: 'Logística', degradacion: 100 - e.logistica },
    { area: 'Admin', degradacion: 100 - e.administrativa },
    { area: 'Comunic.', degradacion: 100 - e.comunicaciones },
    { area: 'Cibernética', degradacion: 100 - e.respuesta_cibernetica },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#1B3A6B" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} />
        <YAxis dataKey="area" type="category" tick={{ fontSize: 10, fill: '#8899B4' }} width={70} axisLine={{ stroke: '#1B3A6B' }} />
        <Tooltip contentStyle={{ backgroundColor: '#0D1F3C', border: '1px solid #1B3A6B', borderRadius: 8, fontSize: 12, color: '#E8EDF5' }} />
        <Bar dataKey="degradacion" fill="#FF3B3B" radius={[0, 4, 4, 0]} animationDuration={1500} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RankingAreas({ datos }: { datos: SimulacionResult }) {
  const e = datos.efecto_institucional;
  const areas = [
    { nombre: 'Continuidad Operativa', valor: e.continuidad_operativa },
    { nombre: 'Disponibilidad Sistema', valor: e.disponibilidad_sistema },
    { nombre: 'Mando y Control', valor: e.mando_control },
    { nombre: 'Logística', valor: e.logistica },
    { nombre: 'Administrativa', valor: e.administrativa },
    { nombre: 'Comunicaciones', valor: e.comunicaciones },
    { nombre: 'Resp. Cibernética', valor: e.respuesta_cibernetica },
    { nombre: 'Adopción Digital', valor: e.adopcion_digital },
    { nombre: 'Confianza Interna', valor: e.confianza_interna },
    { nombre: 'Resistencia Personal', valor: e.resistencia_personal },
    { nombre: 'Capacitación', valor: e.capacitacion },
    { nombre: 'Riesgo Reputacional', valor: e.riesgo_reputacional },
  ].sort((a, b) => a.valor - b.valor);

  const maxValor = areas[0]?.valor || 1;

  return (
    <div className="space-y-2">
      {areas.map((a, i) => {
        const pct = (a.valor / maxValor) * 100;
        const color = a.valor > 70 ? '#00C851' : a.valor > 40 ? '#FFB800' : '#FF3B3B';
        return (
          <div key={a.nombre} className="flex items-center gap-2">
            <span className="text-[10px] text-textLight/40 w-4 text-right">{i + 1}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] text-textLight/70">{a.nombre}</span>
                <span className="text-[10px] font-bold" style={{ color }}>{Math.round(a.valor)}%</span>
              </div>
              <div className="w-full bg-surface rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
            </div>
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

export default function PanelEfectoInstitucional({
  datos, showSemaforo, showCalor, showSerie, showConfianza, showDegradacion, showRanking, showMetricas,
}: Props) {
  const e = datos.efecto_institucional;

  const indicadores = [
    { show: showMetricas, label: 'Continuidad Operativa', value: `${e.continuidad_operativa}%`, color: e.continuidad_operativa > 70 ? '#00C851' : e.continuidad_operativa > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Disponibilidad Sistema', value: `${e.disponibilidad_sistema}%`, color: e.disponibilidad_sistema > 70 ? '#00C851' : e.disponibilidad_sistema > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Mando y Control', value: `${e.mando_control}%`, color: e.mando_control > 70 ? '#00C851' : e.mando_control > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Afectación Logística', value: `${e.logistica}%`, color: e.logistica > 70 ? '#00C851' : e.logistica > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Afectación Admin.', value: `${e.administrativa}%`, color: e.administrativa > 70 ? '#00C851' : e.administrativa > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Comunicaciones', value: `${e.comunicaciones}%`, color: e.comunicaciones > 70 ? '#00C851' : e.comunicaciones > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Resp. Cibernética', value: `${e.respuesta_cibernetica}%`, color: e.respuesta_cibernetica > 70 ? '#00C851' : e.respuesta_cibernetica > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Tiempo Recuperación', value: `${e.tiempo_recuperacion}d`, color: '#00D4FF' },
    { show: showMetricas, label: 'Confianza Interna', value: `${e.confianza_interna}%`, color: e.confianza_interna > 70 ? '#00C851' : e.confianza_interna > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Adopción Digital', value: `${e.adopcion_digital}%`, color: '#00D4FF' },
    { show: showMetricas, label: 'Resistencia Personal', value: `${e.resistencia_personal}%`, color: e.resistencia_personal > 60 ? '#FF3B3B' : '#00C851' },
    { show: showMetricas, label: 'Necesidad Capacitación', value: `${e.capacitacion}%`, color: '#FFB800' },
    { show: showMetricas, label: 'Riesgo Reputacional', value: `${e.riesgo_reputacional}%`, color: e.riesgo_reputacional > 60 ? '#FF3B3B' : '#FFB800' },
  ];

  return (
    <div>
      <SectionHeader title="Efecto Institucional" />

      {/* Row 1: Semáforo + Medidor Confianza + Gráfico Degradación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showSemaforo ? 1 : 0 }}>
          {showSemaforo ? (
            <Card className="p-6 flex flex-col items-center h-full">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Semáforo de Riesgo</p>
              <SemaforoRiesgo nivel={datos.parametricas.riesgoGlobal} />
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center min-h-[220px]"><CargandoAnimado texto="Generando semáforo..." /></Card>
          )}
        </motion.div>

        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showConfianza ? 1 : 0 }}>
          {showConfianza ? (
            <Card className="p-6 flex flex-col items-center h-full">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Medidor de Confianza Interna</p>
              <MedidorConfianza value={e.confianza_interna} />
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center min-h-[220px]"><CargandoAnimado texto="Generando medidor..." /></Card>
          )}
        </motion.div>

        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showDegradacion ? 1 : 0 }} className="sm:col-span-2 lg:col-span-1">
          {showDegradacion ? (
            <Card className="p-4 sm:p-6 h-full">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Degradación Operativa</p>
              <DegradacionOperativa datos={datos} />
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center min-h-[220px]"><CargandoAnimado texto="Generando degradación..." /></Card>
          )}
        </motion.div>
      </div>

      {/* Row 2: Mapa de Calor + Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showCalor ? 1 : 0 }}>
          {showCalor ? (
            <Card className="p-4 sm:p-6">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Mapa de Calor Institucional</p>
              <MapaCalorInstitucional datos={datos} />
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]"><CargandoAnimado texto="Generando mapa de calor..." /></Card>
          )}
        </motion.div>

        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showRanking ? 1 : 0 }}>
          {showRanking ? (
            <Card className="p-4 sm:p-6">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Ranking de Áreas Más Afectadas</p>
              <RankingAreas datos={datos} />
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]"><CargandoAnimado texto="Generando ranking..." /></Card>
          )}
        </motion.div>
      </div>

      {/* Row 3: Línea de tiempo */}
      <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showSerie ? 1 : 0 }} className="mb-6">
        {showSerie ? (
          <Card className="p-4 sm:p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Línea de Tiempo del Incidente — Disponibilidad vs Recuperación</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={datos.serie_temporal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B3A6B" />
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="disponibilidad" stroke="#00D4FF" strokeWidth={2} dot={false} animationDuration={1500} name="Disponibilidad" />
                <Line type="monotone" dataKey="recuperacion" stroke="#00C851" strokeWidth={2} strokeDasharray="5 5" dot={false} animationDuration={1500} name="Recuperación" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        ) : (
          <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]"><CargandoAnimado texto="Generando línea de tiempo..." /></Card>
        )}
      </motion.div>

      {/* Row 4: 13 tarjetas de métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {indicadores.map((m) => (
          <motion.div key={m.label} layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: m.show ? 1 : 0 }}>
            {m.show ? (
              <Card className="p-3 sm:p-4">
                <p className="text-[9px] sm:text-[10px] text-textLight/50 uppercase tracking-wider mb-1">{m.label}</p>
                <p className="text-lg sm:text-xl font-bold" style={{ color: m.color }}>{m.value}</p>
              </Card>
            ) : (
              <Card className="p-4 flex flex-col items-center justify-center min-h-[70px]"><CargandoAnimado texto="" /></Card>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
