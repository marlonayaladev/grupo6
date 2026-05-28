export const categories = [
  {
    id: 'mt',
    name: 'Megatendencias',
    short: 'MT',
    ring: 0,
    items: [
      { id: 'MT1', nombre: 'Escasez de recursos' },
      { id: 'MT2', nombre: 'Cambio climático' },
      { id: 'MT3', nombre: 'Mundo polinodal' },
      { id: 'MT4', nombre: 'Innovación tecnológica' },
      { id: 'MT5', nombre: 'Crimen organizado transnacional' },
      { id: 'MT6', nombre: 'Inseguridad' },
      { id: 'MT7', nombre: 'Migración' },
      { id: 'MT8', nombre: 'Inestabilidad regional' },
      { id: 'MT9', nombre: 'Envejecimiento de la población' },
    ],
    defaultExcluded: ['MT9'],
  },
  {
    id: 'tn',
    name: 'Tendencias Nacionales',
    short: 'TN',
    ring: 1,
    items: [
      { id: 'TN1', nombre: 'Escasez de recursos y crisis climática' },
      { id: 'TN2', nombre: 'Degradación ambiental' },
      { id: 'TN3', nombre: 'Reconfiguración del orden global' },
      { id: 'TN4', nombre: 'Brecha tecnológica y digital' },
      { id: 'TN5', nombre: 'Crimen organizado y narcotráfico' },
      { id: 'TN6', nombre: 'Violencia e inseguridad ciudadana' },
      { id: 'TN7', nombre: 'Presión migratoria y desplazamiento' },
      { id: 'TN8', nombre: 'Conflictos limítrofes y soberanía' },
      { id: 'TN9', nombre: 'Envejecimiento poblacional' },
    ],
    defaultExcluded: [],
  },
  {
    id: 'tin',
    name: 'Tendencias IINN',
    short: 'TIN',
    ring: 2,
    items: [
      { id: 'TIN1', nombre: 'Tendencia IINN 1' },
      { id: 'TIN2', nombre: 'Tendencia IINN 2' },
      { id: 'TIN3', nombre: 'Tendencia IINN 3' },
      { id: 'TIN4', nombre: 'Tendencia IINN 4' },
      { id: 'TIN5', nombre: 'Tendencia IINN 5' },
      { id: 'TIN6', nombre: 'Tendencia IINN 6' },
      { id: 'TIN7', nombre: 'Tendencia IINN 7' },
      { id: 'TIN8', nombre: 'Tendencia IINN 8' },
      { id: 'TIN9', nombre: 'Tendencia IINN 9' },
    ],
    defaultExcluded: [],
  },
  {
    id: 'ts',
    name: 'Tendencias Sectoriales',
    short: 'TS',
    ring: 3,
    items: [
      { id: 'TS1', nombre: 'Desastres naturales' },
      { id: 'TS2', nombre: 'Conflictos armados' },
      { id: 'TS3', nombre: 'Cibercrimen' },
      { id: 'TS4', nombre: 'Tráfico de drogas' },
      { id: 'TS5', nombre: 'Trata de personas' },
      { id: 'TS6', nombre: 'Conflictos sociales' },
      { id: 'TS7', nombre: 'Escasez de recursos' },
      { id: 'TS8', nombre: 'Tendencia Sectorial 8' },
      { id: 'TS9', nombre: 'Tendencia Sectorial 9' },
      { id: 'TS10', nombre: 'Tendencia Sectorial 10' },
      { id: 'TS11', nombre: 'Tendencia Sectorial 11' },
      { id: 'TS12', nombre: 'Tendencia Sectorial 12' },
      { id: 'TS13', nombre: 'Tendencia Sectorial 13' },
      { id: 'TS14', nombre: 'Tendencia Sectorial 14' },
      { id: 'TS15', nombre: 'Tendencia Sectorial 15' },
      { id: 'TS16', nombre: 'Tendencia Sectorial 16' },
    ],
    defaultExcluded: ['TS8', 'TS9', 'TS10', 'TS11', 'TS12', 'TS13', 'TS14', 'TS15', 'TS16'],
  },
  {
    id: 'r',
    name: 'Riesgos',
    short: 'R',
    ring: 4,
    items: [
      { id: 'R1', nombre: 'Conflictos armados' },
      { id: 'R2', nombre: 'Contrabando' },
      { id: 'R3', nombre: 'Minería ilegal' },
      { id: 'R4', nombre: 'Heladas' },
      { id: 'R5', nombre: 'Trata de personas' },
      { id: 'R6', nombre: 'Riesgo 6' },
      { id: 'R7', nombre: 'Riesgo 7' },
      { id: 'R8', nombre: 'Riesgo 8' },
      { id: 'R9', nombre: 'Riesgo 9' },
      { id: 'R10', nombre: 'Riesgo 10' },
    ],
    defaultExcluded: ['R6', 'R7', 'R8', 'R9', 'R10'],
  },
  {
    id: 'a',
    name: 'Amenazas SEG NAC',
    short: 'A',
    ring: 5,
    items: [
      { id: 'A1', nombre: 'Medio ambiente' },
      { id: 'A2', nombre: 'Actores extranjeros' },
      { id: 'A3', nombre: 'Seguridad digital' },
      { id: 'A4', nombre: 'Crimen organizado' },
      { id: 'A5', nombre: 'Actores extranjeros v2' },
      { id: 'A6', nombre: 'Amenaza 6' },
      { id: 'A7', nombre: 'Amenaza 7' },
      { id: 'A8', nombre: 'Amenaza 8' },
      { id: 'A9', nombre: 'Amenaza 9' },
      { id: 'A10', nombre: 'Amenaza 10' },
    ],
    defaultExcluded: ['A6', 'A7', 'A8', 'A9', 'A10'],
  },
];

