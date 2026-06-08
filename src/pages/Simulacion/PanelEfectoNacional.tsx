import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import 'leaflet/dist/leaflet.css';
import peruGeo from '../../mocks/peru.json';
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

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
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
  const geoStyle = useMemo(() => {
    const damagedIndices = new Set<number>();
    while (damagedIndices.size < 3) {
      damagedIndices.add(Math.floor(Math.random() * (peruGeo as GeoJSON.FeatureCollection).features.length));
    }

    return (_feature: GeoJSON.Feature, index: number) => ({
      fillColor: damagedIndices.has(index) ? '#FF3B3B' : '#1B3A6B',
      weight: 1,
      opacity: 1,
      color: '#00D4FF',
      fillOpacity: damagedIndices.has(index) ? 0.7 : 0.4,
    });
  }, []);

  const bounds: L.LatLngBoundsExpression = useMemo(() => [[-18.5, -81.5], [-0.5, -68.5]], []);

  return (
    <MapContainer
      center={[-10, -76]}
      zoom={5}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ height: '100%', width: '100%', background: '#0A1628', borderRadius: 12 }}
    >
      <FitBounds bounds={bounds} />
      <GeoJSON
        key="peru-geojson"
        data={peruGeo as unknown as GeoJSON.FeatureCollection}
        style={geoStyle}
      />
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

      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Mapa de Perú */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="col-span-2">
          <Card className="p-6 overflow-hidden" style={{ height: 360 }}>
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-3">Mapa Nacional — Regiones Afectadas</p>
            <div style={{ height: 300 }}>
              <MapaPeru datos={datos} />
            </div>
          </Card>
        </motion.div>

        {/* Curva de Confianza */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="col-span-2">
          <Card className="p-6">
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
                <Tooltip contentStyle={tooltipStyle} />
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

      <div className="grid grid-cols-3 gap-6">
        {/* Radar de sectores */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="col-span-1">
          <Card className="p-6">
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
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="col-span-1">
          <Card className="p-6">
            <p className="text-[10px] text-textLight/50 uppercase tracking-wider mb-4">Impacto Económico Nacional</p>
            <div className="space-y-4">
              <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
                <p className="text-[10px] text-danger/70 uppercase tracking-wider">Total Estimado</p>
                <p className="text-2xl font-bold text-danger">
                  S/ {(datos.efecto_nacional.impacto_economico_total / 1_000_000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-surface border border-army/20 rounded-xl p-4">
                <p className="text-[10px] text-textLight/50 uppercase tracking-wider">Institucional</p>
                <p className="text-lg font-bold text-textLight">
                  S/ {(datos.efecto_institucional.impacto_economico / 1_000_000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-surface border border-army/20 rounded-xl p-4">
                <p className="text-[10px] text-textLight/50 uppercase tracking-wider">Propagación Regional</p>
                <p className="text-lg font-bold text-cyan">
                  x{((datos.efecto_nacional.impacto_economico_total / datos.efecto_institucional.impacto_economico) || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Métricas nacionales */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="col-span-1">
          <Card className="p-6">
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
