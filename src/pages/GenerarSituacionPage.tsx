import { useSimulacionStore } from '../store/simulacionStore';
import PasoActivos from './GenerarSituacion/PasoActivos';
import PasoIniciativa from './GenerarSituacion/PasoIniciativa';
import PasoAmenaza from './GenerarSituacion/PasoAmenaza';

const pasos = [
  { id: 1, label: 'Activos' },
  { id: 2, label: 'Iniciativa' },
  { id: 3, label: 'Amenazas' },
];

export default function GenerarSituacionPage() {
  const pasoActual = useSimulacionStore((s) => s.pasoActual);

  return (
    <div className="px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-10">
          {pasos.map((p, i) => (
            <div key={p.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    pasoActual === p.id
                      ? 'border-cyan bg-cyan/20 text-cyan'
                      : pasoActual > p.id
                      ? 'border-success bg-success/20 text-success'
                      : 'border-army text-textLight/40'
                  }`}
                >
                  {pasoActual > p.id ? '✓' : p.id}
                </div>
                <span className="text-[10px] mt-2 uppercase tracking-wider text-textLight/50">
                  {p.label}
                </span>
              </div>
              {i < pasos.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 mt-[-18px] rounded transition-colors ${
                    pasoActual > p.id ? 'bg-success' : 'bg-army'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Contenido del paso */}
        {pasoActual === 1 && <PasoActivos />}
        {pasoActual === 2 && <PasoIniciativa />}
        {pasoActual === 3 && <PasoAmenaza />}
      </div>
    </div>
  );
}
