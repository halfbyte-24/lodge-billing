import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, User, Moon } from 'lucide-react';

const TopHeader = () => {
  const { profile } = useAuth();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <header className="admin-topheader">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search rooms, food, drinks or services..." />
      </div>
      
      <div className="header-actions">
        <span className="current-date">{currentDate}</span>
        <button className="icon-btn theme-toggle">
          <Moon size={20} />
        </button>
        <div className="admin-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <span>{profile?.full_name || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
