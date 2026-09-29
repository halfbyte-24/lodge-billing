import { supabase } from '../supabase';

export const seedDatabase = async () => {
  console.log("Seeding Database...");

  // Check if room_types already exist
  let { data: roomTypes, error: rtCheckErr } = await supabase.from('room_types').select('*');
  
  if (!roomTypes || roomTypes.length === 0) {
    const roomTypesData = [
      { name: 'Standard', description: 'Cozy standard room', default_price: 800, capacity: 2, facilities: ['Wi-Fi', 'TV'] },
      { name: 'Deluxe', description: 'Spacious room with better view', default_price: 1500, capacity: 2, facilities: ['Wi-Fi', 'TV', 'AC'] },
      { name: 'Super Deluxe', description: 'Premium room with luxury amenities', default_price: 2500, capacity: 2, facilities: ['Wi-Fi', 'TV', 'AC', 'Mini Fridge'] },
      { name: 'Family', description: 'Large room for family stays', default_price: 3000, capacity: 4, facilities: ['Wi-Fi', 'TV', 'AC', '2 Beds'] }
    ];
    const { data: newRT, error: rtError } = await supabase.from('room_types').insert(roomTypesData).select();
    if (rtError) throw new Error("Room Types: " + rtError.message);
    roomTypes = newRT;
  }

  const getTypeId = (name) => roomTypes.find(rt => rt.name === name)?.id;

  // Check if rooms already exist
  const { data: existingRooms } = await supabase.from('rooms').select('id').limit(1);
  if (!existingRooms || existingRooms.length === 0) {
    const roomsData = [
      { room_number: '101', room_type_id: getTypeId('Standard'), floor: '1', price: 800, status: 'Available' },
      { room_number: '102', room_type_id: getTypeId('Standard'), floor: '1', price: 800, status: 'Available' },
      { room_number: '103', room_type_id: getTypeId('Deluxe'), floor: '1', price: 1200, status: 'Available' },
      { room_number: '104', room_type_id: getTypeId('Deluxe'), floor: '1', price: 1200, status: 'Occupied' },
      { room_number: '105', room_type_id: getTypeId('Super Deluxe'), floor: '1', price: 1800, status: 'Available' },
      { room_number: '106', room_type_id: getTypeId('Family'), floor: '1', price: 2500, status: 'Cleaning' },
      
      { room_number: '201', room_type_id: getTypeId('Standard'), floor: '2', price: 900, status: 'Available' },
      { room_number: '202', room_type_id: getTypeId('Standard'), floor: '2', price: 900, status: 'Available' },
      { room_number: '203', room_type_id: getTypeId('Deluxe'), floor: '2', price: 1400, status: 'Available' },
      { room_number: '204', room_type_id: getTypeId('Deluxe'), floor: '2', price: 1400, status: 'Occupied' },
      { room_number: '205', room_type_id: getTypeId('Super Deluxe'), floor: '2', price: 2000, status: 'Available' },
      { room_number: '206', room_type_id: getTypeId('Family'), floor: '2', price: 2600, status: 'Available' },

      { room_number: '301', room_type_id: getTypeId('Standard'), floor: '3', price: 1000, status: 'Available' },
      { room_number: '302', room_type_id: getTypeId('Standard'), floor: '3', price: 1000, status: 'Available' },
      { room_number: '303', room_type_id: getTypeId('Deluxe'), floor: '3', price: 1500, status: 'Available' },
      { room_number: '304', room_type_id: getTypeId('Deluxe'), floor: '3', price: 1500, status: 'Cleaning' },
      { room_number: '305', room_type_id: getTypeId('Super Deluxe'), floor: '3', price: 2200, status: 'Available' },
      { room_number: '306', room_type_id: getTypeId('Family'), floor: '3', price: 2800, status: 'Available' },

      { room_number: '401', room_type_id: getTypeId('Deluxe'), floor: '4', price: 1600, status: 'Available' },
      { room_number: '402', room_type_id: getTypeId('Super Deluxe'), floor: '4', price: 2300, status: 'Available' }
    ];

    const { error: rError } = await supabase.from('rooms').insert(roomsData);
    if (rError) throw new Error("Rooms: " + rError.message);
  }

  // 3. Seed Restaurant Categories
  let { data: categories } = await supabase.from('restaurant_categories').select('*');
  if (!categories || categories.length === 0) {
    const categoriesData = [
      { name: 'Breakfast' }, { name: 'Indian' }, { name: 'Chinese' }, 
      { name: 'Bengali' }, { name: 'Snacks' }, { name: 'Main Course' }, 
      { name: 'Desserts' }, { name: 'Soft Drinks' }, { name: 'Juices' }, 
      { name: 'Tea' }, { name: 'Coffee' }, { name: 'Mocktails' }, { name: 'Water' }
    ];
    const { data: newCats, error: cError } = await supabase.from('restaurant_categories').insert(categoriesData).select();
    if (cError) throw new Error("Categories: " + cError.message);
    categories = newCats;
  }

  const getCatId = (name) => categories.find(c => c.name === name)?.id;

  // 4. Seed Menu Items
  const { data: existingMenu } = await supabase.from('menu_items').select('id').limit(1);
  if (!existingMenu || existingMenu.length === 0) {
    const menuData = [
      // Breakfast
      { category_id: getCatId('Breakfast'), name: 'Aloo Paratha', price: 100 },
      { category_id: getCatId('Breakfast'), name: 'Masala Omelette', price: 120 },
      { category_id: getCatId('Breakfast'), name: 'Bread Omelette', price: 100 },
      { category_id: getCatId('Breakfast'), name: 'Poha', price: 80 },
      { category_id: getCatId('Breakfast'), name: 'Upma', price: 80 },
      { category_id: getCatId('Breakfast'), name: 'Idli Sambar', price: 100 },
      { category_id: getCatId('Breakfast'), name: 'Breakfast Combo', price: 180 },
      { category_id: getCatId('Breakfast'), name: 'Tea & Toast', price: 70 },
      // Food
      { category_id: getCatId('Main Course'), name: 'Chicken Biryani', price: 220 },
      { category_id: getCatId('Main Course'), name: 'Butter Chicken', price: 280 },
      { category_id: getCatId('Chinese'), name: 'Chicken Fried Rice', price: 200 },
      { category_id: getCatId('Chinese'), name: 'Veg Fried Rice', price: 160 },
      { category_id: getCatId('Indian'), name: 'Paneer Butter Masala', price: 240 },
      { category_id: getCatId('Indian'), name: 'Chicken Curry', price: 260 },
      { category_id: getCatId('Indian'), name: 'Dal Tadka', price: 120 },
      { category_id: getCatId('Indian'), name: 'Naan', price: 40 },
      { category_id: getCatId('Snacks'), name: 'French Fries', price: 120 },
      { category_id: getCatId('Desserts'), name: 'Gulab Jamun', price: 80 },
      // Drinks
      { category_id: getCatId('Soft Drinks'), name: 'Coca Cola', price: 60 },
      { category_id: getCatId('Soft Drinks'), name: 'Pepsi', price: 60 },
      { category_id: getCatId('Soft Drinks'), name: 'Sprite', price: 60 },
      { category_id: getCatId('Juices'), name: 'Fresh Orange Juice', price: 120 },
      { category_id: getCatId('Soft Drinks'), name: 'Fresh Lime Soda', price: 90 },
      { category_id: getCatId('Tea'), name: 'Masala Tea', price: 40 },
      { category_id: getCatId('Coffee'), name: 'Cold Coffee', price: 100 },
      { category_id: getCatId('Coffee'), name: 'Cappuccino', price: 120 },
      { category_id: getCatId('Mocktails'), name: 'Virgin Mojito', price: 150 },
      { category_id: getCatId('Water'), name: 'Mineral Water', price: 30 }
    ];

    const { error: mError } = await supabase.from('menu_items').insert(menuData);
    if (mError) throw new Error("Menu Items: " + mError.message);
  }

  // 5. Seed Services
  const { data: existingServices } = await supabase.from('services').select('id').limit(1);
  if (!existingServices || existingServices.length === 0) {
    const servicesData = [
      { name: 'Extra Bed', price: 300, unit: 'per night' },
      { name: 'Laundry', price: 150, unit: 'per piece' },
      { name: 'Room Cleaning', price: 100, unit: 'per request' },
      { name: 'Airport Pickup', price: 800, unit: 'per trip' },
      { name: 'Spa Service', price: 1200, unit: 'per session' },
      { name: 'Breakfast Service', price: 200, unit: 'per person' },
      { name: 'Extra Person', price: 500, unit: 'per night' }
    ];

    const { error: sError } = await supabase.from('services').insert(servicesData);
    if (sError) throw new Error("Services: " + sError.message);
  }

  return true;
};
