import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Movements from './pages/Movements';
import Alerts from './pages/Alerts';
import HistoryPage from './pages/History';

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
