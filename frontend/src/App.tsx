
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Movements from './pages/Movements';
import Alerts from './pages/Alerts';
import HistoryPage from './pages/History';
import QuickSale from './pages/QuickSale';
import QuickRestock from './pages/QuickRestock';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="movements" element={<Movements />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="quick-sale" element={<QuickSale />} />
          <Route path="quick-restock" element={<QuickRestock />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
