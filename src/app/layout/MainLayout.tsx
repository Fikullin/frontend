import React from 'react';
import Navbar from './Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-layout-container">
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30 blur-3xl pointer-events-none"></div>
        <Navbar />
        <main className="flex-1 pt-20 p-4 sm:p-8 bg-transparent relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
