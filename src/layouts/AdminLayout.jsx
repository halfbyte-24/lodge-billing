import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import TopHeader from '../components/admin/TopHeader';
import BillPreview from '../components/admin/BillPreview';
import { BillProvider } from '../contexts/BillContext';
import '../styles/admin.css';

const AdminLayout = () => {
  return (
    <BillProvider>
      <div className="admin-layout-wrapper">
        <Sidebar />
        <div className="admin-main-container">
          <TopHeader />
          <div className="admin-content-area">
            <div className="admin-main-content">
              <Outlet />
            </div>
            <div className="admin-bill-sidebar">
              <BillPreview />
            </div>
          </div>
        </div>
      </div>
    </BillProvider>
  );
};

export default AdminLayout;
