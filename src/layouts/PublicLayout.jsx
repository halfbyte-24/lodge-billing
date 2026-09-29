import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import '../styles/public.css';

const PublicLayout = () => {
  return (
    <div className="public-layout">
      {/* Premium Sticky Navigation */}
      <PublicNavbar />

      {/* Dynamic Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Shared Luxury Footer */}
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
