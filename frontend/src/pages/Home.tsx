import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { ProductoBase, VarianteProducto } from '../types';
import { Search } from 'lucide-react';
import { Categoria } from '../types';
import { useToast } from '../context/ToastContext';

const Home: React.FC = () => {
    const { showToast } = useToast();
    const [productos, setProductos] = useState<ProductoBase[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get<ProductoBase[]>('/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            showToast('Error al cargar inventario', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Filter products
    const filteredProductos = productos.filter(p => {
        const matchesSearch = p.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.modelo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? p.categoria === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Inventario</h2>
            </div>

            <div className="mb-4 space-y-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por marca, modelo..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
                        onClick={() => setSelectedCategory('')}
                    >
                        Todos
                    </button>
                    {Object.values(Categoria).map(cat => (
                        <button
                            key={cat}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Cargando...</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredProductos.map(producto => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ProductCard: React.FC<{ producto: ProductoBase }> = ({ producto }) => {
    const [variantes, setVariantes] = useState<VarianteProducto[]>([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (expanded && variantes.length === 0) {
            api.get<VarianteProducto[]>(`/productos/${producto.id}/variantes`)
                .then(res => setVariantes(res.data))
                .catch(console.error);
        }
    }, [expanded, producto.id]);

    return (
        <div className="card">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div>
                    <h3 className="font-bold text-lg">{producto.marca} {producto.modelo}</h3>
                    <p className="text-sm text-gray-500">{producto.categoria} - {producto.genero}</p>
                </div>
                <span className="text-blue-600 text-sm">{expanded ? 'Ver menos' : 'Ver stock'}</span>
            </div>

            {expanded && (
                <div className="mt-4 border-t pt-2">
                    {variantes.length === 0 ? (
                        <p className="text-sm text-gray-400">Cargando variantes...</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {variantes.map(v => (
                                <div key={v.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                    <div>
                                        <span className="font-medium">{v.color}</span>
                                        <span className="text-gray-500 text-sm ml-2">Talle: {v.talle}</span>
                                        <div className="text-xs text-gray-400">SKU: {v.sku}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`badge ${v.stockActual <= v.stockMinimo ? 'badge-danger' : 'badge-success'}`}>
                                            Stock: {v.stockActual}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">${v.precio}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
