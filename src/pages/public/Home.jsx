import React from 'react';
import Header from '../../components/Header';
import '../../styles/public.css';

const Home = () => {
  return (
    <div className="public-layout">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Experience Luxury & Comfort</h1>
            <p>Your perfect stay awaits at Hotel Park. Enjoy premium rooms, delicious food, and excellent service.</p>
            <div className="hero-actions">
              <a href="#rooms" className="btn btn-primary">View Rooms</a>
            </div>
          </div>
        </section>

        {/* Placeholder for other sections */}
        <section id="about" className="section-padding container">
          <h2>About Us</h2>
          <p>Welcome to Hotel Park, where luxury meets comfort. We provide top-notch hospitality for our guests.</p>
        </section>

      </main>
      
      <footer className="public-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Hotel Park. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
