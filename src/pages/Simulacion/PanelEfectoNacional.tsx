import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis } from 'recharts';
import 'leaflet/dist/leaflet.css';
import type { SimulacionResult } from '../../utils/simuladorMatematico';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import CargandoAnimado from '../../components/ui/CargandoAnimado';

interface Props {
  datos: SimulacionResult;
  showMapa: boolean;
  showCurva: boolean;
  showRadar: boolean;
  showImpacto: boolean;
  showMatriz: boolean;
  showComparacion: boolean;
  showMetricas: boolean;
}

const cardIn = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const REGIONES_PERU: { nombre: string; lat: number; lng: number }[] = [
  { nombre: 'Lima', lat: -12.0464, lng: -77.0428 },
  { nombre: 'Arequipa', lat: -16.4090, lng: -71.5375 },
  { nombre: 'Trujillo', lat: -8.1091, lng: -79.0215 },
  { nombre: 'Cusco', lat: -13.5320, lng: -71.9675 },
  { nombre: 'Piura', lat: -5.1945, lng: -80.6328 },
  { nombre: 'Chiclayo', lat: -6.7714, lng: -79.8409 },
  { nombre: 'Iquitos', lat: -3.7491, lng: -73.2538 },
  { nombre: 'Huancayo', lat: -12.0653, lng: -75.2049 },
  { nombre: 'Puno', lat: -15.8402, lng: -70.0219 },
  { nombre: 'Tacna', lat: -18.0146, lng: -70.2536 },
  { nombre: 'Tarapoto', lat: -6.4816, lng: -76.4846 },
  { nombre: 'Cajamarca', lat: -7.1638, lng: -78.5004 },
  { nombre: 'Huaraz', lat: -9.5289, lng: -77.5280 },
  { nombre: 'Ayacucho', lat: -13.1588, lng: -74.2239 },
  { nombre: 'Ica', lat: -14.0680, lng: -75.7255 },
  { nombre: 'Sullana', lat: -4.9041, lng: -80.6857 },
  { nombre: 'Cerro de Pasco', lat: -10.6860, lng: -76.2569 },
  { nombre: 'Moyobamba', lat: -6.0340, lng: -76.9718 },
  { nombre: 'Tumbes', lat: -3.5670, lng: -80.4486 },
  { nombre: 'Madre de Dios', lat: -12.5933, lng: -69.1817 },
];

function FitPeru({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => { map.fitBounds(bounds, { padding: [20, 20] }); }, [map, bounds]);
  return null;
}

const SECTORES = [
  { name: 'Mineria', value: 85 },
  { name: 'Agricultura', value: 70 },
  { name: 'Turismo', value: 60 },
  { name: 'Pesca', value: 55 },
  { name: 'Banca', value: 75 },
  { name: 'Salud', value: 80 },
];

function buildSectorData(datos: SimulacionResult) {
  const factor = 1 - datos.parametricas.riesgoGlobal;
  return SECTORES.map(s => ({
    sector: s.name,
    afectacion: Math.round(s.value * factor),
    capacidad: Math.round(s.value),
  }));
}

