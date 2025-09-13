// components/cart/CartDrawer.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import { useSwipe } from "@/hooks/useSwipe";
import { ANIMATION_CONFIG, Z_INDEX } from "@/lib/constants";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { PromoCode } from "./PromoCode";
import { CheckoutButton } from "./CheckoutButton";

export function CartDrawer() {
  const { state, clearCart, getItemCount, getCartTotal, toggleCart } = useCart();
  const { showToast } = useUI();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Handle swipe down to close
  const swipeRef = useSwipe<HTMLDivElement>({
    onSwipeDown: () => {
      if (state.isOpen) {
        handleClose();
      }
    },
    threshold: 100,
  });

  useEffect(() => {
    if (state.isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      if (isVisible) {
        setIsClosing(true);
        setTimeout(() => {
          setIsVisible(false);
          setIsClosing(false);
          document.body.style.overflow = "";
        }, ANIMATION_CONFIG.transition);
      }
    }

    return () => {
      if (!state.isOpen) {
        document.body.style.overflow = "";
      }
    };
  }, [state.isOpen, isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      toggleCart(false);
    }, ANIMATION_CONFIG.microInteraction);
  };

  const handleClearCart = () => {
    if (state.items.length === 0) return;
    
    clearCart();
    showToast("Cart cleared", "info");
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm",
          "transition-opacity duration-300",
          state.isOpen && !isClosing ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ zIndex: Z_INDEX.overlay }}
        onClick={handleClose}
      />

      {/* Cart Drawer */}
      <div
        className={cn(
          "fixed inset-0 bg-background flex flex-col",
          "transform transition-transform duration-300 ease-out",
          state.isOpen && !isClosing ? "translate-x-0" : "translate-x-full"
        )}
        style={{ zIndex: Z_INDEX.modal }}
      >
        {/* Fixed Header - Only this area has swipe-to-close */}
        <div 
          ref={swipeRef}
          className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-20 flex-shrink-0"
        >
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className={cn(
                  "p-2 -ml-2 rounded-lg",
                  "hover:bg-muted active:scale-95",
                  "transition-all duration-200"
                )}
                aria-label="Close cart"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-semibold">
                  Your Cart ({getItemCount()})
                </h2>
              </div>
            </div>

            {state.items.length > 0 && (
              <button
                onClick={handleClearCart}
                className={cn(
                  "p-2 rounded-lg text-red-500",
                  "hover:bg-red-50 active:scale-95",
                  "transition-all duration-200"
                )}
                aria-label="Clear cart"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Drag Handle */}
          <div className="flex justify-center pb-3">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
        </div>

        {/* Content Area - Single Scroll */}
        {state.items.length === 0 ? (
          <EmptyCartState onClose={handleClose} />
        ) : (
          <>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {/* Cart Items */}
              <div className="px-4 pt-6 pb-4">
                <div className="space-y-3">
                  {state.items.map((item, index) => (
                    <div
                      key={item.timestamp}
                      className="animate-in fade-in-0 slide-in-from-right-4 duration-300"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="px-4 py-6 bg-muted/30 mx-4 rounded-xl mb-6">
                <PromoCode />
              </div>

              {/* Order Summary */}
              <div className="px-4 pb-6">
                <CartSummary />
              </div>

              {/* Scroll Indicator - Subtle gradient at bottom */}
              <div className="h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>

            {/* Fixed Bottom - Checkout Button */}
            <div className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur-lg">
              <div className="px-4 py-4 safe-area-bottom">
                <CheckoutButton 
                  total={getCartTotal()}
                  itemCount={getItemCount()}
                  onCheckout={() => {
                    // TODO: Implement checkout flow
                    showToast("Call to place your order!", "info");
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Empty Cart State
function EmptyCartState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      {/* Empty State Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-muted to-muted/60 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/60" />
        </div>
        {/* Floating food emojis */}
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🥟</div>
        <div className="absolute -bottom-1 -left-3 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>🍜</div>
        <div className="absolute top-4 -left-4 text-lg animate-bounce" style={{ animationDelay: '1s' }}>🥢</div>
      </div>
      
      <h3 className="text-2xl font-bold text-foreground mb-3 text-center">
        Your cart is empty
      </h3>
      
      <p className="text-muted-foreground text-center mb-8 max-w-md text-lg leading-relaxed">
        Add some delicious Chinese dishes to get started. Our fresh ingredients and authentic flavors are waiting for you!
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={onClose}
          className={cn(
            "w-full py-4 px-6 rounded-xl",
            "bg-brand-primary text-white",
            "hover:bg-brand-secondary",
            "active:scale-[0.98]",
            "transition-all duration-200",
            "font-semibold text-lg",
            "shadow-lg shadow-brand-primary/25"
          )}
        >
          Browse Menu
        </button>
        
        <button
          onClick={() => {
            // TODO: Navigate to featured items
            onClose();
          }}
          className={cn(
            "w-full py-3 px-6 rounded-xl",
            "bg-muted text-foreground",
            "hover:bg-muted-foreground/10",
            "active:scale-[0.98]",
            "transition-all duration-200",
            "font-medium"
          )}
        >
          View Popular Items
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-md text-center">
        <div>
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xs text-muted-foreground">Fast</div>
          <div className="text-sm font-medium">25-30 min</div>
        </div>
        <div>
          <div className="text-2xl mb-1">🚚</div>
          <div className="text-xs text-muted-foreground">Free Delivery</div>
          <div className="text-sm font-medium">Over $40</div>
        </div>
        <div>
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-xs text-muted-foreground">Rating</div>
          <div className="text-sm font-medium">4.8/5</div>
        </div>
      </div>
    </div>
  );
}