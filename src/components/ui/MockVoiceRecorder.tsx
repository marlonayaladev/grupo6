import { useState, useEffect, useRef, useCallback } from 'react';

type RecorderState = 'INACTIVO' | 'GRABANDO' | 'PROCESANDO';

interface MockVoiceRecorderProps {
  onResult?: (text: string) => void;
  className?: string;
}

const FIXED_TEXT = 'Análisis de amenaza registrado. Se detectaron factores de riesgo en zona fronteriza. Nivel de preocupación: ALTO. Se recomienda activar protocolo de monitoreo.';

export default function MockVoiceRecorder({
  onResult,
  className = '',
}: MockVoiceRecorderProps) {
  const [state, setState] = useState<RecorderState>('INACTIVO');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startRecording = () => {
    if (state !== 'INACTIVO') return;
    cleanup();
    setState('GRABANDO');
    setElapsed(0);

    intervalRef.current = setInterval(() => {
      setElapsed((p) => p + 1);
    }, 1000);

    timerRef.current = setTimeout(() => {
      cleanup();
      setState('PROCESANDO');
      setElapsed(0);

      timerRef.current = setTimeout(() => {
        setState('INACTIVO');
        onResult?.(FIXED_TEXT);
        cleanup();
      }, 2000);
    }, 3000);
  };

  const stopRecording = () => {
    if (state !== 'GRABANDO') return;
    cleanup();
    setState('PROCESANDO');
    setElapsed(0);

    timerRef.current = setTimeout(() => {
      setState('INACTIVO');
      onResult?.(FIXED_TEXT);
      cleanup();
    }, 2000);
  };

  const isActive = state !== 'INACTIVO';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        type="button"
        onClick={isActive ? stopRecording : startRecording}
        className={`
          flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200
          ${state === 'GRABANDO'
            ? 'bg-danger/20 border-danger animate-pulse'
            : state === 'PROCESANDO'
            ? 'bg-warning/20 border-warning'
            : 'bg-surface border-army hover:border-cyan/50'
          }
        `}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={state === 'GRABANDO' ? '#FF3B3B' : state === 'PROCESANDO' ? '#FFB800' : '#64748b'}
        >
          {state === 'GRABANDO' ? (
            <rect x="6" y="6" width="12" height="12" rx="2" />
          ) : (
            <>
              <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke={state === 'GRABANDO' ? '#FF3B3B' : state === 'PROCESANDO' ? '#FFB800' : '#64748b'} strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="19" x2="12" y2="23" stroke={state === 'GRABANDO' ? '#FF3B3B' : state === 'PROCESANDO' ? '#FFB800' : '#64748b'} strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wider text-textLight">
          {state === 'INACTIVO' && 'Micrófono inactivo'}
          {state === 'GRABANDO' && `Grabando... ${elapsed}s`}
          {state === 'PROCESANDO' && 'Procesando audio...'}
        </span>
        <span className="text-[10px] text-army mt-0.5">
          {state === 'INACTIVO' && 'Presione para iniciar'}
          {state === 'GRABANDO' && 'Presione para detener'}
          {state === 'PROCESANDO' && 'Espere un momento'}
        </span>
      </div>
    </div>
  );
}
