import { Link } from 'react-router-dom';
import { useSimulacionStore } from '../store/simulacionStore';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function HistorialPage() {
  const historial = useSimulacionStore((s) => s.historial);
  const eliminarSimulacion = useSimulacionStore((s) => s.eliminarSimulacion);

  const rows = historial.slice().reverse();

  return (
    <div className="px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="Historial de Simulaciones" />

        {rows.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-textLight/50 text-sm mb-4">No hay simulaciones registradas.</p>
            <Link to="/generar">
              <Button variant="primary">Generar primera situación</Button>
            </Link>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-army/50">
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-textLight/50 px-5 py-3">
                    Fecha
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-textLight/50 px-5 py-3">
                    Iniciativa
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-textLight/50 px-5 py-3">
                    Activos
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-textLight/50 px-5 py-3">
                    Amenazas
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-textLight/50 px-5 py-3">
                    ID
                  </th>
                  <th className="text-right text-[10px] font-bold uppercase tracking-wider text-textLight/50 px-5 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((sim) => (
                  <tr
                    key={sim.id}
                    className="border-b border-army/20 hover:bg-navy/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <Link
                        to={`/simulacion/${sim.id}`}
                        className="text-cyan hover:underline font-mono text-xs"
                      >
                        {new Date(sim.fecha).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-textLight/80 text-xs">
                      {sim.iniciativa || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-textLight/50">
                        {sim.activosSeleccionados.length} activo(s)
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-textLight/50">
                        {sim.amenazas.length} amenaza(s)
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] text-textLight/30 font-mono">
                        {sim.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/simulacion/${sim.id}`}>
                          <Button variant="ghost" className="text-xs px-3 py-1">
                            Ver
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          className="text-xs px-3 py-1"
                          onClick={() => eliminarSimulacion(sim.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {rows.length > 0 && (
          <p className="text-xs text-textLight/30 mt-4">
            {rows.length} registro(s) en historial
          </p>
        )}
      </div>
    </div>
  );
}
