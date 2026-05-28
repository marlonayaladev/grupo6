import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const WORLD_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const zonas = [
  { id: 'norte', label: 'Norte', color: '#22c55e', coords: [-79.0, -3.5], radius: 35 },
  { id: 'noreste', label: 'Nororiente', color: '#ef4444', coords: [-73.0, -5.0], radius: 30 },
  { id: 'centro', label: 'Centro', color: '#22c55e', coords: [-75.5, -10.0], radius: 25 },
  { id: 'sur', label: 'Sur', color: '#f97316', coords: [-71.0, -14.5], radius: 30 },
  { id: 'frontera_sur', label: 'Frontera Sur', color: '#ec4899', coords: [-70.0, -17.5], radius: 25 },
  { id: 'lima', label: 'Lima', color: '#eab308', coords: [-77.0, -12.0], radius: 20 },
];

const markers = [
  { id: 1, coords: [-79.0, -3.5], label: '1' },
  { id: 2, coords: [-75.5, -5.0], label: '2' },
  { id: 3, coords: [-73.0, -8.5], label: '3' },
  { id: 4, coords: [-70.0, -13.0], label: '4' },
  { id: 5, coords: [-69.5, -17.0], label: '5' },
  { id: 6, coords: [-70.5, -5.5], label: '6' },
  { id: 7, coords: [-76.5, -6.5], label: '7' },
  { id: 8, coords: [-71.5, -15.5], label: '8' },
];

export default function AreaScreen({ onNavigate, onAreaSelect }) {
  const [selected, setSelected] = useState('');

  const handleConfirm = () => {
    if (!selected) return;
    onAreaSelect(selected);
    onNavigate('filters');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-dash-bg gap-12 px-12 relative">
      <div className="flex items-center justify-center">
        <button
          onClick={() => {}}
          className="px-8 py-6 text-xl font-bold uppercase tracking-[0.15em] text-white bg-[#3b82f6] rounded-xl shadow-lg shadow-blue-500/20"
        >
          SELECCIONE<br />ÁREA CRÍTICA
        </button>
      </div>

      <div className="relative w-[500px] h-[600px] border-2 border-dash-border rounded-xl overflow-hidden bg-dash-surface/30">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1200, center: [-75, -10] }}
          width={500}
          height={600}
          className="w-full h-full"
        >
          <Geographies geography={WORLD_URL}>
            {({ geographies }) =>
              geographies
                .filter((geo) => geo.properties.name === 'Peru')
                .map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1e293b"
                    stroke="#00d4ff"
                    strokeWidth={0.8}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: '#1e3a5f', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
            }
          </Geographies>

          {zonas.map((z) => (
            <Marker key={z.id} coordinates={z.coords}>
              <circle
                r={selected === z.id ? z.radius + 5 : z.radius}
                fill={z.color}
                fillOpacity={selected === z.id ? 0.6 : 0.4}
                stroke={z.color}
                strokeWidth={selected === z.id ? 2 : 1}
                strokeOpacity={0.8}
                style={{ transition: 'r 0.2s, fill-opacity 0.2s', cursor: 'pointer' }}
                onClick={() => setSelected(z.id)}
              />
            </Marker>
          ))}

          {markers.map((m) => (
            <Marker key={m.id} coordinates={m.coords}>
              <circle r={6} fill="#f97316" stroke="#ffffff" strokeWidth={1.5} />
              <text
                textAnchor="middle"
                y={3}
                fill="#ffffff"
                fontSize={6}
                fontWeight={700}
                fontFamily="'Inter', sans-serif"
              >
                {m.label}
              </text>
            </Marker>
          ))}
        </ComposableMap>

        <div className="absolute bottom-3 left-3 bg-dash-bg/90 border border-dash-border rounded-lg p-3">
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-dash-text mb-2">LEYENDA</h4>
          <div className="space-y-1">
            {zonas.map((z) => (
              <div key={z.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: z.color }} />
                <span className="text-[8px] text-dash-muted">{z.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 bg-dash-bg/90 border border-dash-border rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-dash-muted">0</span>
            <div className="flex gap-0.5">
              <div className="w-6 h-1.5 bg-green-500 rounded" />
              <div className="w-6 h-1.5 bg-yellow-500 rounded" />
              <div className="w-6 h-1.5 bg-orange-500 rounded" />
              <div className="w-6 h-1.5 bg-red-500 rounded" />
            </div>
            <span className="text-[8px] text-dash-muted">400 km</span>
          </div>
        </div>

        {selected && (
          <div className="absolute top-3 left-3 bg-[#3b82f6] rounded-lg px-4 py-2">
            <span className="text-xs font-bold text-white uppercase">
              {zonas.find((z) => z.id === selected)?.label}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 w-64">
        {zonas.map((z) => (
          <button
            key={z.id}
            onClick={() => setSelected(z.id)}
            className={`w-full text-left px-5 py-3.5 text-sm font-medium border-2 rounded-xl transition-all ${
              selected === z.id
                ? 'border-[#3b82f6] bg-[#3b82f6]/15 text-white'
                : 'border-dash-border text-dash-muted hover:border-dash-border/70 hover:text-dash-text/80'
            }`}
          >
            <span className="inline-block w-3 h-3 rounded-sm mr-3" style={{ backgroundColor: z.color }} />
            {z.label}
          </button>
        ))}

        <button
          onClick={handleConfirm}
          disabled={!selected}
          className={`w-full mt-4 py-4 text-sm font-bold uppercase tracking-wider rounded-xl border-2 transition-all ${
            selected
              ? 'bg-[#3b82f6] text-white border-[#3b82f6] hover:bg-[#2563eb] shadow-lg shadow-blue-500/20'
              : 'bg-dash-bg text-dash-muted/40 border-dash-border cursor-not-allowed'
          }`}
        >
          CONFIRMAR
        </button>
      </div>

      <div className="absolute bottom-6 left-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center justify-center w-14 h-14 bg-[#3b82f6] hover:bg-[#2563eb] rounded-full transition-all shadow-lg shadow-blue-500/20"
        >
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
