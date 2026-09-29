import React, { useState, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { MessageCircle, Menu, X } from 'lucide-react';
import { hotelInfo, getWhatsAppUrl } from '../../config/hotelInfo';

const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef(null);
  const navigate = useNavigate();

  // Easter egg: 7 clicks on the logo navigates to admin login
  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (clickCountRef.current >= 7) {
      clickCountRef.current = 0;
      navigate('/admin/login');
    } else {
      resetTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 2000);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="public-header">
      <div className="header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={handleLogoClick}>
          <span className="brand-logo-title">SUNRISE</span>
          <span className="brand-logo-subtitle">Lodge & Restaurant</span>
        </Link>

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
