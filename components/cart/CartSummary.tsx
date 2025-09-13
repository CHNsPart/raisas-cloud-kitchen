// components/cart/CartSummary.tsx
"use client";

import React, { useState } from "react";
import { Info, Tag, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { APP_CONFIG, DELIVERY_CONFIG } from "@/lib/constants";

interface CartSummaryProps {
  showDetails?: boolean;
  className?: string;
}

export function CartSummary({ showDetails = true, className }: CartSummaryProps) {
  const { state, getCartTotal, getItemCount } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<"delivery" | "pickup">("delivery");

  const subtotal = getCartTotal();
  const itemCount = getItemCount();
  
  // Calculate fees and totals
  const deliveryFee = selectedDeliveryMethod === "delivery" 
    ? (subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold ? 0 : DELIVERY_CONFIG.deliveryFee)
    : 0;
  
  const tax = subtotal * 0.13; // 13% HST for Ontario
  const total = subtotal + deliveryFee + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.locale, {
      style: "currency",
      currency: APP_CONFIG.currency,
    }).format(price);
  };

  if (state.items.length === 0) return null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Delivery Method Selection */}
      <div className="space-y-3">
        <h3 className="font-semibold text-base text-foreground">Delivery Method</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedDeliveryMethod("delivery")}
            className={cn(
              "p-4 rounded-lg border transition-all duration-200",
              "flex flex-col items-center text-center space-y-2",
              selectedDeliveryMethod === "delivery"
                ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                : "border-border hover:border-muted-foreground text-muted-foreground"
            )}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium">Delivery</span>
            <span className="text-xs">
              {subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold 
                ? "Free" 
                : formatPrice(DELIVERY_CONFIG.deliveryFee)
              }
            </span>
          </button>
          
          <button
            onClick={() => setSelectedDeliveryMethod("pickup")}
            className={cn(
              "p-4 rounded-lg border transition-all duration-200",
              "flex flex-col items-center text-center space-y-2",
              selectedDeliveryMethod === "pickup"
                ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                : "border-border hover:border-muted-foreground text-muted-foreground"
            )}
          >
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Pickup</span>
            <span className="text-xs">Free</span>
          </button>
        </div>
        
        {/* Delivery Info */}
        {selectedDeliveryMethod === "delivery" && (
          <div className="text-sm text-muted-foreground space-y-2 bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Delivering to {APP_CONFIG.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Estimated delivery: {DELIVERY_CONFIG.estimatedTime}</span>
            </div>
            {subtotal < DELIVERY_CONFIG.freeDeliveryThreshold && (
              <div className="flex items-center gap-2 text-green-600">
                <Tag className="w-4 h-4" />
                <span>
                  Add {formatPrice(DELIVERY_CONFIG.freeDeliveryThreshold - subtotal)} more for free delivery!
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center justify-between",
            "text-base font-semibold text-foreground",
            "hover:text-brand-primary transition-colors"
          )}
        >
          <span>Order Summary ({itemCount} items)</span>
          {showDetails && (
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">
                {isExpanded ? "Hide" : "Show"} details
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          )}
        </button>

        {/* Summary Lines */}
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">
              Subtotal ({itemCount} items)
            </span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          {/* Delivery Fee */}
          {selectedDeliveryMethod === "delivery" && (
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Delivery fee</span>
              <span className={cn(
                "font-medium",
                deliveryFee === 0 && "text-green-600"
              )}>
                {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
              </span>
            </div>
          )}

          {/* Tax */}
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">HST (13%)</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-brand-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && showDetails && (
          <div className="mt-6 space-y-3 bg-muted/30 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Order Details
            </h4>
            {state.items.map((item) => (
              <div key={item.timestamp} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}× {item.name} ({item.variant.size})
                </span>
                <span className="font-medium">
                  {item.variant.price === "market" 
                    ? "Market Price" 
                    : formatPrice(item.variant.price * item.quantity)
                  }
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Minimum Order Warning */}
        {selectedDeliveryMethod === "delivery" && subtotal < DELIVERY_CONFIG.minOrderAmount && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">
                  Minimum order required
                </p>
                <p className="text-yellow-700 mt-2">
                  Add {formatPrice(DELIVERY_CONFIG.minOrderAmount - subtotal)} more to meet the minimum delivery order of {formatPrice(DELIVERY_CONFIG.minOrderAmount)}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Savings Highlight */}
        {selectedDeliveryMethod === "delivery" && subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Tag className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800">
                  {"You're saving"} {formatPrice(DELIVERY_CONFIG.deliveryFee)} {"on delivery!"}
                </p>
                <p className="text-green-700 mt-2">
                  Your order qualifies for free delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Order Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-2">
              📞 Ready to order? Call us at {APP_CONFIG.phoneNumber}
            </p>
            <p className="text-blue-700">
              Have your order details ready when you call. We accept cash on delivery or e-transfer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}