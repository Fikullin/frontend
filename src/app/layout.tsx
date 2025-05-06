import React from 'react';
import './globals.css';
import MainLayout from './layout/MainLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fungsi untuk memeriksa apakah path saat ini adalah dashboard
  // Ini akan dijalankan di sisi klien
  const isDashboardPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/dashboard');
    }
    return false;
  };

  return (
    <html lang="en">
      <body>
        {isDashboardPath() ? (
          // Jika path adalah dashboard, jangan gunakan MainLayout
          <>{children}</>
        ) : (
          // Jika bukan dashboard, gunakan MainLayout seperti biasa
          <MainLayout>
            {children}
          </MainLayout>
        )}
      </body>
    </html>
  );
}
