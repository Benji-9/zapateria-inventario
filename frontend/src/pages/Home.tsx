import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { ProductoBase, VarianteProducto } from '../types';
import { Search } from 'lucide-react';

const Home: React.FC = () => {
    const [productos, setProductos] = useState<ProductoBase[]>([]);
    const [variantes, setVariantes] = useState<VarianteProducto[]>([]); // Flattened view for MVP list?
    // Actually, the prototype says "List/Search Products".
    // Ideally we show Variants directly or Products with expanded variants.
    // Let's show Variants as the main inventory unit.
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            // For MVP, we might need an endpoint that returns all variants with product info.
            // Currently we have getAllProductos and getVariantesByProducto.
            // Let's fetch products then fetch variants? Or just fetch all products and their variants?
            // The backend ProductoController has getVariantesByProducto.
            // We probably need a "getAllVariantes" endpoint for the main list if we want to search everything.
            // Or we list Products and expand them.
            // Let's list Products for now.
            const response = await api.get<ProductoBase[]>('/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter products
    const filteredProductos = productos.filter(p =>
        p.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="mb-4 relative">
                <input
                    type="text"
                    placeholder="Buscar por marca, modelo..."
                    className="input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
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
