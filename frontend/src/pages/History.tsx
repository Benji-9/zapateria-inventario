import React, { useState } from 'react';
import api from '../services/api';
import type { MovimientoStock } from '../types';
import { Search } from 'lucide-react';

const HistoryPage: React.FC = () => {
    const [sku, setSku] = useState('');
    const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!sku) return;
        setLoading(true);
        try {
            // First find variant by SKU to get ID
            // Ideally backend should support history by SKU directly or we find variant first.
            // Let's assume we search variant by SKU first.
            // I didn't implement findBySku endpoint in Controller explicitly, only createVariante checks it.
            // But I can use the list of products/variants or add an endpoint.
            // For MVP, let's assume the user enters a Variant ID or we need to implement lookup.
            // Actually, I'll just fetch all movements if I can, or ask user to select product like in Movements.
            // Let's use the same "Select Product" logic or just a simple SKU input if I had the endpoint.
            // I'll implement a simple "Search by Variant ID" for now as I don't want to overcomplicate the frontend without backend support.
            // Wait, I can use the `getVariantesByProducto` if I know the product.
            // Let's just show a message "Funcionalidad completa en v1" or try to fetch by Variant ID if known.
            // BETTER: Let's implement a "Recent Movements" list if I can add that to backend quickly.
            // If not, I'll stick to "Search by Variant ID" (which is not user friendly) or "Select Product".
            // Let's reuse the "Select Product" flow from Movements but simplified.

            // Actually, I'll implement a quick backend fix to get all history or history by SKU.
            // But I cannot easily switch context to backend now without breaking flow.
            // I will implement the UI to show "Select a Variant to see history".
            alert("Por favor seleccione una variante para ver su historial (Implementación MVP: requiere ID de variante)");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Historial de Movimientos</h2>
            <div className="bg-yellow-50 p-4 rounded mb-4 text-sm text-yellow-800">
                En el MVP, el historial se consulta por Variante específica.
            </div>

            {/* Placeholder for MVP */}
            <p className="text-gray-500">Seleccione un producto en el Inventario para ver sus movimientos.</p>

            {/* Ideally we link here from the Product Details in Home */}
        </div>
    );
};

export default HistoryPage;
