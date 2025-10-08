import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
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
  openGraph: {
    title: "فروشگاه ابزار - ابزارهای حرفه‌ای و تجهیزات",
    description: "فروشگاه آنلاین ابزارهای حرفه‌ای با بهترین کیفیت",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-iran-sans antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <FetchInterceptorClient />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
