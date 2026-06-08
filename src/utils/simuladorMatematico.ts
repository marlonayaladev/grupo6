export interface ActivoSim {
  nivel_criticidad: number;
}

export interface AmenazaSim {
  nivel_impacto_base: number;
}

export interface SimulacionResult {
  parametricas: {
    criticidadBase: number;
    factorAmenaza: number;
    riesgoGlobal: number;
  };
  efecto_institucional: {
    impacto_economico: number;
    confianza_ciudadana: number;
  };
  efecto_nacional: {
    impacto_economico_total: number;
    confianza_ciudadana_nacional: number;
    disponibilidad_critica: number;
  };
  serie_temporal: Array<{
    dia: number;
    disponibilidad: number;
    recuperacion: number;
  }>;
}

export function calcularResultados(
  activos: ActivoSim[],
  _iniciativa: string | null,
  amenazas: AmenazaSim[],
  _ambito: string | null
): SimulacionResult {
  const criticidadBase =
    activos.reduce((sum, a) => sum + a.nivel_criticidad, 0) / activos.length;

  const factorAmenaza =
    amenazas.reduce((sum, a) => sum + a.nivel_impacto_base, 0) / amenazas.length;

  const riesgoGlobal =
    ((criticidadBase * 0.4 + factorAmenaza * 0.6) / 5) * 1;

  const impactoEconomico = criticidadBase * 50_000_000 * factorAmenaza;

  const confianzaCiudadana = (1 - riesgoGlobal * 0.85) * 100;

  const serieTemporal = generarSerieTemporal(riesgoGlobal);

  const disponibilidadCritica = serieTemporal[29]?.disponibilidad ?? 0;

  return {
    parametricas: {
      criticidadBase: Math.round(criticidadBase * 100) / 100,
      factorAmenaza: Math.round(factorAmenaza * 100) / 100,
      riesgoGlobal: Math.round(riesgoGlobal * 10000) / 10000,
    },
    efecto_institucional: {
      impacto_economico: Math.round(impactoEconomico),
      confianza_ciudadana: Math.round(confianzaCiudadana * 100) / 100,
    },
    efecto_nacional: {
      impacto_economico_total: Math.round(impactoEconomico * 3.2),
      confianza_ciudadana_nacional: Math.round(confianzaCiudadana * 0.85 * 100) / 100,
      disponibilidad_critica: Math.round(disponibilidadCritica * 100) / 100,
    },
    serie_temporal: serieTemporal,
  };
}

function generarSerieTemporal(riesgoGlobal: number) {
  const caidaMaxima = riesgoGlobal * 60;
  const dias = 30;
  const puntoMinimo = 3;
  const serie: Array<{ dia: number; disponibilidad: number; recuperacion: number }> = [];

  for (let i = 0; i < dias; i++) {
    let disponibilidad: number;

    if (i <= puntoMinimo) {
      const t = i / puntoMinimo;
      disponibilidad = 100 - caidaMaxima * Math.pow(t, 1.5);
    } else {
      const t = (i - puntoMinimo) / (dias - puntoMinimo);
      const recuperacion = 1 - Math.pow(1 - t, 2);
      disponibilidad = (100 - caidaMaxima) + caidaMaxima * recuperacion;
    }

    const recuperacion = i <= puntoMinimo
      ? 0
      : ((i - puntoMinimo) / (dias - puntoMinimo)) * 100;

    serie.push({
      dia: i + 1,
      disponibilidad: Math.round(disponibilidad * 100) / 100,
      recuperacion: Math.round(recuperacion * 100) / 100,
    });
  }

  return serie;
}
