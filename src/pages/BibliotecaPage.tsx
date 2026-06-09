import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSimulacionStore } from '../store/simulacionStore';
import gemelos from '../mocks/gemelos.json';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';

interface Gemelo {
  id: string;
  nombre: string;
  descripcion: string;
  poblacion: number;
  impacto_s_hora: number;
  nivel_criticidad: number;
  categoria: string;
}

const data = gemelos as Gemelo[];

const CATEGORIAS = [...new Set(data.map((g) => g.categoria))].sort();
const CRITICIDADES = [
  { value: 0, label: 'Todas' },
  { value: 5, label: 'Crítico' },
  { value: 4, label: 'Alto' },
  { value: 3, label: 'Medio' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' as const },
  }),
};

function formatPoblacion(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatSoles(v: number): string {
  if (v >= 1_000_000) return `S/ ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `S/ ${(v / 1_000).toFixed(0)}K`;
  return `S/ ${v}`;
}

function nivelLabel(n: number): 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO' {
  if (n >= 5) return 'CRÍTICO';
  if (n >= 4) return 'ALTO';
  if (n >= 3) return 'MEDIO';
  return 'BAJO';
}

function nivelColor(n: number): string {
  if (n >= 5) return 'text-danger';
  if (n >= 4) return 'text-warning';
  if (n >= 3) return 'text-amber-400';
  return 'text-success';
}

export default function BibliotecaPage() {
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [criticidadFiltro, setCriticidadFiltro] = useState(0);
  const navigate = useNavigate();
  const agregarActivo = useSimulacionStore((s) => s.agregarActivo);

  const filtrados = useMemo(() => {
    return data.filter((g) => {
      const matchNombre = g.nombre.toLowerCase().includes(filtro.toLowerCase());
      const matchCategoria = !categoriaFiltro || g.categoria === categoriaFiltro;
      const matchCriticidad = criticidadFiltro === 0 || g.nivel_criticidad === criticidadFiltro;
      return matchNombre && matchCategoria && matchCriticidad;
    });
  }, [filtro, categoriaFiltro, criticidadFiltro]);

  const handleAgregar = (id: string) => {
    agregarActivo(id);
    navigate('/generar');
  };

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="Biblioteca de Gemelos Digitales" />

        {/* Filtros */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4">
          {/* Buscador */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textLight/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full bg-surface border border-army rounded-lg pl-10 pr-4 py-2.5 text-sm text-textLight placeholder:text-textLight/30 focus:border-cyan focus:outline-none transition-colors"
            />
            {filtro && (
              <button
                onClick={() => setFiltro('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textLight/40 hover:text-textLight"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filtro Categoría */}
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="bg-surface border border-army rounded-lg px-4 py-2.5 text-sm text-textLight focus:border-cyan focus:outline-none transition-colors cursor-pointer flex-1"
            >
              <option value="">Todas las categorías</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Filtro Criticidad */}
            <div className="flex border border-army rounded-lg overflow-hidden">
              {CRITICIDADES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCriticidadFiltro(c.value)}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex-1 sm:flex-none ${
                    criticidadFiltro === c.value
                      ? 'bg-cyan/15 text-cyan'
                      : 'bg-surface text-textLight/50 hover:text-textLight'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-textLight/40 mb-5">
          {filtrados.length} gemelo(s) encontrado(s)
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtrados.map((g, i) => (
            <motion.div
              key={g.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Card className="p-4 sm:p-5 flex flex-col h-full hover:border-cyan/40 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-sm font-bold text-textLight leading-tight">{g.nombre}</p>
                  <span className={`shrink-0 text-[10px] font-bold uppercase ${nivelColor(g.nivel_criticidad)}`}>
                    {nivelLabel(g.nivel_criticidad)}
                  </span>
                </div>

                <p className="text-xs text-textLight/50 leading-relaxed mb-4 flex-1 line-clamp-3">
                  {g.descripcion}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-navy rounded-lg p-3">
                    <p className="text-[9px] text-textLight/40 uppercase tracking-wider">Población</p>
                    <p className="text-sm font-bold text-textLight">{formatPoblacion(g.poblacion)}</p>
                  </div>
                  <div className="bg-navy rounded-lg p-3">
                    <p className="text-[9px] text-textLight/40 uppercase tracking-wider">Impacto/Hora</p>
                    <p className="text-sm font-bold text-danger">{formatSoles(g.impacto_s_hora)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-army/30 pt-3">
                  <span className="text-[10px] text-textLight/30 uppercase tracking-wider truncate mr-2">{g.categoria}</span>
                  <Button
                    variant="primary"
                    className="text-xs px-3 py-1.5"
                    onClick={() => handleAgregar(g.id)}
                  >
                    Simular
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-textLight/40">No se encontraron gemelos con esos filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
