"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMenu } from "@/contexts/MenuContext";
import { useUI } from "@/contexts/UIContext";
import { useDebounce } from "@/hooks/useDebounce";
// import { ANIMATION_CONFIG, APP_CONFIG } from "@/lib/constants";
import type { MenuItem } from "@/types/menu";
import Image from "next/image";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
  onItemSelect?: (item: MenuItem) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search for dishes...",
  autoFocus = false,
  onSearch,
  onItemSelect,
  className,
}: SearchBarProps) {
  const { searchItems, featuredItems } = useMenu();
  const { openItemDrawer } = useUI();
  
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<MenuItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("raisa-recent-searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search when query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const searchResults = searchItems(debouncedQuery);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(query.length === 0 && recentSearches.length > 0);
    }
  }, [debouncedQuery, searchItems, recentSearches.length, query.length]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    // Save to recent searches
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery),
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("raisa-recent-searches", JSON.stringify(updatedSearches));
    
    if (onSearch) {
      onSearch(searchQuery);
    }
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleItemSelect = (item: MenuItem) => {
    if (onItemSelect) {
      onItemSelect(item);
    } else {
      openItemDrawer(item);
    }
    
    setQuery("");
    setIsOpen(false);
    
    // Save search
    handleSearch(item.name);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("raisa-recent-searches");
  };

  const trendingSearches = ["Fried Rice", "Manchurian", "Combo Meals", "Tandoori"];

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search 
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2",
            "w-5 h-5 text-muted-foreground"
          )}
        />
        
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "w-full h-12 pl-10 pr-10",
            "bg-muted/50 border border-border",
            "rounded-xl",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
            "focus:border-brand-primary",
            "transition-all duration-200"
          )}
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "w-5 h-5 text-muted-foreground",
              "hover:text-foreground transition-colors"
            )}
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <div
        className={cn(
          "absolute top-full left-0 right-0 mt-2",
          "bg-background border border-border",
          "rounded-xl shadow-lg",
          "max-h-[70vh] overflow-y-auto",
          "transform transition-all duration-200 origin-top",
          isOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none"
        )}
        style={{ zIndex: 10 }}
      >
        {/* Search Results */}
        {results.length > 0 && (
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
              Results ({results.length})
            </p>
            {results.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className={cn(
                  "w-full px-3 py-2.5",
                  "flex items-center gap-3",
                  "hover:bg-muted rounded-lg",
                  "transition-colors text-left",
                  "animate-in fade-in-0 slide-in-from-top-1"
                )}
                style={{
                  animationDelay: `${index * 30}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.category} • ${item.variants[0].price !== "market" ? item.variants[0].price : "Market"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {query && results.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">{`No results found for "${query}"`}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try searching for something else
            </p>
          </div>
        )}

        {/* Recent & Trending Searches */}
        {!query && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-2 border-b border-border">
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Recent Searches
                  </p>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className={cn(
                      "w-full px-3 py-2",
                      "flex items-center gap-2",
                      "hover:bg-muted rounded-lg",
                      "transition-colors text-left",
                      "text-sm"
                    )}
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Trending
              </p>
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className={cn(
                    "w-full px-3 py-2",
                    "flex items-center gap-2",
                    "hover:bg-muted rounded-lg",
                    "transition-colors text-left",
                    "text-sm"
                  )}
                >
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  {search}
                </button>
              ))}
            </div>

            {/* Popular Items */}
            {featuredItems.length > 0 && (
              <div className="p-2 border-t border-border">
                <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                  Popular Items
                </p>
                {featuredItems.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className={cn(
                      "w-full px-3 py-2",
                      "flex items-center gap-3",
                      "hover:bg-muted rounded-lg",
                      "transition-colors text-left"
                    )}
                  >
                    <div className="w-8 h-8 rounded bg-muted flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ⭐ {item.rating}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Minimal Search Trigger for Header
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2",
        "h-10 px-4",
        "bg-muted/50 hover:bg-muted",
        "border border-border",
        "rounded-xl",
        "transition-all duration-200",
        "group"
      )}
    >
      <Search className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        Search dishes...
      </span>
    </button>
  );
}