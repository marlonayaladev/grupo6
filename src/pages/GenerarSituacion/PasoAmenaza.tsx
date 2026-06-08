import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulacionStore } from '../../store/simulacionStore';
import { extraerAmbitoMock, type AmbitoResult } from '../../utils/mockIA';
import amenazasData from '../../mocks/amenazas.json';
import MockVoiceRecorder from '../../components/ui/MockVoiceRecorder';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

type VistaAmbito = 'grabar' | 'procesando' | 'resultado';

interface Amenaza {
  id: string;
  nombre: string;
  grupo: string;
  nivel_impacto_base: number;
}

const amenazas = amenazasData as Amenaza[];

const grupos = ['Ciberataques', 'Datos', 'Cognitivos'] as const;

const impactoLabel: Record<number, string> = {
  1: 'Bajo',
  2: 'Medio-Bajo',
  3: 'Medio',
  4: 'Alto',
  5: 'Crítico',
};

const impactoColor: Record<number, string> = {
  1: 'text-success',
  2: 'text-success',
  3: 'text-amber-400',
  4: 'text-warning',
  5: 'text-danger',
};

export default function PasoAmenaza() {
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set());
  const [gruposAbiertos, setGruposAbiertos] = useState<Set<string>>(new Set(grupos));
  const [vistaAmbito, setVistaAmbito] = useState<VistaAmbito>('grabar');
  const [ambito, setAmbito] = useState<AmbitoResult | null>(null);

  const navigate = useNavigate();
  const { activosSeleccionados, iniciativa, agregarSimulacion, resetSimulacion } = useSimulacionStore();

  const toggleGrupo = (grupo: string) => {
    setGruposAbiertos((prev) => {
      const next = new Set(prev);
      if (next.has(grupo)) next.delete(grupo);
      else next.add(grupo);
      return next;
    });
  };

  const toggleAmenaza = (id: string) => {
    setSeleccionadas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAmbitoResult = async (texto: string) => {
    setVistaAmbito('procesando');
    const result = await extraerAmbitoMock(texto);
    setAmbito(result);
    setVistaAmbito('resultado');
  };

  const generarSimulacion = () => {
    const id = crypto.randomUUID();
    const amenazasSeleccionadas = amenazas
      .filter((a) => seleccionadas.has(a.id))
      .map((a) => a.nombre);

    const ambitoStr = ambito ? `${ambito.actores_involucrados} (Daño: ${ambito.nivel_dano_inicial})` : null;

    agregarSimulacion({
      id,
      fecha: new Date().toISOString(),
      activosSeleccionados: [...activosSeleccionados],
      iniciativa,
      amenazas: amenazasSeleccionadas,
      ambito: ambitoStr,
    });

    setTimeout(() => resetSimulacion(), 50);
    navigate(`/simulacion/${id}`);
  };

  return (
    <div>
      <SectionHeader title="Amenazas y Ámbito de Materialización" />

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Columna izquierda: Amenazas */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold uppercase tracking-wider text-textLight mb-4">
            Seleccionar Amenazas
          </h3>
          <div className="space-y-3">
            {grupos.map((grupo) => {
              const items = amenazas.filter((a) => a.grupo === grupo);
              const abiertos = gruposAbiertos.has(grupo);
              const countSelected = items.filter((a) => seleccionadas.has(a.id)).length;

              return (
                <div key={grupo}>
                  <button
                    onClick={() => toggleGrupo(grupo)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-army/50 rounded-lg hover:border-cyan/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 text-textLight/50 transition-transform ${abiertos ? 'rotate-90' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-sm font-semibold text-textLight">{grupo}</span>
                    </div>
                    <span className="text-[10px] text-textLight/40">
                      {countSelected}/{items.length}
                    </span>
                  </button>

                  {abiertos && (
                    <div className="ml-6 mt-2 space-y-2">
                      {items.map((am) => {
                        const selected = seleccionadas.has(am.id);
                        return (
                          <Card
                            key={am.id}
                            className={`p-3 cursor-pointer transition-all ${
                              selected
                                ? 'border-cyan shadow-[0_0_12px_rgba(0,212,255,0.15)]'
                                : 'border-army/30 hover:border-army'
                            }`}
                            onClick={() => toggleAmenaza(am.id)}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                    selected ? 'bg-cyan border-cyan' : 'border-army bg-navy'
                                  }`}
                                >
                                  {selected && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                      <path d="M1 4L3.5 6.5L9 1" stroke="#050E1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-xs text-textLight">{am.nombre}</span>
                              </div>
                              <span className={`text-[10px] font-bold uppercase shrink-0 ${impactoColor[am.nivel_impacto_base]}`}>
                                {impactoLabel[am.nivel_impacto_base]}
                              </span>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna derecha: Ámbito */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold uppercase tracking-wider text-textLight mb-4">
            Ámbito de Materialización
          </h3>

          {vistaAmbito === 'grabar' && (
            <Card className="p-6">
              <p className="text-sm text-textLight/50 mb-6">
                Describa verbalmente el contexto y actores involucrados en la
                materialización de las amenazas.
              </p>
              <MockVoiceRecorder onResult={handleAmbitoResult} />
            </Card>
          )}

          {vistaAmbito === 'procesando' && (
            <Card className="p-6 flex flex-col items-center justify-center gap-4">
              <Spinner />
              <p className="text-sm text-textLight/60">Analizando ámbito...</p>
            </Card>
          )}

          {vistaAmbito === 'resultado' && ambito && (
            <Card className="p-6">
              <p className="text-sm text-textLight/50 mb-4">
                Ámbito extraído. Puede editar antes de generar.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-textLight/50 mb-2">
                    Actores Involucrados
                  </label>
                  <input
                    type="text"
                    value={ambito.actores_involucrados}
                    onChange={(e) =>
                      setAmbito({ ...ambito, actores_involucrados: e.target.value })
                    }
                    className="w-full bg-navy border border-army rounded-lg px-4 py-3 text-sm text-textLight focus:border-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-textLight/50 mb-2">
                    Nivel de Daño Inicial (1-5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={ambito.nivel_dano_inicial}
                    onChange={(e) =>
                      setAmbito({ ...ambito, nivel_dano_inicial: Number(e.target.value) })
                    }
                    className="w-full bg-navy border border-army rounded-lg px-4 py-3 text-sm text-textLight focus:border-cyan focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-army pt-6">
        <span className="text-xs text-textLight/40">
          {seleccionadas.size} amenaza(s) seleccionada(s)
        </span>
        <Button
          variant="primary"
          disabled={seleccionadas.size < 1}
          onClick={generarSimulacion}
        >
          Generar Simulación
        </Button>
      </div>
    </div>
  );
}
