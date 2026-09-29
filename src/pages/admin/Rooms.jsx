import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useBill } from '../../contexts/BillContext';
import { seedDatabase } from '../../services/seedService';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [seeding, setSeeding] = useState(false);
  const { addItemToBill } = useBill();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
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
            facilities
          )
        `)
        .eq('is_active', true)
        .order('room_number');

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedDatabase();
      await fetchRooms();
      alert("Database seeded successfully with dummy data!");
    } catch (error) {
      console.error(error);
      alert("Error seeding database: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  const categories = ['All', 'Standard', 'Deluxe', 'AC', 'Non-AC'];

  const filteredRooms = rooms.filter(room => {
    if (filter === 'All') return true;
    if (filter === 'AC') return room.room_types?.facilities?.includes('AC');
    if (filter === 'Non-AC') return !room.room_types?.facilities?.includes('AC');
    return room.room_types?.name === filter;
  });

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'badge available';
      case 'occupied': return 'badge occupied';
      case 'cleaning': return 'badge cleaning';
      case 'maintenance': return 'badge maintenance';
      default: return 'badge';
    }
  };

  const getRoomImage = (roomType) => {
    switch (roomType) {
      case 'Deluxe': return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; // Deluxe room
      case 'Super Deluxe': return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; // Luxury room
      case 'Family': return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; // Family room
      default: return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; // Standard room
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Rooms</h2>
          <p className="page-subtitle">Select a room to add to bill</p>
        </div>
        {rooms.length === 0 && !loading && (
          <button 
            className="btn btn-primary" 
            onClick={handleSeed} 
            disabled={seeding}
          >
            {seeding ? 'Seeding Database...' : 'Seed Dummy Data'}
          </button>
        )}
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '2rem 0' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem' }}>No rooms found.</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Click Seed Dummy Data to load demo rooms.</p>
          <button 
            className="btn btn-primary" 
            onClick={handleSeed} 
            disabled={seeding}
          >
            {seeding ? 'Seeding Database...' : 'Seed Dummy Data'}
          </button>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '2rem 0' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem' }}>No rooms match the selected filter.</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Try selecting 'All' or a different category.</p>
          <button className="btn btn-outline" onClick={() => setFilter('All')}>Clear Filters</button>
        </div>
      ) : (
        <div className="item-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredRooms.map(room => {
            const isAvailable = room.status?.toLowerCase() === 'available';
            const roomType = room.room_types?.name || 'Standard';
            const hasAC = room.room_types?.facilities?.includes('AC');
            
            return (
              <div className="item-card" key={room.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <img 
                  src={getRoomImage(roomType)} 
                  alt={`${roomType} Room`} 
                  style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }} 
                />
                <div className="item-details" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="item-header">
                    <h3 className="item-title">Room {room.room_number}</h3>
                    <span className="item-price">₹{room.price}</span>
                  </div>
                  <div className="item-category">{roomType} Room</div>
                  <div className="item-meta" style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                    <span>Floor {room.floor}</span>
                  </div>
                  <div className="item-meta" style={{ flex: 1 }}>
                    <span>{room.room_types?.capacity || 2} Guests</span>
                    <span>• {hasAC ? 'AC' : 'Non-AC'}</span>
                    <span>• Wi-Fi</span>
                  </div>
                  <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
                    <span className={getStatusBadgeClass(room.status)}>{room.status}</span>
                  </div>
                  <div className="item-actions">
                    <button 
                      className={`btn ${isAvailable ? 'btn-primary' : 'btn-disabled'}`}
                      disabled={!isAvailable}
                      style={{ width: '100%' }}
                      onClick={() => addItemToBill({
                        id: room.id,
                        roomId: room.id,
                        roomNumber: room.room_number,
                        name: `Room ${room.room_number} - ${roomType} Room`,
                        price: room.price
                      }, 'Room')}
                    >
                      {isAvailable ? 'Add to Bill' : room.status}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Rooms;
