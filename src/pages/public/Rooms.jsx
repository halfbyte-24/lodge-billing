import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import {
  Wifi,
  Tv,
  Wind,
  Bath,
  RotateCcw,
  AlertCircle,
  MessageCircle,
  Eye,
  SlidersHorizontal,
  Sparkles,
  Info
} from 'lucide-react';
import { hotelInfo, getRoomEnquiryUrl } from '../../config/hotelInfo';
import { hotelImages, getRoomImageByType } from '../../config/images';
import RoomDetailsModal from '../../components/public/RoomDetailsModal';

// Curated demo room fallback (only activated with clear user consent if database is empty)
const DEMO_ROOMS = [
  {
    id: "demo-room-101",
    room_number: "101",
    floor: "1",
    price: 800,
    status: "Available",
    room_types: {
      id: "demo-type-std",
      name: "Standard",
      capacity: 2,
      facilities: ["Wi-Fi", "TV", "Attached Bath", "Daily Housekeeping"],
      description: "Cozy standard room featuring comfortable bedding, clean en-suite bath, and restful lighting."
    }
  },
  {
    id: "demo-room-102",
    room_number: "102",
    floor: "1",
    price: 1200,
    status: "Available",
    room_types: {
      id: "demo-type-dlx",
      name: "Deluxe",
      capacity: 2,
      facilities: ["Wi-Fi", "AC", "TV", "Attached Bath"],
      description: "Spacious deluxe room with air conditioning, premium linen, and large picture windows."
    }
  },
  {
    id: "demo-room-201",
    room_number: "201",
    floor: "2",
    price: 1800,
    status: "Available",
    room_types: {
      id: "demo-type-super",
      name: "Super Deluxe",
      capacity: 2,
      facilities: ["Wi-Fi", "AC", "TV", "Mini Fridge", "Balcony View"],
      description: "Premium room with luxury mattress, private balcony view, refrigerator, and executive workspace."
    }
  },
  {
    id: "demo-room-202",
    room_number: "202",
    floor: "2",
    price: 2500,
    status: "Available",
    room_types: {
      id: "demo-type-fam",
      name: "Family",
      capacity: 4,
      facilities: ["Wi-Fi", "AC", "TV", "2 Beds", "Attached Bath"],
      description: "Expansive family room accommodating up to 4 guests with twin queen bedding and spacious bathroom."
    }
  }
];

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const filterCategories = ['All', 'Standard', 'Deluxe', 'Super Deluxe', 'Family'];

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  const fetchPublicRooms = async () => {
    setLoading(true);
    setError(null);
    setIsDemoMode(false);

    try {
      const { data, error: supabaseError } = await supabase
        .from('rooms')
        .select(`
          id,
          room_number,
          floor,
          price,
          status,
          is_active,
          room_types (
            id,
            name,
            capacity,
            facilities,
            description
          )
        `)
        .eq('is_active', true)
        .order('room_number');

      if (supabaseError) {
        throw supabaseError;
      }

      setRooms(data || []);
    } catch (err) {
      console.error("Supabase public rooms fetch error:", err);
      setError(err.message || "Failed to communicate with database");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemoRooms = () => {
    setRooms(DEMO_ROOMS);
    setIsDemoMode(true);
    setError(null);
  };

  // Filter rooms based on active category
  const filteredRooms = rooms.filter((room) => {
    if (activeFilter === 'All') return true;
    const typeName = room.room_types?.name?.toLowerCase() || '';
    return typeName.includes(activeFilter.toLowerCase());
  });

  // Map public status: Never expose 'Cleaning', 'Occupied', or internal admin states
  const getPublicStatus = (status) => {
    if (status === 'Available') {
      return { label: 'Available', isAvailable: true };
    }
    return { label: 'Currently Unavailable', isAvailable: false };
  };

  return (
    <div className="rooms-page">
      {/* 1. Hero Banner */}
      <section className="about-hero-banner" style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.88)), url(${hotelImages.hero.main})`
      }}>
        <div className="container">
          <span className="section-tag" style={{ color: 'var(--gold-accent)' }}>
            Accommodations
          </span>
          <h1 className="pub-hero-title" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', marginBottom: '0.8rem' }}>
            Rooms & Suites
          </h1>
          <p className="pub-hero-subtitle" style={{ marginBottom: 0 }}>
            Comfortable spaces designed for a relaxing, tranquil, and memorable stay.
          </p>
        </div>
      </section>

      {/* 2. Main Content */}
      <section className="section-padding">
        <div className="container">
          {/* Category Filter Tabs */}
          <div className="filter-tabs-wrapper">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-tab-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Transparent Demo Mode Indicator */}
          {isDemoMode && (
            <div style={{ textAlign: 'center' }}>
              <div className="demo-mode-badge">
                <Info size={16} />
                <span>Showing curated preview demo rooms</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="data-state-container">
              <div className="highlight-icon" style={{ margin: '0 auto 1.5rem', width: '56px', height: '56px' }}>
                <RotateCcw size={28} className="animate-spin" />
              </div>
              <h3 className="data-state-title">Loading Rooms...</h3>
              <p className="data-state-desc">Connecting to database and retrieving available rooms.</p>
            </div>
          )}

          {/* Error State: Transparent, does NOT silently fake data */}
          {!loading && error && (
            <div className="data-state-container" style={{ borderColor: 'var(--danger-color)' }}>
              <AlertCircle size={48} color="var(--danger-color)" style={{ margin: '0 auto 1rem' }} />
              <h3 className="data-state-title">Unable to Load Rooms</h3>
              <p className="data-state-desc">
                An error occurred while fetching rooms from Supabase: <br />
                <code style={{ color: 'var(--danger-color)', fontSize: '0.85rem' }}>{error}</code>
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={fetchPublicRooms}
                >
                  <RotateCcw size={16} />
                  <span>Retry Connection</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleLoadDemoRooms}
                >
                  <span>View Demo Showcase</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && rooms.length === 0 && (
            <div className="data-state-container">
              <Info size={48} color="var(--gold-primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 className="data-state-title">No Rooms Available</h3>
              <p className="data-state-desc">
                There are currently no active rooms listed in the database.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleLoadDemoRooms}
              >
                <span>Load Demo Rooms</span>
              </button>
            </div>
          )}

          {/* Success Rooms Grid */}
          {!loading && !error && filteredRooms.length > 0 && (
            <div className="rooms-grid">
              {filteredRooms.map((room) => {
                const roomTitle = `Room ${room.room_number}`;
                const typeName = room.room_types?.name || "Standard";
                const price = room.price || room.room_types?.default_price || 1200;
                const publicStatus = getPublicStatus(room.status);
                const roomImg = getRoomImageByType(typeName);
                const facilities = room.room_types?.facilities || ['Wi-Fi', 'TV', 'Attached Bath'];
                const floorText = room.floor ? `Floor ${room.floor}` : "Standard Floor";

                const enrichedRoom = {
                  ...room,
                  name: roomTitle,
                  type: typeName,
                  image: roomImg,
                  price: price,
                  isAvailable: publicStatus.isAvailable
                };

                return (
                  <div key={room.id} className="room-card">
                    <div className="room-card-img-wrap">
                      <img
                        src={roomImg}
                        alt={`${roomTitle} - ${typeName}`}
                        className="room-card-img"
                        loading="lazy"
                      />
                      <span
                        className={`room-card-status-badge ${
                          publicStatus.isAvailable
                            ? 'room-status-available'
                            : 'room-status-unavailable'
                        }`}
                      >
                        {publicStatus.label}
                      </span>
                      <div className="room-card-price-tag">
                        <strong>₹{price.toLocaleString()}</strong> / night
                      </div>
                    </div>

                    <div className="room-card-body">
                      <span className="room-card-floor">{floorText}</span>
                      <h3 className="room-card-title">
                        {roomTitle} – {typeName}
                      </h3>
                      <p className="room-card-desc">
                        {room.room_types?.description ||
                          `Experience superior hospitality in our ${typeName} room equipped with modern comfort amenities.`}
                      </p>

                      <div className="room-card-amenities">
                        {facilities.slice(0, 3).map((f, i) => (
                          <span key={i} className="amenity-chip">
                            {f}
                          </span>
                        ))}
                        {facilities.length > 3 && (
                          <span className="amenity-chip">+{facilities.length - 3} more</span>
                        )}
                      </div>

                      <div className="room-card-actions">
                        <button
                          type="button"
                          className="btn-card-details"
                          onClick={() => setSelectedRoom(enrichedRoom)}
                        >
                          <Eye size={15} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          <span>View Details</span>
                        </button>

                        <a
                          href={getRoomEnquiryUrl(`${roomTitle} (${typeName})`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-card-enquire"
                        >
                          <MessageCircle size={15} />
                          <span>Enquire</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Filter has 0 results */}
          {!loading && !error && rooms.length > 0 && filteredRooms.length === 0 && (
            <div className="data-state-container">
              <h3 className="data-state-title">No Rooms in this Category</h3>
              <p className="data-state-desc">
                No rooms match the selected category "{activeFilter}".
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveFilter('All')}
              >
                View All Rooms
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Room Details Modal */}
      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};

export default Rooms;
