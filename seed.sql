-- 1. Create Room Types
INSERT INTO room_types (id, name, description, default_price, capacity, facilities, created_at)
VALUES 
  (gen_random_uuid(), 'Standard', 'Cozy standard room', 800, 2, ARRAY['Wi-Fi', 'TV'], now()),
  (gen_random_uuid(), 'Deluxe', 'Spacious room with better view', 1500, 2, ARRAY['Wi-Fi', 'TV', 'AC'], now()),
  (gen_random_uuid(), 'Super Deluxe', 'Premium room with luxury amenities', 2500, 2, ARRAY['Wi-Fi', 'TV', 'AC', 'Mini Fridge'], now()),
  (gen_random_uuid(), 'Family', 'Large room for family stays', 3000, 4, ARRAY['Wi-Fi', 'TV', 'AC', '2 Beds'], now());

-- 2. Create Rooms
-- We use a CTE or standard subquery to reference the room_types we just created.
DO $$ 
DECLARE
  standard_id uuid;
  deluxe_id uuid;
  super_deluxe_id uuid;
  family_id uuid;
BEGIN
  SELECT id INTO standard_id FROM room_types WHERE name = 'Standard' LIMIT 1;
  SELECT id INTO deluxe_id FROM room_types WHERE name = 'Deluxe' LIMIT 1;
  SELECT id INTO super_deluxe_id FROM room_types WHERE name = 'Super Deluxe' LIMIT 1;
  SELECT id INTO family_id FROM room_types WHERE name = 'Family' LIMIT 1;

  INSERT INTO rooms (id, room_number, room_type_id, floor, price, status) VALUES
    (gen_random_uuid(), '101', standard_id, '1', 800, 'Available'),
    (gen_random_uuid(), '102', deluxe_id, '1', 1500, 'Available'),
    (gen_random_uuid(), '103', super_deluxe_id, '1', 2500, 'Available'),
    (gen_random_uuid(), '104', family_id, '1', 3000, 'Available'),
    (gen_random_uuid(), '201', deluxe_id, '2', 1500, 'Available'),
    (gen_random_uuid(), '202', standard_id, '2', 800, 'Available'),
    (gen_random_uuid(), '203', deluxe_id, '2', 1500, 'Occupied'),
    (gen_random_uuid(), '204', family_id, '2', 3000, 'Available'),
    (gen_random_uuid(), '301', standard_id, '3', 800, 'Cleaning'),
    (gen_random_uuid(), '302', super_deluxe_id, '3', 2500, 'Available');
END $$;

-- 3. Create Restaurant Categories
INSERT INTO restaurant_categories (id, name, is_active)
VALUES
  (gen_random_uuid(), 'Breakfast', true),
  (gen_random_uuid(), 'Indian', true),
  (gen_random_uuid(), 'Chinese', true),
  (gen_random_uuid(), 'Bengali', true),
  (gen_random_uuid(), 'Snacks', true),
  (gen_random_uuid(), 'Main Course', true),
  (gen_random_uuid(), 'Desserts', true),
  (gen_random_uuid(), 'Soft Drinks', true),
  (gen_random_uuid(), 'Juices', true),
  (gen_random_uuid(), 'Tea', true),
  (gen_random_uuid(), 'Coffee', true),
  (gen_random_uuid(), 'Mocktails', true),
  (gen_random_uuid(), 'Water', true);

-- 4. Create Menu Items
DO $$
DECLARE
  breakfast_id uuid;
  indian_id uuid;
  chinese_id uuid;
  snacks_id uuid;
  main_course_id uuid;
  desserts_id uuid;
  soft_drinks_id uuid;
  juices_id uuid;
  tea_id uuid;
  coffee_id uuid;
  water_id uuid;
