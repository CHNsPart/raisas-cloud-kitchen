"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuCard } from "./MenuCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ANIMATION_CONFIG } from "@/lib/constants";
import type { Category } from "@/types/menu";

interface CategorySectionProps {
  category: Category;
  variant?: "grid" | "carousel" | "list";
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function CategorySection({
  category,
  variant = "grid",
  showViewAll = true,
  onViewAll,
  className,
}: CategorySectionProps) {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      // Default navigation to category page
      window.location.href = `/menu?category=${category.id}`;
    }
  };

  return (
    <section
      ref={sectionRef}
      id={`category-${category.id}`}
      className={cn(
        "py-6 opacity-0 transition-opacity duration-500",
        isVisible && "opacity-100 animate-in fade-in-0 slide-in-from-bottom-4",
        className
      )}
      style={{
        animationDelay: isVisible ? `${ANIMATION_CONFIG.stagger}ms` : undefined,
      }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={category.name}>
            {category.emoji}
          </span>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
          </div>
        </div>
        
        {showViewAll && category.items.length > 3 && (
          <button
            onClick={handleViewAll}
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              "text-brand-primary hover:text-brand-secondary",
              "transition-colors group"
            )}
          >
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Items Grid/List/Carousel */}
      {variant === "grid" && (
        <div className={cn(
          "grid gap-4 px-4 md:px-0",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}>
          {category.items.slice(0, showViewAll ? 4 : undefined).map((item, index) => (
            <div
              key={item.id}
              className="opacity-0 animate-in fade-in-0 slide-in-from-bottom-4"
              style={{
                animationDelay: `${(index + 1) * ANIMATION_CONFIG.stagger}ms`,
                animationFillMode: "forwards",
              }}
            >
              <MenuCard item={item} />
            </div>
          ))}
        </div>
      )}

      {variant === "carousel" && (
        <div className="relative overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 md:px-0 pb-2 snap-x snap-mandatory">
            {category.items.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "flex-shrink-0 w-72 sm:w-80 snap-start",
                  "opacity-0 animate-in fade-in-0 slide-in-from-right-4"
                )}
                style={{
                  animationDelay: `${(index + 1) * ANIMATION_CONFIG.stagger}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === "list" && (
        <div className="space-y-3 px-4 md:px-0">
          {category.items.map((item, index) => (
            <div
              key={item.id}
              className="opacity-0 animate-in fade-in-0 slide-in-from-left-4"
              style={{
                animationDelay: `${(index + 1) * ANIMATION_CONFIG.stagger}ms`,
                animationFillMode: "forwards",
              }}
            >
              <MenuCard item={item} variant="compact" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {category.items.length === 0 && (
        <div className="text-center py-12 px-4">
          <p className="text-muted-foreground">
            No items available in this category at the moment.
          </p>
        </div>
      )}
    </section>
  );
}

// Skeleton loader for category section
export function CategorySectionSkeleton() {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4 px-4 md:px-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          <div>
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded mt-1 animate-pulse" />
          </div>
        </div>
        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
      </div>
      
      <div className="grid gap-4 px-4 md:px-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/3] bg-muted rounded-xl animate-pulse" />
            <div className="space-y-2 p-1">
              <div className="h-5 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="flex justify-between items-center">
                <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}