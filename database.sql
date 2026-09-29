-- Database Schema for Lodge Billing System

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (Staff & Admins)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  role text check (role in ('admin', 'receptionist', 'cashier')) default 'receptionist',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Hotel Settings
create table hotel_settings (
  id uuid default uuid_generate_v4() primary key,
  hotel_name text not null,
  address text,
  phone text,
  whatsapp text,
  email text,
  description text,
  facilities text[],
  logo_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Room Types
create table room_types (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  default_price numeric(10,2) not null,
  capacity integer default 2,
  facilities text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Rooms
create table rooms (
  id uuid default uuid_generate_v4() primary key,
  room_number text unique not null,
  room_type_id uuid references room_types(id) on delete restrict,
  floor text,
  price numeric(10,2), -- overrides room_type default_price if set
  status text check (status in ('Available', 'Reserved', 'Occupied', 'Cleaning', 'Maintenance', 'Inactive')) default 'Available',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Restaurant Categories
create table restaurant_categories (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Menu Items
create table menu_items (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references restaurant_categories(id) on delete restrict,
  name text not null,
  description text,
  price numeric(10,2) not null,
  is_available boolean default true,
  is_active boolean default true,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Services
create table services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric(10,2) not null,
  unit text default 'per item',
  is_available boolean default true,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Guests
create table guests (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  phone text,
  address text,
  id_proof_type text,
  id_proof_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Stays (Check-ins)
create table stays (
  id uuid default uuid_generate_v4() primary key,
  guest_id uuid references guests(id) on delete cascade not null,
  room_id uuid references rooms(id) on delete restrict not null,
  check_in_date timestamp with time zone not null,
  expected_checkout_date timestamp with time zone not null,
  actual_checkout_date timestamp with time zone,
  number_of_guests integer default 1,
  room_rate numeric(10,2) not null,
  status text check (status in ('active', 'checked_out', 'cancelled')) default 'active',
  notes text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Charges (Running Bill)
create table charges (
  id uuid default uuid_generate_v4() primary key,
  stay_id uuid references stays(id) on delete cascade not null,
  charge_type text check (charge_type in ('room', 'restaurant', 'service', 'custom')) not null,
  description text not null,
  quantity integer default 1,
  unit_price numeric(10,2) not null,
  total_amount numeric(10,2) not null,
  reference_id uuid, -- could reference menu_items.id or services.id if needed
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Payments
create table payments (
  id uuid default uuid_generate_v4() primary key,
  stay_id uuid references stays(id) on delete cascade not null,
  amount numeric(10,2) not null,
  payment_method text check (payment_method in ('Cash', 'UPI', 'Card', 'Bank Transfer', 'Other')) not null,
  note text,
  received_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Discounts
create table discounts (
  id uuid default uuid_generate_v4() primary key,
  stay_id uuid references stays(id) on delete cascade not null,
  amount numeric(10,2) not null,
  reason text,
  applied_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. Invoices
create table invoices (
  id uuid default uuid_generate_v4() primary key,
  invoice_number text unique not null,
  stay_id uuid references stays(id) on delete restrict not null,
  subtotal numeric(10,2) not null,
  discount_total numeric(10,2) default 0,
  net_total numeric(10,2) not null,
  paid_total numeric(10,2) not null,
  balance_due numeric(10,2) not null,
  finalized_at timestamp with time zone default timezone('utc'::text, now()) not null,
  generated_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. Reservations (Optional for future)
create table reservations (
  id uuid default uuid_generate_v4() primary key,
  guest_name text not null,
  phone text,
  room_type_id uuid references room_types(id),
  check_in_date date not null,
  check_out_date date not null,
  number_of_guests integer,
  status text check (status in ('pending', 'confirmed', 'cancelled', 'completed')) default 'pending',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- Setup Row Level Security (RLS)

-- Example RLS policies (You will need to adjust based on exact requirements)
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table hotel_settings enable row level security;
alter table room_types enable row level security;
alter table rooms enable row level security;
alter table restaurant_categories enable row level security;
alter table menu_items enable row level security;
alter table services enable row level security;
alter table guests enable row level security;
alter table stays enable row level security;
alter table charges enable row level security;
alter table payments enable row level security;
alter table discounts enable row level security;
alter table invoices enable row level security;
alter table reservations enable row level security;

-- Public can read hotel_settings, room_types, rooms (available), categories, menu_items
create policy "Public can read hotel settings" on hotel_settings for select using (true);
create policy "Public can read room types" on room_types for select using (true);
create policy "Public can read active rooms" on rooms for select using (is_active = true);
create policy "Public can read categories" on restaurant_categories for select using (is_active = true);
create policy "Public can read menu items" on menu_items for select using (is_active = true);
create policy "Public can read services" on services for select using (is_active = true);

-- Staff can do everything (simplified for now, ideally check role in profiles)
-- A proper policy would check: exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'receptionist', 'cashier'))
-- For development, allowing authenticated users full access to these tables:
create policy "Staff full access" on profiles for all to authenticated using (true);
create policy "Staff full access" on hotel_settings for all to authenticated using (true);
create policy "Staff full access" on room_types for all to authenticated using (true);
create policy "Staff full access" on rooms for all to authenticated using (true);
create policy "Staff full access" on restaurant_categories for all to authenticated using (true);
create policy "Staff full access" on menu_items for all to authenticated using (true);
create policy "Staff full access" on services for all to authenticated using (true);
create policy "Staff full access" on guests for all to authenticated using (true);
create policy "Staff full access" on stays for all to authenticated using (true);
create policy "Staff full access" on charges for all to authenticated using (true);
create policy "Staff full access" on payments for all to authenticated using (true);
create policy "Staff full access" on discounts for all to authenticated using (true);
create policy "Staff full access" on invoices for all to authenticated using (true);
create policy "Staff full access" on reservations for all to authenticated using (true);
