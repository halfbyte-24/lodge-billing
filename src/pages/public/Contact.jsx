import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { hotelInfo, getWhatsAppUrl, getDirectionsUrl } from '../../config/hotelInfo';
import { hotelImages } from '../../config/images';
import LocationMap from '../../components/public/LocationMap';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your contact phone number.";
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Please enter your enquiry message or stay dates.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate clean form handling without fake backend calls
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        message: ''
      });
    }, 400);
  };

  return (
    <div className="contact-page">
      {/* 1. Hero Banner */}
      <section
        className="about-hero-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.88)), url(${hotelImages.hero.main})`
        }}
      >
        <div className="container">
          <span className="section-tag" style={{ color: 'var(--gold-accent)' }}>
            Get in Touch
          </span>
          <h1 className="pub-hero-title" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', marginBottom: '0.8rem' }}>
            Contact & Reservations
          </h1>
          <p className="pub-hero-subtitle" style={{ marginBottom: 0 }}>
            We are always here to assist with your booking inquiries, room reservations, and special requests.
          </p>
        </div>
      </section>

      {/* 2. Contact Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="contact-layout-grid">
            {/* Left Column: Contact Information */}
            <div className="contact-info-card">
              <h3>{hotelInfo.name}</h3>
              <p className="contact-info-subtitle">
                Feel free to call, email, or message our front desk at any time.
              </p>

              <div className="contact-details-list">
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <MapPin size={22} />
                  </div>
                  <div className="contact-item-text">
                    <span>Lodge Address</span>
                    <p>{hotelInfo.address}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <Phone size={22} />
                  </div>
                  <div className="contact-item-text">
                    <span>Phone Numbers</span>
                    <p>
                      <a href={`tel:${hotelInfo.phone.replace(/[^0-9+]/g, '')}`}>{hotelInfo.phone}</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <Mail size={22} />
                  </div>
                  <div className="contact-item-text">
                    <span>Email Address</span>
                    <p>
                      <a href={`mailto:${hotelInfo.email}`}>{hotelInfo.email}</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <Clock size={22} />
                  </div>
                  <div className="contact-item-text">
                    <span>Front Desk Hours</span>
                    <p>{hotelInfo.receptionHours}</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Call to Action */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1.8rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                  Prefer immediate assistance? Connect directly on WhatsApp with our front desk:
                </p>
                <a
                  href={getWhatsAppUrl("Hello, I would like to enquire about room availability and stay at Sunrise Lodge.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-hero-whatsapp"
                  style={{ width: '100%', justifyContent: 'center', background: '#25D366', borderColor: '#25D366' }}
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="contact-form-card">
              <h3>Send an Enquiry</h3>
              <p>
                Fill out the details below and our reservations team will get back to you promptly.
              </p>

              {/* Success Notification */}
              {submitted && (
                <div className="contact-success-alert">
                  <CheckCircle2 size={32} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
                  <h4>Thank you!</h4>
                  <p>
                    Thank you! Your enquiry has been received. Our team will contact you shortly.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setSubmitted(false)}
                    style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', borderColor: '#059669', color: '#065f46' }}
                  >
                    Send Another Enquiry
                  </button>
                </div>
              )}

              {!submitted && (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group-pub">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    {errors.fullName && (
                      <span className="form-error-feedback">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="form-row-2">
                    <div className="form-group-pub">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <span className="form-error-feedback">{errors.phone}</span>
                      )}
                    </div>

                    <div className="form-group-pub">
                      <label htmlFor="email">Email Address (Optional)</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="e.g. rahul@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <span className="form-error-feedback">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group-pub">
                    <label htmlFor="message">Your Message or Booking Details *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Please specify your planned check-in / check-out dates, room type preference, and number of guests..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                    {errors.message && (
                      <span className="form-error-feedback">{errors.message}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                  >
                    <Send size={18} />
                    <span>{isSubmitting ? 'Sending Enquiry...' : 'Send Enquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Location & Directions Map */}
      <LocationMap title="Location & Map" />
    </div>
  );
};

export default Contact;
