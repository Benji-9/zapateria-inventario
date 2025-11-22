import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, PlusCircle, ArrowRightLeft, AlertTriangle, History } from 'lucide-react';

const Layout: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-800">Zapatería Inventario</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 pb-20 overflow-y-auto">
                <Outlet />
            </main>

            {/* Bottom Navigation (Mobile First) */}
            <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full flex justify-around p-2 pb-4 safe-area-pb">
                <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-blue-600' : 'text-gray-500'}`}>
                    <Home size={24} />
                    <span className="text-xs mt-1">Inicio</span>
                </Link>
                <Link to="/add" className={`flex flex-col items-center p-2 ${isActive('/add') ? 'text-blue-600' : 'text-gray-500'}`}>
                    <PlusCircle size={24} />
                    <span className="text-xs mt-1">Alta</span>
                </Link>
                <Link to="/movements" className={`flex flex-col items-center p-2 ${isActive('/movements') ? 'text-blue-600' : 'text-gray-500'}`}>
                    <ArrowRightLeft size={24} />
                    <span className="text-xs mt-1">Mover</span>
                </Link>
                <Link to="/alerts" className={`flex flex-col items-center p-2 ${isActive('/alerts') ? 'text-blue-600' : 'text-gray-500'}`}>
                    <AlertTriangle size={24} />
                    <span className="text-xs mt-1">Alertas</span>
                </Link>
                <Link to="/history" className={`flex flex-col items-center p-2 ${isActive('/history') ? 'text-blue-600' : 'text-gray-500'}`}>
                    <History size={24} />
                    <span className="text-xs mt-1">Historial</span>
                </Link>
            </nav>
        </div>
    );
};

export default Layout;
