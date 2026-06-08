export interface IniciativaResult {
  nombre_iniciativa: string;
  utilidad: string;
  nivel_madurez: number;
  nivel_criticidad: number;
}

export interface AmbitoResult {
  actores_involucrados: string;
  nivel_dano_inicial: number;
}

export function extraerIniciativaMock(_texto: string): Promise<IniciativaResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nombre_iniciativa: 'Modernización',
        utilidad: 'Centralización',
        nivel_madurez: 3,
        nivel_criticidad: 4,
      });
    }, 2000);
  });
}

export function extraerAmbitoMock(_texto: string): Promise<AmbitoResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        actores_involucrados: 'Actores estatales y no estatales',
        nivel_dano_inicial: 3,
      });
    }, 2000);
  });
}

const RECOMENDACIONES_MOCK: string[] = [
  'Implementar segmentación de red (VLAN) para aislar sistemas críticos de infraestructura estatal, reduciendo la superficie de ataque ante movimientos laterales.',
  'Establecer un programa de concienciación en ciberseguridad para todos los funcionarios públicos, con simulacros de phishing trimestrales y métricas de cumplimiento.',
  'Adoptar un marco Zero Trust para el acceso a datos sensibles: autenticación multifactor obligatoria, principio de mínimo privilegio y monitoreo continuo de sesiones.',
  'Diseñar y ejercitar un Plan de Continuidad del Negocio (BCP) y un Plan de Recuperación ante Desastres (DRP) con objetivos RTO/RPO definidos por criticidad de activo.',
];

export function generarRecomendacionesMock(): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(RECOMENDACIONES_MOCK);
    }, 1500);
  });
}
