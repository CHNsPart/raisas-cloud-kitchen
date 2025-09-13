import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { UIProvider } from "@/contexts/UIContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ac0b14" },
    { media: "(prefers-color-scheme: dark)", color: "#830007" }
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  title: {
    default: "Raisa's Chinese Food - Authentic Chinese Flavors | Cloud Kitchen",
    template: "%s | Raisa's Chinese Food"
  },
  description: "Order authentic Chinese cuisine from Raisa's Cloud Kitchen. Fresh ingredients, traditional recipes, and fast delivery. Manchurian, Fried Rice, Tandoori, and more. Order now!",
  keywords: [
    "Chinese restaurant",
    "cloud kitchen",
    "Chinese food delivery",
    "Manchurian chicken",
    "fried rice",
    "Chinese takeaway",
    "authentic Chinese cuisine",
    "food delivery",
    "online ordering",
    "Raisa's restaurant"
  ],
  authors: [{ name: "Raisa's Chinese Food" }],
  creator: "Raisa's Chinese Food",
  publisher: "Raisa's Chinese Food",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://raisaschinese.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Raisa's Chinese Food - Authentic Chinese Flavors",
    description: "Order authentic Chinese cuisine from our cloud kitchen. Fresh ingredients, traditional recipes, fast delivery.",
    url: "/",
    siteName: "Raisa's Chinese Food",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Raisa's Chinese Food - Delicious Chinese Food",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raisa's Chinese Food - Order Now",
    description: "Authentic Chinese flavors, crafted with love. Order from our cloud kitchen for fast delivery.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Raisa's Chinese",
  },
  applicationName: "Raisa's Chinese Food",
  category: "food",
  classification: "Food, Food Delivery, Chinese Cuisine",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon-180x180.png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#ac0b14",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Raisa's" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180x180.png" />
        
        {/* Preconnect to optimize font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA splash screens for iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1242-2688.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1125-2436.jpg"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        
        {/* Structured Data for Restaurant */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Raisa's Chinese Restaurant",
              description: "Authentic Chinese flavors, crafted with love. Cloud kitchen specializing in Chinese cuisine.",
              url: process.env.NEXT_PUBLIC_BASE_URL || "https://raisaschinese.com",
              telephone: process.env.NEXT_PUBLIC_PHONE || "+1234567890",
              servesCuisine: "Chinese",
              priceRange: "$$",
              image: "/og-image.jpg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Your City",
                addressRegion: "Your State",
                addressCountry: "Your Country"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "0.0",
                longitude: "0.0"
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  opens: "11:00",
                  closes: "22:00"
                }
              ],
              hasMenu: {
                "@type": "Menu",
                url: "/menu"
              },
              acceptsReservations: "False",
              delivery: "True",
              takeaway: "True"
            })
          }}
        />
      </head>
      <body className="antialiased min-h-[100dvh] bg-background text-foreground">
        <MenuProvider>
          <CartProvider>
            <UIProvider>
              {children}
            </UIProvider>
          </CartProvider>
        </MenuProvider>
      </body>
    </html>
  );
}