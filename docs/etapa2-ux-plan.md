# Plan Etapa 2: Mejorar la experiencia de uso (UX)

## Objetivo
Optimizar la interfaz y los flujos de trabajo para que el sistema sea usable en el día a día de un negocio familiar, priorizando la velocidad en ventas y reposiciones, y una interfaz amigable para móviles.

## User Review Required
> [!NOTE]
> **Cambio de Enfoque**: Se pasará de una gestión genérica de "Movimientos" a flujos específicos de "Venta Rápida" y "Reposición".
> **UI Mobile-First**: Los botones y controles se agrandarán para facilitar el uso táctil.

## Proposed Changes

### Frontend (React + PWA)

#### 1. Nueva Pantalla: Venta Rápida (`/quick-sale`)
- **Objetivo**: Registrar una salida de stock en el menor tiempo posible.
- **Flujo**:
    1. Buscador grande (autofocus) para SKU o Nombre.
    2. Lista de resultados simplificada (Tarjeta con Nombre, Talle, Color, Precio).
    3. Al seleccionar: Modal o sección expandida para ingresar cantidad (default 1) y confirmar.
    4. Feedback inmediato (Toast Success) y reset del buscador para la siguiente venta.

#### 2. Nueva Pantalla: Reposición Rápida (`/quick-restock`)
- **Objetivo**: Cargar stock nuevo rápidamente (ej. llega un pedido).
- **Flujo**:
    1. Similar a venta, pero registrando ENTRADA.
    2. Permite editar el Costo si cambió.

#### 3. Mejoras en Inventario (`/`)
- **Filtros**: Agregar filtros visuales (Chips o Dropdowns) para:
    - Categoría (Zapatilla, Bota, etc.)
    - Talle
    - Stock Bajo (Toggle)
- **Diseño**: Tarjetas de producto más limpias, destacando Stock y Precio.

#### 4. Navegación y Layout
- **Barra de Navegación Inferior (Mobile)**: Iconos grandes para Home, Venta, Reposición, Historial.
- **Tema**: Ajustes de colores para mejor contraste y jerarquía visual.

### Backend (Spring Boot)
- **Endpoints**:
    - No se requieren cambios estructurales grandes, se reutilizan los endpoints de `MovimientoStock` y `Producto`.
    - Endpoint de búsqueda optimizada si el filtrado en frontend se vuelve lento.

## Verification Plan

### Manual Verification
1. **Flujo Venta**: Abrir `/quick-sale` en modo móvil (DevTools), buscar producto, vender 1 unidad. Verificar descuento de stock.
2. **Flujo Reposición**: Abrir `/quick-restock`, buscar producto, agregar 5 unidades. Verificar aumento de stock.
3. **Filtros**: En Home, filtrar por "Zapatilla" y verificar resultados.
4. **Responsividad**: Verificar que los botones sean tocables (min 44px) en simulación móvil.
