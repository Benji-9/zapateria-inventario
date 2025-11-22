import React, { useEffect } from 'react';
import { useStore } from '../stores/useStore';
import { AlertTriangle } from 'lucide-react';

const Alerts: React.FC = () => {
    const { alertas, fetchAlertas } = useStore();

    useEffect(() => {
        fetchAlertas();
    }, [fetchAlertas]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 flex items-center text-red-600">
                <AlertTriangle className="mr-2" /> Alertas de Stock Bajo
            </h2>

            {alertas.length === 0 ? (
                <p className="text-gray-500">No hay alertas de stock.</p>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {alertas.map(v => (
                        <div key={v.id} className="card border-l-4 border-red-500 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{v.productoBase?.marca} {v.productoBase?.modelo}</h3>
                                <p className="text-sm text-gray-600">{v.color} - Talle {v.talle}</p>
                                <p className="text-xs text-gray-400">SKU: {v.sku}</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-red-600">{v.stockActual}</span>
                                <span className="text-xs text-gray-500">Min: {v.stockMinimo}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Alerts;
