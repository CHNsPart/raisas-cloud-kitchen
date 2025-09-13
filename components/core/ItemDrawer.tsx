"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Star, Flame, Leaf, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import { useSwipe } from "@/hooks/useSwipe";
import { APP_CONFIG, ANIMATION_CONFIG, Z_INDEX } from "@/lib/constants";
import type { MenuItemVariant } from "@/types/menu";

export function ItemDrawer() {
  const { selectedItem, isItemDrawerOpen, closeItemDrawer, showToast } = useUI();
  const { addToCart } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset state when item changes
  useEffect(() => {
    if (selectedItem && selectedItem.variants.length > 0) {
      setSelectedVariant(selectedItem.variants[0]);
      setQuantity(1);
      setSpecialInstructions("");
    }
  }, [selectedItem]);

  // Handle swipe down to close
  const swipeRef = useSwipe<HTMLDivElement>({
    onSwipeDown: () => {
      if (isItemDrawerOpen) {
        closeItemDrawer();
      }
    },
    threshold: 100,
  });

  const handleAddToCart = async () => {
    if (!selectedItem || !selectedVariant) return;
    
    setIsAdding(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setTimeout(() => {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: selectedItem.id,
          name: selectedItem.name,
          description: selectedItem.description,
          image: selectedItem.image,
          category: selectedItem.category,
          variant: selectedVariant,
          quantity: 1,
          specialInstructions: i === 0 ? specialInstructions : undefined,
        });
      }
      
      showToast(
        `${quantity} × ${selectedItem.name} added to cart`,
        "success"
      );
      
      setIsAdding(false);
      closeItemDrawer();
    }, ANIMATION_CONFIG.microInteraction);
  };

  const updateQuantity = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(99, quantity + delta));
    setQuantity(newQuantity);
    
    // Light haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const formatPrice = (price: number | "market") => {
    if (price === "market") return "Market Price";
    
    return new Intl.NumberFormat(APP_CONFIG.locale, {
      style: "currency",
      currency: APP_CONFIG.currency,
    }).format(price);
  };

  const getTotalPrice = () => {
    if (!selectedVariant || selectedVariant.price === "market") {
      return "Market Price";
    }
    
    const total = selectedVariant.price * quantity;
    return new Intl.NumberFormat(APP_CONFIG.locale, {
      style: "currency",
      currency: APP_CONFIG.currency,
    }).format(total);
  };

  if (!selectedItem) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm",
          "transition-opacity duration-300",
          isItemDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ zIndex: Z_INDEX.overlay }}
        onClick={closeItemDrawer}
      />

      {/* Drawer */}
      <div
        ref={swipeRef}
        className={cn(
          "fixed bottom-0 left-0 right-0",
          "bg-background rounded-t-2xl",
          "max-h-[90vh] overflow-hidden",
          "transform transition-transform duration-300 ease-out",
          isItemDrawerOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{ zIndex: Z_INDEX.modal }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={closeItemDrawer}
          className={cn(
            "absolute top-4 right-4",
            "w-8 h-8 rounded-full",
            "bg-muted/80 backdrop-blur-sm",
            "flex items-center justify-center",
            "hover:bg-muted active:scale-95",
            "transition-all duration-200"
          )}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-48px)] pb-safe">
          {/* Image */}
          <div className="relative h-64 sm:h-80 bg-muted">
            <Image
              src={imageError ? "/images/placeholder.jpg" : selectedItem.image}
              alt={selectedItem.name}
              fill
              sizes="100vw"
              className="object-cover"
              onError={() => setImageError(true)}
              priority
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {selectedItem.isVegetarian && (
                <div className="bg-green-500 text-white rounded-full p-2" title="Vegetarian">
                  <Leaf className="w-4 h-4" />
                </div>
              )}
              {selectedItem.isSpicy && (
                <div className="bg-red-500 text-white rounded-full p-2" title="Spicy">
                  <Flame className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium">{selectedItem.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Title & Description */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {selectedItem.name}
              </h2>
              <p className="text-muted-foreground mt-2">
                {selectedItem.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted px-3 py-1.5 rounded-full capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Variants */}
            {selectedItem.variants.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Choose Option</h3>
                <div className="space-y-2">
                  {selectedItem.variants.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 transition-all",
                        "flex items-center justify-between",
                        selectedVariant?.size === variant.size
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      <div className="text-left">
                        <div className="font-medium capitalize">{variant.size}</div>
                        {variant.pieces && (
                          <div className="text-sm text-muted-foreground">
                            {variant.pieces} pieces
                          </div>
                        )}
                      </div>
                      <div className="font-semibold text-brand-primary">
                        {formatPrice(variant.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <label htmlFor="instructions" className="text-sm font-semibold mb-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Special Instructions (Optional)
              </label>
              <textarea
                id="instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="E.g., Extra spicy, no onions, etc."
                className={cn(
                  "w-full p-3 rounded-lg",
                  "border border-border",
                  "bg-background",
                  "resize-none",
                  "focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
                  "transition-all duration-200"
                )}
                rows={3}
                maxLength={200}
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {specialInstructions.length}/200
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                  className={cn(
                    "w-8 h-8 rounded-full",
                    "bg-muted hover:bg-muted-foreground/20",
                    "flex items-center justify-center",
                    "transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "active:scale-95"
                  )}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                
                <button
                  onClick={() => updateQuantity(1)}
                  disabled={quantity >= 99}
                  className={cn(
                    "w-8 h-8 rounded-full",
                    "bg-muted hover:bg-muted-foreground/20",
                    "flex items-center justify-center",
                    "transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "active:scale-95"
                  )}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !selectedVariant}
              className={cn(
                "w-full py-4 rounded-xl",
                "bg-brand-primary text-white",
                "font-semibold text-lg",
                "hover:bg-brand-secondary",
                "active:scale-[0.98]",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-3"
              )}
            >
              {isAdding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart • {getTotalPrice()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Import ShoppingBag icon
import { ShoppingBag } from "lucide-react";