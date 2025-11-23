import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, PlusCircle, ArrowRightLeft, AlertTriangle, History, ShoppingCart, PackagePlus, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Zapatería Inventario</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 md:hidden">
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* Sidebar (Desktop) / Drawer (Mobile) */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:hidden`} onClick={() => setIsSidebarOpen(false)} />

            <div className="flex flex-1 overflow-hidden">
                <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}>
                    <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="font-bold text-lg">Menú</h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden"><X /></button>
                    </div>
                    <nav className="p-4 space-y-2">
                        <Link to="/" className="block py-2 px-4 hover:bg-gray-100 rounded flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}><Home size={20} /> Inicio</Link>
                        <Link to="/quick-sale" className="block py-2 px-4 hover:bg-blue-50 text-blue-600 rounded flex items-center gap-2 font-bold" onClick={() => setIsSidebarOpen(false)}><ShoppingCart size={20} /> Venta Rápida</Link>
                        <Link to="/quick-restock" className="block py-2 px-4 hover:bg-green-50 text-green-600 rounded flex items-center gap-2 font-bold" onClick={() => setIsSidebarOpen(false)}><PackagePlus size={20} /> Reposición Rápida</Link>
                        <div className="border-t my-2"></div>
                        <Link to="/add" className="block py-2 px-4 hover:bg-gray-100 rounded flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}><PlusCircle size={20} /> Nuevo Producto</Link>
                        <Link to="/movements" className="block py-2 px-4 hover:bg-gray-100 rounded flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}><ArrowRightLeft size={20} /> Movimientos</Link>
                        <Link to="/alerts" className="block py-2 px-4 hover:bg-gray-100 rounded flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}><AlertTriangle size={20} /> Alertas</Link>
                        <Link to="/history" className="block py-2 px-4 hover:bg-gray-100 rounded flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}><History size={20} /> Historial</Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 pb-24 md:pb-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full flex justify-around p-2 pb-4 safe-area-pb md:hidden z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`}>
                    <Home size={24} />
                    <span className="text-[10px] mt-1 font-medium">Inicio</span>
                </Link>
                <Link to="/quick-sale" className={`flex flex-col items-center p-2 ${isActive('/quick-sale') ? 'text-blue-600' : 'text-gray-400'}`}>
                    <ShoppingCart size={24} />
                    <span className="text-[10px] mt-1 font-medium">Venta</span>
                </Link>
                <Link to="/quick-restock" className={`flex flex-col items-center p-2 ${isActive('/quick-restock') ? 'text-green-600' : 'text-gray-400'}`}>
                    <PackagePlus size={24} />
                    <span className="text-[10px] mt-1 font-medium">Reponer</span>
                </Link>
                <Link to="/history" className={`flex flex-col items-center p-2 ${isActive('/history') ? 'text-blue-600' : 'text-gray-400'}`}>
                    <History size={24} />
                    <span className="text-[10px] mt-1 font-medium">Historial</span>
                </Link>
            </nav>
        </div>
    );
};

export default Layout;
