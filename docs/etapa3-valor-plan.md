# Plan de Implementación - Etapa 3: Features de Valor

## Objetivo
Implementar funcionalidades que aporten valor inmediato al negocio: exportación de datos a Excel, soporte para lectores de código de barras y reportes básicos.

## User Review Required
> [!NOTE]
> Se asume que el lector de código de barras funciona como un teclado (HID). No se requiere integración con hardware específico, solo asegurar que el foco y la entrada de texto funcionen correctamente.

## Proposed Changes

### Backend
#### [MODIFY] [pom.xml](file:///c:/Users/benja/OneDrive/Desktop/Takane/Codigo/zapateria-inventario/backend/pom.xml)
- Agregar dependencia `apache-poi` para generación de Excel.

#### [NEW] [ExcelService.java](file:///c:/Users/benja/OneDrive/Desktop/Takane/Codigo/zapateria-inventario/backend/src/main/java/com/zapateria/inventario/service/ExcelService.java)
- Servicio para generar archivos Excel (.xlsx) a partir de listas de objetos.
- Métodos: `generarReporteInventario()`, `generarReporteMovimientos()`.

#### [NEW] [ReporteController.java](file:///c:/Users/benja/OneDrive/Desktop/Takane/Codigo/zapateria-inventario/backend/src/main/java/com/zapateria/inventario/controller/ReporteController.java)
- Endpoints para descargar reportes:
    - `GET /api/reportes/inventario/excel`
    - `GET /api/reportes/movimientos/excel`

### Frontend
#### [MODIFY] [Home.tsx](file:///c:/Users/benja/OneDrive/Desktop/Takane/Codigo/zapateria-inventario/frontend/src/pages/Home.tsx)
- Agregar botón "Exportar Excel" en la barra de herramientas.

#### [MODIFY] [Movements.tsx](file:///c:/Users/benja/OneDrive/Desktop/Takane/Codigo/zapateria-inventario/frontend/src/pages/Movements.tsx)
- Agregar botón "Exportar Historial" en la pestaña de historial.

#### [MODIFY] [QuickSale.tsx](file:///c:/Users/benja/OneDrive/Desktop/Takane/Codigo/zapateria-inventario/frontend/src/pages/QuickSale.tsx)
- Asegurar que el input de búsqueda mantenga el foco para escaneo continuo.
- Detectar "Enter" para seleccionar automáticamente el primer resultado si es coincidencia exacta (comportamiento típico de scanner).

#### [NEW] [Reports.tsx](file:///c:/Users/benja/OneDrive/Desktop/Takane/Codigo/zapateria-inventario/frontend/src/pages/Reports.tsx)
- Nueva página de reportes simples.
- Gráficos básicos (usando `recharts` o similar, o solo tablas por ahora para MVP).
- "Top 5 Más Vendidos", "Stock Bajo Crítico".

## Verification Plan

### Automated Tests
- **Backend**: Unit tests para `ExcelService` verificando que genera un byte array no vacío.
- **Frontend**: Build check.

### Manual Verification
1. **Excel**:
   - Clic en "Exportar Excel" en Inventario.
   - Abrir archivo descargado y verificar columnas (SKU, Marca, Modelo, Stock).
2. **Barcode**:
   - En "Venta Rápida", escanear un código (o escribir SKU y dar Enter).
   - Verificar que se selecciona el producto sin necesidad de clic adicional.
3. **Reportes**:
   - Navegar a `/reports` (o nueva sección).
   - Verificar visualización de datos.
