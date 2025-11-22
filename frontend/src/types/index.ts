export enum Categoria {
    ZAPATILLA = 'ZAPATILLA',
    BOTA = 'BOTA',
    SANDALIA = 'SANDALIA',
    ZAPATO_VESTIR = 'ZAPATO_VESTIR',
    DEPORTIVO = 'DEPORTIVO',
    OTRO = 'OTRO'
}

export enum Genero {
    HOMBRE = 'HOMBRE',
    MUJER = 'MUJER',
    NINO = 'NINO',
    UNISEX = 'UNISEX'
}

export enum TipoMovimiento {
    ENTRADA = 'ENTRADA',
    SALIDA = 'SALIDA',
    AJUSTE = 'AJUSTE'
}

export enum MotivoMovimiento {
    COMPRA = 'COMPRA',
    VENTA = 'VENTA',
    MERMA = 'MERMA',
    DEVOLUCION = 'DEVOLUCION',
    INVENTARIO = 'INVENTARIO'
}

export interface ProductoBase {
    id?: number;
    marca: string;
    modelo: string;
    categoria: Categoria;
    genero: Genero;
    temporada?: string;
    proveedor?: string;
}

export interface VarianteProducto {
    id?: number;
    productoBase?: ProductoBase; // Optional when creating if we pass ID separately, but usually full object in response
    productoBaseId?: number; // For creation
    color: string;
    talle: string;
    sku: string;
    costo: number;
    precio: number;
    stockActual: number;
    stockMinimo: number;
    ubicacion?: string;
}

export interface MovimientoStock {
    id?: number;
    variante?: VarianteProducto;
    varianteId?: number; // For creation
    tipo: TipoMovimiento;
    cantidad: number;
    fechaHora?: string;
    usuario?: string;
    motivo: MotivoMovimiento;
    observaciones?: string;
}
