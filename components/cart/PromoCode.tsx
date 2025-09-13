// components/cart/PromoCode.tsx
"use client";

import React, { useState } from "react";
import { Tag, Check, X, Percent, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUI } from "@/contexts/UIContext";
// import { ANIMATION_CONFIG } from "@/lib/constants";

interface PromoCodeProps {
  onApply?: (code: string, discount: number) => void;
  className?: string;
}

// Mock promo codes for demo
const PROMO_CODES = {
  "WELCOME10": { discount: 10, type: "percentage", description: "10% off your first order" },
  "SAVE5": { discount: 5, type: "fixed", description: "$5 off orders over $25" },
  "FREESHIP": { discount: 0, type: "shipping", description: "Free delivery on any order" },
  "STUDENT15": { discount: 15, type: "percentage", description: "15% student discount" },
} as const;

type PromoCodeKey = keyof typeof PROMO_CODES;

export function PromoCode({ onApply, className }: PromoCodeProps) {
  const { showToast } = useUI();
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<PromoCodeKey | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const upperCode = code.toUpperCase() as PromoCodeKey;
      const promoData = PROMO_CODES[upperCode];
      
      if (promoData) {
        setAppliedCode(upperCode);
        setCode("");
        showToast(`Promo code applied! ${promoData.description}`, "success");
        
        if (onApply) {
          onApply(upperCode, promoData.discount);
        }
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      } else {
        showToast("Invalid promo code. Please try again.", "error");
        
        // Error haptic
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleRemove = () => {
    setAppliedCode(null);
    showToast("Promo code removed", "info");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  const formatDiscount = (promoKey: PromoCodeKey) => {
    const promo = PROMO_CODES[promoKey];
    if (promo.type === "percentage") {
      return `${promo.discount}% off`;
    } else if (promo.type === "fixed") {
      return `$${promo.discount} off`;
    } else {
      return "Free shipping";
    }
  };

  const suggestedCodes = Object.keys(PROMO_CODES) as PromoCodeKey[];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between",
          "text-base font-semibold text-foreground",
          "hover:text-brand-primary transition-colors"
        )}
      >
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          <span>Promo Code</span>
          {appliedCode && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Applied
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {isExpanded ? "Hide" : "Show"}
        </span>
      </button>

      {/* Applied Code Display */}
      {appliedCode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-base font-medium text-green-800">
                  {appliedCode}
                </span>
                <p className="text-sm text-green-700">
                  {PROMO_CODES[appliedCode].description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-green-800">
                {formatDiscount(appliedCode)}
              </span>
              <button
                onClick={handleRemove}
                className={cn(
                  "p-2 rounded-full text-green-600",
                  "hover:bg-green-100 active:scale-95",
                  "transition-all duration-200"
                )}
                aria-label="Remove promo code"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Section */}
      {isExpanded && !appliedCode && (
        <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter promo code"
                className={cn(
                  "w-full h-12 px-4 pr-12",
                  "bg-background border border-border",
                  "rounded-lg",
                  "text-base",
                  "focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
                  "focus:border-brand-primary",
                  "transition-all duration-200"
                )}
                disabled={isLoading}
              />
              <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            
            <button
              onClick={handleApply}
              disabled={!code.trim() || isLoading}
              className={cn(
                "px-6 h-12 rounded-lg",
                "bg-brand-primary text-white",
                "hover:bg-brand-secondary",
                "active:scale-95",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "text-base font-medium",
                "min-w-[100px] flex items-center justify-center"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Apply"
              )}
            </button>
          </div>

          {/* Suggested Codes */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Available codes:
            </p>
            <div className="grid grid-cols-1 gap-3">
              {suggestedCodes.map((promoKey) => (
                <button
                  key={promoKey}
                  onClick={() => setCode(promoKey)}
                  className={cn(
                    "p-3 rounded-lg border border-border",
                    "hover:border-brand-primary hover:bg-brand-primary/5",
                    "active:scale-95",
                    "transition-all duration-200",
                    "text-left"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {PROMO_CODES[promoKey].type === "percentage" ? (
                      <Percent className="w-4 h-4 text-brand-primary" />
                    ) : (
                      <Gift className="w-4 h-4 text-brand-primary" />
                    )}
                    <span className="text-sm font-medium text-brand-primary">
                      {promoKey}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {PROMO_CODES[promoKey].description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <p className="text-sm text-muted-foreground">
            Promo codes cannot be combined. Terms and conditions apply.
          </p>
        </div>
      )}
    </div>
  );
}