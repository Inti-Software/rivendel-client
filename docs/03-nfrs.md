# 03. NFRs, seguridad, rendimiento, testing y CI/CD

## 1) Objetivo de las NFRs

Las Non-Functional Requirements del proyecto apuntan a sostener una aplicación de administración interna, con acceso restringido, operaciones CRUD con respuesta inmediata y datos legales sensibles. Por esa razón, los requisitos no funcionales relevantes son:

- seguridad de acceso y sesiones
- disponibilidad y tolerancia a fallos
- rendimiento y respuesta de UI
- calidad y cobertura del código
- capacidad de despliegue y operación

## 2) Seguridad

### 2.1 Autenticación y acceso

La base de seguridad del cliente está en:

- `auth.repository.js` para `/auth/login`, `/auth/refresh`, `/auth/logout`
- `ProtectedRoute.jsx` para bloquear rutas no autorizadas
- `interceptors.js` para inyectar bearer token en cada request autenticado

La sesión se maneja con:

- `dtos/token.js`
- `stores/auth-status.js`
- `stores/auth-resolution.js`

### 2.2 Tokens y refresh

El flujo observado es:

1. El usuario inicia sesión.
2. Se guarda el `accessToken` en memoria.
3. El interceptor agrega el header `Authorization` a peticiones autenticadas.
4. Si hay `401`, se intenta refresh.
5. Si refresh falla, se limpia el estado de autenticación y se redirige a `/`.

Esto evita que la app quede en estado inconsistente, aunque la estrategia depende en buena medida de la seguridad del backend y del manejo de cookies con `withCredentials: true`.

### 2.3 Validación del lado del cliente

La validación se hace en componentes y handlers:

- Login valida email y contraseña.
- Formularios validan obligatorios y longitud mínima antes de enviar.
- El sanitizado de HTML se hace con `DOMPurify` en `ClausulasAcuerdo/editor.utils.js`, una buena práctica dado que se maneja contenido editable y posible render a PDF.

### 2.4 Riesgos de seguridad actuales

- El token se guarda solo en memoria del módulo; no hay almacenamiento persistente ni protección reforzada ante reload.
- Los datos de sesión no están cifrados ni en `sessionStorage`.
- Hay ausencia de control más estricto para CSRF / XSRF; la app asume que la cookie del backend se maneja de forma segura.
- No se observa `httpOnly` en el contexto del cliente, dado que la cookie se gestiona desde el navegador con `withCredentials`.

## 3) Rendimiento

### 3.1 Estrategia general

El proyecto es una SPA pequeña/moderada, por lo que el rendimiento se optimiza más por:

- componentes bien segmentados
- paginación en listados
- debounce en búsquedas
- carga de datos bajo demanda
- ventana de carga del backend mientras se resuelve sesión

### 3.2 Puntos fuertes del diseño

- `useDebounce` reduce llamadas a backend en búsquedas.
- `Grid` evita re-render innecesario al paginar y filtrar sólo la porción de datos.
- `NotificationProvider` centraliza toasts sin duplicar instancias.
- `AppGate` evita renderizar UI protegida hasta que el backend y la sesión estén listos.

### 3.3 Cuellos de botella posibles

- El módulo de reclamos y actas puede generar render pesado con contenido Tiptap y PDFMake.
- El uso de `window.history.replaceState` y navegación con `location.state` requiere cuidado para no romper UX en rutas con recarga.
- El proyecto no usa lazy loading por rutas ni code-splitting avanzado por módulos.
- `vite.config.js` tiene `rollup-plugin-visualizer` que ayuda a inspección, pero no reemplaza un plan de optimización funcional.

## 4) Estrategias de cacheo

### 4.1 Cache de sesión y UI

- `localStorage` se usa para recordar si se vio el tour inicial (`tour-v1`) en `useTourInicial.js`.
- No se observa cache HTTP robusto ni caché de API en cliente.
- Los estados de autenticación, backend y calendario se gestionan con módulos de estado global en memoria.

### 4.2 Recomendación de mejora

Para un producto de mayor madurez se recomienda:

- cache de respuestas de listados con invalidación por entidad
- `stale-while-revalidate` para listados de consulta que no cambian con frecuencia
- almacenamiento de sesión por `sessionStorage` o cookie robusta según política del backend
- reintentos con backoff para conexiones intermitentes, como ya se implementa parcialmente en `interceptors.js`

## 5) Testing

### 5.1 Framework y cobertura visible

La configuración de test en `vite.config.js` usa:

- `environment: 'jsdom'`
- `globals: true`
- `setupFiles: ['./src/setupTests.js']`

Comandos:

- `npm test` / `pnpm test` → `vitest run`
- `npm run test:watch` / `pnpm test:watch` → watch mode

### 5.2 Cobertura funcional actual

El proyecto ya tiene una base sólida en:

- login
- validación de rutas protegidas
- API auth repository
- interceptors
- repositorios `BaseRepository`, Google Calendar, etc.
- listados de Partes, Patrocinantes y Reclamos
- layout y providers

### 5.3 Áreas con riesgo de falta de pruebas

- flujo completo de sesión con refresh/401
- callback y OAuth de Google Calendar
- lógica de actas y PDF
- conversiones de fechas y estados entre formularios y backend
- rendering de contenido Tiptap y sanitizado DOM
- edge cases de paginación y búsquedas complejas

### 5.4 Recomendación de mejora

- añadir tests de integración con backend mockado
- pruebas de regresión para actas y reclamos legales
- tests para rutas protegidas y login con refresh fallido
- casos de error de red y respuesta del servidor sin `response`

## 6) CI/CD

### 6.1 Estado visible

No se observan archivos de pipeline ni configuración de GitHub Actions, Azure Pipelines, GitLab CI o despliegue automatizado en la estructura del proyecto visible.

### 6.2 Recomendación mínima de pipeline

Un pipeline CI básico debería incluir:

1. instalación (`pnpm install --frozen-lockfile`)
2. lint (`pnpm lint`)
3. tests (`pnpm test`)
4. build (`pnpm build`)
5. análisis de bundle si se requiere
6. despliegue solo si la rama es main o release y la build pasa

### 6.3 Recomendación para despliegue

- Vercel o hosting estático con `vercel.json`
- variables de entorno segregadas (`.env.local`, `.env.production`)
- build en CI y previews por branch
- revisión manual de cambios sensibles antes de merge

## 7) Calidad de código

### 7.1 Buenas prácticas ya presentes

- ESLint con reglas de React y hooks
- `react-refresh` para mantener excelente DX
- uso de `jsdom` para pruebas UI
- `prettier` integrado
- claridad de estructura por entidad y feature

### 7.2 Mejoras sugeridas

- introducir TypeScript en puntos críticos (más seguro para dominios complejos)
- evitar lógica de negocio en componentes de UI puntuales
- consolidar validadores y mappers de reclamos en módulos aislados
- revisar prop drilling y acoplamiento visual entre piezas reutilizables

## 8) Resumen NFR

El proyecto presenta una base sólida para una SPA administrativa con autenticación, rutas protegidas y gestión de datos clave. Los aspectos más fuertes están en la estructura modular y en la gestión de errores superficiales. Los mayores riesgos NFR están en seguridad de sesión, falta de cache y tests en lógica crítica de dominio, y ausencia de CI/CD automatizado.

Si se busca una preparación de producción, el siguiente paso más valioso es: fortalecer tests de autenticación, refresh y reclamos, y agregar un pipeline mínimo de lint + test + build en CI.
