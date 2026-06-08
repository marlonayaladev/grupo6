import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Simulacion {
  id: string;
  fecha: string;
  activosSeleccionados: string[];
  iniciativa: string | null;
  amenazas: string[];
  ambito: string | null;
  resultado?: string;
}

interface SimulacionState {
  activosSeleccionados: string[];
  iniciativa: string | null;
  amenazas: string[];
  ambito: string | null;
  historial: Simulacion[];
  pasoActual: number;

  setActivosSeleccionados: (activos: string[]) => void;
  agregarActivo: (activo: string) => void;
  setIniciativa: (ini: string | null) => void;
  setAmenazas: (amenazas: string[]) => void;
  setAmbito: (ambito: string | null) => void;
  setPasoActual: (paso: number) => void;
  agregarSimulacion: (sim: Simulacion) => void;
  eliminarSimulacion: (id: string) => void;
  getUltimasSimulaciones: (n: number) => Simulacion[];
  resetSimulacion: () => void;
}

const initialState = {
  activosSeleccionados: [],
  iniciativa: null,
  amenazas: [],
  ambito: null,
  historial: [],
  pasoActual: 1,
};

export const useSimulacionStore = create<SimulacionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setActivosSeleccionados: (activos) => set({ activosSeleccionados: activos }),
      agregarActivo: (activo) =>
        set((state) => ({
          activosSeleccionados: state.activosSeleccionados.includes(activo)
            ? state.activosSeleccionados
            : [...state.activosSeleccionados, activo],
          pasoActual: 1,
        })),
      setIniciativa: (ini) => set({ iniciativa: ini }),
      setAmenazas: (amenazas) => set({ amenazas }),
      setAmbito: (ambito) => set({ ambito }),
      setPasoActual: (paso) => set({ pasoActual: paso }),

      agregarSimulacion: (sim) =>
        set((state) => ({
          historial: [...state.historial, sim],
        })),

      eliminarSimulacion: (id) =>
        set((state) => ({
          historial: state.historial.filter((s) => s.id !== id),
        })),

      getUltimasSimulaciones: (n) => {
        const historial = get().historial;
        return historial.slice(-n).reverse();
      },

      resetSimulacion: () =>
        set({
          activosSeleccionados: [],
          iniciativa: null,
          amenazas: [],
          ambito: null,
          pasoActual: 1,
        }),
    }),
    {
      name: 'sandbox-resiliencia-storage',
    }
  )
);
