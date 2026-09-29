/**
 * Central Hotel Information & Configuration
 * 
 * Update this file to change hotel contact details, address,
 * coordinates, or social links across the entire public website.
 */
export const hotelInfo = {
  name: "Sunrise Lodge & Restaurant",
  tagline: "Experience Luxury & Comfort",
  description:
    "Your perfect stay awaits at Sunrise Lodge & Restaurant. Enjoy premium rooms, delicious multi-cuisine dining, and warm hospitality nestled in serene comfort.",

  // Location configuration (Set latitude & longitude when known)
  address: "Station Road, Near Nature Park, Dooars, West Bengal (Configure in src/config/hotelInfo.js)",
  latitude: null, // e.g. 26.6834 (set to null if not yet determined)
  longitude: null, // e.g. 88.5833 (set to null if not yet determined)
  mapsUrl: "", // Optional direct Google Maps link or Google Business URL

  // Contact details
  phone: "+91 98765 43210",
  whatsapp: "919876543210", // Phone number without '+' or special characters for wa.me URL
  email: "stay@sunriselodge.com",

  // Lodge details
  checkInTime: "12:00 PM",
  checkOutTime: "11:00 AM",
  receptionHours: "24/7 Front Desk & Guest Support",

  // Social Links
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    whatsapp: "https://wa.me/919876543210",
  },
};

/**
 * Builds a valid WhatsApp click-to-chat URL with properly encoded message
 * @param {string} customMessage - Message to pre-fill
 * @returns {string} - WhatsApp URL
 */
export const getWhatsAppUrl = (customMessage) => {
  const baseNumber = hotelInfo.whatsapp.replace(/[^0-9]/g, '');
  const message = customMessage || "Hello, I would like to enquire about Sunrise Lodge & Restaurant.";
  return `https://wa.me/${baseNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Builds a WhatsApp URL for room enquiry
 * @param {string} roomName - Name/Number of room
 * @returns {string}
 */
export const getRoomEnquiryUrl = (roomName) => {
  const text = `Hello, I would like to enquire about ${roomName || "a room"} at Sunrise Lodge & Restaurant.`;
  return getWhatsAppUrl(text);
};

/**
 * Builds a WhatsApp URL for restaurant/menu item enquiry
 * @param {string} itemName - Name of dish or drink
 * @returns {string}
 */
export const getRestaurantEnquiryUrl = (itemName) => {
  const text = `Hello, I would like to enquire about ${itemName || "dining"} at Sunrise Restaurant.`;
  return getWhatsAppUrl(text);
};

/**
 * Generates Google Maps Directions URL
 * Safely handles missing coordinates by falling back to search query
 */
export const getDirectionsUrl = () => {
  if (hotelInfo.mapsUrl) {
    return hotelInfo.mapsUrl;
  }
  if (hotelInfo.latitude !== null && hotelInfo.longitude !== null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${hotelInfo.latitude},${hotelInfo.longitude}`;
  }
  if (hotelInfo.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      hotelInfo.name + ", " + hotelInfo.address
    )}`;
  }
  return "https://www.google.com/maps";
};
