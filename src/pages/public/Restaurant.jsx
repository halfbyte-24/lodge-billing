import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import {
  UtensilsCrossed,
  RotateCcw,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Info,
  Clock,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { hotelInfo, getRestaurantEnquiryUrl, getWhatsAppUrl } from '../../config/hotelInfo';
import { hotelImages, getMenuItemImage } from '../../config/images';

// Curated demo menu fallback (only displayed if explicitly activated or if DB is unseeded)
const DEMO_MENU = [
  {
    id: "demo-m-1",
    name: "Chicken Biryani",
    category: "Rice & Biryani",
    price: 220,
    description: "Slow-cooked aromatic basmati rice layered with tender spiced chicken, saffron, and fresh mint."
  },
  {
    id: "demo-m-2",
    name: "Butter Chicken",
    category: "Main Course",
    price: 280,
    description: "Succulent chicken chunks simmered in a velvety smooth tomato, butter, and cream gravy."
  },
  {
    id: "demo-m-3",
    name: "Chicken Fried Rice",
    category: "Rice & Biryani",
    price: 200,
    description: "Wok-tossed fragrant rice with shredded chicken, scrambled eggs, and crunchy fresh garden veggies."
  },
  {
    id: "demo-m-4",
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 240,
    description: "Cubes of fresh cottage cheese cooked in an authentic mildly spiced, buttery tomato makhani sauce."
  },
  {
    id: "demo-m-5",
    name: "Aloo Paratha",
    category: "Breakfast",
    price: 100,
    description: "Traditional golden Indian flatbread stuffed with spiced potato mash, served with curd and pickle."
  },
  {
    id: "demo-m-6",
    name: "Masala Dosa",
    category: "Breakfast",
    price: 140,
    description: "Crispy fermented rice and lentil crepe stuffed with tempered spiced potatoes, sambar, and chutneys."
  },
  {
    id: "demo-m-7",
    name: "French Fries",
    category: "Snacks",
    price: 120,
    description: "Crispy golden potato fingers tossed in light sea salt, served hot with tangy tomato salsa."
  },
  {
    id: "demo-m-8",
    name: "Fresh Orange Juice",
    category: "Drinks",
    price: 120,
    description: "Pure freshly squeezed seasonal oranges, served chilled with natural citrus goodness."
  },
  {
    id: "demo-m-9",
    name: "Coca Cola",
    category: "Drinks",
    price: 60,
    description: "Chilled refreshing 250ml beverage served on ice."
  },
  {
    id: "demo-m-10",
    name: "Cold Coffee",
    category: "Drinks",
    price: 100,
    description: "Thick creamy iced blend of espresso coffee, chilled dairy milk, and chocolate drizzle."
  },
  {
    id: "demo-m-11",
    name: "Masala Tea",
    category: "Drinks",
    price: 40,
    description: "Traditional Indian cutting chai brewed with aromatic cardamom, ginger, and cloves."
  },
  {
    id: "demo-m-12",
    name: "Gulab Jamun",
    category: "Desserts",
    price: 80,
    description: "Warm golden milk dumplings soaked in fragrant rose water and cardamom sugar syrup."
  }
];

const Restaurant = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const categories = [
    'All',
    'Breakfast',
    'Main Course',
    'Rice & Biryani',
    'Snacks',
    'Drinks',
    'Desserts'
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    setIsDemoMode(false);

    try {
      const { data, error: supabaseError } = await supabase
        .from('menu_items')
        .select(`
          id,
          name,
          description,
          price,
          is_available,
          image_url,
          restaurant_categories (
            name
          )
        `)
        .eq('is_active', true)
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      setMenuItems(data || []);
    } catch (err) {
      console.error("Supabase public restaurant menu fetch error:", err);
      setError(err.message || "Failed to load restaurant menu");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemoMenu = () => {
    setMenuItems(DEMO_MENU);
    setIsDemoMode(true);
    setError(null);
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    if (activeCategory === 'All') return true;
    const catName = (item.restaurant_categories?.name || item.category || '').toLowerCase();
    const filterNorm = activeCategory.toLowerCase();

    if (filterNorm === 'rice & biryani') {
      return catName.includes('rice') || catName.includes('biryani') || catName.includes('chinese');
    }
    if (filterNorm === 'drinks') {
      return catName.includes('drink') || catName.includes('juice') || catName.includes('tea') || catName.includes('coffee') || catName.includes('water');
    }
    return catName.includes(filterNorm);
  });

  return (
    <div className="restaurant-page">
      {/* 1. Hero Banner */}
      <section
        className="about-hero-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.9)), url(${hotelImages.restaurant.hero})`
        }}
      >
        <div className="container">
          <span className="section-tag" style={{ color: 'var(--gold-accent)' }}>
            Dining at Sunrise
          </span>
          <h1 className="pub-hero-title" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', marginBottom: '0.8rem' }}>
            Culinary Craftsmanship
          </h1>
          <p className="pub-hero-subtitle" style={{ marginBottom: '1.5rem' }}>
            Enjoy freshly prepared meals, refreshing drinks, and authentic comfort cuisine prepared by our skilled chefs.
          </p>
          <a
            href={getWhatsAppUrl("Hello, I would like to order or enquire about restaurant dining at Sunrise.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-hero-whatsapp"
            style={{ display: 'inline-flex' }}
          >
            <MessageCircle size={18} />
            <span>Order / Enquire via WhatsApp</span>
          </a>
        </div>
      </section>

      {/* 2. Restaurant Service Highlights */}
      <section className="section-padding" style={{ padding: '3.5rem 0 1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="highlight-icon">
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', marginBottom: '2px' }}>Breakfast Hours</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>7:30 AM – 10:30 AM</p>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="highlight-icon">
                <UtensilsCrossed size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', marginBottom: '2px' }}>Lunch & Dinner</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>12:00 PM – 10:30 PM</p>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="highlight-icon">
                <Coffee size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', marginBottom: '2px' }}>In-Room Dining</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Hot meals served to your room</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Menu Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tag">Our Delicious Menu</span>
            <h2 className="section-title">Discover Our Flavors</h2>
            <p className="section-subtitle">
              Prepared fresh on order with high-quality ingredients, traditional spices, and culinary love.
            </p>
            <div className="section-divider" />
          </div>

          {/* Category Tabs */}
          <div className="filter-tabs-wrapper">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Demo Indicator */}
          {isDemoMode && (
            <div style={{ textAlign: 'center' }}>
              <div className="demo-mode-badge">
                <Info size={16} />
                <span>Showing curated demo restaurant menu</span>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="data-state-container">
              <div className="highlight-icon" style={{ margin: '0 auto 1.5rem', width: '56px', height: '56px' }}>
                <RotateCcw size={28} className="animate-spin" />
              </div>
              <h3 className="data-state-title">Loading Restaurant Menu...</h3>
              <p className="data-state-desc">Fetching food and beverage listings from the kitchen database.</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="data-state-container" style={{ borderColor: 'var(--danger-color)' }}>
              <AlertCircle size={48} color="var(--danger-color)" style={{ margin: '0 auto 1rem' }} />
              <h3 className="data-state-title">Unable to Load Menu</h3>
              <p className="data-state-desc">
                An error occurred while loading items from Supabase: <br />
                <code style={{ color: 'var(--danger-color)', fontSize: '0.85rem' }}>{error}</code>
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={fetchMenuItems}
                >
                  <RotateCcw size={16} />
                  <span>Retry Connection</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleLoadDemoMenu}
                >
                  <span>View Curated Menu Showcase</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && menuItems.length === 0 && (
            <div className="data-state-container">
              <UtensilsCrossed size={48} color="var(--gold-primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 className="data-state-title">Menu Under Preparation</h3>
              <p className="data-state-desc">
                No items are currently active in the database menu.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleLoadDemoMenu}
              >
                <span>Load Demo Menu Items</span>
              </button>
            </div>
          )}

          {/* Food Cards Grid */}
          {!loading && !error && filteredItems.length > 0 && (
            <div className="restaurant-grid">
              {filteredItems.map((item) => {
                const categoryName = item.restaurant_categories?.name || item.category || "Special";
                const itemImg = item.image_url || getMenuItemImage(item.name, categoryName);
                const price = item.price || 150;

                return (
                  <div key={item.id} className="food-card">
                    <div className="food-card-img-wrap">
                      <img
                        src={itemImg}
                        alt={item.name}
                        className="food-card-img"
                        loading="lazy"
                      />
                      <span className="food-category-badge">{categoryName}</span>
                    </div>

                    <div className="food-card-body">
                      <h3 className="food-card-title">{item.name}</h3>
                      <p className="food-card-desc">
                        {item.description || "Freshly cooked to order with authentic seasonings and premium ingredients."}
                      </p>

                      <div className="food-card-footer">
                        <span className="food-price">₹{price}</span>
                        <a
                          href={getRestaurantEnquiryUrl(item.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-food-enquire"
                        >
                          <MessageCircle size={14} />
                          <span>Order on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 0 items in filtered category */}
          {!loading && !error && menuItems.length > 0 && filteredItems.length === 0 && (
            <div className="data-state-container">
              <h3 className="data-state-title">No Items in this Category</h3>
              <p className="data-state-desc">
                No menu items found under "{activeCategory}".
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveCategory('All')}
              >
                View All Menu Items
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Restaurant;
