# Zapatería Inventario PWA

Sistema de gestión de inventario para zapatería familiar. Monorepo con Backend Spring Boot y Frontend React PWA.

## Estructura
- `/backend`: API REST con Spring Boot (Java 21).
- `/frontend`: PWA con React, TypeScript y Vite.
- `/docs`: Documentación del proyecto.

## Requisitos
- Java 21 (JDK)
- Node.js (v18+)
- PostgreSQL

## Configuración Local

### 1. Base de Datos
Crear una base de datos PostgreSQL llamada `zapateria_db`:
```sql
CREATE DATABASE zapateria_db;
```
El usuario/password por defecto en `application.properties` es `postgres`/`postgres`. Modificar en `backend/src/main/resources/application.properties` si es necesario.

### 2. Backend
Desde la carpeta raíz o `/backend`:
```bash
cd backend
# Ejecutar con Maven Wrapper (si se genera) o Maven instalado
mvn spring-boot:run
```
La API estará disponible en `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend
Desde la carpeta `/frontend`:
```bash
cd frontend
npm install
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

## Funcionalidades MVP
- **Inventario**: Listado de productos con búsqueda.
- **Alta**: Creación de productos y variantes (talle/color).
- **Movimientos**: Registro de entradas, salidas y ajustes de stock.
- **Alertas**: Visualización de productos con stock bajo.
- **PWA**: Instalable en dispositivos móviles.
