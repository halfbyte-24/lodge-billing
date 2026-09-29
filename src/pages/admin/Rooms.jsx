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
            has_ac
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
    if (filter === 'AC') return room.room_types?.has_ac;
    if (filter === 'Non-AC') return !room.room_types?.has_ac;
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
      ) : (
        <div className="item-grid">
          {filteredRooms.map(room => {
            const isAvailable = room.status?.toLowerCase() === 'available';
            const roomType = room.room_types?.name || 'Standard';
            
            return (
              <div className="item-card" key={room.id}>
                <div className="item-details" style={{ padding: '1.5rem' }}>
                  <div className="item-header">
                    <h3 className="item-title">Room {room.room_number}</h3>
                    <span className="item-price">₹{room.price}</span>
                  </div>
                  <div className="item-category">{roomType}</div>
                  <div className="item-meta">
                    <span>Capacity: {room.room_types?.capacity || 2}</span>
                    <span>• {room.room_types?.has_ac ? 'AC' : 'Non-AC'}</span>
                  </div>
                  <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
                    <span className={getStatusBadgeClass(room.status)}>{room.status}</span>
                  </div>
                  <div className="item-actions">
                    <button 
                      className={`btn ${isAvailable ? 'btn-primary' : 'btn-disabled'}`}
                      disabled={!isAvailable}
                      onClick={() => addItemToBill({
                        id: room.id,
                        roomId: room.id,
                        roomNumber: room.room_number,
                        name: `Room ${room.room_number} - ${roomType}`,
                        price: room.price
                      }, 'Room')}
                    >
                      {isAvailable ? 'Add to Bill' : 'Not Available'}
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
