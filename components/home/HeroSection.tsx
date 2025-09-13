"use client";

import React from "react";
import Image from "next/image";
// import { cn } from "@/lib/utils";
import { useMenu } from "@/contexts/MenuContext";
import { APP_CONFIG } from "@/lib/constants";

export function HeroSection() {
  const { restaurant } = useMenu();

  return (
    <section className="px-4 pt-18 pb-8 bg-gradient-to-b from-brand-primary/5 to-transparent">
      <div className="flex flex-col md:flex-row items-center text-center md:text-left max-w-4xl mx-auto gap-6">
        <div className="relative size-32 md:size-40 mx-auto md:mx-0 flex-shrink-0">
          <Image
            src="/rcf-logo.svg"
            alt={APP_CONFIG.name}
            fill
            className="object-center object-contain mt-1.5"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold text-brand-primary mb-2">
            Welcome to {APP_CONFIG.name}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-0 md:mb-4">
            {restaurant.description}
          </p>
          <div className="hidden sm:flex flex-col sm:flex-row items-center md:items-start gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full">
              <span className="text-brand-primary">📍</span>
              <span>Serving {APP_CONFIG.city}, {APP_CONFIG.province}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full">
              <span className="text-brand-primary">⏱️</span>
              <span>Delivery in {restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full">
              <span className="text-brand-primary">🏪</span>
              <span>{restaurant.type}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}