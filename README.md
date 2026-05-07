# Wandr

> Wandr es una aplicación de planificación de viajes ligera, construida con Vue 3, Vite y Tailwind. Permite crear viajes, organizar días y actividades, y usar un asistente de IA para sugerencias de itinerario.

## Características

- Gestión de viajes (crear, editar, eliminar) almacenados en `localStorage`.
- Itinerarios por días y actividades (hora, duración, ubicación, notas, costo).
- Autenticación simulada (mock) para flujo de usuario básico.
- Panel de asistente IA con integración opcional a un microservicio externo.
- UI moderna con Tailwind CSS y componentes reutilizables.

## Tecnologías

- Vue 3
- Vite
- Pinia
- Vue Router
- Tailwind CSS
- Lucide icons

## Empezando (desarrollo)

Requisitos:

- Node.js >= 16
- npm o yarn

Instalación:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Construir para producción:

```bash
npm run build
npm run preview
```

## Variables de entorno / Integración IA

Wandr incluye un servicio de IA con respuestas mock en `src/services/ai.service.js`. Para conectar un microservicio real, define las variables de entorno en un archivo `.env` (o en tu entorno de despliegue):

- `VITE_AI_SERVICE_URL` — URL del microservicio de IA (ej. `https://mi-ia.example.com/api`)
- `VITE_ANTHROPIC_API_KEY` — (opcional) clave si integras Anthropic u otro proveedor directamente

Si no configuras `VITE_AI_SERVICE_URL`, la aplicación usa respuestas simuladas.

## Estructura principal

- `package.json` — [package.json](package.json)
- `src/main.js` — punto de entrada de la app
- `src/services/ai.service.js` — integración con IA (mock/real)
- `src/stores/auth.js` — store de autenticación (mock)
- `src/stores/trips.js` — lógica CRUD y persistencia en `localStorage`
- `src/router/index.js` — rutas y guard de navegación
- `src/views/` — vistas principales: Dashboard, Planner, TripDetail, Login, Register
- `src/components/` — componentes UI reutilizables (TripCard, NewTripModal, etc.)

## Conectar un backend real

Las stores y el servicio de IA están pensados para ser reemplazados por llamadas a APIs reales:

- Reemplaza las funciones mock en `src/stores/auth.js` por llamadas a tu `authService`.
- Reemplaza las operaciones en `src/stores/trips.js` por llamadas a tu `tripService`.
- Configura `VITE_AI_SERVICE_URL` y adapta `src/services/ai.service.js` para enviar peticiones a tu microservicio.

## Estilo y convenciones

- Usa Pinia para el estado global.
- Las fechas se manejan en ISO (YYYY-MM-DD) para inputs y presentaciones locales.

## Contribuir

1. Crea una rama con nombre descriptivo: `feature/nombre`.
2. Haz commits claros y pequeños.
3. Abre un Pull Request describiendo los cambios.

## Licencia

Licencia MIT — adaptarla según tus necesidades.

---

Si quieres, puedo:

- Añadir badges (build/coverage) y enlaces CI.
- Expandir la sección de despliegue (Docker / Netlify / Vercel).
- Traducir a inglés o generar un `README_en.md`.

Dime qué prefieres.
