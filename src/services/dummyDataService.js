const INITIAL_ROOMS = [
  { id: '1', number: '101', type: 'Standard', price: 800, capacity: '2 Guests', ac: false, wifi: true, status: 'Available', image: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=300&q=80' },
  { id: '2', number: '102', type: 'Deluxe', price: 1200, capacity: '2-3 Guests', ac: true, wifi: true, status: 'Available', image: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=300&q=80' },
  { id: '3', number: '103', type: 'Super Deluxe', price: 1800, capacity: '3-4 Guests', ac: true, wifi: true, status: 'Occupied', image: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=300&q=80' },
  { id: '4', number: '104', type: 'Family', price: 2500, capacity: '4-6 Guests', ac: true, wifi: true, status: 'Available', image: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=300&q=80' },
  { id: '5', number: '201', type: 'Deluxe', price: 1500, capacity: '2-3 Guests', ac: true, wifi: true, status: 'Available', image: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=300&q=80' },
  { id: '6', number: '202', type: 'Standard', price: 900, capacity: '2 Guests', ac: false, wifi: true, status: 'Cleaning', image: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=300&q=80' }
];

const INITIAL_FOOD = [
  { id: '1', name: 'Chicken Biryani', category: 'Rice & Biryani', price: 220, available: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80', description: 'Delicious chicken biryani' },
  { id: '2', name: 'Butter Chicken', category: 'Main Course', price: 280, available: true, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?w=300&q=80', description: 'Creamy butter chicken' },
  { id: '3', name: 'Paneer Butter Masala', category: 'Indian', price: 220, available: true, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80', description: 'Rich paneer curry' },
  { id: '4', name: 'Veg Fried Rice', category: 'Chinese', price: 160, available: true, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&q=80', description: 'Classic veg fried rice' },
  { id: '5', name: 'Chicken Fried Rice', category: 'Chinese', price: 200, available: true, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&q=80', description: 'Fried rice with chicken chunks' },
  { id: '6', name: 'French Fries', category: 'Snacks', price: 120, available: true, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=300&q=80', description: 'Crispy potato fries' },
  { id: '7', name: 'Gulab Jamun', category: 'Desserts', price: 80, available: true, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=80', description: 'Sweet milk dumplings' }
];

const INITIAL_DRINKS = [
  { id: '1', name: 'Coca Cola', category: 'Soft Drinks', price: 60, available: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80' },
  { id: '2', name: 'Pepsi', category: 'Soft Drinks', price: 60, available: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80' },
  { id: '3', name: 'Fresh Lime Soda', category: 'Juices', price: 80, available: true, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&q=80' },
  { id: '4', name: 'Cold Coffee', category: 'Coffee', price: 140, available: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80' },
  { id: '5', name: 'Masala Tea', category: 'Tea', price: 50, available: true, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&q=80' }
];

const INITIAL_SERVICES = [
  { id: '1', name: 'Extra Bed', category: 'Extra Bed', price: 300, unit: 'per night', available: true, description: 'Additional mattress and bedding' },
  { id: '2', name: 'Laundry', category: 'Laundry', price: 150, unit: 'per piece', available: true, description: 'Washing and ironing' },
  { id: '3', name: 'Room Cleaning', category: 'Cleaning', price: 200, unit: 'per request', available: true, description: 'Extra room cleaning service' }
];

const initializeData = () => {
  if (!localStorage.getItem('lodge_rooms')) localStorage.setItem('lodge_rooms', JSON.stringify(INITIAL_ROOMS));
  if (!localStorage.getItem('lodge_food')) localStorage.setItem('lodge_food', JSON.stringify(INITIAL_FOOD));
  if (!localStorage.getItem('lodge_drinks')) localStorage.setItem('lodge_drinks', JSON.stringify(INITIAL_DRINKS));
  if (!localStorage.getItem('lodge_services')) localStorage.setItem('lodge_services', JSON.stringify(INITIAL_SERVICES));
};

// Rooms
export const getRooms = () => { initializeData(); return JSON.parse(localStorage.getItem('lodge_rooms') || '[]'); };
export const saveRooms = (data) => localStorage.setItem('lodge_rooms', JSON.stringify(data));

// Food
export const getFood = () => { initializeData(); return JSON.parse(localStorage.getItem('lodge_food') || '[]'); };
export const saveFood = (data) => localStorage.setItem('lodge_food', JSON.stringify(data));

// Drinks
export const getDrinks = () => { initializeData(); return JSON.parse(localStorage.getItem('lodge_drinks') || '[]'); };
export const saveDrinks = (data) => localStorage.setItem('lodge_drinks', JSON.stringify(data));

// Services
export const getServices = () => { initializeData(); return JSON.parse(localStorage.getItem('lodge_services') || '[]'); };
export const saveServices = (data) => localStorage.setItem('lodge_services', JSON.stringify(data));
