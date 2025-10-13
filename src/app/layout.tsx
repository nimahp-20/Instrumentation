import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import FetchInterceptorClient from '@/components/FetchInterceptorClient';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Persian font configuration
const iranSans = {
  variable: "--font-iran-sans",
  family: "IRANSansX",
};

export const metadata: Metadata = {
  title: "فروشگاه ابزار - ابزارهای حرفه‌ای و تجهیزات",
  description: "فروشگاه آنلاین ابزارهای حرفه‌ای. ابزارهای برقی، دستی، تجهیزات ایمنی و بیشتر. بهترین کیفیت با قیمت مناسب.",
  keywords: ["ابزار", "تجهیزات", "ابزار برقی", "ابزار دستی", "تجهیزات ایمنی", "ابزار حرفه‌ای"],
  manifest: "/manifest.json",
  themeColor: "#059669",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ابزارکده",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "فروشگاه ابزار - ابزارهای حرفه‌ای و تجهیزات",
    description: "فروشگاه آنلاین ابزارهای حرفه‌ای با بهترین کیفیت",
    type: "website",
    locale: "fa_IR",
    siteName: "ابزارکده",
  },
  twitter: {
    card: "summary_large_image",
    title: "فروشگاه ابزار - ابزارهای حرفه‌ای و تجهیزات",
    description: "فروشگاه آنلاین ابزارهای حرفه‌ای با بهترین کیفیت",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="ابزارکده" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ابزارکده" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        
        {/* Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icon-512x512.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-iran-sans antialiased flex flex-col min-h-screen`}
      >
               <AuthProvider>
                 <CartProvider>
                   <WishlistProvider>
                     <FetchInterceptorClient />
                     <Header />
                     <main className="flex-grow">{children}</main>
                     <Footer />
                   </WishlistProvider>
                 </CartProvider>
               </AuthProvider>
      </body>
    </html>
  );
}
