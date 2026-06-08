import { useState } from 'react';
import { useSimulacionStore } from '../../store/simulacionStore';
import { extraerIniciativaMock, type IniciativaResult } from '../../utils/mockIA';
import MockVoiceRecorder from '../../components/ui/MockVoiceRecorder';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';
import Spinner from '../../components/ui/Spinner';

type Vista = 'grabar' | 'procesando' | 'resultado';

export default function PasoIniciativa() {
  const [vista, setVista] = useState<Vista>('grabar');
  const [datos, setDatos] = useState<IniciativaResult | null>(null);
  const setIniciativa = useSimulacionStore((s) => s.setIniciativa);
  const setPasoActual = useSimulacionStore((s) => s.setPasoActual);

  const handleVoiceResult = async (texto: string) => {
    setVista('procesando');
    const result = await extraerIniciativaMock(texto);
    setDatos(result);
    setVista('resultado');
  };

  const guardar = () => {
    if (!datos) return;
    setIniciativa(datos.nombre_iniciativa);
    setPasoActual(3);
  };

  const omitir = () => {
    setPasoActual(3);
  };

  return (
    <div>
      <SectionHeader title="Definición de Iniciativa" />

      {vista === 'grabar' && (
        <Card className="p-8">
          <p className="text-sm text-textLight/50 mb-8">
            Describa verbalmente la iniciativa que desea evaluar. La IA extraerá
            automáticamente los parámetros clave.
          </p>
          <MockVoiceRecorder onResult={handleVoiceResult} />
        </Card>
      )}

      {vista === 'procesando' && (
        <Card className="p-8 flex flex-col items-center justify-center gap-4">
          <Spinner />
          <p className="text-sm text-textLight/60">Analizando iniciativa...</p>
        </Card>
      )}

      {vista === 'resultado' && datos && (
        <Card className="p-8">
          <p className="text-sm text-textLight/50 mb-6">
            Parámetros extraídos. Puede editar antes de continuar.
          </p>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-textLight/50 mb-2">
                Nombre de Iniciativa
              </label>
              <input
                type="text"
                value={datos.nombre_iniciativa}
                onChange={(e) =>
                  setDatos({ ...datos, nombre_iniciativa: e.target.value })
                }
                className="w-full bg-navy border border-army rounded-lg px-4 py-3 text-sm text-textLight focus:border-cyan focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-textLight/50 mb-2">
                Utilidad
              </label>
              <input
                type="text"
                value={datos.utilidad}
                onChange={(e) =>
                  setDatos({ ...datos, utilidad: e.target.value })
                }
                className="w-full bg-navy border border-army rounded-lg px-4 py-3 text-sm text-textLight focus:border-cyan focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-textLight/50 mb-2">
                Nivel de Madurez (1-5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={datos.nivel_madurez}
                onChange={(e) =>
                  setDatos({ ...datos, nivel_madurez: Number(e.target.value) })
                }
                className="w-full bg-navy border border-army rounded-lg px-4 py-3 text-sm text-textLight focus:border-cyan focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-textLight/50 mb-2">
                Nivel de Criticidad (1-5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={datos.nivel_criticidad}
                onChange={(e) =>
                  setDatos({ ...datos, nivel_criticidad: Number(e.target.value) })
                }
                className="w-full bg-navy border border-army rounded-lg px-4 py-3 text-sm text-textLight focus:border-cyan focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button variant="primary" onClick={guardar}>
              Añadir Amenaza
            </Button>
            <Button variant="ghost" onClick={omitir}>
              Omitir Amenaza
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
