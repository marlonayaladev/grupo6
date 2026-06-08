# Sandbox Institucional de Resiliencia Digital

Prototipo de simulación de escenarios de ciberseguridad para infraestructura crítica estatal.

## Instalación y Ejecución

```bash
npm install
npm run dev
```

**Este prototipo corre 100% en el frontend con datos mockeados.** No requiere backend, base de datos ni servicios externos.

## Credenciales de Acceso

| Email | Rol |
|-------|-----|
| `admin@ejercito.pe` | ADMINISTRADOR |

La contraseña no se valida (es un prototipo mock). Cualquier valor funciona.

## Stack Tecnológico

- React 19 + Vite 8
- Tailwind CSS v4
- Framer Motion
- Recharts
- react-leaflet (mapa de Perú)
- Zustand (state + persist en localStorage)
- react-router-dom v6
- @react-pdf/renderer (generación de informes)

## Funcionalidades

- Wizard de 3 pasos: Activos → Iniciativa → Amenazas
- Simulación matemática con curvas de recuperación
- Paneles de efecto institucional y nacional
- Mapa de Perú con regiones afectadas
- Ficha de resultados con recomendaciones mock
- Generación y descarga de PDF
- Biblioteca de gemelos digitales
- Historial de simulaciones (persistente en localStorage)
- Modo Presentación (pantalla completa)
- Login con autenticación mock
