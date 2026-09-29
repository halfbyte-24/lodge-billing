/**
 * Curated high-resolution imagery for Sunrise Lodge & Restaurant
 * Optimized with high performance CDN parameters & fallbacks
 */
export const hotelImages = {
  hero: {
    main: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80",
    alt: "Sunrise Lodge & Restaurant Luxury Property",
  },
  about: {
    facade: "https://images.unsplash.com/photo-1566073171589-408c3c6460c2?auto=format&fit=crop&w=1200&q=80",
    lobby: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    diningArea: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    garden: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
  },
  rooms: {
    standard: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
    deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
    superDeluxe: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80",
    family: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
    suite: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
  },
  restaurant: {
    hero: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
    biryani: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    butterChicken: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
    friedRice: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    paneer: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
    snacks: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
    coldDrinks: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    orangeJuice: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    desserts: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    masalaChai: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
  }
};

/**
 * Helper to get a room image based on room type name
 */
export const getRoomImageByType = (typeName = "") => {
  const normalized = typeName.toLowerCase();
  if (normalized.includes("family")) return hotelImages.rooms.family;
  if (normalized.includes("super deluxe")) return hotelImages.rooms.superDeluxe;
  if (normalized.includes("deluxe")) return hotelImages.rooms.deluxe;
  if (normalized.includes("standard")) return hotelImages.rooms.standard;
  return hotelImages.rooms.deluxe;
};

/**
 * Helper to get restaurant image based on category or item name
 */
export const getMenuItemImage = (name = "", category = "") => {
  const normName = name.toLowerCase();
  const normCat = category.toLowerCase();

  if (normName.includes("biryani")) return hotelImages.restaurant.biryani;
  if (normName.includes("butter chicken") || normName.includes("curry")) return hotelImages.restaurant.butterChicken;
  if (normName.includes("fried rice") || normName.includes("chinese")) return hotelImages.restaurant.friedRice;
  if (normName.includes("paneer")) return hotelImages.restaurant.paneer;
  if (normName.includes("fries") || normName.includes("snack") || normName.includes("dosa")) return hotelImages.restaurant.snacks;
  if (normName.includes("juice")) return hotelImages.restaurant.orangeJuice;
  if (normName.includes("cola") || normName.includes("pepsi") || normName.includes("sprite") || normCat.includes("drink")) return hotelImages.restaurant.coldDrinks;
  if (normName.includes("jamun") || normName.includes("sweet") || normCat.includes("dessert")) return hotelImages.restaurant.desserts;
  if (normName.includes("tea") || normName.includes("chai") || normName.includes("coffee")) return hotelImages.restaurant.masalaChai;
  if (normCat.includes("breakfast") || normName.includes("paratha") || normName.includes("omelette")) return hotelImages.restaurant.breakfast;

  return hotelImages.restaurant.biryani;
};