BEGIN
  SELECT id INTO breakfast_id FROM restaurant_categories WHERE name = 'Breakfast' LIMIT 1;
  SELECT id INTO indian_id FROM restaurant_categories WHERE name = 'Indian' LIMIT 1;
  SELECT id INTO chinese_id FROM restaurant_categories WHERE name = 'Chinese' LIMIT 1;
  SELECT id INTO snacks_id FROM restaurant_categories WHERE name = 'Snacks' LIMIT 1;
  SELECT id INTO main_course_id FROM restaurant_categories WHERE name = 'Main Course' LIMIT 1;
  SELECT id INTO desserts_id FROM restaurant_categories WHERE name = 'Desserts' LIMIT 1;
  SELECT id INTO soft_drinks_id FROM restaurant_categories WHERE name = 'Soft Drinks' LIMIT 1;
  SELECT id INTO juices_id FROM restaurant_categories WHERE name = 'Juices' LIMIT 1;
  SELECT id INTO tea_id FROM restaurant_categories WHERE name = 'Tea' LIMIT 1;
  SELECT id INTO coffee_id FROM restaurant_categories WHERE name = 'Coffee' LIMIT 1;
  SELECT id INTO water_id FROM restaurant_categories WHERE name = 'Water' LIMIT 1;

  INSERT INTO menu_items (id, category_id, name, description, price, is_available) VALUES
    -- Food
    (gen_random_uuid(), breakfast_id, 'Aloo Paratha', 'Stuffed Indian flatbread with potatoes', 100, true),
    (gen_random_uuid(), breakfast_id, 'Masala Omelette', 'Indian style spicy omelette', 120, true),
    (gen_random_uuid(), breakfast_id, 'Bread Omelette', 'Classic bread and omelette', 100, true),
    (gen_random_uuid(), breakfast_id, 'Poha', 'Flattened rice cooked with spices', 80, true),
    (gen_random_uuid(), breakfast_id, 'Upma', 'Thick semolina porridge', 80, true),
    (gen_random_uuid(), breakfast_id, 'Idli Sambar', 'Rice cakes with lentil soup', 100, true),
    (gen_random_uuid(), breakfast_id, 'Breakfast Combo', 'Complete morning meal', 180, true),
    (gen_random_uuid(), breakfast_id, 'Tea + Toast', 'Light morning snack', 70, true),
    
    (gen_random_uuid(), main_course_id, 'Chicken Biryani', 'Aromatic rice with spiced chicken', 220, true),
    (gen_random_uuid(), main_course_id, 'Butter Chicken', 'Chicken in creamy tomato gravy', 280, true),
    (gen_random_uuid(), chinese_id, 'Chicken Fried Rice', 'Wok-tossed rice with chicken', 200, true),
    (gen_random_uuid(), chinese_id, 'Veg Fried Rice', 'Wok-tossed rice with vegetables', 160, true),
    (gen_random_uuid(), indian_id, 'Paneer Butter Masala', 'Cottage cheese in rich gravy', 240, true),
    (gen_random_uuid(), indian_id, 'Chicken Curry', 'Home-style chicken curry', 260, true),
    (gen_random_uuid(), indian_id, 'Dal Tadka', 'Tempered yellow lentils', 120, true),
    (gen_random_uuid(), indian_id, 'Naan', 'Tandoori flatbread', 40, true),
    (gen_random_uuid(), snacks_id, 'French Fries', 'Crispy potato fries', 120, true),
    (gen_random_uuid(), snacks_id, 'Masala Dosa', 'Crispy crepe with potato filling', 140, true),
    (gen_random_uuid(), desserts_id, 'Gulab Jamun', 'Sweet milk dumplings in syrup', 80, true),

    -- Drinks
    (gen_random_uuid(), soft_drinks_id, 'Coca Cola', 'Chilled 250ml', 60, true),
    (gen_random_uuid(), soft_drinks_id, 'Pepsi', 'Chilled 250ml', 60, true),
    (gen_random_uuid(), soft_drinks_id, 'Sprite', 'Chilled 250ml', 60, true),
    (gen_random_uuid(), juices_id, 'Fresh Orange Juice', 'Freshly squeezed', 120, true),
    (gen_random_uuid(), soft_drinks_id, 'Fresh Lime Soda', 'Sweet or salted', 90, true),
    (gen_random_uuid(), tea_id, 'Masala Tea', 'Spiced Indian tea', 40, true),
    (gen_random_uuid(), coffee_id, 'Cold Coffee', 'Creamy iced coffee', 100, true),
    (gen_random_uuid(), coffee_id, 'Cappuccino', 'Hot frothy coffee', 120, true),
    (gen_random_uuid(), water_id, 'Mineral Water', '1L Bottle', 30, true);
END $$;

-- 5. Create Services
INSERT INTO services (id, name, price, unit, is_available) VALUES
  (gen_random_uuid(), 'Extra Bed', 300, 'per night', true),
  (gen_random_uuid(), 'Laundry', 150, 'per piece', true),
  (gen_random_uuid(), 'Room Cleaning', 100, 'per request', true),
  (gen_random_uuid(), 'Airport Pickup', 800, 'per trip', true),
  (gen_random_uuid(), 'Spa Service', 1200, 'per session', true),
  (gen_random_uuid(), 'Breakfast Service', 200, 'per person', true),
  (gen_random_uuid(), 'Extra Person', 500, 'per night', true);
