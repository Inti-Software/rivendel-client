# 02. Funcionalidad, rutas y uso principal

## 1) Alcance funcional del sistema

La aplicación es un cliente para gestión de conciliaciones legales y administrativos. El usuario principal resuelve consultas de reclamos, administra partes y patrocinantes, gestiona credenciales de usuario y eventualmente sincroniza eventos con Google Calendar.

El dominio funcional visible en la UI se puede resumir en estas áreas:

- Autenticación y sesión
- Registro de patrocinantes
- Registro de partes / involucrados
- Casos de reclamo
- Comentarios/condiciones para acuerdo
- Configuración de usuario
- Sincronización con Google Calendar

## 2) Mapa de rutas de la aplicación

La app está montada con `BrowserRouter` y rutas protegidas bajo `ProtectedRoute`.

### Rutas públicas

- `/` → pantalla de login (`App.jsx` → `Login`)

### Rutas protegidas

- `/user/form` → configuración del usuario
- `/patrocinantes` → listado de patrocinantes
- `/patrocinantes/new` → alta de patrocinante
- `/patrocinantes/edit/:id` → edición de patrocinante
- `/partes` → listado de partes
- `/partes/new` → alta de parte
- `/partes/edit/:id` → edición de parte
- `/reclamos` → listado de reclamos
- `/reclamos/new` → alta de reclamo
- `/reclamos/edit/:id` → edición de reclamo
- `/google-calendar/callback` → callback OAuth de Google Calendar

### Estructura funcional de rutas

```mermaid
flowchart LR
    A[/] --> B[Login]
    B --> C{Autenticado?}
    C -- Sí --> D[Layout + menu]
    D --> E[Patrocinantes]
    D --> F[Partes]
    D --> G[Reclamos]
    D --> H[Usuario]
    D --> I[Google Calendar Callback]
    C -- No --> B
```

## 3) Páginas y flujos principales

### 3.1 Login

Componente: `src/components/Login/components/Login.jsx`

Funcionalidad:

- Valida email con regex.
- Valida contraseña obligatoria y longitud mínima de 6 caracteres.
- Envía credenciales al backend usando `login()`.
- Si la respuesta es válida, guarda sesión y redirige a `/reclamos`.
- Si falla, muestra error local en el formulario.

Estado de formulario:

- `email`
- `password`
- `showPassword`
- `loading`
- `error`
- `redirect`

Archivo asociado:

- `src/components/Login/eventHandlers.js`
- `src/components/Login/hooks/useForm.js`

### 3.2 Layout y navegación

Componente: `src/components/Layout/Layout.jsx`

Incluye:

- barra de navegación con links a patrocinantes, partes y reclamos
- botón de logout
- acceso a perfil del usuario
- onboarding con `driver.js`

La navegación usa `NavLink` y `Link` de React Router, con estados visuales por ruta activa.

### 3.3 Patrocinantes

Rutas:

- `/patrocinantes`
- `/patrocinantes/new`
- `/patrocinantes/edit/:id`

Entidad:

- `src/api/repositories/patrocinantes.js`
- `src/components/Patrocinantes/components/Form.jsx`
- `src/components/Patrocinantes/components/List.jsx`

Funcionalidad:

- alta, edición, listado y borrado
- búsqueda por nombre/matricula
- paginación con `Grid`
- validación de campos básicos: nombre, domicilio, localidad, matrícula

### 3.4 Partes

Rutas:

- `/partes`
- `/partes/new`
- `/partes/edit/:id`

Consta de una UI de listado y un formulario con:

- nombre
- tipo de documento
- número documento
- CUIL/CUIT
- domicilio
- localidad
- patrocinante asociado
- `esApoderado`

El listado usa `Grid` con búsqueda por nombre o CUIL/CUIT.

### 3.5 Reclamos

Rutas:

- `/reclamos`
- `/reclamos/new`
- `/reclamos/edit/:id`

Es el módulo más complejo del producto. Tiene lógica de:

- número de reclamo
- rubros y resolución
- fecha/hora de inicio
- hora de fin y audiencia
- partes involucradas
- cláusulas y generación de actas
- estados de comparecencia y multado

Archivos relevantes:

- `src/components/Reclamos/components/Form.jsx`
- `src/components/Reclamos/components/List.jsx`
- `src/components/Reclamos/acta-builder.js`
- `src/components/Reclamos/acta.utils.js`
- `src/components/Reclamos/eventHandlers.utils.js`
- `src/components/Reclamos/mappers.js`
- `src/components/Reclamos/numeros-a-letras.js`
- `src/components/Reclamos/tiptap-to-pdfmake.js`

