"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import { ANIMATION_CONFIG, Z_INDEX } from "@/lib/constants";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  badge?: number | string;
}

export function MobileNavBar() {
  const pathname = usePathname();
  const { getItemCount, toggleCart } = useCart();
  const { setIsSearchOpen } = useUI();
  const cartCount = getItemCount();

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      action: () => setIsSearchOpen(true),
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingBag,
      action: () => toggleCart(true),
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
      href: "/favorites",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile",
    },
  ];

  const handleItemClick = (item: NavItem) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    if (item.action) {
      item.action();
    }
  };

  const isActive = (item: NavItem) => {
    if (item.href) {
      return pathname === item.href;
    }
    return false;
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-16 md:hidden" />
      
      {/* Navigation Bar */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 md:hidden",
          "bg-background/95 backdrop-blur-lg",
          "border-t border-border",
          "safe-area-bottom"
        )}
        style={{ zIndex: Z_INDEX.sticky }}
      >
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            const content = (
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center",
                  "w-full h-full py-2 px-3",
                  "transition-all duration-200",
                  "group cursor-pointer select-none",
                  "active:scale-95"
                )}
                onClick={() => handleItemClick(item)}
              >
                {/* Icon Container */}
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all duration-200",
                      active
                        ? "text-brand-primary scale-110"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  
                  {/* Badge */}
                  {item.badge && (
                    <span
                      className={cn(
                        "absolute -top-1 -right-1",
                        "bg-brand-primary text-white",
                        "text-[10px] font-bold",
                        "min-w-[16px] h-4 px-1",
                        "rounded-full",
                        "flex items-center justify-center",
                        "animate-in zoom-in-50 duration-200"
                      )}
                    >
                      {typeof item.badge === 'number' && item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                
                {/* Label */}
                <span
                  className={cn(
                    "text-[11px] mt-1 font-medium",
                    "transition-all duration-200",
                    active
                      ? "text-brand-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {item.label}
                </span>
                
                {/* Active Indicator */}
                {active && (
                  <div
                    className={cn(
                      "absolute top-0 left-1/2 -translate-x-1/2",
                      "w-8 h-0.5 bg-brand-primary rounded-full",
                      "animate-in fade-in-0 slide-in-from-bottom-2"
                    )}
                    style={{
                      animationDuration: `${ANIMATION_CONFIG.microInteraction}ms`,
                    }}
                  />
                )}
              </div>
            );
            
            // Wrap in Link if href is provided
            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex-1 flex items-center justify-center"
                >
                  {content}
                </Link>
              );
            }
            
            return (
              <button
                key={item.id}
                className="flex-1 flex items-center justify-center"
                type="button"
              >
                {content}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

// Floating Cart Button for desktop
export function FloatingCartButton() {
  const { getItemCount, toggleCart } = useCart();
  const cartCount = getItemCount();
  
  if (cartCount === 0) return null;
  
  return (
    <button
      onClick={() => toggleCart(true)}
      className={cn(
        "fixed bottom-6 right-6 hidden md:flex",
        "bg-brand-primary text-white",
        "w-14 h-14 rounded-full",
        "items-center justify-center",
        "shadow-lg hover:shadow-xl",
        "hover:scale-110 active:scale-95",
        "transition-all duration-200",
        "group"
      )}
      style={{ zIndex: Z_INDEX.sticky }}
      aria-label={`Open cart with ${cartCount} items`}
    >
      <ShoppingBag className="w-6 h-6" />
      
      {cartCount > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1",
            "bg-brand-secondary text-white",
            "text-xs font-bold",
            "min-w-[20px] h-5 px-1.5",
            "rounded-full",
            "flex items-center justify-center",
            "animate-in zoom-in-50 duration-200"
          )}
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
      
      {/* Pulse animation for attention */}
      <span
        className={cn(
          "absolute inset-0 rounded-full",
          "bg-brand-primary opacity-30",
          "animate-ping"
        )}
      />
    </button>
  );
}