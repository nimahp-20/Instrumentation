import type { Metadata } from 'next';
import '@/app/admin/admin-shell.css';

export const metadata: Metadata = {
  title: 'پنل مدیریت | ابزارکده',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
