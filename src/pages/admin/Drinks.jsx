import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useBill } from '../../contexts/BillContext';
import { seedDatabase } from '../../services/seedService';

const Drinks = () => {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [seeding, setSeeding] = useState(false);
  const { addItemToBill } = useBill();

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          id,
          name,
          description,
          price,
          is_available,
          image_url,
          restaurant_categories (name)
        `)
        .eq('is_active', true);

      if (error) throw error;
      setDrinks(data || []);
    } catch (error) {
      console.error("Error fetching drinks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedDatabase();
      await fetchDrinks();
      alert("Database seeded successfully with dummy data!");
    } catch (error) {
      console.error(error);
      alert("Error seeding database: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  const categories = ['All', 'Soft Drinks', 'Juices', 'Tea', 'Coffee', 'Mocktails', 'Water'];

  const filteredDrinks = drinks.filter(item => {
    if (filter === 'All') return true;
    return item.restaurant_categories?.name === filter;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Drinks</h2>
          <p className="page-subtitle">Select drinks to add to bill</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {drinks.length === 0 && !loading && (
            <button 
              className="btn btn-primary" 
              onClick={handleSeed} 
              disabled={seeding}
            >
              {seeding ? 'Seeding Database...' : 'Seed Dummy Data'}
            </button>
          )}
          <button className="btn btn-outline">Manage Drinks</button>
        </div>
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
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading drinks...</div>
      ) : (
        <div className="item-grid">
          {filteredDrinks.map(item => (
            <div className="item-card" key={item.id}>
              {item.image_url && <img src={item.image_url} alt={item.name} className="item-image" />}
              <div className="item-details" style={{ padding: '1.5rem' }}>
                <div className="item-header">
                  <h3 className="item-title">{item.name}</h3>
                  <span className="item-price">₹{item.price}</span>
                </div>
                <div className="item-category">{item.restaurant_categories?.name || 'Drink'}</div>
                
                <div style={{ marginBottom: '1rem', marginTop: '0.5rem', flex: 1, display: 'flex', alignItems: 'flex-end' }}>
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
                    }, 'Drink')}
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

export default Drinks;
