import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/public.css';
import { supabase } from "../supabase";

const Header = () => {
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;
    if (clickCount > 0 && clickCount < 7) {
      timeout = setTimeout(() => {
        setClickCount(0);
      }, 2000); // 2 seconds timeout to reset
    } else if (clickCount >= 7) {
      setClickCount(0);
      navigate('/admin/login');
    }

    return () => clearTimeout(timeout);
  }, [clickCount, navigate]);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <header className="public-header">
      <div className="container header-container">
        <div className="logo" onClick={handleLogoClick}>
          <h2>Hotel Park</h2>
        </div>
        <nav className="main-nav">
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#rooms">Rooms</a></li>
            <li><a href="#restaurant">Restaurant</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="btn btn-primary whatsapp-btn">
          Enquire on WhatsApp
        </a>
      </div>
    </header>
  );
};

export default Header;
