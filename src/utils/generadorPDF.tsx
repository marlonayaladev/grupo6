import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { SimulacionResult } from './simuladorMatematico';

interface Props {
  datos: SimulacionResult;
  activos: string[];
  amenazas: string[];
  iniciativa: string | null;
  recomendaciones: string[];
}

const s = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    color: '#1a1a1a',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#0D1F3C',
    paddingBottom: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D1F3C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0D1F3C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0D1F3C',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  badgeCritico: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  badgeBajo: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  recItem: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  recNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  recText: {
    flex: 1,
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
});

function formatSoles(v: number): string {
  return `S/ ${(v / 1_000_000).toFixed(1)}M`;
}

function getNivelRiesgo(riesgo: number): string {
  if (riesgo < 0.33) return 'BAJO';
  if (riesgo < 0.66) return 'MEDIO';
  return 'CRÍTICO';
}

function getBadgeStyle(riesgo: number) {
  if (riesgo < 0.33) return s.badgeBajo;
  if (riesgo < 0.66) return s.badge;
  return s.badgeCritico;
}

export function InformePDF({ datos, activos, amenazas, iniciativa, recomendaciones }: Props) {
  const nivelRiesgo = getNivelRiesgo(datos.parametricas.riesgoGlobal);
  const badgeStyle = getBadgeStyle(datos.parametricas.riesgoGlobal);
  const fecha = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Informe SICEP</Text>
          <Text style={s.subtitle}>Simulador de Iniciativas de Ciberdefensa</Text>
          <Text style={[s.subtitle, { marginTop: 4 }]}>{fecha}</Text>
        </View>

        {/* Resumen ejecutivo */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Resumen Ejecutivo</Text>
          <View style={s.row}>
            <Text style={s.label}>Nivel de Riesgo</Text>
            <Text style={[s.value, badgeStyle, { paddingHorizontal: 8, paddingVertical: 2 }]}>
              {nivelRiesgo}
            </Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Activos Críticos</Text>
            <Text style={s.value}>{activos.length} identificados</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Amenazas Detectadas</Text>
            <Text style={s.value}>{amenazas.length} amenazas</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Iniciativa</Text>
            <Text style={s.value}>{iniciativa || 'No especificada'}</Text>
          </View>
        </View>

        {/* Impacto económico */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Impacto Económico</Text>
          <View style={[s.card, { borderLeftWidth: 3, borderLeftColor: '#EF4444' }]}>
            <Text style={s.cardTitle}>Impacto Nacional Total</Text>
            <Text style={[s.cardText, { fontSize: 16, fontWeight: 'bold', color: '#991B1B' }]}>
              {formatSoles(datos.efecto_nacional.impacto_economico_total)}
            </Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>Impacto Institucional</Text>
            <Text style={[s.cardText, { fontSize: 14, fontWeight: 'bold', color: '#1a1a1a' }]}>
              {formatSoles(datos.efecto_institucional.impacto_economico)}
            </Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Factor de Propagación</Text>
            <Text style={s.value}>
              x{((datos.efecto_nacional.impacto_economico_total / datos.efecto_institucional.impacto_economico) || 0).toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Indicadores */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Indicadores Clave</Text>
          <View style={s.row}>
            <Text style={s.label}>Disponibilidad Crítica</Text>
            <Text style={s.value}>{datos.efecto_nacional.disponibilidad_critica.toFixed(1)}%</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Confianza Ciudadana</Text>
            <Text style={s.value}>{datos.efecto_institucional.confianza_ciudadana.toFixed(1)}%</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Riesgo Global</Text>
            <Text style={s.value}>{(datos.parametricas.riesgoGlobal * 100).toFixed(1)}%</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Criticidad Base</Text>
            <Text style={s.value}>{datos.parametricas.criticidadBase.toFixed(2)}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Factor Amenaza</Text>
            <Text style={s.value}>{datos.parametricas.factorAmenaza.toFixed(2)}</Text>
          </View>
        </View>

        {/* Recomendaciones */}
        {recomendaciones.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Recomendaciones de Ciberseguridad</Text>
            {recomendaciones.map((rec, i) => (
              <View key={i} style={s.recItem}>
                <Text style={s.recNumber}>{String(i + 1)}</Text>
                <Text style={s.recText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Sandbox de Resiliencia Digital — Informe Automático</Text>
          <Text style={s.footerText}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
}
