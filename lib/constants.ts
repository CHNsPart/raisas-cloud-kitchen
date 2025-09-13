// lib/constants.ts
export const APP_CONFIG = {
  name: "Raisa's Chinese Food",
  shortName: "Raisa's",
  description: "Authentic Chinese flavors, crafted with love",
  currency: "CAD",
  locale: "en-CA",
  phoneNumber: process.env.NEXT_PUBLIC_PHONE || "+1-437-566-6989",
  email: process.env.NEXT_PUBLIC_EMAIL || "order@raisaschinese.com",
  address: process.env.NEXT_PUBLIC_ADDRESS || "Peterborough, Ontario, Canada",
  city: "Peterborough",
  province: "Ontario",
  country: "Canada",
} as const;

export const DELIVERY_CONFIG = {
  minOrderAmount: 20, // CAD
  deliveryFee: 4.99, // CAD
  freeDeliveryThreshold: 40, // CAD
  estimatedTime: "25-30 min",
  maxDistance: 8, // kilometers
  servicedAreas: [
    "Downtown Peterborough",
    "East City",
    "West End",
    "North End",
    "South End",
  ],
} as const;

export const ANIMATION_CONFIG = {
  microInteraction: 200,
  transition: 300,
  pageTransition: 400,
  stagger: 50,
  skeleton: 500,
} as const;

export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
  tooltip: 70,
} as const;

export const SWIPE_THRESHOLD = {
  horizontal: 50,
  vertical: 100,
  velocity: 0.5,
} as const;

export const IMAGE_QUALITY = {
  thumbnail: 30,
  card: 50,
  hero: 75,
  full: 90,
} as const;

export const CACHE_KEYS = {
  cart: "raisa-cart",
  favorites: "raisa-favorites",
  recentOrders: "raisa-recent-orders",
  userPreferences: "raisa-preferences",
} as const;

export const API_ENDPOINTS = {
  menu: "/api/menu",
  order: "/api/order",
  tracking: "/api/tracking",
  feedback: "/api/feedback",
} as const;

export const SEO_DEFAULTS = {
  title: "Raisa's Chinese Food - Authentic Chinese Flavors | Cloud Kitchen",
  titleTemplate: "%s | Raisa's Chinese Food",
  description: "Order authentic Chinese cuisine from Raisa's Cloud Kitchen. Fresh ingredients, traditional recipes, and fast delivery.",
  keywords: [
    "Chinese restaurant",
    "cloud kitchen",
    "Chinese food delivery",
    "Manchurian chicken",
    "fried rice",
    "Chinese takeaway",
  ],
  ogImage: "/og-image.jpg",
  twitterImage: "/twitter-image.jpg",
} as const;

export const RATING_CONFIG = {
  max: 5,
  precision: 0.5,
  colors: {
    filled: "#ac0b14",
    empty: "#E5E7EB",
  },
} as const;

export const TOAST_DURATION = {
  short: 2000,
  medium: 3000,
  long: 5000,
} as const;