import React from 'react';

const Settings = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p className="page-subtitle">Configure hotel information</p>
        </div>
      </div>
      <div className="item-card" style={{ padding: '2rem' }}>
        <p>Settings configuration panel will go here (connected to Supabase hotel_settings).</p>
      </div>
    </div>
  );
};

export default Settings;
