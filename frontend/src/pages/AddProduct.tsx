import React, { useState } from 'react';
import api from '../services/api';
import { Categoria, Genero } from '../types';
import type { ProductoBase, VarianteProducto } from '../types';
import { Plus, Save } from 'lucide-react';

const AddProduct: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'variantes'>('general');
    const [producto, setProducto] = useState<Partial<ProductoBase>>({
        marca: '',
        modelo: '',
        categoria: Categoria.ZAPATILLA,
        genero: Genero.UNISEX,
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
        try {
            const res = await api.post<ProductoBase>('/productos', producto);
            setCreatedProduct(res.data);
            setActiveTab('variantes');
            alert('Producto creado correctamente. Ahora agregue variantes.');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error al crear producto');
        }
    };

    const handleAddVariant = async () => {
        if (!createdProduct?.id) return;
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
            alert('Variante agregada');
        } catch (error) {
            console.error('Error creating variant:', error);
            alert('Error al crear variante (verifique SKU único)');
        }
    };

    return (
        <div className="pb-20">
            <h2 className="text-xl font-bold mb-4">Alta de Producto</h2>

            <div className="flex mb-4 border-b">
                <button
                    className={`px-4 py-2 ${activeTab === 'general' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('general')}
                >
                    Datos Generales
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'variantes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => createdProduct ? setActiveTab('variantes') : alert('Primero guarde el producto')}
                >
                    Variantes
                </button>
            </div>

            {activeTab === 'general' ? (
                <div className="flex flex-col gap-3">
                    <input
                        className="input"
                        placeholder="Marca"
                        value={producto.marca}
                        onChange={e => setProducto({ ...producto, marca: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Modelo"
                        value={producto.modelo}
                        onChange={e => setProducto({ ...producto, modelo: e.target.value })}
                    />
                    <select
                        className="input"
                        value={producto.categoria}
                        onChange={e => setProducto({ ...producto, categoria: e.target.value as Categoria })}
                    >
                        {Object.values(Categoria).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        className="input"
                        value={producto.genero}
                        onChange={e => setProducto({ ...producto, genero: e.target.value as Genero })}
                    >
                        {Object.values(Genero).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <input
                        className="input"
                        placeholder="Temporada"
                        value={producto.temporada}
                        onChange={e => setProducto({ ...producto, temporada: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Proveedor"
                        value={producto.proveedor}
                        onChange={e => setProducto({ ...producto, proveedor: e.target.value })}
                    />
                    <button className="btn btn-primary mt-2" onClick={handleSaveProduct}>
                        <Save size={18} className="mr-2" /> Guardar Producto
                    </button>
                </div>
            ) : (
                <div>
                    <div className="bg-gray-100 p-4 rounded mb-4">
                        <h3 className="font-bold mb-2">Nueva Variante</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <input className="input" placeholder="Color" value={newVariant.color} onChange={e => setNewVariant({ ...newVariant, color: e.target.value })} />
                            <input className="input" placeholder="Talle" value={newVariant.talle} onChange={e => setNewVariant({ ...newVariant, talle: e.target.value })} />
                            <input className="input col-span-2" placeholder="SKU / Barcode" value={newVariant.sku} onChange={e => setNewVariant({ ...newVariant, sku: e.target.value })} />
                            <input className="input" type="number" placeholder="Costo" value={newVariant.costo} onChange={e => setNewVariant({ ...newVariant, costo: Number(e.target.value) })} />
                            <input className="input" type="number" placeholder="Precio" value={newVariant.precio} onChange={e => setNewVariant({ ...newVariant, precio: Number(e.target.value) })} />
                            <input className="input" type="number" placeholder="Stock Inicial" value={newVariant.stockActual} onChange={e => setNewVariant({ ...newVariant, stockActual: Number(e.target.value) })} />
                            <input className="input" type="number" placeholder="Stock Minimo" value={newVariant.stockMinimo} onChange={e => setNewVariant({ ...newVariant, stockMinimo: Number(e.target.value) })} />
                        </div>
                        <button className="btn btn-primary w-full mt-2" onClick={handleAddVariant}>
                            <Plus size={18} className="mr-2" /> Agregar Variante
                        </button>
                    </div>

                    <h3 className="font-bold mb-2">Variantes Agregadas</h3>
                    {variantes.length === 0 ? <p className="text-gray-500">No hay variantes aún.</p> : (
                        <ul className="space-y-2">
                            {variantes.map(v => (
                                <li key={v.id} className="bg-white p-2 border rounded flex justify-between">
                                    <span>{v.color} - Talle {v.talle}</span>
                                    <span className="font-mono">{v.sku}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddProduct;
