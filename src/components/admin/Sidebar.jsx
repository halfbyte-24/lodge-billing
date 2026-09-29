import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Bed, Utensils, Coffee, ConciergeBell, FileText, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Rooms', path: '/admin/rooms', icon: <Bed size={20} /> },
    { name: 'Food', path: '/admin/food', icon: <Utensils size={20} /> },
    { name: 'Drinks', path: '/admin/drinks', icon: <Coffee size={20} /> },
    { name: 'Services', path: '/admin/services', icon: <ConciergeBell size={20} /> },
    { name: 'Billing', path: '/admin/billing', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h3 className="brand-name">Sunrise Lodge<br/>& Restaurant</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path} 
                end={item.exact}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-link logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
