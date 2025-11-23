import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import type { VarianteProducto, MovimientoStock } from '../types';
import { TipoMovimiento, MotivoMovimiento } from '../types';
import { Search, ShoppingCart, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const QuickSale: React.FC = () => {
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<VarianteProducto[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<VarianteProducto | null>(null);
    const [quantity, setQuantity] = useState(1);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length > 1) {
                searchVariants(searchTerm);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const searchVariants = async (query: string) => {
        try {
            const res = await api.get<VarianteProducto[]>(`/productos/variantes/search?q=${query}`);
            setResults(res.data);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const handleSelect = (variant: VarianteProducto) => {
        setSelectedVariant(variant);
        setQuantity(1);
        setResults([]);
        setSearchTerm('');
    };

    const handleConfirmSale = async () => {
        if (!selectedVariant) return;

        try {
            const payload: Partial<MovimientoStock> = {
                variante: selectedVariant,
                tipo: TipoMovimiento.SALIDA,
                cantidad: quantity,
                motivo: MotivoMovimiento.VENTA,
                usuario: 'admin', // MVP
                observaciones: 'Venta Rápida'
            };

            await api.post('/stock/movimientos', payload);
            showToast(`Venta registrada: ${selectedVariant.sku} x${quantity}`, 'success');

            // Reset
            setSelectedVariant(null);
            setQuantity(1);
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Error al registrar venta';
            showToast(msg, 'error');
        }
    };

    return (
        <div className="pb-20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ShoppingCart className="text-blue-600" /> Venta Rápida
            </h2>

            {!selectedVariant ? (
                <div className="relative">
                    <input
                        ref={searchInputRef}
                        className="w-full p-4 text-lg border-2 border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Buscar SKU, Marca, Modelo..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <Search className="absolute right-4 top-4 text-gray-400" size={24} />

                    {results.length > 0 && (
                        <div className="mt-2 bg-white border rounded-lg shadow-xl max-h-[60vh] overflow-y-auto">
                            {results.map(v => (
                                <div
                                    key={v.id}
                                    className="p-4 border-b hover:bg-blue-50 cursor-pointer active:bg-blue-100"
                                    onClick={() => handleSelect(v)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-lg">{v.productoBase?.marca} {v.productoBase?.modelo}</div>
                                            <div className="text-gray-600">{v.color} - Talle {v.talle}</div>
                                            <div className="text-sm text-gray-400 font-mono">{v.sku}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-green-600">${v.precio}</div>
                                            <div className={`text-sm ${v.stockActual > 0 ? 'text-gray-500' : 'text-red-500 font-bold'}`}>
                                                Stock: {v.stockActual}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchTerm.length > 1 && results.length === 0 && (
                        <div className="mt-4 text-center text-gray-500">No se encontraron productos</div>
                    )}
                </div>
            ) : (
                <div className="card bg-blue-50 border-blue-200 animate-fade-in-up">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold">{selectedVariant.productoBase?.marca} {selectedVariant.productoBase?.modelo}</h3>
                            <p className="text-gray-700">{selectedVariant.color} - Talle {selectedVariant.talle}</p>
                            <p className="font-mono text-gray-500">{selectedVariant.sku}</p>
                        </div>
                        <button
                            onClick={() => setSelectedVariant(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            Cancelar
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <button
                            className="w-12 h-12 rounded-full bg-white border shadow flex items-center justify-center text-2xl font-bold active:bg-gray-100"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            -
                        </button>
                        <div className="flex-1 text-center">
                            <div className="text-sm text-gray-500">Cantidad</div>
                            <div className="text-3xl font-bold">{quantity}</div>
                        </div>
                        <button
                            className="w-12 h-12 rounded-full bg-white border shadow flex items-center justify-center text-2xl font-bold active:bg-gray-100"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            +
                        </button>
                    </div>

                    <div className="mb-6 text-center">
                        <div className="text-gray-500">Total</div>
                        <div className="text-4xl font-bold text-blue-600">${selectedVariant.precio * quantity}</div>
                    </div>

                    <button
                        className="w-full py-4 bg-blue-600 text-white rounded-xl text-xl font-bold shadow-lg active:bg-blue-700 flex items-center justify-center gap-2"
                        onClick={handleConfirmSale}
                    >
                        <Check size={28} /> Confirmar Venta
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuickSale;