export const relationMatrix = {
  MT1: ['TN1', 'TIN1', 'TS1', 'TS7', 'R4', 'A1'],
  MT2: ['TN2', 'TIN2', 'TS1', 'R4', 'A1'],
  MT3: ['TN3', 'TIN3', 'TS2', 'R1', 'A2'],
  MT4: ['TN4', 'TIN4', 'TS3', 'R3', 'A3'],
  MT5: ['TN5', 'TIN5', 'TS4', 'R2', 'A4'],
  MT6: ['TN6', 'TIN6', 'TS5', 'R5', 'A4'],
  MT7: ['TN7', 'TIN7', 'TS6', 'R4', 'A1'],
  MT8: ['TN8', 'TIN8', 'TS2', 'R1', 'A2'],
};

export const ringRadii = [80, 140, 200, 260, 320, 380];

export const ringColors = [
  '#00d4ff',
  '#ff6b35',
  '#7bed9f',
  '#ffa502',
  '#a855f7',
  '#f4a261',
];

export const ringWidths = [14, 18, 22, 26, 30, 34];

export const rotationSpeeds = [180, 150, 130, 110, 90, 70];

export const amenazasCaracterizadas = [
  {
    id: 1,
    nombre: 'Degradación hídrico-ambiental en zona fronteriza por acción de la población.',
    path: ['MT1', 'TN1', 'TIN1', 'TS1', 'R4', 'A1'],
  },
  {
    id: 2,
    nombre: 'Accionar de actores extranjeros contra la seguridad nacional, soberanía y ciberseguridad.',
    path: ['MT3', 'TN3', 'TIN3', 'TS2', 'R1', 'A2'],
  },
  {
    id: 3,
    nombre: 'Accionar del crimen organizado internacional contra la seguridad nacional.',
    path: ['MT5', 'TN5', 'TIN5', 'TS4', 'R2', 'A4'],
  },
  {
    id: 4,
    nombre: 'Accionar del Gobierno Boliviano contra la seguridad migratoria nacional.',
    path: ['MT7', 'TN7', 'TIN7', 'TS6', 'R4', 'A1'],
  },
  {
    id: 5,
    nombre: 'Aumento de conflictividad en sector aimara como efecto ideológico.',
    path: ['MT6', 'TN6', 'TIN6', 'TS5', 'R5', 'A4'],
  },
];
