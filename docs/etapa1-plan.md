# Plan Etapa 1: Endurecer el MVP para uso real

## Objetivo
Transformar el MVP actual en un sistema confiable y robusto, implementando validaciones críticas, trazabilidad de operaciones, manejo de errores estandarizado y feedback claro al usuario.

## User Review Required
> [!IMPORTANT]
> **Cambios en Modelo de Datos**: Se agregarán campos para auditoría (usuario, motivo) en movimientos de stock. Esto podría requerir migración de datos si ya existen datos en producción (asumimos ambiente dev/test por ahora).
> **Validaciones Estrictas**: Se bloquearán operaciones que antes permitían stock negativo o datos incompletos.

## Proposed Changes

### Backend (Spring Boot)

#### Validaciones de Negocio
- **Stock**: Impedir movimientos que dejen el stock en negativo (salvo configuración explícita, por defecto bloqueado).
- **Producto**:
    - SKU único (validación en DB y Service).
    - Precio y Costo >= 0.
    - Campos obligatorios: Nombre, SKU, Precio.
- **Movimientos**:
    - Motivo de ajuste obligatorio para ajustes manuales.
    - Registro de usuario que realiza la acción (aunque sea un usuario "default" por ahora si no hay auth completa).

#### Auditoría y Trazabilidad
- **Entidades**:
    - Agregar campos `createdBy`, `createdAt`, `reason` en entidad de Movimiento/Transacción.
    - (Opcional Etapa 1) Tabla de historial de cambios de precios/costos.

#### Manejo de Errores (GlobalExceptionHandler)
- Crear estructura estándar de respuesta de error JSON:
  ```json
  {
    "timestamp": "...",
    "status": 400,
    "error": "Bad Request",
    "message": "El SKU ya existe",
    "path": "/api/products"
  }
  ```
- Mapear excepciones de negocio (ej. `InsufficientStockException`, `DuplicateSkuException`) a códigos HTTP adecuados (400, 409).

#### Tests
- Unit tests para `ProductService` (validaciones de creación/edición).
- Unit tests para `StockService` (validación de stock suficiente).
- Integration test simple para flujo de creación de producto.

### Frontend (React + PWA)

#### UI/UX para Errores y Confirmaciones
- **Feedback Visual**:
    - Mostrar mensajes de error del backend en Toasts/Snackbars (no solo `console.log`).
    - Validaciones de formulario en tiempo real (React Hook Form o similar) para campos obligatorios y números positivos.
- **Confirmaciones**:
    - Modal de confirmación para acciones destructivas (eliminar producto) o críticas (ajuste de stock grande).

## Verification Plan

### Automated Tests
- Ejecutar `mvn test` en backend para verificar nuevas validaciones.
- Verificar que los tests de stock negativo fallen como se espera.

### Manual Verification
1. **Validación SKU**: Intentar crear dos productos con el mismo SKU -> Debe mostrar error claro en UI.
2. **Stock Negativo**: Intentar registrar una salida mayor al stock actual -> Debe bloquear y mostrar error.
3. **Campos Obligatorios**: Intentar guardar producto sin precio -> Debe marcar campo en rojo.
4. **Auditoría**: Realizar un movimiento y verificar en DB (o historial UI) que aparezca fecha y motivo.
