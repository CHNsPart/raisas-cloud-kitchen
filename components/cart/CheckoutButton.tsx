// components/cart/CheckoutButton.tsx
"use client";

import React, { useState } from "react";
import { Phone, ArrowRight, MapPin, Clock, AlertTriangle, Banknote, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_CONFIG, DELIVERY_CONFIG } from "@/lib/constants";

interface CheckoutButtonProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function CheckoutButton({
  total,
  itemCount,
  // onCheckout,
  disabled = false,
  isLoading = false,
  className,
}: CheckoutButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.locale, {
      style: "currency",
      currency: APP_CONFIG.currency,
    }).format(price);
  };

  const handleCall = () => {
    if (disabled || isLoading) return;
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Call the restaurant
    window.open(`tel:${APP_CONFIG.phoneNumber}`, '_self');
  };

  const canProceed = total >= DELIVERY_CONFIG.minOrderAmount;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Payment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex gap-2">
          <div className="flex gap-1">
            <Banknote className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          </div>
          <div className="text-xs">
            <p className="font-medium text-blue-800">
              Payment: Cash or E-Transfer
            </p>
            <p className="text-blue-700 mt-1">
              Call us to place your order. We accept cash on delivery or e-transfer payment.
            </p>
          </div>
        </div>
      </div>

      {/* Main Call Button */}
      <button
        onClick={handleCall}
        disabled={disabled || isLoading || !canProceed}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={cn(
          "w-full h-14 rounded-xl",
          "font-semibold text-lg",
          "transition-all duration-200",
          "flex items-center justify-between px-6",
          "shadow-lg active:shadow-md",
          // Enabled states
          canProceed && !disabled && !isLoading && [
            "bg-green-600 text-white",
            "hover:bg-green-700",
            "active:scale-[0.98]",
            isPressed && "scale-[0.98]"
          ],
          // Disabled states
          (!canProceed || disabled || isLoading) && [
            "bg-muted text-muted-foreground",
            "cursor-not-allowed"
          ]
        )}
      >
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Phone className="w-5 h-5" />
          )}
          <div className="text-left">
            <div className="text-sm font-medium opacity-90">
              {isLoading ? "Calling..." : canProceed ? "Call to Order" : "Minimum Order Required"}
            </div>
            <div className="text-xs opacity-75">
              {canProceed ? APP_CONFIG.phoneNumber : `Need ${formatPrice(DELIVERY_CONFIG.minOrderAmount - total)} more`}
            </div>
          </div>
        </div>
        
        {canProceed && !isLoading && (
          <ArrowRight className="w-5 h-5" />
        )}
      </button>

      {/* Minimum Order Warning */}
      {!canProceed && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-orange-800">
                Add {formatPrice(DELIVERY_CONFIG.minOrderAmount - total)} more to place order
              </p>
              <p className="text-orange-700 mt-1">
                Minimum order amount is {formatPrice(DELIVERY_CONFIG.minOrderAmount)} for delivery.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Instructions */}
      {canProceed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs space-y-2">
            <p className="font-medium text-green-800">
              📞 When you call, please mention:
            </p>
            <ul className="text-green-700 space-y-1 ml-4">
              <li>• Your order total: <strong>{formatPrice(total)}</strong></li>
              <li>• Number of items: <strong>{itemCount}</strong></li>
              <li>• Your delivery address</li>
              <li>• Preferred payment method (Cash/E-Transfer)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Quick Info */}
      {canProceed && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Ready in {DELIVERY_CONFIG.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>Delivering to {APP_CONFIG.city}</span>
          </div>
        </div>
      )}

      {/* Restaurant Hours */}
      <div className="text-center text-xs text-muted-foreground border-t border-border pt-3">
        <p>📞 Call us: <strong>{APP_CONFIG.phoneNumber}</strong></p>
        <p className="mt-1">Open daily 11:00 AM - 10:00 PM</p>
      </div>
    </div>
  );
}