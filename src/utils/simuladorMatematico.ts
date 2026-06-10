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
    continuidad_operativa: number;
    disponibilidad_sistema: number;
    mando_control: number;
    logistica: number;
    administrativa: number;
    comunicaciones: number;
    respuesta_cibernetica: number;
    tiempo_recuperacion: number;
    confianza_interna: number;
    adopcion_digital: number;
    resistencia_personal: number;
    capacitacion: number;
    riesgo_reputacional: number;
  };
  efecto_nacional: {
    impacto_economico_total: number;
    confianza_ciudadana_nacional: number;
    disponibilidad_critica: number;
    servicios_esenciales: number;
    impacto_gobernabilidad: number;
    infraestructura_critica: number;
    desinformacion: number;
    credibilidad_publica: number;
    continuidad_estado: number;
    poblacion_impactada: number;
    escalamiento_social: number;
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

  const clamp = (v: number) => Math.round(Math.min(100, Math.max(0, v)) * 100) / 100;

  const r = riesgoGlobal;
  const f = factorAmenaza;
  const c = criticidadBase;

  // Institucional
  const continuidadOperativa = clamp(Math.max(0, 100 - r * 75));
  const disponibilidadSistema = clamp(Math.max(0, 100 - r * 70 - f * 10));
  const mandoControl = clamp(Math.max(0, 100 - r * 60 - c * 8));
  const logistica = clamp(Math.max(0, 100 - r * 55 - f * 12));
  const administrativa = clamp(Math.max(0, 100 - r * 50 - c * 10));
  const comunicaciones = clamp(Math.max(0, 100 - r * 65 - f * 8));
  const respuestaCibernetica = clamp(Math.max(0, 100 - r * 80));
  const tiempoRecuperacion = Math.round(3 + r * 25 + f * 5);
  const confianzaInterna = clamp(Math.max(0, 100 - r * 60));
  const adopcionDigital = clamp(Math.max(0, 100 - r * 40 - c * 5));
  const resistenciaPersonal = clamp(Math.min(100, 30 + r * 50));
  const capacitacion = clamp(Math.min(100, 20 + r * 60 + c * 5));
  const riesgoReputacional = clamp(Math.min(100, r * 100 * 0.9 + f * 10));

  // Nacional
  const serviciosEsenciales = clamp(Math.max(0, 100 - r * 70 - f * 15));
  const impactoGobernabilidad = clamp(Math.min(100, r * 80 + f * 10));
  const infraestructuraCritica = clamp(Math.max(0, 100 - r * 75 - c * 10));
  const desinformacion = clamp(Math.min(100, r * 60 + f * 20));
  const credibilidadPublica = clamp(Math.max(0, 100 - r * 70));
  const continuidadEstado = clamp(Math.max(0, 100 - r * 55 - c * 8));
  const poblacionImpactada = Math.round(r * 8_000_000 + f * 2_000_000);
  const escalamientoSocial = clamp(Math.min(100, r * 70 + desinformacion * 0.3));

  return {
    parametricas: {
      criticidadBase: Math.round(criticidadBase * 100) / 100,
      factorAmenaza: Math.round(factorAmenaza * 100) / 100,
      riesgoGlobal: Math.round(riesgoGlobal * 10000) / 10000,
    },
    efecto_institucional: {
      impacto_economico: Math.round(impactoEconomico),
      confianza_ciudadana: Math.round(confianzaCiudadana * 100) / 100,
      continuidad_operativa: continuidadOperativa,
      disponibilidad_sistema: disponibilidadSistema,
      mando_control: mandoControl,
      logistica: logistica,
      administrativa: administrativa,
      comunicaciones: comunicaciones,
      respuesta_cibernetica: respuestaCibernetica,
      tiempo_recuperacion: tiempoRecuperacion,
      confianza_interna: confianzaInterna,
      adopcion_digital: adopcionDigital,
      resistencia_personal: resistenciaPersonal,
      capacitacion: capacitacion,
      riesgo_reputacional: riesgoReputacional,
    },
    efecto_nacional: {
      impacto_economico_total: Math.round(impactoEconomico * 3.2),
      confianza_ciudadana_nacional: Math.round(confianzaCiudadana * 0.85 * 100) / 100,
      disponibilidad_critica: Math.round(disponibilidadCritica * 100) / 100,
      servicios_esenciales: serviciosEsenciales,
      impacto_gobernabilidad: impactoGobernabilidad,
      infraestructura_critica: infraestructuraCritica,
      desinformacion: desinformacion,
      credibilidad_publica: credibilidadPublica,
      continuidad_estado: continuidadEstado,
      poblacion_impactada: poblacionImpactada,
      escalamiento_social: escalamientoSocial,
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
