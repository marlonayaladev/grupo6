import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import 'leaflet/dist/leaflet.css';
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
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
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
  { name: 'Minería', value: 85 },
  { name: 'Agricultura', value: 70 },
  { name: 'Turismo', value: 60 },
  { name: 'Pesca', value: 55 },
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
    const numAfectadas = Math.min(5, Math.max(2, Math.round(datos.parametricas.riesgoGlobal * 8)));
    const shuffled = [...REGIONES_PERU].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, numAfectadas);
  }, [datos.parametricas.riesgoGlobal]);

  const bounds: L.LatLngBoundsExpression = useMemo(() => [[-18.5, -81.5], [0.5, -68.5]], []);

  const isAfectada = (nombre: string) => regionesAfectadas.some(r => r.nombre === nombre);
  const intensidad = datos.parametricas.riesgoGlobal;

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
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />
      <FitPeru bounds={bounds} />
      {REGIONES_PERU.map((region) => {
        const afectada = isAfectada(region.nombre);
        return (
          <CircleMarker
            key={region.nombre}
            center={[region.lat, region.lng]}
            radius={afectada ? 8 : 3}
            pathOptions={{
              color: afectada ? '#FF3B3B' : '#00D4FF',
              fillColor: afectada ? '#FF3B3B' : '#1B3A6B',
              fillOpacity: afectada ? 0.6 : 0.4,
              weight: afectada ? 2 : 1,
              opacity: afectada ? 1 : 0.5,
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -8]}
              opacity={1}
              className="!bg-[#0D1F3C] !border-[#1B3A6B] !text-[#E8EDF5] !rounded-lg !text-xs !font-bold"
            >
              <span>{region.nombre}{afectada ? ' — Afectada' : ''}</span>
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

export default function PanelEfectoNacional({ datos }: Props) {
  const sectorData = useMemo(() => buildSectorData(datos), [datos]);

  return (
    <div>
      <SectionHeader title="Efecto Nacional" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Mapa de Perú */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-4 sm:p-6 overflow-hidden" style={{ height: 340 }}>
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-3">Mapa Nacional — Regiones Afectadas</p>
            <div style={{ height: 280 }}>
              <MapaPeru datos={datos} />
            </div>
          </Card>
        </motion.div>

        {/* Curva de Confianza */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-4 sm:p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Curva de Confianza — 30 días</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={datos.serie_temporal}>
                <defs>
                  <linearGradient id="gradConfianza" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C851" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00C851" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B3A6B" />
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1B3A6B' }} domain={[0, 100]} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="recuperacion"
                  stroke="#00C851"
                  strokeWidth={2}
                  fill="url(#gradConfianza)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Radar de sectores */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-4 sm:p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Afectación por Sector Económico</p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={sectorData}>
                <PolarGrid stroke="#1B3A6B" />
                <PolarAngleAxis dataKey="sector" tick={{ fontSize: 11, fill: '#8899B4' }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 100]} />
                <Radar name="Afectación" dataKey="afectacion" stroke="#FF3B3B" fill="#FF3B3B" fillOpacity={0.3} />
                <Radar name="Capacidad" dataKey="capacidad" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.1} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Tarjetas de impacto */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-4 sm:p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Impacto Económico Nacional</p>
            <div className="space-y-4">
              <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
                <p className="text-[10px] text-danger/70 uppercase tracking-wider">Total Estimado</p>
                <p className="text-xl sm:text-2xl font-bold text-danger">
                  S/ {(datos.efecto_nacional.impacto_economico_total / 1_000_000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-surface border border-army/20 rounded-xl p-4">
                <p className="text-[10px] text-textLight/50 uppercase tracking-wider">Institucional</p>
                <p className="text-base sm:text-lg font-bold text-textLight">
                  S/ {(datos.efecto_institucional.impacto_economico / 1_000_000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-surface border border-army/20 rounded-xl p-4">
                <p className="text-[10px] text-textLight/50 uppercase tracking-wider">Propagación Regional</p>
                <p className="text-base sm:text-lg font-bold text-cyan">
                  x{((datos.efecto_nacional.impacto_economico_total / datos.efecto_institucional.impacto_economico) || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Métricas nacionales */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-4 sm:p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Indicadores Nacionales</p>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-1">Confianza Nacional</p>
                <div className="w-full bg-surface rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-cyan transition-all duration-1000"
                    style={{ width: `${datos.efecto_nacional.confianza_ciudadana_nacional}%` }}
                  />
                </div>
                <p className="text-xs text-textLight/60 mt-1">{datos.efecto_nacional.confianza_ciudadana_nacional.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-1">Disponibilidad Crítica</p>
                <div className="w-full bg-surface rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-success transition-all duration-1000"
                    style={{ width: `${datos.efecto_nacional.disponibilidad_critica}%` }}
                  />
                </div>
                <p className="text-xs text-textLight/60 mt-1">{datos.efecto_nacional.disponibilidad_critica.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-1">Riesgo Global</p>
                <div className="w-full bg-surface rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-danger transition-all duration-1000"
                    style={{ width: `${datos.parametricas.riesgoGlobal * 100}%` }}
                  />
                </div>
                <p className="text-xs text-textLight/60 mt-1">{(datos.parametricas.riesgoGlobal * 100).toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
