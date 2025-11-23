# Plan de Implementación - Etapa 3: Funcionalidades de Valor Real

## Objetivo
Implementar un conjunto de funcionalidades avanzadas para transformar el MVP en una herramienta de gestión completa y eficiente.

## Estrategia de Desarrollo
Se utilizarán ramas separadas para cada feature, fusionando a `dev` tras la verificación.
- `feature/excel-import`
- `feature/excel-export`
- `feature/barcode`
- `feature/roles`
- `feature/reportes`

## 1. Importación y Exportación Excel (`feature/excel-import`, `feature/excel-export`)

### Backend
- **Dependencia**: `apache-poi` para manejo de .xlsx.
- **Endpoints**:
    - `POST /api/productos/import`: Recibe archivo Excel. Valida formato, marcas y categorías. Retorna resumen (creados, errores).
    - `GET /api/productos/import/template`: Descarga plantilla vacía.
    - `GET /api/productos/export`: Descarga inventario actual en Excel.
- **Servicios**:
    - `ExcelService`: Lógica de parsing y generación.
    - `ProductoService`: Método `bulkCreate` para inserción masiva transaccional.

### Frontend
- **Componentes**:
    - `ExcelUpload`: Zona de drop o botón de carga. Muestra errores de validación si los hay.
    - Botón "Descargar Plantilla".
    - Botón "Exportar Inventario" en Header de Home.

## 2. Lector de Código de Barras (`feature/barcode`)

### Backend
- Sin cambios mayores (búsqueda por SKU ya existe).

### Frontend
- **Modo USB (Escáner físico)**:
    - En `QuickSale` y `QuickRestock`, asegurar que el input de búsqueda mantenga el foco (`autoFocus`, `onBlur` prevent default opcional).
    - Detectar evento "Enter" (enviado por el escáner) para seleccionar automáticamente el producto si hay coincidencia única.
- **Modo Cámara (PWA)**:
    - Nueva librería: `react-qr-code` o `html5-qrcode`.
    - Botón "Escanear con Cámara" en inputs de búsqueda.
    - Abre modal con vista de cámara, detecta código y llena el input.

## 3. Usuarios y Roles (`feature/roles`)

### Backend
- **Entidades**:
    - `Usuario`: id, username, password (hash), nombre, rol (ENUM: ADMIN, OPERADOR).
- **Seguridad**:
    - Implementar `Spring Security` básico con JWT o Session (para MVP, JWT es más limpio para PWA).
    - `AuthController`: `login`, `register` (solo admin).
    - Proteger endpoints:
        - `ADMIN`: Crear/Editar/Borrar productos, Ajustes, Ver Reportes Financieros.
        - `OPERADOR`: Venta Rápida, Reposición, Ver Inventario.

### Frontend
- **Contexto**: `AuthContext` (user, token, login, logout).
- **Vistas**:
    - `Login`: Pantalla inicial si no hay sesión.
    - Protección de Rutas (`ProtectedRoute`): Redirigir si no tiene rol adecuado.
- **UI**:
    - Ocultar botones de "Editar", "Eliminar" y "Ajustes" para Operadores.

## 4. Reportes Simples (`feature/reportes`)

### Backend
- **Endpoints (`ReporteController`)**:
    - `GET /api/reportes/ventas-ranking`: Top productos más vendidos (por cantidad).
    - `GET /api/reportes/rotacion`: Productos con más movimientos vs stock promedio.
    - `GET /api/reportes/inmovilizados`: Productos sin salidas en X días.
- **Consultas**:
    - Queries nativas o JPQL agregadas en `MovimientoStockRepository`.

### Frontend
- **Librería**: `recharts` para gráficos visuales.
- **Página `Reports`**:
    - Gráfico de Barras: Ranking de Ventas.
    - Tabla: Productos Inmovilizados (con alerta visual).
    - KPIs: Ventas totales del mes, Items vendidos.

## Plan de Trabajo
1. **Configuración**: Crear ramas y estructura base.
2. **Excel**: Implementar Import/Export (Valor alto, complejidad media).
3. **Roles**: Implementar Seguridad (Crítico para separar funciones).
4. **Barcode**: Mejorar UX de captura (Valor alto para agilidad).
5. **Reportes**: Visualización de datos (Valor estratégico).
