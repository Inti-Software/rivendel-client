# Documentación técnica del proyecto

## Tabla de contenidos

1. [01. Arquitectura](./01-arquitectura.md)
   - stack tecnológico
   - estructura del proyecto
   - flujo de arranque
   - autenticación y datos
   - diagrama Mermaid de arquitectura

2. [02. Funcionalidad](./02-funcional.md)
   - páginas y rutas
   - flujos de negocio principales
   - casos de uso
   - componentes reutilizables
   - mapeo funcional por módulo

3. [03. NFRs y calidad](./03-nfrs.md)
   - seguridad
   - rendimiento
   - estrategia de cacheo
   - testing
   - CI/CD y recomendaciones

## Resumen ejecutivo

Este repositorio corresponde a una SPA de gestión para conciliaciones, con módulos de autenticación, mantenimiento de partes/patrocinantes/reclamos, configuración de usuario y sincronización con Google Calendar. La aplicación combina una estructura modular con repositorios y stores simples, y la mayor concentración de valor funcional y riesgo está en los procesos de reclamos y autenticación.

## Cómo usar esta documentación

- Revisar [01-arquitectura.md](./01-arquitectura.md) para entender el diseño técnico del cliente.
- Revisar [02-funcional.md](./02-funcional.md) para comprender la interacción de usuarios y requisitos funcionales.
- Revisar [03-nfrs.md](./03-nfrs.md) para evaluar robustez, seguridad, rendimiento y pipeline operativo.
