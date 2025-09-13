"use client";

import React from "react";
import { ChevronRight, Star, TrendingUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuCard } from "@/components/core/MenuCard";
import { useMenu } from "@/contexts/MenuContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
// import { ANIMATION_CONFIG } from "@/lib/constants";

interface FeaturedSectionProps {
  limit?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function FeaturedSection({ 
  limit = 6, 
  showViewAll = true, 
  onViewAll,
  className 
}: FeaturedSectionProps) {
  const { featuredItems, isLoading } = useMenu();
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const displayItems = featuredItems.slice(0, limit);

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      // Scroll to all menu items
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (isLoading) {
    return <FeaturedSectionSkeleton />;
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        "py-8 bg-muted/20",
        "transition-all duration-700",
        isVisible ? "opacity-100" : "opacity-100", // Force visible
        className
      )}
    >
      <div className="px-4 md:px-6">
        {/* Section Header */}
        <div
          className={cn(
            "flex items-center justify-between mb-6",
            "transition-all duration-700",
            "opacity-100" // Force visible
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-primary/10 rounded-xl">
                <Star className="w-5 h-5 text-brand-primary fill-current" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Featured Favorites
                </h2>
                <p className="text-sm text-muted-foreground">
                  Our most loved dishes
                </p>
              </div>
            </div>
          </div>

          {showViewAll && (
            <button
              onClick={handleViewAll}
              className={cn(
                "flex items-center gap-2 px-4 py-2",
                "bg-background hover:bg-muted",
                "border border-border hover:border-brand-primary/30",
                "rounded-xl transition-all duration-200",
                "text-sm font-medium",
                "text-muted-foreground hover:text-brand-primary",
                "group shadow-sm hover:shadow-md"
              )}
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Featured Items Grid */}
        {displayItems.length > 0 ? (
          <>
            {/* Mobile: Use default variant instead of compact for better image display */}
            <div className="grid grid-cols-2 gap-3 mb-6 md:hidden">
              {displayItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="opacity-100" // Force visible
                >
                  <MenuCard 
                    item={item} 
                    variant="default" // Changed from "compact" to "default"
                  />
                </div>
              ))}
            </div>

            {/* Desktop: Featured layout with hero item */}
            <div className="hidden md:grid md:grid-cols-12 gap-6 mb-6">
              {/* Hero Featured Item */}
              <div className="col-span-6 opacity-100">
                <MenuCard item={displayItems[0]} variant="featured" />
              </div>

              {/* Side Items */}
              <div className="col-span-6 grid grid-cols-2 gap-4">
                {displayItems.slice(1, 5).map((item) => (
                  <div key={item.id} className="opacity-100">
                    <MenuCard item={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Items Row */}
            {displayItems.length > 5 && (
              <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4">
                {displayItems.slice(5).map((item) => (
                  <div key={item.id} className="opacity-100">
                    <MenuCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyFeaturedState />
        )}

        {/* Bottom Stats */}
        <div
          className={cn(
            "flex items-center justify-center gap-8 mt-8 pt-6 border-t border-border/50",
            "opacity-100" // Force visible
          )}
        >
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 bg-yellow-100 rounded-lg">
              <Star className="w-4 h-4 text-yellow-600 fill-current" />
            </div>
            <span className="text-muted-foreground">4.6+ Rating</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-muted-foreground">Most Ordered</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 bg-red-100 rounded-lg">
              <Flame className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-muted-foreground">Fresh Made</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Empty state component
function EmptyFeaturedState() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Star className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        No Featured Items Yet
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Our featured items will appear here based on ratings and popularity.
      </p>
    </div>
  );
}

// Skeleton loader
export function FeaturedSectionSkeleton() {
  return (
    <section className="py-8 bg-muted/20">
      <div className="px-4 md:px-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-xl animate-pulse" />
            <div>
              <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-20 bg-muted rounded-xl animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
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
      </div>
    </section>
  );
}