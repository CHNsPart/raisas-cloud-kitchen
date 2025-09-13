"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import menuDataJson from "@/data/menu.json";
import type { MenuItem, Category, Restaurant, MenuData } from "@/types/menu";

// Type assertion for the imported JSON data
const menuData = menuDataJson as MenuData;

interface MenuContextType {
  restaurant: Restaurant;
  categories: Category[];
  allItems: MenuItem[];
  featuredItems: MenuItem[];
  searchItems: (query: string) => MenuItem[];
  getItemById: (id: string) => MenuItem | undefined;
  getCategoryById: (id: string) => Category | undefined;
  filterItems: (filters: {
    vegetarian?: boolean;
    spicy?: boolean;
    category?: string;
    priceRange?: [number, number];
  }) => MenuItem[];
  isLoading: boolean;
}

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [restaurant] = useState<Restaurant>(menuData.restaurant);
  const [categories] = useState<Category[]>(menuData.categories);

  // Flatten all items for easier access
  const allItems = categories.flatMap(category => category.items);

  // Get featured items (highest rated)
  const featuredItems = allItems
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  useEffect(() => {
    // Simulate loading state for skeleton loaders
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const searchItems = (query: string): MenuItem[] => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];

    return allItems.filter(item => {
      const matchName = item.name.toLowerCase().includes(searchTerm);
      const matchDescription = item.description.toLowerCase().includes(searchTerm);
      const matchTags = item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      const matchCategory = item.category.toLowerCase().includes(searchTerm);
      
      return matchName || matchDescription || matchTags || matchCategory;
    });
  };

  const getItemById = (id: string): MenuItem | undefined => {
    return allItems.find(item => item.id === id);
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  };

  const filterItems = (filters: {
    vegetarian?: boolean;
    spicy?: boolean;
    category?: string;
    priceRange?: [number, number];
  }): MenuItem[] => {
    return allItems.filter(item => {
      // Vegetarian filter
      if (filters.vegetarian !== undefined && item.isVegetarian !== filters.vegetarian) {
        return false;
      }

      // Spicy filter
      if (filters.spicy !== undefined && item.isSpicy !== filters.spicy) {
        return false;
      }

      // Category filter
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        const itemPrice = item.variants[0].price;
        if (itemPrice === "market") return true; // Include market price items
        if (itemPrice < min || itemPrice > max) {
          return false;
        }
      }

      return true;
    });
  };

  const value: MenuContextType = {
    restaurant,
    categories,
    allItems,
    featuredItems,
    searchItems,
    getItemById,
    getCategoryById,
    filterItems,
    isLoading,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}