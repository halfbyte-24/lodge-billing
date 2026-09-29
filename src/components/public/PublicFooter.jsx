import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, X } from 'lucide-react';
import { hotelInfo, getWhatsAppUrl } from '../../config/hotelInfo';

const InstagramIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const PublicFooter = () => {
  const [modalContent, setModalContent] = useState(null);

  const openLegalModal = (type) => {
    if (type === 'privacy') {
      setModalContent({
        title: "Privacy Policy",
        text: `At ${hotelInfo.name}, we value your trust and privacy. Personal information shared during booking, check-in, or enquiry (such as your name, contact phone, and email address) is kept strictly confidential and used solely for reservation confirmation and hospitality service delivery. We do not sell or rent guest information to third parties.`
      });
    } else {
      setModalContent({
        title: "Terms & Conditions",
        text: `Standard check-in time is ${hotelInfo.checkInTime} and check-out is ${hotelInfo.checkOutTime}. Guests must present valid government photo identification upon arrival. Cancellations and modifications are subject to lodge policies. All guest rights and lodge property protections apply during your stay at ${hotelInfo.name}.`
      });
    }
  };

  return (
    <footer className="public-footer">
      <div className="container">
        <div className="footer-main-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h2>{hotelInfo.name.split(' ')[0]}</h2>
            <span className="footer-tagline">Lodge & Restaurant</span>
            <p>{hotelInfo.description}</p>
            <div className="footer-social-links">
              <a
                href={hotelInfo.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={hotelInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                title="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={hotelInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                title="Facebook"
              >
                <FacebookIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/rooms">Rooms & Suites</Link></li>
              <li><Link to="/restaurant">Restaurant & Dining</Link></li>
              <li><Link to="/contact">Contact & Location</Link></li>
            </ul>
          </div>

          {/* Guest Services */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul className="footer-links-list">
              <li><span>Premium Lodging</span></li>
              <li><span>Multi-Cuisine Dining</span></li>
              <li><span>24/7 Room Assistance</span></li>
              <li><span>High-Speed Wi-Fi</span></li>
              <li><span>Free Secure Parking</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-col">
            <h4>Contact Info</h4>
            <div className="footer-contact-items">
              <div className="footer-contact-item">
                <MapPin size={18} />
                <span>{hotelInfo.address}</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} />
                <a href={`tel:${hotelInfo.phone.replace(/[^0-9+]/g, '')}`}>{hotelInfo.phone}</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} />
                <a href={`mailto:${hotelInfo.email}`}>{hotelInfo.email}</a>
              </div>
              <div className="footer-contact-item">
                <MessageCircle size={18} />
                <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                  Instant WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} {hotelInfo.name}. All rights reserved.</p>
          
          <div className="footer-legal-links">
            <button type="button" onClick={() => openLegalModal('privacy')}>
              Privacy Policy
            </button>
            <span>•</span>
            <button type="button" onClick={() => openLegalModal('terms')}>
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Simple Legal Modal */}
      {modalContent && (
        <div className="modal-overlay" onClick={() => setModalContent(null)}>
          <div className="modal-card" style={{ maxWidth: '520px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setModalContent(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
              {modalContent.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              {modalContent.text}
            </p>
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setModalContent(null)}
                style={{ padding: '0.5rem 1.2rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default PublicFooter;
