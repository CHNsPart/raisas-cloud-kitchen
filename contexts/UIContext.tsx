"use client";

import { MenuItem } from "@/types/menu";
import React, { createContext, useContext, useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface UIContextType {
  // Modal/Drawer states
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  isItemDrawerOpen: boolean;
  selectedItem: MenuItem | null;
  openItemDrawer: (item: MenuItem) => void;
  closeItemDrawer: () => void;
  
  // Navigation
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"], duration?: number) => void;
  removeToast: (id: string) => void;
  
  // Loading states
  isAddingToCart: boolean;
  setIsAddingToCart: (loading: boolean) => void;
  
  // Mobile specific
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  
  // Scroll position tracking
  scrollY: number;
  setScrollY: (y: number) => void;
  isScrollingUp: boolean;
  setIsScrollingUp: (up: boolean) => void;
  
  // PWA install prompt
  installPrompt: any;
  setInstallPrompt: (prompt: any) => void;
  isInstallable: boolean;
  setIsInstallable: (installable: boolean) => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  // Modal/Drawer states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isItemDrawerOpen, setIsItemDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Navigation
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Loading states
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Mobile specific
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Scroll tracking
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  
  // PWA install
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const openItemDrawer = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    setIsItemDrawerOpen(true);
    
    // Prevent body scroll when drawer is open
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const closeItemDrawer = useCallback(() => {
    setIsItemDrawerOpen(false);
    
    // Restore body scroll
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    
    // Clear selected item after animation
    setTimeout(() => setSelectedItem(null), 300);
  }, []);

  const showToast = useCallback((
    message: string,
    type: Toast["type"] = "info",
    duration: number = 3000
  ) => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    // Haptic feedback for success
    if (type === "success" && typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const value: UIContextType = {
    isSearchOpen,
    setIsSearchOpen,
    isItemDrawerOpen,
    selectedItem,
    openItemDrawer,
    closeItemDrawer,
    activeCategory,
    setActiveCategory,
    toasts,
    showToast,
    removeToast,
    isAddingToCart,
    setIsAddingToCart,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    scrollY,
    setScrollY,
    isScrollingUp,
    setIsScrollingUp,
    installPrompt,
    setInstallPrompt,
    isInstallable,
    setIsInstallable,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}