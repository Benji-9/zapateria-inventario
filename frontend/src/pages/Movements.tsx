import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { VarianteProducto, TipoMovimiento, MotivoMovimiento, MovimientoStock } from '../types';
import { Search, Save } from 'lucide-react';

const Movements: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [variantes, setVariantes] = useState<VarianteProducto[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<VarianteProducto | null>(null);

    const [movimiento, setMovimiento] = useState<Partial<MovimientoStock>>({
        tipo: TipoMovimiento.SALIDA,
        cantidad: 1,
        motivo: MotivoMovimiento.VENTA,
        observaciones: '',
        usuario: 'admin' // Hardcoded for MVP
    });

    useEffect(() => {
        if (searchTerm.length > 2) {
            // In a real app, we would hit a search endpoint.
            // For MVP, we might fetch all and filter client side if dataset is small, 
            // or use the product search and then get variants.
            // Let's assume we have a way to search variants or just fetch all for now.
            // Ideally backend should have /api/variantes/search?q=...
            // I implemented `searchVariantes` in Service but not Controller endpoint explicitly for search query?
            // Wait, ProductoController has `getAllProductos`.
            // Let's fetch all products and their variants? Too heavy.
            // I'll add a simple search endpoint to backend or just fetch all variants if not too many.
            // Given I didn't add a specific search endpoint for variants in controller (only getAllProductos),
            // I will fetch all products, then fetch variants for them? No, that's N+1.
            // I'll assume for MVP we can fetch all products and filter, but selecting a variant requires drilling down.
            // BETTER MVP APPROACH: Input SKU directly or select from a list.
            // Let's implement a simple "Find by SKU" or "Find by Product Name" that filters a local list of ALL variants (if small) or products.
            // I'll fetch all products and let user select product -> variant.
        }
    }, [searchTerm]);

    // Fetch all products to select from (MVP shortcut)
    const [allProducts, setAllProducts] = useState<any[]>([]);
    useEffect(() => {
        api.get('/productos').then(res => setAllProducts(res.data));
    }, []);

    const handleSearch = async () => {
        // Mock search: filter allProducts
        // Ideally we select a product, then a variant.
    };

    const handleSubmit = async () => {
        if (!selectedVariant || !movimiento.cantidad) return;

        try {
            const payload = {
                ...movimiento,
                variante: selectedVariant
            };
            await api.post('/stock/movimientos', payload);
            alert('Movimiento registrado con éxito');
            setMovimiento({ ...movimiento, cantidad: 1, observaciones: '' });
            setSelectedVariant(null);
        } catch (error) {
            console.error('Error registering movement:', error);
            alert('Error al registrar movimiento');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Registrar Movimiento</h2>

            {/* Variant Selection */}
            <div className="card mb-4">
                <h3 className="font-semibold mb-2">1. Seleccionar Producto</h3>
                {!selectedVariant ? (
                    <div>
                        <div className="relative mb-2">
                            <input
                                className="input pl-10"
                                placeholder="Buscar por marca o modelo..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>
                        <div className="max-h-60 overflow-y-auto border rounded">
                            {allProducts
                                .filter(p => (p.marca + ' ' + p.modelo).toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(p => (
                                    <div key={p.id} className="p-2 border-b hover:bg-gray-50 cursor-pointer" onClick={() => {
                                        // Fetch variants for this product
                                        api.get(`/productos/${p.id}/variantes`).then(res => {
                                            setVariantes(res.data);
                                            // If only one, select it? Or show list.
                                            // Let's show list below.
                                        });
                                    }}>
                                        {p.marca} {p.modelo}
                                    </div>
                                ))
                            }
                        </div>
                        {variantes.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">Seleccione variante:</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {variantes.map(v => (
                                        <div key={v.id} className="p-2 border rounded hover:bg-blue-50 cursor-pointer flex justify-between" onClick={() => setSelectedVariant(v)}>
                                            <span>{v.color} - {v.talle}</span>
                                            <span className="text-xs text-gray-500">Stock: {v.stockActual}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded border border-blue-200">
                        <div>
                            <span className="font-bold block">{selectedVariant.sku}</span>
                            <span>{selectedVariant.color} - Talle {selectedVariant.talle}</span>
                        </div>
                        <button className="text-red-500 text-sm underline" onClick={() => setSelectedVariant(null)}>Cambiar</button>
                    </div>
                )}
            </div>

            {/* Movement Details */}
            <div className="card">
                <h3 className="font-semibold mb-2">2. Detalles del Movimiento</h3>

                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <div className="flex gap-2 mb-3">
                    {Object.values(TipoMovimiento).map(t => (
                        <button
                            key={t}
                            className={`flex-1 py-2 rounded border ${movimiento.tipo === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`}
                            onClick={() => setMovimiento({ ...movimiento, tipo: t })}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <select
                    className="input mb-3"
                    value={movimiento.motivo}
                    onChange={e => setMovimiento({ ...movimiento, motivo: e.target.value as MotivoMovimiento })}
                >
                    {Object.values(MotivoMovimiento).map(m => <option key={m} value={m}>{m}</option>)}
                </select>

                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                    type="number"
                    className="input mb-3"
                    min="1"
                    value={movimiento.cantidad}
                    onChange={e => setMovimiento({ ...movimiento, cantidad: Number(e.target.value) })}
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                    className="input mb-4"
                    rows={2}
                    value={movimiento.observaciones}
                    onChange={e => setMovimiento({ ...movimiento, observaciones: e.target.value })}
                />

                <button
                    className="btn btn-primary w-full py-3 text-lg"
                    onClick={handleSubmit}
                    disabled={!selectedVariant}
                >
                    <Save className="mr-2" /> Confirmar Movimiento
                </button>
            </div>
        </div>
    );
};

export default Movements;
