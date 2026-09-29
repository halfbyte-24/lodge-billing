import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Wifi,
  Wind,
  Bath,
  Users,
  Bed,
  Layers,
  MessageCircle,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { getRoomEnquiryUrl, hotelInfo } from '../../config/hotelInfo';

const RoomDetailsModal = ({ room, onClose }) => {
  const navigate = useNavigate();

  if (!room) return null;

  const roomTitle = room.room_number ? `Room ${room.room_number}` : room.name;
  const typeName = room.room_types?.name || room.type || "Luxury Room";
  const price = room.price || room.room_types?.default_price || 1200;
  const isAvailable = room.status === 'Available' || room.isAvailable === true;
  const capacity = room.room_types?.capacity || room.capacity || 2;
  const floor = room.floor ? `Floor ${room.floor}` : "Ground Floor";
  const facilities = room.room_types?.facilities || room.facilities || ['Wi-Fi', 'TV', 'Attached Bathroom', 'AC'];
  const description =
    room.room_types?.description ||
    room.description ||
    "Tastefully furnished with contemporary aesthetics, premium bedding, and a peaceful ambiance to ensure an unforgettable stay.";

  const handleContactClick = () => {
    onClose();
    navigate('/contact');
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <img
          src={room.image || room.image_url}
          alt={`${roomTitle} - ${typeName}`}
          className="modal-img-hero"
        />

        <div className="modal-content-body">
          {/* Title & Price Header */}
          <div className="modal-header-row">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '4px' }}>
                <span className="room-card-floor">{floor}</span>
                <span
                  className={`room-card-status-badge ${
                    isAvailable ? 'room-status-available' : 'room-status-unavailable'
                  }`}
                  style={{ position: 'static' }}
                >
                  {isAvailable ? 'Available' : 'Currently Unavailable'}
                </span>
              </div>
              <h2 className="modal-title">
                {roomTitle} – {typeName}
              </h2>
            </div>

            <div className="modal-price-box">
              <span>Per Night Stay</span>
              <strong>₹{price.toLocaleString()}</strong>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="modal-specs-grid">
            <div className="spec-item">
              <Users size={18} />
              <span>Up to {capacity} Guests</span>
            </div>
            <div className="spec-item">
              <Bed size={18} />
              <span>{capacity > 2 ? 'Double + Single Bed' : 'Queen Size Bed'}</span>
            </div>
            <div className="spec-item">
              <Layers size={18} />
              <span>{floor}</span>
            </div>
            <div className="spec-item">
              <Wind size={18} />
              <span>Air Conditioned / Climate Control</span>
            </div>
            <div className="spec-item">
              <Wifi size={18} />
              <span>High Speed Wi-Fi</span>
            </div>
            <div className="spec-item">
              <Bath size={18} />
              <span>Private En-suite Bathroom</span>
            </div>
          </div>

          {/* Room Description */}
          <div style={{ marginBottom: '1.6rem' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--dark-navy)' }}>
              Room Overview
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.96rem' }}>
              {description}
            </p>
          </div>

          {/* Room Amenities */}
          <div className="modal-amenities-section">
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--dark-navy)' }}>
              Included Room Amenities
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem', marginTop: '0.75rem' }}>
              {facilities.map((fac, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="var(--gold-primary)" />
                  <span>{fac}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--gold-primary)" />
                <span>24/7 Hot & Cold Water</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--gold-primary)" />
                <span>Daily Housekeeping</span>
              </div>
            </div>
          </div>

          {/* Stay Policies */}
          <div style={{ background: 'var(--light-gray)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <strong>Check-In:</strong> {hotelInfo.checkInTime}
            </div>
            <div>
              <strong>Check-Out:</strong> {hotelInfo.checkOutTime}
            </div>
            <div>
              <strong>Reception:</strong> {hotelInfo.receptionHours}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions-footer">
            <a
              href={getRoomEnquiryUrl(`${roomTitle} (${typeName})`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-hero-whatsapp"
              style={{ background: '#25D366', borderColor: '#25D366', color: '#ffffff', flex: 1, justifyContent: 'center' }}
            >
              <MessageCircle size={18} />
              <span>Enquire on WhatsApp</span>
            </a>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleContactClick}
              style={{ flex: 1, padding: '0.8rem' }}
            >
              <Mail size={18} />
              <span>Contact Reception</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;
