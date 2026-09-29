import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bed,
  UtensilsCrossed,
  BellRing,
  Wifi,
  Car,
  Clock,
  Sparkles,
  Users,
  ShieldCheck,
  HeartHandshake,
  Award,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { hotelInfo, getWhatsAppUrl } from '../../config/hotelInfo';
import { hotelImages } from '../../config/images';

const About = () => {
  // 8 Specific Hotel Amenities
  const amenitiesList = [
    {
      icon: <Bed size={26} />,
      title: "Comfortable Rooms",
      description: "Ergonomically planned rooms with plush bedding, clean linen, and soothing soundproofing."
    },
    {
      icon: <UtensilsCrossed size={26} />,
      title: "Multi-Cuisine Restaurant",
      description: "Freshly prepared traditional Indian, Chinese, and regional breakfast and dinner dishes."
    },
    {
      icon: <BellRing size={26} />,
      title: "Room Service",
      description: "Prompt in-room meal delivery and beverage service delivered directly to your doorstep."
    },
    {
      icon: <Wifi size={26} />,
      title: "High-Speed Wi-Fi",
      description: "Seamless wireless internet throughout the lodge for work, streaming, and connection."
    },
    {
      icon: <Car size={26} />,
      title: "Secure Parking",
      description: "Complimentary on-premises vehicle parking space with 24-hour security supervision."
    },
    {
      icon: <Clock size={26} />,
      title: "24/7 Guest Support",
      description: "Warm reception and dedicated staff always on call to assist with any request or inquiry."
    },
    {
      icon: <Sparkles size={26} />,
      title: "Pristine Clean Rooms",
      description: "Rigorous daily housekeeping standards and hospital-grade sanitization procedures."
    },
    {
      icon: <Users size={26} />,
      title: "Family Friendly",
      description: "Spacious suites and welcoming environment suited for travelers of all generations."
    }
  ];

  return (
    <div className="about-page">
      {/* 1. Hero Banner */}
      <section
        className="about-hero-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.88)), url(${hotelImages.about.facade})`
        }}
      >
        <div className="container">
          <span className="section-tag" style={{ color: 'var(--gold-accent)' }}>
            Welcome to Our Haven
          </span>
          <h1 className="pub-hero-title" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', marginBottom: '0.8rem' }}>
            About Sunrise Lodge & Restaurant
          </h1>
          <p className="pub-hero-subtitle" style={{ marginBottom: 0 }}>
            Dedicated to gracious hospitality, comfort, and peaceful stays nestled in beauty.
          </p>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="section-padding">
        <div className="container">
          <div className="about-preview-grid">
            <div className="about-preview-image-wrap">
              <img
                src={hotelImages.about.lobby}
                alt="Sunrise Lodge Lobby"
                className="about-preview-img-main"
                loading="lazy"
              />
              <div className="about-preview-badge-floating">
                <strong>Hospitality First</strong>
                <span>Welcoming guests with care</span>
              </div>
            </div>

            <div className="about-preview-content">
              <span className="section-tag">Our Heritage & Story</span>
              <h3>Where Comfort Meets Warmth</h3>
              <p>
                Established with a vision to offer travelers a peaceful and memorable home away from home, <strong>{hotelInfo.name}</strong> has emerged as a premier retreat for families, road trippers, and business travelers alike.
              </p>
              <p>
                Our philosophy is simple: authentic warmth, meticulous cleanliness, and delicious, wholesome food. From the moment you arrive at our reception desk, our attentive team is committed to making your stay as effortless and refreshing as possible.
              </p>
              <p>
                Whether you are exploring local attractions or pausing during a journey, our well-maintained rooms provide sanctuary, quietude, and modern convenience.
              </p>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/rooms" className="btn btn-primary">
                  <span>Explore Accommodations</span>
                  <ChevronRight size={18} />
                </Link>

                <a
                  href={getWhatsAppUrl("Hello, I would like to enquire about room bookings at Sunrise Lodge.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <MessageCircle size={18} />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Guests Choose Us (Alternating Section) */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="about-preview-grid" style={{ direction: 'rtl' }}>
            <div className="about-preview-image-wrap" style={{ direction: 'ltr' }}>
              <img
                src={hotelImages.about.diningArea}
                alt="Sunrise Dining Experience"
                className="about-preview-img-main"
                loading="lazy"
              />
            </div>

            <div className="about-preview-content" style={{ direction: 'ltr' }}>
              <span className="section-tag">Guest Experience</span>
              <h3>Why Guests Choose Us</h3>
              <p>
                Our guests return time and time again for the personalized attention, peaceful surroundings, and outstanding dining. We ensure every detail is tended to:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1.5rem 0 2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="highlight-icon" style={{ flexShrink: 0, width: '42px', height: '42px' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-navy)', marginBottom: '2px' }}>
                      Clean & Sanitized Environment
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Every room is deeply cleaned, sanitized, and inspected prior to your arrival.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="highlight-icon" style={{ flexShrink: 0, width: '42px', height: '42px' }}>
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-navy)', marginBottom: '2px' }}>
                      Courteous & Respectful Staff
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Warm, knowledgeable team members ready to assist with any travel requirement.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="highlight-icon" style={{ flexShrink: 0, width: '42px', height: '42px' }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-navy)', marginBottom: '2px' }}>
                      Uncompromised Value
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Affordable room rates that never cut corners on quality, security, or comfort.
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/contact" className="btn btn-primary">
                <span>Contact Our Front Desk</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Amenities Section (8 Cards) */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Convenience & Leisure</span>
            <h2 className="section-title">Lodge Amenities & Facilities</h2>
            <p className="section-subtitle">
              Everything you need for an enjoyable, stress-free stay in one place.
            </p>
            <div className="section-divider" />
          </div>

          <div className="amenities-8-grid">
            {amenitiesList.map((amenity, idx) => (
              <div key={idx} className="amenity-8-card">
                <div className="amenity-8-icon">
                  {amenity.icon}
                </div>
                <h4>{amenity.title}</h4>
                <p>{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
