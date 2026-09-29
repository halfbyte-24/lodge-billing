import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Public Pages
import Home from './pages/public/Home';

// Admin Layout & Components
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Rooms from './pages/admin/Rooms';
import Food from './pages/admin/Food';
import Drinks from './pages/admin/Drinks';
import Services from './pages/admin/Services';
import Billing from './pages/admin/Billing';
import Settings from './pages/admin/Settings';
import InvoicePreview from './pages/admin/InvoicePreview';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Invoice Print View (Outside layout to hide sidebar) */}
        <Route path="/admin/billing/invoice/:id" element={
          <ProtectedRoute>
            <InvoicePreview />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="food" element={<Food />} />
          <Route path="drinks" element={<Drinks />} />
          <Route path="services" element={<Services />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
