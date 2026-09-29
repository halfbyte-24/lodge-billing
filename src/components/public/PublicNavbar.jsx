import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageCircle, Menu, X } from 'lucide-react';
import { hotelInfo, getWhatsAppUrl } from '../../config/hotelInfo';

const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef(null);
  const navigate = useNavigate();

  // Exactly 7 clicks/taps on the hotel brand navigates to /admin/login
  const handleBrandClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    clickCountRef.current += 1;

    // Clear existing timer if clicked again within the window
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (clickCountRef.current === 7) {
      clickCountRef.current = 0;
      navigate('/admin/login');
    } else {
      // Reset counter after 2.5 seconds of inactivity
      resetTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 2500);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="public-header">
      <div className="header-container">
        {/* Brand Logo with 7-click secret admin trigger */}
        <div
          role="button"
          tabIndex={0}
          className="brand-logo"
          onClick={handleBrandClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleBrandClick(e);
          }}
          style={{ cursor: 'pointer', userSelect: 'none', touchAction: 'manipulation' }}
          aria-label="Sunrise Lodge & Restaurant"
        >
          <span className="brand-logo-title">SUNRISE</span>
          <span className="brand-logo-subtitle">Lodge & Restaurant</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="main-nav" aria-label="Main Navigation">
          <ul className="nav-links-desktop">
            <li>
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/rooms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Rooms
              </NavLink>
            </li>
            <li>
              <NavLink to="/restaurant" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Restaurant
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Actions & Mobile Toggle */}
        <div className="header-actions">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-nav"
            title="Chat with Reception on WhatsApp"
          >
            <MessageCircle size={18} />
            <span>Enquire on WhatsApp</span>
          </a>

          {/* Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/rooms"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Rooms
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/restaurant"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Restaurant
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Contact
            </NavLink>
          </li>
        </ul>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp-nav mobile-whatsapp-btn"
          onClick={closeMobileMenu}
        >
          <MessageCircle size={18} />
          <span>Enquire on WhatsApp</span>
        </a>
      </div>
    </header>
  );
};

export default PublicNavbar;
