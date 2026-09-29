import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';
import { seedDatabase } from '../../services/seedService';

const Dashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ totalRooms: 0, occupiedRooms: 0, availableRooms: 0 });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('status, is_active')
        .eq('is_active', true);
      
      if (error) throw error;
      
      const total = rooms.length;
      const occupied = rooms.filter(r => r.status?.toLowerCase() === 'occupied').length;
      const available = rooms.filter(r => r.status?.toLowerCase() === 'available').length;
      
      setStats({ totalRooms: total, occupiedRooms: occupied, availableRooms: available });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedDatabase();
      await fetchStats();
      alert("Database seeded successfully with dummy data!");
    } catch (error) {
      console.error(error);
      alert("Error seeding database: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Dashboard</h2>
          <p className="page-subtitle" style={{ color: '#64748b', margin: '0.2rem 0 0 0' }}>Overview of hotel operations</p>
        </div>
        {stats.totalRooms === 0 && !loading && (
          <button 
            className="btn btn-primary" 
            onClick={handleSeed} 
            disabled={seeding}
          >
            {seeding ? 'Seeding Database...' : 'Seed Dummy Data'}
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading dashboard data...</div>
      ) : (
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          
          <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Total Rooms</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1e293b', marginTop: '0.5rem' }}>
              {stats.totalRooms}
            </div>
          </div>

          <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Occupied</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ef4444', marginTop: '0.5rem' }}>
              {stats.occupiedRooms}
            </div>
          </div>

          <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Available</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10b981', marginTop: '0.5rem' }}>
              {stats.availableRooms}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
