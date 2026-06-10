import { useSimulacionStore } from '../../store/simulacionStore';
import { extraerIniciativaMock } from '../../utils/mockIA';
import MockVoiceRecorder from '../../components/ui/MockVoiceRecorder';
import Button from '../../components/ui/Button';

export default function PasoIniciativa() {
  const setIniciativa = useSimulacionStore((s) => s.setIniciativa);
  const setPasoActual = useSimulacionStore((s) => s.setPasoActual);

  const handleVoiceResult = async (texto: string) => {
    const result = await extraerIniciativaMock(texto);
    setIniciativa(result.nombre_iniciativa);
    setPasoActual(3);
  };

  const omitir = () => {
    setPasoActual(3);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => setPasoActual(1)}>
          ← Retroceder
        </Button>
        <Button variant="ghost" onClick={omitir}>
          Omitir Amenaza
        </Button>
      </div>

      <MockVoiceRecorder onResult={handleVoiceResult} />
    </div>
  );
}
