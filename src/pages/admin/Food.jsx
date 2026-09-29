import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useBill } from '../../contexts/BillContext';
import { seedDatabase } from '../../services/seedService';

const Food = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [seeding, setSeeding] = useState(false);
  const { addItemToBill } = useBill();

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
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
      setFoodItems(data || []);
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedDatabase();
      await fetchFoodItems();
      alert("Database seeded successfully with dummy data!");
    } catch (error) {
      console.error(error);
      alert("Error seeding database: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  const categories = ['All', 'Breakfast', 'Starters', 'Main Course', 'Rice & Biryani', 'Chinese', 'Indian', 'Snacks', 'Desserts'];

  const filteredFood = foodItems.filter(item => {
    if (filter === 'All') return true;
    return item.restaurant_categories?.name === filter;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Food</h2>
          <p className="page-subtitle">Select food items to add to bill</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {foodItems.length === 0 && !loading && (
            <button 
              className="btn btn-primary" 
              onClick={handleSeed} 
              disabled={seeding}
            >
              {seeding ? 'Seeding Database...' : 'Seed Dummy Data'}
            </button>
          )}
          <button className="btn btn-outline">Admin Manage Menu</button>
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
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading food...</div>
      ) : (
        <div className="item-grid">
          {filteredFood.map(item => (
            <div className="item-card" key={item.id}>
              {item.image_url && <img src={item.image_url} alt={item.name} className="item-image" />}
              <div className="item-details" style={{ padding: '1.5rem' }}>
                <div className="item-header">
                  <h3 className="item-title">{item.name}</h3>
                  <span className="item-price">₹{item.price}</span>
                </div>
                <div className="item-category">{item.restaurant_categories?.name || 'Food'}</div>
                <p className="item-meta" style={{ fontSize: '0.8rem', flex: 1 }}>{item.description}</p>
                
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
                    }, 'Food')}
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

export default Food;
