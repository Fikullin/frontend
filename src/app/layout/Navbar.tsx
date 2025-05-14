'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Info Beasiswa', href: '/info-beasiswa' },
  { name: 'Penerima Beasiswa', href: '/penerima' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const router = useRouter();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-8">
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
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          {/* Login/Logout buttons desktop */}
          <div className="hidden md:flex">
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
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 px-4 py-4 space-y-2">
          <ul>
            {navItems.map(({ name, href }) => (
              <li key={name}>
                <a
                  href={href}
                  className="block px-3 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
          <div>
            {isLoggedIn ? (
              <div className="space-y-2 mt-4">
                {(user as { role?: string })?.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleDashboardClick();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogoutClick();
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLoginClick();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
