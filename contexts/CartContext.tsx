"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { MenuItemVariant } from "@/types/menu";

export interface CartItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  variant: MenuItemVariant;
  quantity: number;
  specialInstructions?: string;
  timestamp: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string } // uses timestamp as unique identifier
  | { type: "UPDATE_QUANTITY"; payload: { timestamp: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART"; payload?: boolean }
  | { type: "LOAD_CART"; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: Omit<CartItem, "timestamp">) => void;
  removeFromCart: (timestamp: number) => void;
  updateQuantity: (timestamp: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  getFormattedTotal: () => string;
} | null>(null);

const CART_STORAGE_KEY = "raisa-cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const newState = {
        ...state,
        items: [...state.items, action.payload],
      };
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState.items));
      }
      return newState;
    }

    case "REMOVE_ITEM": {
      const newState = {
        ...state,
        items: state.items.filter(item => item.timestamp.toString() !== action.payload),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState.items));
      }
      return newState;
    }

    case "UPDATE_QUANTITY": {
      const newState = {
        ...state,
        items: state.items.map(item =>
          item.timestamp === action.payload.timestamp
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState.items));
      }
      return newState;
    }

    case "CLEAR_CART": {
      if (typeof window !== "undefined") {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
      return {
        ...state,
        items: [],
      };
    }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: action.payload !== undefined ? action.payload : !state.isOpen,
      };

    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          dispatch({ type: "LOAD_CART", payload: items });
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      }
    }
  }, []);

  const addToCart = (item: Omit<CartItem, "timestamp">) => {
    const cartItem: CartItem = {
      ...item,
      timestamp: Date.now(),
    };
    dispatch({ type: "ADD_ITEM", payload: cartItem });
    
    // Haptic feedback if available
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  const removeFromCart = (timestamp: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: timestamp.toString() });
    
    // Haptic feedback
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  const updateQuantity = (timestamp: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(timestamp);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { timestamp, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleCart = (open?: boolean) => {
    dispatch({ type: "TOGGLE_CART", payload: open });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const price = item.variant.price === "market" ? 0 : item.variant.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getFormattedTotal = () => {
    const total = getCartTotal();
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total);
  };

  const value = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    getCartTotal,
    getItemCount,
    getFormattedTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}