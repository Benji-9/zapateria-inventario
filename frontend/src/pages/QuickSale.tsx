import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import type { VarianteProducto, MovimientoStock } from '../types';
import { TipoMovimiento, MotivoMovimiento } from '../types';
import { Search, ShoppingCart, Trash2, Plus, Minus, Check, ScanBarcode } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import BarcodeScanner from '../components/BarcodeScanner';

interface CartItem {
    variant: VarianteProducto;
    quantity: number;
}

const QuickSale: React.FC = () => {
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<VarianteProducto[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showScanner, setShowScanner] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Debounce search and handle USB scanner auto-add
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
            // Auto-add if exact SKU match and unique result (USB Scanner behavior)
            if (res.data.length === 1 && res.data[0].sku.toLowerCase() === query.toLowerCase()) {
                addToCart(res.data[0]);
                setSearchTerm(''); // Clear search after auto-adding
                searchInputRef.current?.focus(); // Refocus for next scan
            }
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const addToCart = (variant: VarianteProducto) => {
        setCart(prev => {
            const existing = prev.find(item => item.variant.id === variant.id);
            if (existing) {
                if (existing.quantity >= variant.stockActual) {
                    showToast('No hay suficiente stock', 'error');
                    return prev;
                }
                return prev.map(item =>
                    item.variant.id === variant.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { variant, quantity: 1 }];
        });
        showToast('Producto agregado', 'success');
        setSearchTerm(''); // Clear search after adding
        searchInputRef.current?.focus(); // Refocus for next scan
    };

    const updateCartItemQuantity = (variantId: number | undefined, newQuantity: number) => {
        if (!variantId) return;
        setCart(prev => {
            const updatedCart = prev.map(item =>
                item.variant.id === variantId
                    ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.variant.stockActual)) }
                    : item
            );
            return updatedCart.filter(item => item.quantity > 0); // Remove if quantity becomes 0
        });
    };

    const removeFromCart = (variantId: number | undefined) => {
        if (!variantId) return;
        setCart(prev => prev.filter(item => item.variant.id !== variantId));
        showToast('Producto eliminado del carrito', 'info');
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // If there's an exact match in the current results, add it to cart
        const exactMatch = results.find(v => v.sku.toLowerCase() === searchTerm.toLowerCase());
        if (exactMatch) {
            addToCart(exactMatch);
        } else if (results.length === 1) {
            // If only one result, add that to cart
            addToCart(results[0]);
        } else {
            // If no exact match or multiple results, let the user select
            showToast('Por favor, seleccione un producto de la lista o refine su búsqueda.', 'info');
        }
    };

    const handleConfirmSale = async () => {
        if (cart.length === 0) {
            showToast('El carrito está vacío.', 'error');
            return;
        }

        try {
            // We need to send individual requests for now as backend doesn't support batch yet?
            // Or we can loop. The prompt said "Implementar Lector...", not "Implement Batch".
            // Let's loop for MVP safety or check if we have batch.
            // Previous code used single post. Let's loop.
            for (const item of cart) {
                const payload: Partial<MovimientoStock> = {
                    variante: item.variant,
                    tipo: TipoMovimiento.SALIDA,
                    cantidad: item.quantity,
                    motivo: MotivoMovimiento.VENTA,
                    usuario: 'admin', // MVP
                    observaciones: `Venta Rápida - SKU: ${item.variant.sku}`
                };
                await api.post('/stock/movimientos', payload);
            }

            showToast(`Venta registrada con ${cart.length} productos.`, 'success');

            // Reset
            setCart([]);
            setSearchTerm('');
            setResults([]);
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Search & Product List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <form onSubmit={handleSearchSubmit} className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Buscar por SKU, marca, modelo..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowScanner(true)}
                                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                                title="Escanear código de barras"
                            >
                                <ScanBarcode size={24} />
                            </button>
                        </form>
                    </div>

                    {results.length > 0 && (
                        <div className="mt-2 bg-white border rounded-lg shadow-xl max-h-[60vh] overflow-y-auto">
                            {results.map(v => (
                                <div
                                    key={v.id}
                                    className="p-4 border-b hover:bg-blue-50 cursor-pointer active:bg-blue-100"
                                    onClick={() => addToCart(v)}
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

                    {searchTerm.length > 2 && results.length === 0 && (
                        <div className="mt-4 text-center text-gray-500">No se encontraron productos</div>
                    )}
                </div>

                {/* Right Column: Cart Summary */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
                    <h3 className="text-xl font-bold mb-4">Carrito ({cart.length})</h3>
                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center">Agregue productos para iniciar una venta.</p>
                    ) : (
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item.variant.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.variant.productoBase?.marca} {item.variant.productoBase?.modelo}</p>
                                        <p className="text-sm text-gray-600">{item.variant.color} - Talle {item.variant.talle}</p>
                                        <p className="text-xs text-gray-400 font-mono">{item.variant.sku}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateCartItemQuantity(item.variant.id, item.quantity - 1)}
                                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold text-lg">{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartItemQuantity(item.variant.id, item.quantity + 1)}
                                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                            disabled={item.quantity >= item.variant.stockActual}
                                        >
                                            <Plus size={16} />
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.variant.id)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="ml-4 text-right">
                                        <p className="font-bold text-lg">${(item.variant.precio * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {cart.length > 0 && (
                        <>
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between items-center text-2xl font-bold text-blue-600">
                                    <span>Total:</span>
                                    <span>${cart.reduce((sum, item) => sum + item.variant.precio * item.quantity, 0).toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                className="w-full py-4 bg-blue-600 text-white rounded-xl text-xl font-bold shadow-lg active:bg-blue-700 flex items-center justify-center gap-2"
                                onClick={handleConfirmSale}
                            >
                                <Check size={28} /> Confirmar Venta
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showScanner && (
                <BarcodeScanner
                    onClose={() => setShowScanner(false)}
                    onScanSuccess={(code) => {
                        setSearchTerm(code);
                        setShowScanner(false); // Close scanner after successful scan
                        // The useEffect will trigger the search and auto-add
                    }}
                />
            )}
        </div>
    );
};

export default QuickSale;
