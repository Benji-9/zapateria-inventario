import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import type { VarianteProducto, MovimientoStock } from '../types';
import { TipoMovimiento, MotivoMovimiento } from '../types';
import { Search, PackagePlus, Check, ScanBarcode } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import BarcodeScanner from '../components/BarcodeScanner';

const QuickRestock: React.FC = () => {
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<VarianteProducto[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<VarianteProducto | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [showScanner, setShowScanner] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Debounce search
    useEffect(() => {
        if (searchTerm.length > 2) {
            const delayDebounceFn = setTimeout(() => {
                searchVariants(searchTerm);
            }, 300);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setResults([]);
        }
    }, [searchTerm]);

    const searchVariants = async (query: string) => {
        try {
            const res = await api.get<VarianteProducto[]>(`/productos/variantes/search?q=${query}`);
            setResults(res.data);
            // Auto-select if exact SKU match and unique result
            if (res.data.length === 1 && res.data[0].sku.toLowerCase() === query.toLowerCase()) {
                handleSelect(res.data[0]);
            }
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

    const handleConfirmRestock = async () => {
        if (!selectedVariant) return;

        try {
            const payload: Partial<MovimientoStock> = {
                variante: selectedVariant,
                tipo: TipoMovimiento.ENTRADA,
                cantidad: quantity,
                motivo: MotivoMovimiento.COMPRA,
                usuario: 'admin', // MVP
                observaciones: 'Reposición Rápida'
            };

            await api.post('/stock/movimientos', payload);
            showToast(`Stock actualizado: ${selectedVariant.sku} +${quantity}`, 'success');

            // Reset
            setSelectedVariant(null);
            setQuantity(1);
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Error al registrar reposición';
            showToast(msg, 'error');
        }
    };

    return (
        <div className="pb-20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <PackagePlus className="text-green-600" /> Reposición Rápida
            </h2>

            {!selectedVariant ? (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex gap-2 mb-4">
                        <div className="relative flex-1">
                            <input
                                ref={searchInputRef}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Buscar SKU, Marca, Modelo..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        </div>
                        <button
                            onClick={() => setShowScanner(true)}
                            className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                            title="Escanear código de barras"
                        >
                            <ScanBarcode size={24} />
                        </button>
                    </div>

                    {results.length > 0 && (
                        <div className="bg-white border rounded-lg shadow-xl max-h-[60vh] overflow-y-auto">
                            {results.map(v => (
                                <div
                                    key={v.id}
                                    className="p-4 border-b hover:bg-green-50 cursor-pointer active:bg-green-100"
                                    onClick={() => handleSelect(v)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-lg">{v.productoBase?.marca} {v.productoBase?.modelo}</div>
                                            <div className="text-gray-600">{v.color} - Talle {v.talle}</div>
                                            <div className="text-sm text-gray-400 font-mono">{v.sku}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm ${v.stockActual > 0 ? 'text-gray-500' : 'text-red-500 font-bold'}`}>
                                                Stock actual: {v.stockActual}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchTerm.length > 2 && results.length === 0 && (
                        <div className="mt-4 text-center text-gray-500">No se encontraron productos</div>
                    )}
                </div>
            ) : (
                <div className="card bg-green-50 border-green-200 animate-fade-in-up">
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
                            <div className="text-sm text-gray-500">Cantidad a ingresar</div>
                            <div className="text-3xl font-bold">{quantity}</div>
                        </div>
                        <button
                            className="w-12 h-12 rounded-full bg-white border shadow flex items-center justify-center text-2xl font-bold active:bg-gray-100"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            +
                        </button>
                    </div>

                    <button
                        className="w-full py-4 bg-green-600 text-white rounded-xl text-xl font-bold shadow-lg active:bg-green-700 flex items-center justify-center gap-2"
                        onClick={handleConfirmRestock}
                    >
                        <Check size={28} /> Confirmar Ingreso
                    </button>
                </div>
            )}

            {showScanner && (
                <BarcodeScanner
                    onClose={() => setShowScanner(false)}
                    onScanSuccess={(code) => {
                        setSearchTerm(code);
                        setShowScanner(false);
                    }}
                />
            )}
        </div>
    );
};

export default QuickRestock;
