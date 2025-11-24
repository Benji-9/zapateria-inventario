import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import StockMovement from './pages/Movements';
import History from './pages/History';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import QuickSale from './pages/QuickSale';
import QuickRestock from './pages/QuickRestock';
import Login from './pages/Login';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />

                {/* Admin Only */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="productos/nuevo" element={<AddProduct />} />
                  <Route path="alertas" element={<Alerts />} />
                  <Route path="historial" element={<History />} />
                  <Route path="reportes" element={<Reports />} />
                </Route>

                {/* Admin & Operador */}
                <Route path="stock/movimientos" element={<StockMovement />} />
                <Route path="venta-rapida" element={<QuickSale />} />
                <Route path="reposicion-rapida" element={<QuickRestock />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
