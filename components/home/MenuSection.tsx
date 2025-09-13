"use client";

import React, { useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategorySection, CategorySectionSkeleton } from "@/components/core/CategorySection";
import { useMenu } from "@/contexts/MenuContext";
import { useUI } from "@/contexts/UIContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ANIMATION_CONFIG } from "@/lib/constants";
import type { MenuItem } from "@/types/menu";

interface MenuSectionProps {
  searchQuery?: string;
  filters?: {
    vegetarian?: boolean;
    spicy?: boolean;
    priceRange?: [number, number];
  };
  showFilters?: boolean;
  className?: string;
}

export function MenuSection({ 
  searchQuery = "", 
  filters = {},
  showFilters = true,
  className 
}: MenuSectionProps) {
  const { categories, allItems, filterItems, isLoading } = useMenu();
  const { activeCategory, setActiveCategory, setIsSearchOpen } = useUI();
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  // Filter items based on active category, search query, and filters
  const filteredCategories = useMemo(() => {
    let itemsToShow: MenuItem[] = allItems;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      itemsToShow = allItems.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Apply other filters
    if (Object.keys(filters).length > 0) {
      itemsToShow = filterItems(filters);
    }

    // Filter by active category
    if (activeCategory !== "all") {
      itemsToShow = itemsToShow.filter(item => item.category === activeCategory);
    }

    // Group filtered items back into categories
    if (activeCategory === "all") {
      return categories.map(category => ({
        ...category,
        items: itemsToShow.filter(item => item.category === category.id)
      })).filter(category => category.items.length > 0);
    } else {
      const selectedCategory = categories.find(cat => cat.id === activeCategory);
      if (selectedCategory) {
        return [{
          ...selectedCategory,
          items: itemsToShow
        }];
      }
    }

    return [];
  }, [categories, allItems, activeCategory, searchQuery, filters, filterItems]);

  const totalItemsCount = filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  if (isLoading) {
    return <MenuSectionSkeleton />;
  }

  return (
    <section
      id="menu-section"
      ref={sectionRef}
      className={cn(
        "py-8",
        "transition-all duration-700",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <div className="px-4 md:px-6">
        {/* Section Header */}
        <div
          className={cn(
            "flex items-center justify-between mb-6",
            "transition-all duration-700",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
          style={{
            animationDelay: `${ANIMATION_CONFIG.stagger}ms`,
          }}
        >
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {activeCategory === "all" ? "Our Menu" : 
               categories.find(cat => cat.id === activeCategory)?.name || "Menu"
              }
            </h2>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? `${totalItemsCount} results for "${searchQuery}"` : 
               `${totalItemsCount} delicious ${activeCategory === "all" ? "items" : "dishes"} available`
              }
            </p>
          </div>

          {showFilters && (
            <div className="flex items-center gap-2">
              {/* Search Button (Mobile) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "md:hidden p-2 rounded-xl",
                  "bg-muted hover:bg-muted-foreground/10",
                  "transition-colors"
                )}
                aria-label="Search menu"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Filter Button */}
              <button
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl",
                  "bg-muted hover:bg-muted-foreground/10",
                  "text-sm font-medium transition-all",
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Filters (Mobile) */}
        <div
          className={cn(
            "flex gap-2 mb-6 overflow-x-auto scrollbar-hide md:hidden",
            "transition-all duration-700",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
          style={{
            animationDelay: `${2 * ANIMATION_CONFIG.stagger}ms`,
          }}
        >
          <FilterChip label="Vegetarian" icon="🥬" active={filters.vegetarian} />
          <FilterChip label="Spicy" icon="🌶️" active={filters.spicy} />
          <FilterChip label="Popular" icon="⭐" />
          <FilterChip label="New" icon="✨" />
        </div>

        {/* Menu Categories */}
        <div className="space-y-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <div
                key={category.id}
                className={cn(
                  "transition-all duration-700",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{
                  animationDelay: `${(index + 3) * ANIMATION_CONFIG.stagger}ms`,
                }}
              >
                <CategorySection
                  category={category}
                  variant="grid"
                  showViewAll={activeCategory === "all" && category.items.length > 4}
                  onViewAll={() => {
                    // Switch to specific category view
                    setActiveCategory(category.id);
                  }}
                />
              </div>
            ))
          ) : (
            <EmptyMenuState searchQuery={searchQuery} activeCategory={activeCategory} />
          )}
        </div>

        {/* Bottom CTA */}
        {filteredCategories.length > 0 && (
          <div
            className={cn(
              "text-center mt-12 pt-8 border-t border-border/50",
              "transition-all duration-700",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
            style={{
              animationDelay: `${(filteredCategories.length + 4) * ANIMATION_CONFIG.stagger}ms`,
            }}
          >
            <p className="text-muted-foreground mb-4">
              {"Can't find what you're looking for?"}
            </p>
            <button
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "px-6 py-3 rounded-xl",
                "bg-brand-primary text-white",
                "hover:bg-brand-secondary",
                "transition-all duration-200",
                "font-medium shadow-lg hover:shadow-xl"
              )}
            >
              Search Our Full Menu
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// Filter Chip Component
function FilterChip({ 
  label, 
  icon, 
  active = false, 
  onClick 
}: { 
  label: string; 
  icon?: string; 
  active?: boolean; 
  onClick?: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "text-xs font-medium whitespace-nowrap",
        "transition-all duration-200",
        "border",
        active
          ? [
              "bg-brand-primary text-white border-brand-primary",
              "shadow-md"
            ]
          : [
              "bg-background text-muted-foreground",
              "border-border hover:border-brand-primary/30",
              "hover:text-foreground hover:bg-muted/50"
            ]
      )}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

// Empty State Component
function EmptyMenuState({ 
  searchQuery, 
  activeCategory 
}: { 
  searchQuery: string; 
  activeCategory: string; 
}) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {searchQuery ? "No results found" : "No items available"}
      </h3>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {searchQuery 
          ? `We couldn't find any items matching "${searchQuery}". Try different keywords or browse our categories.`
          : activeCategory !== "all"
          ? "This category doesn't have any items yet. Check back soon!"
          : "Our menu is being updated. Please check back later."
        }
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className={cn(
            "px-6 py-3 rounded-xl",
            "bg-brand-primary text-white",
            "hover:bg-brand-secondary",
            "transition-all duration-200",
            "font-medium"
          )}
        >
          Refresh Menu
        </button>
        
        <button
          className={cn(
            "px-6 py-3 rounded-xl",
            "bg-muted text-foreground",
            "hover:bg-muted-foreground/10",
            "transition-all duration-200",
            "font-medium"
          )}
        >
          Browse All Categories
        </button>
      </div>
    </div>
  );
}

// Skeleton Loader
export function MenuSectionSkeleton() {
  return (
    <section className="py-8">
      <div className="px-4 md:px-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-7 w-32 bg-muted rounded animate-pulse mb-2" />
            <div className="h-5 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-muted rounded-xl animate-pulse" />
            <div className="h-10 w-20 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex gap-2 mb-6 md:hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-16 bg-muted rounded-full animate-pulse" />
          ))}
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <CategorySectionSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}