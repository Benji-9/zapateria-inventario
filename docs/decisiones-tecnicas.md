# Documento de Decisiones Técnicas

## 1. Stack Tecnológico

### Frontend: React + TypeScript + Vite
- **Decisión**: Utilizar React con TypeScript y Vite como bundler.
- **Por qué**:
  - **React**: Ecosistema maduro, componentes reutilizables, ideal para interfaces dinámicas.
  - **TypeScript**: Tipado estático que reduce errores en tiempo de desarrollo, crucial para manejar modelos de datos de inventario y evitar errores de "undefined".
  - **Vite**: Velocidad de desarrollo superior a Create React App, build optimizado.
- **Alternativas Descartadas**:
  - *Angular*: Curva de aprendizaje más alta, excesivo para un MVP rápido.
  - *Vue*: Buena opción, pero React tiene mayor adopción y librerías disponibles.

### Backend: Spring Boot (Java 21)
- **Decisión**: Spring Boot 3.x con Java 21.
- **Por qué**:
  - Robustez y facilidad para crear APIs RESTful.
  - **Spring Data JPA**: Simplifica enormemente la capa de acceso a datos.
  - **Java 21**: LTS más reciente, mejor performance y features modernas (Records, Pattern Matching).
- **Alternativas Descartadas**:
  - *Node.js (Express/NestJS)*: Buena opción, pero Spring Boot ofrece un tipado y estructura más rígida "out-of-the-box" que beneficia la mantenibilidad a largo plazo en sistemas empresariales/de gestión.
  - *Python (Django/FastAPI)*: Rápido desarrollo, pero Java es estándar en backend corporativo y ofrece excelente manejo de concurrencia y tipos.

### Base de Datos: PostgreSQL
- **Decisión**: PostgreSQL.
- **Por qué**:
  - Base de datos relacional robusta, open source.
  - Soporte excelente para integridad referencial (clave para inventarios).
  - Escalabilidad futura.
- **Alternativas Descartadas**:
  - *MySQL*: Similar, pero Postgres tiene mejores features avanzadas y conformidad SQL.
  - *MongoDB*: No recomendado para inventarios donde la consistencia transaccional y las relaciones (Producto -> Variante -> Movimiento) son críticas.

### Estado Global: Zustand
- **Decisión**: Zustand.
- **Por qué**:
  - Minimalista, sin boilerplate (a diferencia de Redux).
  - API simple basada en hooks.
  - Suficiente para manejar el estado de sesión, carrito o filtros globales.
- **Alternativas Descartadas**:
  - *Redux Toolkit*: Demasiado complejo para el alcance actual.
  - *Context API*: Puede tener problemas de performance con muchos re-renders si no se optimiza bien.

## 2. Arquitectura

### Monorepo
- Se mantiene todo el código en un solo repositorio para facilitar la gestión de versiones y despliegues coordinados del frontend y backend.

### PWA (Progressive Web App)
- **Requisito**: La app debe ser instalable y funcionar bien en móviles.
- **Implementación**: Service Workers para caché, Manifest.json para instalación en home screen. Permite a los empleados usar sus propios celulares o una tablet en el local.

## 3. Modelo de Datos
- Se separó `ProductoBase` de `VarianteProducto` para evitar duplicidad de datos (ej: no repetir "Nike Air Max" para cada talle).
- `MovimientoStock` es inmutable. No se edita el stock directamente, se calcula o se ajusta mediante movimientos para tener trazabilidad total (auditoría).
