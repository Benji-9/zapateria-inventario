import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ArrowLeftRight, History, Bell, ShoppingCart, PackagePlus, LogOut, User, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Inventario', roles: ['ADMIN', 'OPERADOR'] },
        { path: '/venta-rapida', icon: ShoppingCart, label: 'Venta Rápida', roles: ['ADMIN', 'OPERADOR'] },
        { path: '/reposicion-rapida', icon: PackagePlus, label: 'Reposición', roles: ['ADMIN', 'OPERADOR'] },
        { path: '/stock/movimientos', icon: ArrowLeftRight, label: 'Movimientos', roles: ['ADMIN', 'OPERADOR'] },
        { path: '/productos/nuevo', icon: PlusCircle, label: 'Agregar Producto', roles: ['ADMIN'] },
        { path: '/historial', icon: History, label: 'Historial', roles: ['ADMIN'] },
        { path: '/alertas', icon: Bell, label: 'Alertas', roles: ['ADMIN'] },
        { path: '/reportes', icon: BarChart3, label: 'Reportes', roles: ['ADMIN'] },
    ];

    return (
        <div className="min-h-screen bg-gray-100 pb-20 lg:pb-0 lg:pl-64">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:bg-white lg:border-r lg:border-gray-200">
                <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
                    <h1 className="text-xl font-bold text-blue-600">Zapatería</h1>
                </div>
                <div className="flex flex-col flex-1 overflow-y-auto p-4 gap-1">
                    {menuItems.filter(item => item.roles.includes(user?.role || '')).map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User size={16} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 px-4 flex items-center justify-between">
                <h1 className="text-lg font-bold text-blue-600">Zapatería</h1>
                <button onClick={logout} className="p-2 text-gray-600">
                    <LogOut size={20} />
                </button>
            </header>

            {/* Main Content */}
            <main className="pt-20 lg:pt-8 px-4 lg:px-8 max-w-7xl mx-auto">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {menuItems.filter(item => item.roles.includes(user?.role || '')).slice(0, 5).map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive(item.path)
                                ? 'text-blue-600'
                                : 'text-gray-400'
                                }`}
                        >
                            <item.icon size={24} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default Layout;
