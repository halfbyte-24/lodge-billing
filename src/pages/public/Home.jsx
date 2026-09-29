import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bed,
  UtensilsCrossed,
  Clock,
  MapPin,
  Wifi,
  Tv,
  Wind,
  Bath,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Coffee,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { hotelInfo, getWhatsAppUrl, getDirectionsUrl } from '../../config/hotelInfo';
import { hotelImages } from '../../config/images';
import LocationMap from '../../components/public/LocationMap';

const Home = () => {
  // 4 Featured Rooms for the preview section
  const featuredRooms = [
    {
      id: "feat-1",
      name: "Standard Room",
      price: 800,
      description: "Cozy and tranquil retreat designed with comfort and essential modern amenities.",
      image: hotelImages.rooms.standard,
      amenities: ["Wi-Fi", "TV", "Attached Bath", "Daily Housekeeping"]
    },
    {
      id: "feat-2",
      name: "Deluxe Room",
      price: 1200,
      description: "Spacious interior featuring refined finishes, air conditioning, and peaceful scenic views.",
      image: hotelImages.rooms.deluxe,
      amenities: ["Wi-Fi", "AC", "TV", "En-suite Bath"]
    },
    {
      id: "feat-3",
      name: "Super Deluxe Room",
      price: 1800,
      description: "Superior comfort boasting premium king bedding, mini-fridge, and luxury bath fittings.",
      image: hotelImages.rooms.superDeluxe,
      amenities: ["Wi-Fi", "AC", "Smart TV", "Mini Fridge"]
    },
    {
      id: "feat-4",
      name: "Family Room",
      price: 2500,
      description: "Generous layout equipped with dual bedding, ideal for families and traveling groups.",
      image: hotelImages.rooms.family,
      amenities: ["Wi-Fi", "AC", "2 Beds", "Family Space"]
    }
  ];

  // 4 Core Why Choose Us features
  const coreFeatures = [
    {
      icon: <Bed size={28} />,
      title: "Comfortable Rooms",
      description: "Spacious, well-ventilated rooms with plush mattresses, pristine linens, and soothing ambiance."
    },
    {
      icon: <UtensilsCrossed size={28} />,
      title: "Delicious Restaurant",
      description: "Freshly cooked local delicacies, multi-cuisine favorites, and refreshing breakfast spreads."
    },
    {
      icon: <Clock size={28} />,
      title: "24/7 Guest Support",
      description: "Attentive front desk and room service round the clock to ensure your stay is hassle-free."
    },
    {
      icon: <MapPin size={28} />,
      title: "Prime Location",
      description: "Peaceful setting with convenient access to transportation, nature parks, and local landmarks."
    }
  ];

  // Mini preview dishes
  const previewDishes = [
    { name: "Chicken Biryani", price: "₹220", image: hotelImages.restaurant.biryani },
    { name: "Butter Chicken", price: "₹280", image: hotelImages.restaurant.butterChicken },
    { name: "Chicken Fried Rice", price: "₹200", image: hotelImages.restaurant.friedRice },
    { name: "Paneer Butter Masala", price: "₹240", image: hotelImages.restaurant.paneer }
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section
        className="pub-hero"
        style={{ backgroundImage: `url(${hotelImages.hero.main})` }}
      >
        <div className="pub-hero-overlay" />
        <div className="pub-hero-content">
          <div className="pub-hero-badge">
            <Sparkles size={14} />
            <span>Welcome to Luxury Hospitality</span>
          </div>

          <h1 className="pub-hero-title">Experience Luxury & Comfort</h1>

          <p className="pub-hero-subtitle">
            Your perfect stay awaits at {hotelInfo.name}. Enjoy premium rooms, delicious food, and warm hospitality.
          </p>

          <div className="pub-hero-buttons">
            <Link to="/rooms" className="btn btn-hero-primary">
              <span>Explore Rooms</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href={getWhatsAppUrl("Hello, I would like to enquire about staying at Sunrise Lodge & Restaurant.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-whatsapp"
            >
              <MessageCircle size={18} />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Quick Highlights Bar */}
      <section className="quick-highlights-bar">
        <div className="quick-highlights-container">
          <div className="highlight-item">
            <div className="highlight-icon">
              <Clock size={24} />
            </div>
            <div className="highlight-text">
              <h4>24/7 Front Desk</h4>
              <p>Round-the-clock service</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon">
              <UtensilsCrossed size={24} />
            </div>
            <div className="highlight-text">
              <h4>Fine Dining</h4>
              <p>Fresh multi-cuisine meals</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon">
              <Wifi size={24} />
            </div>
            <div className="highlight-text">
              <h4>High-Speed Wi-Fi</h4>
              <p>Complimentary connection</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="highlight-text">
              <h4>Safe & Peaceful</h4>
              <p>Relaxed, secure environment</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Preview Section */}
      <section className="section-padding">
        <div className="container">
          <div className="about-preview-grid">
            <div className="about-preview-image-wrap">
              <img
                src={hotelImages.about.facade}
                alt={`${hotelInfo.name} property exterior`}
                className="about-preview-img-main"
                loading="lazy"
              />
              <div className="about-preview-badge-floating">
                <strong>Luxury & Peace</strong>
                <span>Your home away from home</span>
              </div>
            </div>

            <div className="about-preview-content">
              <span className="section-tag">About Our Lodge</span>
              <h3>Stay Somewhere Special</h3>
              <p>
                Nestled amidst serene natural surroundings, <strong>{hotelInfo.name}</strong> blends tranquil relaxation with modern lodge elegance. Whether you are traveling for leisure, family vacations, or business, we provide impeccably maintained rooms, personalized care, and an authentic culinary experience.
              </p>
              <p>
                From freshly brewed morning tea to quiet evenings in restful suites, every moment is crafted to ensure comfort, privacy, and lasting memories.
              </p>

              <div className="about-highlights-list">
                <div className="about-highlight-item">
                  <ShieldCheck size={18} />
                  <span>Sanitized & Immaculate Rooms</span>
                </div>
                <div className="about-highlight-item">
                  <Coffee size={18} />
                  <span>In-House Restaurant & Service</span>
                </div>
                <div className="about-highlight-item">
                  <Wifi size={18} />
                  <span>Free High Speed Internet</span>
                </div>
                <div className="about-highlight-item">
                  <Clock size={18} />
                  <span>Attentive 24/7 Care</span>
                </div>
              </div>

              <Link to="/about" className="btn btn-primary" style={{ padding: '0.75rem 1.6rem' }}>
                <span>Discover More</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Rooms */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Accommodations</span>
            <h2 className="section-title">Featured Rooms & Suites</h2>
            <p className="section-subtitle">
              Carefully appointed spaces designed for rejuvenating relaxation, uninterrupted sleep, and modern convenience.
            </p>
            <div className="section-divider" />
          </div>

          <div className="rooms-grid">
            {featuredRooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-card-img-wrap">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="room-card-img"
                    loading="lazy"
                  />
                  <span className="room-card-status-badge room-status-available">
                    Available
                  </span>
                  <div className="room-card-price-tag">
                    <strong>₹{room.price}</strong> / night
                  </div>
                </div>

                <div className="room-card-body">
                  <h3 className="room-card-title">{room.name}</h3>
                  <p className="room-card-desc">{room.description}</p>

                  <div className="room-card-amenities">
                    {room.amenities.map((amenity, idx) => (
                      <span key={idx} className="amenity-chip">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="room-card-actions" style={{ gridTemplateColumns: '1fr' }}>
                    <Link to="/rooms" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      <span>View Room</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/rooms" className="btn btn-outline" style={{ padding: '0.8rem 2rem' }}>
              <span>Explore All Rooms & Check Availability</span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Sunrise Experience</span>
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">
              We take pride in exceptional service, immaculate cleanliness, and heartfelt hospitality that brings guests back.
            </p>
            <div className="section-divider" />
          </div>

          <div className="features-grid">
            {coreFeatures.map((feat, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  {feat.icon}
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Restaurant Preview */}
      <section className="section-padding" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="restaurant-preview-banner">
            <div className="restaurant-preview-grid">
              <div className="restaurant-preview-text">
                <span className="section-tag" style={{ color: 'var(--gold-accent)' }}>
                  Culinary Delights
                </span>
                <h3>Dining at Sunrise</h3>
                <p>
                  Enjoy freshly prepared meals, refreshing drinks, and delicious breakfast options made by seasoned cooks. From rich aromatic biryanis to comforting teas, we cater to every palate.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/restaurant" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem' }}>
                    <span>Explore Restaurant</span>
                    <ArrowRight size={18} />
                  </Link>

                  <a
                    href={getWhatsAppUrl("Hello, I would like to enquire about dining and food options at Sunrise Restaurant.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}
                  >
                    <MessageCircle size={18} />
                    <span>Order via WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* 4 Mini dish preview cards */}
              <div className="restaurant-preview-dishes-grid">
                {previewDishes.map((dish, idx) => (
                  <div key={idx} className="mini-dish-card">
                    <img src={dish.image} alt={dish.name} className="mini-dish-img" loading="lazy" />
                    <div className="mini-dish-info">
                      <h4>{dish.name}</h4>
                      <span className="mini-dish-price">{dish.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Location Preview */}
      <LocationMap title="Location & Access" />
    </div>
  );
};

export default Home;
