export const Categoria = {
    ZAPATILLA: 'ZAPATILLA',
    ZAPATILLA_CASUAL: 'ZAPATILLA_CASUAL',
    URBANO: 'URBANO',
    SANDALIA: 'SANDALIA',
    ZUECO: 'ZUECO',
    MOCASIN: 'MOCASIN',
    CHINELA: 'CHINELA',
    BOTA: 'BOTA',
    BORCEGO: 'BORCEGO',
    ZAPATO_VESTIR: 'ZAPATO_VESTIR',
    NAUTICO: 'NAUTICO',
    COMFORT: 'COMFORT',
    OUTDOOR: 'OUTDOOR',
    COLEGIAL: 'COLEGIAL',
    ZAPATO: 'ZAPATO',
    CARTERA: 'CARTERA',
    BILLETERA: 'BILLETERA',
    DEPORTIVO: 'DEPORTIVO',
    OTRO: 'OTRO'
} as const;
export type Categoria = typeof Categoria[keyof typeof Categoria];

export const Genero = {
    HOMBRE: 'HOMBRE',
    MUJER: 'MUJER',
    NINO: 'NINO',
    UNISEX: 'UNISEX'
} as const;
export type Genero = typeof Genero[keyof typeof Genero];

export const TipoMovimiento = {
    ENTRADA: 'ENTRADA',
    SALIDA: 'SALIDA',
    AJUSTE: 'AJUSTE'
} as const;
export type TipoMovimiento = typeof TipoMovimiento[keyof typeof TipoMovimiento];

export const MotivoMovimiento = {
    COMPRA: 'COMPRA',
    VENTA: 'VENTA',
    MERMA: 'MERMA',
    DEVOLUCION: 'DEVOLUCION',
    INVENTARIO: 'INVENTARIO'
} as const;
export type MotivoMovimiento = typeof MotivoMovimiento[keyof typeof MotivoMovimiento];

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
