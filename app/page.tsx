// app/page.tsx
import { Metadata } from "next";
import { 
  HeroSection, 
  CategoryTabs, 
  FeaturedSection, 
  MenuSection,
} from "@/components/home";
import { HeaderBar } from "@/components/layout/HeaderBar";
import { MobileNavBar, FloatingCartButton } from "@/components/layout/MobileNavBar";
import { ItemDrawer } from "@/components/core/ItemDrawer";
import { CartDrawer } from "@/components/cart";
import { ToastContainer } from "@/components/feedback/Toast";
import { APP_CONFIG, SEO_DEFAULTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} - Order Authentic Chinese Food | ${APP_CONFIG.city}`,
  description: `Order delicious Chinese food from ${APP_CONFIG.name} in ${APP_CONFIG.city}, ${APP_CONFIG.province}. Fast delivery, authentic flavors. Manchurian, Fried Rice, Combos & more!`,
  keywords: [
    ...SEO_DEFAULTS.keywords,
    APP_CONFIG.city,
    APP_CONFIG.province,
    "Canada",
    "Chinese food delivery Peterborough",
    "best Chinese restaurant Peterborough",
  ],
  openGraph: {
    title: `${APP_CONFIG.name} - Authentic Chinese Cuisine`,
    description: `Experience authentic Chinese flavors delivered to your door in ${APP_CONFIG.city}. Order now!`,
    images: [
      {
        url: SEO_DEFAULTS.ogImage,
        width: 1200,
        height: 630,
        alt: `${APP_CONFIG.name} - Delicious Chinese Food`,
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <HeaderBar />
      
      {/* Main Content */}
      <main className="min-h-screen pb-16 md:pb-0">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Category Navigation */}
        <CategoryTabs />
        
        {/* Featured Items */}
        <FeaturedSection />
        
        {/* Menu Sections */}
        <MenuSection />
      </main>
      
      {/* Mobile Navigation */}
      <MobileNavBar />
      
      {/* Desktop Floating Cart */}
      <FloatingCartButton />
      
      {/* Drawers & Modals */}
      <ItemDrawer />
      <CartDrawer />
      
      {/* Toast Notifications */}
      <ToastContainer />
    </>
  );
}