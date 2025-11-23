import { useToast } from '../context/ToastContext';

const HistoryPage: React.FC = () => {
    const { showToast } = useToast();

    const handleShowInfo = () => {
        showToast("Por favor seleccione una variante para ver su historial (Implementación MVP: requiere ID de variante)", 'info');
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Historial de Movimientos</h2>
            <div className="bg-yellow-50 p-4 rounded mb-4 text-sm text-yellow-800">
                En el MVP, el historial se consulta por Variante específica.
            </div>

            {/* Placeholder for MVP */}
            <p className="text-gray-500 cursor-pointer" onClick={handleShowInfo}>Seleccione un producto en el Inventario para ver sus movimientos.</p>

            {/* Ideally we link here from the Product Details in Home */}
        </div>
    );
};

export default HistoryPage;