function MapaPeru({ datos }: { datos: SimulacionResult }) {
  const regionesAfectadas = useMemo(() => {
    const numAfectadas = Math.min(8, Math.max(3, Math.round(datos.parametricas.riesgoGlobal * 12)));
    const shuffled = [...REGIONES_PERU].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, numAfectadas);
  }, [datos.parametricas.riesgoGlobal]);

  const bounds: L.LatLngBoundsExpression = useMemo(() => [[-18.5, -81.5], [0.5, -68.5]], []);
  const isAfectada = (nombre: string) => regionesAfectadas.some(r => r.nombre === nombre);

  return (
    <MapContainer
      center={[-10, -76]}
      zoom={5}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      doubleClickZoom={false}
      keyboard={false}
      touchZoom={false}
      style={{ height: '100%', width: '100%', borderRadius: 12 }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" maxZoom={19} />
      <FitPeru bounds={bounds} />
      {REGIONES_PERU.map((region) => {
        const afectada = isAfectada(region.nombre);
        return (
          <CircleMarker
            key={region.nombre}
            center={[region.lat, region.lng]}
            radius={afectada ? 10 : 3}
            pathOptions={{
              color: afectada ? '#FF3B3B' : '#00D4FF',
              fillColor: afectada ? '#FF3B3B' : '#1B3A6B',
              fillOpacity: afectada ? 0.6 : 0.4,
              weight: afectada ? 2 : 1,
              opacity: afectada ? 1 : 0.5,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}
              className="!bg-[#0D1F3C] !border-[#1B3A6B] !text-[#E8EDF5] !rounded-lg !text-xs !font-bold">
              <span>{region.nombre}{afectada ? ' - Afectada' : ''}</span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

const tooltipStyle: React.CSSProperties = {
  backgroundColor: '#0D1F3C',
  border: '1px solid #1B3A6B',
  borderRadius: 8,
  fontSize: 12,
  color: '#E8EDF5',
};

export default function PanelEfectoNacional({ datos, showMapa, showCurva, showRadar, showImpacto, showMatriz, showComparacion, showMetricas }: Props) {
  const sectorData = useMemo(() => buildSectorData(datos), [datos]);
  const e = datos.efecto_nacional;
  const r = datos.parametricas.riesgoGlobal;

  const matrizData = [
    { name: 'Servicios Esenciales', impacto: e.servicios_esenciales, probabilidad: Math.round(r * 90), z: 20 },
    { name: 'Infraestructura', impacto: e.infraestructura_critica, probabilidad: Math.round(r * 85), z: 18 },
    { name: 'Gobernabilidad', impacto: e.impacto_gobernabilidad, probabilidad: Math.round(r * 75), z: 15 },
    { name: 'Desinformacion', impacto: e.desinformacion, probabilidad: Math.round(r * 80), z: 12 },
    { name: 'Credibilidad', impacto: e.credibilidad_publica, probabilidad: Math.round(r * 70), z: 14 },
    { name: 'Escalamiento', impacto: e.escalamiento_social, probabilidad: Math.round(r * 65), z: 16 },
  ];

  const sinMitigacion = datos.serie_temporal.map(p => ({ dia: p.dia, disponibilidad: p.disponibilidad }));
  const conMitigacion = datos.serie_temporal.map(p => ({ dia: p.dia, disponibilidad: Math.min(100, p.disponibilidad + (100 - p.disponibilidad) * 0.4) }));

  const indicadores = [
    { show: showMetricas, label: 'Servicios Esenciales', value: `${e.servicios_esenciales}%`, color: e.servicios_esenciales > 70 ? '#00C851' : e.servicios_esenciales > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Impacto Economico', value: `$${(e.impacto_economico_total / 1_000_000).toFixed(1)}M`, color: '#FF3B3B' },
    { show: showMetricas, label: 'Confianza Ciudadana', value: `${e.confianza_ciudadana_nacional}%`, color: e.confianza_ciudadana_nacional > 70 ? '#00C851' : '#FFB800' },
    { show: showMetricas, label: 'Gobernabilidad', value: `${e.impacto_gobernabilidad}%`, color: e.impacto_gobernabilidad < 40 ? '#00C851' : e.impacto_gobernabilidad < 70 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Infraestructura Critica', value: `${e.infraestructura_critica}%`, color: e.infraestructura_critica > 70 ? '#00C851' : e.infraestructura_critica > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Riesgo Desinformacion', value: `${e.desinformacion}%`, color: e.desinformacion < 40 ? '#00C851' : '#FF3B3B' },
    { show: showMetricas, label: 'Credibilidad Publica', value: `${e.credibilidad_publica}%`, color: e.credibilidad_publica > 70 ? '#00C851' : '#FFB800' },
    { show: showMetricas, label: 'Continuidad Estado', value: `${e.continuidad_estado}%`, color: e.continuidad_estado > 70 ? '#00C851' : e.continuidad_estado > 40 ? '#FFB800' : '#FF3B3B' },
    { show: showMetricas, label: 'Poblacion Impactada', value: `${(e.poblacion_impactada / 1_000_000).toFixed(1)}M`, color: '#FF3B3B' },
    { show: showMetricas, label: 'Escalamiento Social', value: `${e.escalamiento_social}%`, color: e.escalamiento_social < 40 ? '#00C851' : '#FF3B3B' },
    { show: showMetricas, label: 'Disponibilidad Critica', value: `${e.disponibilidad_critica}%`, color: e.disponibilidad_critica > 70 ? '#00C851' : '#FFB800' },
    { show: showMetricas, label: 'Riesgo Global', value: `${(r * 100).toFixed(1)}%`, color: r < 0.33 ? '#00C851' : r < 0.66 ? '#FFB800' : '#FF3B3B' },
  ];

  const tableroItems = [
    { label: 'Servicios Esenciales', value: e.servicios_esenciales },
    { label: 'Infraestructura Critica', value: e.infraestructura_critica },
    { label: 'Continuidad del Estado', value: e.continuidad_estado },
    { label: 'Gobernabilidad', value: e.impacto_gobernabilidad },
  ];

  return (
    <div>
      <SectionHeader title="Efecto Nacional" />

      {/* Row 1: Mapa + Curva */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showMapa ? 1 : 0 }}>
          {showMapa ? (
            <Card className="p-4 sm:p-6 overflow-hidden" style={{ height: 340 }}>
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-3">Mapa Nacional - Regiones Afectadas</p>
              <div style={{ height: 280 }}><MapaPeru datos={datos} /></div>
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center" style={{ height: 340 }}><CargandoAnimado texto="Generando mapa..." /></Card>
          )}
        </motion.div>

        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showCurva ? 1 : 0 }}>
          {showCurva ? (
            <Card className="p-4 sm:p-6">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Curva de Perdida de Confianza Ciudadana</p>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={datos.serie_temporal}>
                  <defs>
                    <linearGradient id="gradConfianzaNac" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C851" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00C851" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1B3A6B" />
                  <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} domain={[0, 100]} />
                  <RechartsTooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="recuperacion" stroke="#00C851" strokeWidth={2} fill="url(#gradConfianzaNac)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 320 }}><CargandoAnimado texto="Generando curva..." /></Card>
          )}
        </motion.div>
      </div>

      {/* Row 2: Radar + Tablero Decision + Matriz */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showRadar ? 1 : 0 }}>
          {showRadar ? (
            <Card className="p-4 sm:p-6">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Sectores Economicos Afectados</p>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={sectorData}>
                  <PolarGrid stroke="#1B3A6B" />
                  <PolarAngleAxis dataKey="sector" tick={{ fontSize: 11, fill: '#8899B4' }} />
                  <PolarRadiusAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 100]} />
                  <Radar name="Afectacion" dataKey="afectacion" stroke="#FF3B3B" fill="#FF3B3B" fillOpacity={0.3} />
                  <Radar name="Capacidad" dataKey="capacidad" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.1} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 300 }}><CargandoAnimado texto="Generando radar..." /></Card>
          )}
        </motion.div>

        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showImpacto ? 1 : 0 }}>
          {showImpacto ? (
            <Card className="p-4 sm:p-6">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Tablero de Decision Estrategica</p>
              <div className="space-y-3">
                {tableroItems.map((item) => {
                  const color = item.value > 70 ? '#00C851' : item.value > 40 ? '#FFB800' : '#FF3B3B';
                  const status = item.value > 70 ? 'ESTABLE' : item.value > 40 ? 'ADVERTENCIA' : 'CRITICO';
                  return (
                    <div key={item.label} className="bg-surface border border-army/30 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-textLight/70 uppercase tracking-wider">{item.label}</span>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ color, backgroundColor: `${color}20` }}>{status}</span>
                      </div>
                      <div className="w-full bg-bg rounded-full h-2">
                        <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${item.value}%`, backgroundColor: color }} />
                      </div>
                      <p className="text-xs text-textLight/50 mt-1 text-right">{item.value.toFixed(1)}%</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 300 }}><CargandoAnimado texto="Generando tablero..." /></Card>
          )}
        </motion.div>

        <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showMatriz ? 1 : 0 }}>
          {showMatriz ? (
            <Card className="p-4 sm:p-6">
              <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Matriz Impacto - Probabilidad</p>
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1B3A6B" />
                  <XAxis type="number" dataKey="probabilidad" name="Probabilidad" domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} />
                  <YAxis type="number" dataKey="impacto" name="Impacto" domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} />
                  <ZAxis type="number" dataKey="z" range={[80, 300]} />
                  <RechartsTooltip contentStyle={tooltipStyle}
                    formatter={(_val: number, name: string) => [name === 'impacto' ? 'Impacto' : 'Probabilidad']}
                  />
                  <Scatter data={matrizData} fill="#FF3B3B" fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 300 }}><CargandoAnimado texto="Generando matriz..." /></Card>
          )}
        </motion.div>
      </div>

      {/* Row 3: Comparacion */}
      <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showComparacion ? 1 : 0 }} className="mb-6">
        {showComparacion ? (
          <Card className="p-4 sm:p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-2">Comparacion: Sin Mitigacion vs Con Mitigacion</p>
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-danger rounded" /><span className="text-[10px] text-textLight/60">Sin Mitigacion</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-success rounded" /><span className="text-[10px] text-textLight/60">Con Mitigacion</span></div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart>
                <defs>
                  <linearGradient id="gradSin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B3B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF3B3B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradCon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C851" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00C851" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B3A6B" />
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} domain={[0, 100]} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="disponibilidad" data={sinMitigacion} stroke="#FF3B3B" strokeWidth={2} fill="url(#gradSin)" animationDuration={1500} name="Sin Mitigacion" />
                <Area type="monotone" dataKey="disponibilidad" data={conMitigacion} stroke="#00C851" strokeWidth={2} fill="url(#gradCon)" animationDuration={1500} name="Con Mitigacion" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        ) : (
          <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]"><CargandoAnimado texto="Generando comparacion..." /></Card>
        )}
      </motion.div>

      {/* Row 4: Impacto Economico */}
      <motion.div layout variants={cardIn} initial="hidden" animate="visible" style={{ opacity: showImpacto ? 1 : 0 }} className="mb-6">
        {showImpacto ? (
          <Card className="p-4 sm:p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Impacto Economico Nacional</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
                <p className="text-[10px] text-danger/70 uppercase tracking-wider">Total Estimado</p>
                <p className="text-xl sm:text-2xl font-bold text-danger">S/ {(e.impacto_economico_total / 1_000_000).toFixed(1)}M</p>
              </div>
              <div className="bg-surface border border-army/20 rounded-xl p-4">
                <p className="text-[10px] text-textLight/50 uppercase tracking-wider">Institucional</p>
                <p className="text-base sm:text-lg font-bold text-textLight">S/ {(datos.efecto_institucional.impacto_economico / 1_000_000).toFixed(1)}M</p>
              </div>
              <div className="bg-surface border border-army/20 rounded-xl p-4">
                <p className="text-[10px] text-textLight/50 uppercase tracking-wider">Propagacion Regional</p>
                <p className="text-base sm:text-lg font-bold text-cyan">x{((e.impacto_economico_total / datos.efecto_institucional.impacto_economico) || 0).toFixed(1)}</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 flex flex-col items-center justify-center min-h-[160px]"><CargandoAnimado texto="Generando impacto..." /></Card>
        )}
      </motion.div>

      {/* Row 5: 12 metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
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
