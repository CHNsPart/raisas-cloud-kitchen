export interface MenuItemVariant {
  size: string;
  price: number | "market";
  pieces: number | null;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  availability: "fresh" | "frozen" | "both";
  rating: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  variants: MenuItemVariant[];
  tags: string[];
  includes?: string[];
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  items: MenuItem[];
}

export interface Restaurant {
  name: string;
  description: string;
  type: string;
  deliveryTime: string;
  status: "open" | "closed";
}

export interface MenuMetadata {
  totalCategories: number;
  totalItems: number;
  lastUpdated: string;
  version: string;
  currency: string;
  imageBasePath: string;
  availabilityTypes: string[];
  priceTypes: string[];
}

export interface MenuData {
  restaurant: Restaurant;
  categories: Category[];
  metadata: MenuMetadata;
}