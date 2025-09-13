// components/cart/CartItem.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Plus, Minus, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, type CartItem as CartItemType } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import { useSwipe } from "@/hooks/useSwipe";
import { APP_CONFIG, ANIMATION_CONFIG } from "@/lib/constants";

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

export function CartItem({ item, className }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { showToast } = useUI();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showDeleteAction, setShowDeleteAction] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // const itemRef = useRef<HTMLDivElement>(null);
  const deleteThreshold = 80;

  // Handle swipe gestures
  const swipeRef = useSwipe<HTMLDivElement>({
    onSwipeLeft: () => {
      if (swipeOffset > deleteThreshold) {
        handleDelete();
      }
    },
    onSwiping: (direction, distance) => {
      if (direction === 'left') {
        const offset = Math.min(distance, 120);
        setSwipeOffset(offset);
        setShowDeleteAction(offset > deleteThreshold);
      }
    },
    threshold: 20,
  });

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    
    if (newQuantity <= 0) {
      handleDelete();
    } else {
      updateQuantity(item.timestamp, newQuantity);
      
      // Light haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }

    // Animate out
    setTimeout(() => {
      removeFromCart(item.timestamp);
      showToast(`${item.name} removed from cart`, "info");
    }, ANIMATION_CONFIG.microInteraction);
  };

  const resetSwipe = () => {
    setSwipeOffset(0);
    setShowDeleteAction(false);
  };

  const formatPrice = (price: number | "market") => {
    if (price === "market") return "Market Price";
    
    return new Intl.NumberFormat(APP_CONFIG.locale, {
      style: "currency",
      currency: APP_CONFIG.currency,
    }).format(price);
  };

  const getItemTotal = () => {
    if (item.variant.price === "market") return "Market Price";
    
    return new Intl.NumberFormat(APP_CONFIG.locale, {
      style: "currency",
      currency: APP_CONFIG.currency,
    }).format(item.variant.price * item.quantity);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "bg-card rounded-xl",
        "transition-all duration-300",
        isDeleting && "scale-95 opacity-0",
        className
      )}
    >
      {/* Delete Action Background */}
      <div
        className={cn(
          "absolute inset-0 bg-red-500 flex items-center justify-end px-6",
          "transition-opacity duration-200",
          showDeleteAction ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-2 text-white">
          <Trash2 className="w-5 h-5" />
          <span className="font-medium">Delete</span>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={swipeRef}
        className={cn(
          "bg-card p-4 transition-transform duration-200",
          "touch-pan-y" // Allow vertical scrolling while swiping horizontally
        )}
        style={{
          transform: `translateX(-${swipeOffset}px)`,
        }}
        onTouchEnd={resetSwipe}
      >
        <div className="flex gap-3">
          {/* Item Image */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={imageError ? "/images/placeholder.jpg" : item.image}
              alt={item.name}
              fill
              sizes="64px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-medium text-sm truncate pr-2">
                {item.name}
              </h3>
              <span className="text-sm font-semibold text-brand-primary whitespace-nowrap">
                {getItemTotal()}
              </span>
            </div>

            {/* Variant Info */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground capitalize">
                {item.variant.size}
              </span>
              {item.variant.pieces && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {item.variant.pieces} pieces
                  </span>
                </>
              )}
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {formatPrice(item.variant.price)} each
              </span>
            </div>

            {/* Special Instructions */}
            {item.specialInstructions && (
              <div className="mb-2">
                <p className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  <Edit3 className="w-3 h-3 inline mr-1" />
                  {item.specialInstructions}
                </p>
              </div>
            )}

            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className={cn(
                    "w-7 h-7 rounded-full",
                    "bg-muted hover:bg-muted-foreground/20",
                    "flex items-center justify-center",
                    "transition-all duration-200",
                    "active:scale-95",
                    item.quantity <= 1 && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                
                <span className="w-8 text-center font-medium text-sm">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={item.quantity >= 99}
                  className={cn(
                    "w-7 h-7 rounded-full",
                    "bg-muted hover:bg-muted-foreground/20",
                    "flex items-center justify-center",
                    "transition-all duration-200",
                    "active:scale-95",
                    item.quantity >= 99 && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className={cn(
                  "p-1.5 rounded-lg text-red-500",
                  "hover:bg-red-50 active:scale-95",
                  "transition-all duration-200"
                )}
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Hint */}
      {swipeOffset > 10 && swipeOffset < deleteThreshold && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs text-muted-foreground">
          ← Swipe to delete
        </div>
      )}
    </div>
  );
}