"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMenu } from "@/contexts/MenuContext";
import { useUI } from "@/contexts/UIContext";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { Z_INDEX } from "@/lib/constants";

interface CategoryTabsProps {
  onCategoryChange?: (categoryId: string) => void;
  className?: string;
}

export function CategoryTabs({ onCategoryChange, className }: CategoryTabsProps) {
  const { categories } = useMenu();
  const { activeCategory, setActiveCategory } = useUI();
  const { isScrollingDown, scrollY } = useScrollDirection();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [isScrollable, setIsScrollable] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);

  // All categories including "All"
  const allCategories = [
    { id: "all", name: "All", emoji: "🍽️", description: "All menu items" },
    ...categories,
  ];

  // Check if tabs are scrollable and update gradients
  useEffect(() => {
    const checkScrollable = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const isScrollableNow = container.scrollWidth > container.clientWidth;
        setIsScrollable(isScrollableNow);
        
        if (isScrollableNow) {
          updateGradients();
        } else {
          setShowLeftGradient(false);
          setShowRightGradient(false);
        }
      }
    };

    const updateGradients = () => {
      const container = scrollContainerRef.current;
      if (container && isScrollable) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftGradient(scrollLeft > 10);
        setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateGradients);
    }

    return () => {
      window.removeEventListener('resize', checkScrollable);
      if (container) {
        container.removeEventListener('scroll', updateGradients);
      }
    };
  }, [isScrollable]);

  // Auto-scroll to active tab
  const scrollToActiveTab = (categoryId: string) => {
    const tabElement = tabRefs.current[categoryId];
    const container = scrollContainerRef.current;
    
    if (tabElement && container) {
      const tabRect = tabElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft = container.scrollLeft;
      
      // Calculate the position to center the tab
      const targetScrollLeft = scrollLeft + (tabRect.left - containerRect.left) - 
        (containerRect.width / 2) + (tabRect.width / 2);
      
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth',
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    scrollToActiveTab(categoryId);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }

    // Smooth scroll to the category section
    if (categoryId !== "all") {
      setTimeout(() => {
        const categoryElement = document.getElementById(`category-${categoryId}`);
        if (categoryElement) {
          const headerHeight = 120; // Account for sticky headers
          const elementPosition = categoryElement.getBoundingClientRect().top + window.scrollY;
          
          window.scrollTo({
            top: elementPosition - headerHeight,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  };

  // Hide tabs when scrolling down on mobile
  const shouldHide = isScrollingDown && scrollY > 200;

  return (
    <div
      className={cn(
        "sticky bg-background/95 backdrop-blur-lg z-20",
        "border-b border-border",
        "transition-transform duration-300",
        shouldHide ? "-translate-y-full md:translate-y-0" : "translate-y-0",
        className
      )}
      style={{ 
        zIndex: Z_INDEX.sticky - 1,
        top: "64px", // Below header
      }}
    >
      <div className="relative">
        {/* Left Gradient */}
        {showLeftGradient && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}
        
        {/* Right Gradient */}
        {showRightGradient && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrollable Tabs Container */}
        <div
          ref={scrollContainerRef}
          className={cn(
            "flex gap-2 overflow-x-auto overflow-y-hidden py-3 px-4",
            "scrollbar-hide no-scrollbar", // Multiple classes for better browser support
            // Inline styles as fallback
            "[&::-webkit-scrollbar]:hidden",
            "[-ms-overflow-style:none]",
            "[scrollbar-width:none]"
          )}
          style={{
            scrollSnapType: 'x mandatory',
            // Inline CSS as ultimate fallback
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {allCategories.map((category) => {
            const isActive = activeCategory === category.id;
            const itemCount = category.id === "all" 
              ? categories.reduce((sum, cat) => sum + cat.items.length, 0)
              : 'items' in category ? category.items?.length || 0 : 0;

            return (
              <button
                key={category.id}
                ref={(el) => {
                  tabRefs.current[category.id] = el;
                }}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full",
                  "text-sm font-medium whitespace-nowrap",
                  "transition-all duration-200",
                  "scroll-snap-align-start",
                  "hover:scale-105 active:scale-95",
                  "opacity-100", // Changed from opacity-0 to opacity-100
                  isActive
                    ? [
                        "bg-brand-primary text-white",
                        "shadow-lg shadow-brand-primary/25",
                        "scale-105"
                      ]
                    : [
                        "bg-muted hover:bg-muted-foreground/10",
                        "text-muted-foreground hover:text-foreground",
                        "border border-transparent hover:border-border"
                      ]
                )}
              >
                <span className="text-base" role="img" aria-label={category.name}>
                  {category.emoji}
                </span>
                <span>{category.name}</span>
                {itemCount > 0 && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    )}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      </div>

      {/* Scroll Hint */}
      {isScrollable && !showLeftGradient && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="flex items-center gap-1 text-xs text-muted-foreground animate-bounce">
            <span>Swipe</span>
            <div className="w-4 h-0.5 bg-muted-foreground/30 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}

export function CategoryFilterPills({ onCategoryChange }: CategoryTabsProps) {
  const { categories } = useMenu();
  const { activeCategory, setActiveCategory } = useUI();

  const handleChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-4">
      <button
        onClick={() => handleChange("all")}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
          activeCategory === "all"
            ? "bg-brand-primary text-white"
            : "bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleChange(category.id)}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            activeCategory === category.id
              ? "bg-brand-primary text-white"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <span>{category.emoji}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
}