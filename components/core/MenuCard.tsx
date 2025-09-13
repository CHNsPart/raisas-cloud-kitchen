"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Plus, Flame, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { APP_CONFIG, ANIMATION_CONFIG } from "@/lib/constants";
import type { MenuItem } from "@/types/menu";

interface MenuCardProps {
  item: MenuItem;
  variant?: "default" | "compact" | "featured";
  onQuickAdd?: (item: MenuItem) => void;
  className?: string;
}

export function MenuCard({ 
  item, 
  variant = "default",
  onQuickAdd,
  className 
}: MenuCardProps) {
  const { addToCart } = useCart();
  const { openItemDrawer, showToast } = useUI();
  const [imageRef] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Use first variant as default
    const defaultVariant = item.variants[0];
    
    setTimeout(() => {
      addToCart({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        category: item.category,
        variant: defaultVariant,
        quantity: 1,
      });
      
      showToast(`${item.name} added to cart`, "success");
      setIsLoading(false);
      
      if (onQuickAdd) {
        onQuickAdd(item);
      }
    }, ANIMATION_CONFIG.microInteraction);
  };

  const handleCardClick = () => {
    openItemDrawer(item);
  };

  const formatPrice = (price: number | "market") => {
    if (price === "market") return "Market Price";
    
    return new Intl.NumberFormat(APP_CONFIG.locale, {
      style: "currency",
      currency: APP_CONFIG.currency,
    }).format(price);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-yellow-600";
    return "text-orange-600";
  };

  if (variant === "compact") {
    return (
      <div
        onClick={handleCardClick}
        className={cn(
          "group flex gap-3 p-3 rounded-lg bg-card",
          "hover:shadow-md transition-all duration-300",
          "cursor-pointer active:scale-[0.98]",
          className
        )}
      >
        {/* Fixed image container size and loading */}
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
          <Image
            src={imageError ? "/images/placeholder.jpg" : item.image}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {item.isSpicy && (
            <div className="absolute top-0.5 left-0.5 bg-red-500 text-white rounded-full p-0.5">
              <Flame className="w-2.5 h-2.5" />
            </div>
          )}
          {item.isVegetarian && (
            <div className="absolute top-0.5 right-0.5 bg-green-500 text-white rounded-full p-0.5">
              <Leaf className="w-2.5 h-2.5" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{item.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {item.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-semibold text-brand-primary">
              {formatPrice(item.variants[0].price)}
            </span>
            <button
              onClick={handleQuickAdd}
              disabled={isLoading}
              className={cn(
                "bg-brand-primary text-white p-1.5 rounded-full",
                "hover:bg-brand-secondary transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={imageRef}
      onClick={handleCardClick}
      className={cn(
        "group bg-card rounded-xl overflow-hidden",
        "shadow-sm hover:shadow-lg transition-all duration-300",
        "cursor-pointer active:scale-[0.98]",
        variant === "featured" && "md:flex md:h-48",
        className
      )}
    >
      <div className={cn(
        "relative overflow-hidden bg-muted",
        variant === "featured" ? "md:w-2/5 h-48" : "aspect-[4/3]"
      )}>
        {/* Always render image, don't wait for intersection observer */}
        <Image
          src={imageError ? "/images/placeholder.jpg" : item.image}
          alt={item.name}
          fill
          sizes={variant === "featured" ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 640px) 50vw, 33vw"}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
          priority={variant === "featured"}
          loading={variant === "featured" ? "eager" : "lazy"}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {item.isVegetarian && (
            <div className="bg-green-500 text-white rounded-full p-1.5" title="Vegetarian">
              <Leaf className="w-3.5 h-3.5" />
            </div>
          )}
          {item.isSpicy && (
            <div className="bg-red-500 text-white rounded-full p-1.5" title="Spicy">
              <Flame className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className={cn("w-3.5 h-3.5 fill-current", getRatingColor(item.rating))} />
          <span className={cn("text-xs font-medium", getRatingColor(item.rating))}>
            {item.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className={cn(
        "p-4",
        variant === "featured" && "md:flex-1 md:flex md:flex-col"
      )}>
        <div className="flex-1">
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-brand-primary transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
          
          {/* Tags */}
          {variant === "featured" && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-brand-primary">
              {formatPrice(item.variants[0].price)}
            </span>
            {item.variants.length > 1 && (
              <span className="text-xs text-muted-foreground ml-1">
                {item.variants.length} options
              </span>
            )}
          </div>
          
          <button
            onClick={handleQuickAdd}
            disabled={isLoading}
            className={cn(
              "bg-brand-primary text-white p-2 rounded-full",
              "hover:bg-brand-secondary hover:scale-110",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-sm hover:shadow-md"
            )}
            aria-label={`Add ${item.name} to cart`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}