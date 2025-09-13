"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Clock, ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useMenu } from "@/contexts/MenuContext";
import { useUI } from "@/contexts/UIContext";
import { APP_CONFIG, Z_INDEX } from "@/lib/constants";

interface HeaderBarProps {
  showDeliveryInfo?: boolean;
  transparent?: boolean;
  className?: string;
}

export function HeaderBar({ 
  showDeliveryInfo = true, 
  transparent = false,
  className 
}: HeaderBarProps) {
  const { restaurant } = useMenu();
  const { setIsMobileMenuOpen } = useUI();
  const { isScrollingDown, scrollY, isAtTop } = useScrollDirection();
  const [showFullHeader, setShowFullHeader] = useState(true);

  useEffect(() => {
    // Hide extended header when scrolling down past threshold, show when scrolling up or at top
    const threshold = 50; // Add some buffer to prevent jumping
    setShowFullHeader(!isScrollingDown || scrollY < threshold);
  }, [isScrollingDown, scrollY]);

  const isOpen = restaurant.status === "open";

  return (
    <>
      {/* Fixed Spacer - Always maintain consistent space */}
      <div className="h-16" />

      {/* Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0",
          "bg-background/95 backdrop-blur-lg",
          "transition-all duration-300 ease-out",
          !transparent && !isAtTop && "shadow-sm border-b border-border",
          className
        )}
        style={{ zIndex: Z_INDEX.sticky }}
      >
        {/* Main Header - Always visible */}
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                "md:hidden p-2 -ml-2",
                "hover:bg-muted rounded-lg",
                "transition-colors"
              )}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              {/* Logo */}
              <div className="relative size-10 md:size-14">
                <Image
                  src="/rcf-logo.svg"
                  alt={APP_CONFIG.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Restaurant Name */}
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg md:text-xl text-brand-primary">
                  {APP_CONFIG.shortName}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {restaurant.type}
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge & Compact Delivery Info */}
          <div className="flex items-center gap-2">
            {/* Compact delivery info when extended header is hidden */}
            {!showFullHeader && showDeliveryInfo && (
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
              </div>
            )}
            
            {/* Status Badge */}
            <div
              className={cn(
                "px-3 py-1.5 rounded-full",
                "text-xs font-medium",
                "flex items-center gap-1",
                isOpen
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
                )}
              />
              {isOpen ? "Open" : "Closed"}
            </div>
          </div>
        </div>

        {/* Extended Info Section - Use height and opacity for smooth transition */}
        <div
          className={cn(
            "border-t border-border overflow-hidden",
            "transition-all duration-300 ease-out",
            showFullHeader
              ? "h-16 opacity-100"
              : "h-0 opacity-0"
          )}
        >
          <div className="px-4 md:px-6 py-3 flex items-center justify-between h-16">
            {/* Delivery Info */}
            {showDeliveryInfo && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Delivery to</span>
                  <button className="font-medium flex items-center gap-1 hover:text-brand-primary transition-colors">
                    Peterborough
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="hidden sm:flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{restaurant.deliveryTime}</span>
                </div>
              </div>
            )}

            {/* Restaurant Tagline */}
            <div className="hidden md:block text-sm text-muted-foreground italic">
              {restaurant.description}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// Simplified Header for specific pages
export function SimpleHeader({ title }: { title: string }) {
  const { isScrollingDown, isAtTop } = useScrollDirection();

  return (
    <>
      <div className="h-16" />
      <header
        className={cn(
          "fixed top-0 left-0 right-0 h-16",
          "bg-background/95 backdrop-blur-lg",
          "border-b border-border",
          "flex items-center justify-center",
          "transition-transform duration-300",
          isScrollingDown && !isAtTop && "-translate-y-full"
        )}
        style={{ zIndex: Z_INDEX.sticky }}
      >
        <h1 className="font-semibold text-lg">{title}</h1>
      </header>
    </>
  );
}