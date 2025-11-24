import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Package, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

interface KpiData {
    ventasMes: number;
    ingresosMes: number;
    stockTotal: number;
    productosBajoStock: number;
}

interface VentaData {
    producto: string;
    cantidad: number;
    total: number;
}

interface Inmovilizado {
    id: number;
    sku: string;
    productoBase: {
        marca: string;
        modelo: string;
    };
    stockActual: number;
    ubicacion: string;
}

const Reports: React.FC = () => {
    const [kpis, setKpis] = useState<KpiData | null>(null);
    const [ranking, setRanking] = useState<VentaData[]>([]);
    const [inmovilizados, setInmovilizados] = useState<Inmovilizado[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [kpiRes, rankingRes, inmovilizadosRes] = await Promise.all([
                api.get('/reportes/kpis'),
                api.get('/reportes/ranking-ventas'),
                api.get('/reportes/inmovilizados')
            ]);

            setKpis(kpiRes.data);
            setRanking(rankingRes.data);
            setInmovilizados(inmovilizadosRes.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            showToast('Error al cargar reportes', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando reportes...</div>;

    return (
        <div className="space-y-8 pb-10">
            <h1 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h1>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Ventas del Mes"
                    value={kpis?.ventasMes || 0}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                />
                <KpiCard
                    title="Ingresos (Est.)"
                    value={`$${(kpis?.ingresosMes || 0).toLocaleString()}`} // Placeholder if 0
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <KpiCard
                    title="Stock Total"
                    value={kpis?.stockTotal || 0}
                    icon={Package}
                    color="bg-purple-500"
                />
                <KpiCard
                    title="Bajo Stock"
                    value={kpis?.productosBajoStock || 0}
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Top Productos Vendidos</h2>
                    <div className="h-80 min-h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ranking} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="producto" width={100} style={{ fontSize: '12px' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cantidad" fill="#3B82F6" name="Unidades" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Stock Inmovilizado (+30 días)</h2>
                    <div className="overflow-y-auto h-80">
                        <table className="w-full text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Producto</th>
                                    <th className="px-4 py-2">SKU</th>
                                    <th className="px-4 py-2">Stock</th>
                                    <th className="px-4 py-2">Ubicación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {inmovilizados.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {item.productoBase.marca} {item.productoBase.modelo}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.sku}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.stockActual}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.ubicacion || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {inmovilizados.length === 0 && (
                            <p className="text-center text-gray-400 mt-4">No hay productos inmovilizados.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center text-${color.replace('bg-', '')}`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export default Reports;