### 3.6 Usuario y configuración

Ruta:

- `/user/form`

Componente: `src/components/Users/components/Form.jsx`

Permite:

- actualizar nombre del usuario
- cambiar número de habilitación
- cambiar contraseña
- conectar y desconectar Google Calendar

## 4) Componentes reutilizables y patrones funcionales

### 4.1 Grid y listado genérico

Componente central: `src/components/Grid/components/Grid.jsx`

Supone un patrón de uso basado en:

- `columnBuilder({ data, onDelete })`
- `endpoints` con `findAll`, `delete`
- paginación por `currentPage`
- búsqueda con debounce de 300ms
- botón para editar/eliminar por tipo de columa

Es la base de listados de Partes, Patrocinantes y Reclamos.

### 4.2 SearchDialog

El proyecto implementa un diálogo reutilizable de búsqueda con templates y resultados tabulares.

Componentes:

- `src/components/SearchDialog/components/ModalSearchDialog.jsx`
- `src/components/SearchDialog/components/Content.jsx`
- `src/components/SearchDialog/components/TabularResults.jsx`
- `src/components/SearchDialog/components/TemplateResults.jsx`

Se usa para buscar relaciones entre entidades y completar formularios.

### 4.3 Google Calendar

Ruta de callback: `/google-calendar/callback`

Flujo:

1. El usuario hace click en `Button` de Google Calendar.
2. `useGoogleCalendar` llama a `GoogleCalendar.authUrl()`
3. El backend devuelve una URL de OAuth.
4. El navegador redirige a Google.
5. La respuesta vuelve a la aplicación con `?google_calendar=connected|error`
6. `Callback` actualiza el store `calendar` y navega al returnUrl original.

## 5) Casos de uso principal

### Caso de uso 1: iniciar sesión

- El usuario ingresa email y contraseña.
- El frontend valida formato y requisitos.
- Se invoca `publicHttp.post('/auth/login')`.
- Si el backend responde OK, la UI almacena sesión y redirige.
- Si falla, se muestra el error asociado.

### Caso de uso 2: restaurar sesión al recargar

- `main.jsx` ejecuta `initializeAuth()`.
- El cliente llama a `/auth/refresh`.
- Si es exitoso, rehidrata la app con token y perfil del usuario.
- Si falla, limpia la sesión y envia al login.

### Caso de uso 3: listar y buscar registros

- El usuario abre un módulo (partes, patrocinantes, reclamos).
- El grid llama a `findAll({ query, currentPage, recordsPerPage })`.
- Se renderiza el listado y, si hay más páginas, se muestran controles de paginación.
- La búsqueda se debounces para no saturar el backend.

### Caso de uso 4: crear o editar un reclamo

- Se usa el formulario de reclamo con datos complejos.
- El usuario selecciona resolución, fechas, partes implicadas y posibles cláusulas.
- El formulario genera payload y lo envía a `Reclamos.create` o `Reclamos.update`.
- La UI notifica éxito y redirige.

### Caso de uso 5: conectar Google Calendar

- El usuario accede a perfil y hace clic en “Conectar”.
- La app solicita una URL OAuth al backend.
- Luego del callback, se marca el estado `googleCalendarConnected=true`.

## 6) Tareas más críticas desde el punto de vista funcional

- Validación de acceso y autorización del usuario.
- Integridad de datos en reclamos, partes y patrocinantes.
- Generación de actas con contenido legal y PDF.
- Manejo de errores del backend y estados de red.
- Conexión con Google Calendar y persistencia del estado.

## 7) Observaciones sobre tipos y tipado

Si bien la app se desarrolló principalmente en JavaScript/JSX, hay señales de una intención de typing y componentes genéricos. Sin embargo, la base real del proyecto es:

- JS para lógica de negocio
- JSX para UI
- Entidad de datos como objetos planos
- Ninguna capa de TS formal en la estructura actual

Esto implica menos seguridad de tipos y más dependencia en tests y validaciones manuales en runtime.

## 8) Resumen funcional

La app está construida como un CRM/gestor administrativo para conciliaciones. Se apoya en un patrón de CRUD modular, repositorios por entidad y un sistema de validación y navegación de usuario. El núcleo más valioso y sensible del negocio está concentrado en el módulo de reclamos y en la generación documental asociada.
