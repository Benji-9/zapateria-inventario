import React, { useState } from 'react';
import api from '../services/api';
import { Categoria, Genero } from '../types';
import type { ProductoBase, VarianteProducto } from '../types';
import { Plus, Trash2, Save, ScanBarcode } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import BarcodeScanner from '../components/BarcodeScanner';

const AddProduct: React.FC = () => {
    const { showToast } = useToast();

    const brands = [
        "Hush Puppies", "Merrell", "CAT", "Kickers", "Roble", "Boating",
        "Brooksfield", "Tomahawk", "Boaonda", "Tabbuso", "Benti", "Donatella",
        "Keady", "Cherie", "Fragola", "Penelope", "Gondolino", "Ferli",
        "Piscis", "Giuliani", "Perissinotto"
    ].sort();

    const categoriesByGender: Record<string, string[]> = {
        [Genero.MUJER]: [
            'ZAPATILLA', 'URBANO', 'SANDALIA', 'ZUECO', 'MOCASIN', 'CHINELA',
            'BOTA', 'BORCEGO', 'CARTERA', 'BILLETERA'
        ],
        [Genero.HOMBRE]: [
            'ZAPATILLA', 'ZAPATILLA_CASUAL', 'ZAPATO_VESTIR', 'NAUTICO', 'COMFORT',
            'BOTA', 'BORCEGO', 'OUTDOOR', 'SANDALIA', 'CHINELA', 'BILLETERA'
        ],
        [Genero.NINO]: [
            'ZAPATILLA', 'COLEGIAL', 'ZAPATO', 'SANDALIA', 'OUTDOOR'
        ],
        [Genero.UNISEX]: Object.keys(Categoria)
    };

    const [activeTab, setActiveTab] = useState<'general' | 'variantes'>('general');
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [scanningVariantIndex, setScanningVariantIndex] = useState<number | null>(null);
    const [producto, setProducto] = useState<Partial<ProductoBase>>({
        marca: '',
        modelo: '',
        categoria: undefined, // Start empty to force selection
        genero: Genero.MUJER, // Default to Mujer as per image 1
        temporada: '',
        proveedor: ''
    });
    const [createdProduct, setCreatedProduct] = useState<ProductoBase | null>(null);
    const [variantes, setVariantes] = useState<VarianteProducto[]>([]);

    // New Variant Form State
    const [newVariant, setNewVariant] = useState<Partial<VarianteProducto>>({
        color: '',
        talle: '',
        sku: '',
        costo: 0,
        precio: 0,
        stockActual: 0,
        stockMinimo: 5,
        ubicacion: 'Deposito'
    });

    const handleSaveProduct = async () => {
        setLoading(true);
        try {
            const res = await api.post<ProductoBase>('/productos', producto);
            setCreatedProduct(res.data);
            setActiveTab('variantes');
            showToast('Producto creado correctamente. Ahora agregue variantes.', 'success');
        } catch (error: any) {
            console.error('Error creating product:', error);
            const msg = error.response?.data?.message || 'Error al crear producto';
            const details = error.response?.data?.details;
            if (details) {
                const detailMsg = Object.values(details).join(', ');
                showToast(`${msg}: ${detailMsg}`, 'error');
            } else {
                showToast(msg, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddVariant = async () => {
        if (!createdProduct?.id) return;
        setLoading(true);
        try {
            const variantToSend = { ...newVariant, productoBase: createdProduct };
            const res = await api.post<VarianteProducto>('/productos/variantes', variantToSend);
            setVariantes([...variantes, res.data]);
            setNewVariant({
                color: '',
                talle: '',
                sku: '',
                costo: 0,
                precio: 0,
                stockActual: 0,
                stockMinimo: 5,
                ubicacion: 'Deposito'
            });
            showToast('Variante agregada', 'success');
        } catch (error: any) {
            console.error('Error creating variant:', error);
            const msg = error.response?.data?.message || 'Error al crear variante';
            const details = error.response?.data?.details;
            if (details) {
                const detailMsg = Object.values(details).join(', ');
                showToast(`${msg}: ${detailMsg}`, 'error');
            } else {
                showToast(msg, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateVariante = (index: number, field: keyof VarianteProducto, value: any) => {
        const updatedVariantes = [...variantes];
        updatedVariantes[index] = { ...updatedVariantes[index], [field]: value };
        setVariantes(updatedVariantes);
    };

    const handleRemoveVariant = (id: number) => {
        setVariantes(variantes.filter(v => v.id !== id));
        showToast('Variante eliminada (solo de la lista, no de la DB)', 'info'); // In a real app, you'd call an API to delete
    };

    return (
        <div className="pb-20">
            <h2 className="text-xl font-bold mb-4">Alta de Producto</h2>

            <div className="flex mb-4 border-b">
                <button
                    className={`px-4 py-2 ${activeTab === 'general' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('general')}
                    disabled={loading}
                >
                    Datos Generales
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'variantes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => createdProduct ? setActiveTab('variantes') : showToast('Primero guarde el producto', 'info')}
                    disabled={loading}
                >
                    Variantes
                </button>
            </div>

            {activeTab === 'general' ? (
                <div className="flex flex-col gap-3">
                    <input
                        className="input"
                        placeholder="Marca"
                        list="brands-list"
                        value={producto.marca}
                        onChange={e => setProducto({ ...producto, marca: e.target.value })}
                        disabled={loading}
                    />
                    <datalist id="brands-list">
                        {brands.map(brand => <option key={brand} value={brand} />)}
                    </datalist>
                    <input
                        className="input"
                        placeholder="Modelo"
                        value={producto.modelo}
                        onChange={e => setProducto({ ...producto, modelo: e.target.value })}
                        disabled={loading}
                    />
                    <select
                        className="input"
                        value={producto.genero}
                        onChange={e => {
                            const newGender = e.target.value as Genero;
                            setProducto({
                                ...producto,
                                genero: newGender,
                                categoria: undefined
                            });
                        }}
                        disabled={loading}
                    >
                        {Object.values(Genero).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select
                        className="input"
                        value={producto.categoria || ''}
                        onChange={e => setProducto({ ...producto, categoria: e.target.value as Categoria })}
                        disabled={loading}
                    >
                        <option value="" disabled>Seleccione Categoría</option>
                        {(categoriesByGender[producto.genero || Genero.UNISEX] || Object.keys(Categoria)).map(c => (
                            <option key={c} value={c}>{c.replace('_', ' ')}</option>
                        ))}
                    </select>
                    <input
                        className="input"
                        placeholder="Temporada"
                        value={producto.temporada}
                        onChange={e => setProducto({ ...producto, temporada: e.target.value })}
                        disabled={loading}
                    />
                    <input
                        className="input"
                        placeholder="Proveedor"
                        value={producto.proveedor}
                        onChange={e => setProducto({ ...producto, proveedor: e.target.value })}
                        disabled={loading}
                    />
                    <button className="btn btn-primary mt-2" onClick={handleSaveProduct} disabled={loading}>
                        <Save size={18} className="mr-2" /> {loading ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </div>
            ) : (
                <div>
                    <div className="bg-gray-100 p-4 rounded mb-4">
                        <h3 className="font-bold mb-2">Nueva Variante</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <input className="input" placeholder="Color" value={newVariant.color} onChange={e => setNewVariant({ ...newVariant, color: e.target.value })} disabled={loading} />
                            <input className="input" placeholder="Talle" value={newVariant.talle} onChange={e => setNewVariant({ ...newVariant, talle: e.target.value })} disabled={loading} />
                            <div className="flex gap-2 col-span-2">
                                <input
                                    className="input w-full"
                                    placeholder="SKU / Barcode"
                                    value={newVariant.sku}
                                    onChange={e => setNewVariant({ ...newVariant, sku: e.target.value })}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setScanningVariantIndex(-1); // Use -1 for new variant
                                        setShowScanner(true);
                                    }}
                                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                                    title="Escanear SKU"
                                    disabled={loading}
                                >
                                    <ScanBarcode size={20} />
                                </button>
                            </div>
                            <input className="input" type="number" placeholder="Costo" value={newVariant.costo} onChange={e => setNewVariant({ ...newVariant, costo: Number(e.target.value) })} disabled={loading} />
                            <input className="input" type="number" placeholder="Precio" value={newVariant.precio} onChange={e => setNewVariant({ ...newVariant, precio: Number(e.target.value) })} disabled={loading} />
                            <input className="input" type="number" placeholder="Stock Inicial" value={newVariant.stockActual} onChange={e => setNewVariant({ ...newVariant, stockActual: Number(e.target.value) })} disabled={loading} />
                            <input className="input" type="number" placeholder="Stock Minimo" value={newVariant.stockMinimo} onChange={e => setNewVariant({ ...newVariant, stockMinimo: Number(e.target.value) })} disabled={loading} />
                        </div>
                        <button className="btn btn-primary w-full mt-2" onClick={handleAddVariant} disabled={loading}>
                            <Plus size={18} className="mr-2" /> {loading ? 'Agregando...' : 'Agregar Variante'}
                        </button>
                    </div>

                    <h3 className="font-bold mb-2">Variantes Agregadas</h3>
                    {variantes.length === 0 ? <p className="text-gray-500">No hay variantes aún.</p> : (
                        <ul className="space-y-2">
                            {variantes.map((variante, index) => (
                                <li key={variante.id || `new-${index}`} className="bg-white p-2 border rounded flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">{variante.color} - Talle {variante.talle}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVariant(variante.id!)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Eliminar variante"
                                            disabled={loading}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex gap-2 col-span-2">
                                            <input
                                                type="text"
                                                placeholder="SKU"
                                                className="input w-full"
                                                value={variante.sku}
                                                onChange={e => updateVariante(index, 'sku', e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setScanningVariantIndex(index);
                                                    setShowScanner(true);
                                                }}
                                                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                                                title="Escanear SKU"
                                                disabled={loading}
                                            >
                                                <ScanBarcode size={20} />
                                            </button>
                                        </div>
                                        <input className="input" type="number" placeholder="Costo" value={variante.costo} onChange={e => updateVariante(index, 'costo', Number(e.target.value))} disabled={loading} />
                                        <input className="input" type="number" placeholder="Precio" value={variante.precio} onChange={e => updateVariante(index, 'precio', Number(e.target.value))} disabled={loading} />
                                        <input className="input" type="number" placeholder="Stock Actual" value={variante.stockActual} onChange={e => updateVariante(index, 'stockActual', Number(e.target.value))} disabled={loading} />
                                        <input className="input" type="number" placeholder="Stock Mínimo" value={variante.stockMinimo} onChange={e => updateVariante(index, 'stockMinimo', Number(e.target.value))} disabled={loading} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {showScanner && (
                <BarcodeScanner
                    onClose={() => {
                        setShowScanner(false);
                        setScanningVariantIndex(null);
                    }}
                    onScanSuccess={(code) => {
                        if (scanningVariantIndex === -1) { // New variant
                            setNewVariant(prev => ({ ...prev, sku: code }));
                        } else if (scanningVariantIndex !== null) { // Existing variant
                            updateVariante(scanningVariantIndex, 'sku', code);
                        }
                        setShowScanner(false);
                        setScanningVariantIndex(null);
                    }}
                />
            )}
        </div>
    );
};

export default AddProduct;
