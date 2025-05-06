'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Info Beasiswa', href: '/info-beasiswa' },
  { name: 'Penerima Beasiswa', href: '/penerima' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const router = useRouter();
  const [show, setShow] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<unknown>(null);

  React.useEffect(() => {
    // Periksa status login
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setShow(false);
      } else {
        // Scrolling up
        setShow(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-blue-900 text-white shadow-md transition-transform duration-600 ease-in-out z-50 ${
        show ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold tracking-wide">Beasiswa</div>
          <ul className="flex space-x-8">
            {navItems.map(({ name, href }) => (
              <li key={name}>
                <a
                  href={href}
                  className="hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
          <div>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {(user as { role?: string })?.role === 'admin' && (
                  <button
                    type="button"
                    onClick={handleDashboardClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLoginClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
