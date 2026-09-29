import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useBill } from '../../contexts/BillContext';
import { seedDatabase } from '../../services/seedService';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const { addItemToBill } = useBill();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedDatabase();
      await fetchServices();
      alert("Database seeded successfully with dummy data!");
    } catch (error) {
      console.error(error);
      alert("Error seeding database: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Services</h2>
          <p className="page-subtitle">Add extra services to bill</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {services.length === 0 && !loading && (
            <button 
              className="btn btn-primary" 
              onClick={handleSeed} 
              disabled={seeding}
            >
              {seeding ? 'Seeding Database...' : 'Seed Dummy Data'}
            </button>
          )}
          <button className="btn btn-outline">Manage Services</button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading services...</div>
      ) : (
        <div className="item-grid">
          {services.map(item => (
            <div className="item-card" key={item.id}>
              <div className="item-details" style={{ padding: '1.5rem' }}>
                <div className="item-header">
                  <h3 className="item-title">{item.name}</h3>
                  <span className="item-price">₹{item.price}</span>
                </div>
                <div className="item-category">Service</div>
                <p className="item-meta" style={{ fontSize: '0.8rem', flex: 1 }}>{item.unit}</p>
                
                <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
                  <span className={item.is_available ? 'badge available' : 'badge occupied'}>
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <div className="item-actions">
                  <button 
                    className={`btn ${item.is_available ? 'btn-primary' : 'btn-disabled'}`}
                    disabled={!item.is_available}
                    onClick={() => addItemToBill({
                      id: item.id,
                      name: item.name,
                      price: item.price
                    }, 'Service')}
                  >
                    {item.is_available ? 'Add to Bill' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
