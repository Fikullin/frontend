'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiHome, FiUsers, FiFileText, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import API_ENDPOINTS from '@/utils/api-config';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{
    username?: string;
    role?: string;
  } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user data
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Set axios default headers
    const setupAxios = async () => {
      const axios = (await import('axios')).default;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      try {
        // Verify token is valid
        await axios.get(API_ENDPOINTS.AUTH.PROFILE);
        setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    setupAxios();

    // Check if mobile view
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FiHome size={24} />, path: '/dashboard' },
    { name: 'Penerima', icon: <FiUsers size={24} />, path: '/dashboard/recipients' },
    { name: 'Laporan Keuangan', icon: <FiFileText size={24} />, path: '/dashboard/finance' },
    { name: 'InfoBeasiswa', icon: <FiFileText size={24} />, path: '/dashboard/info-beasiswa' },
    { name: 'Broadcast', icon: <FiFileText size={24} />, path: '/dashboard/broadcast' },
    { name: 'Admin', icon: <FiFileText size={24} />, path: '/dashboard/admin' },
    { name: 'Home Edit Header', icon: <FiFileText size={24} />, path: '/dashboard/home-edit-header' },
    { name: 'Home Edit Section 1', icon: <FiFileText size={24} />, path: '/dashboard/home-edit-section1' },
    { name: 'Home Edit Section Text', icon: <FiFileText size={24} />, path: '/dashboard/home-edit-sectiontext' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-blue-900">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-blue-900 text-white transition-transform duration-300 z-50
          ${collapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 md:w-64'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            {!collapsed && <h1 className="text-xl font-bold">Beasiswa</h1>}
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="p-1 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {collapsed ? '☰' : '✕'}
            </button>
          </div>

          {/* User profile */}
          <div className="flex items-center p-4 border-b border-blue-800">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-xl font-bold">
              {user?.username?.charAt(0) || 'A'}
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="font-medium">{user?.username || 'Admin'}</p>
                <p className="text-sm text-blue-300">{user?.role || 'admin'}</p>
              </div>
            )}
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center py-3 px-4 ${
                      pathname === item.path ? 'bg-blue-800' : 'hover:bg-blue-800'
                    } transition-colors`}
                  >
                    <div className="flex items-center justify-center w-8">
                      {item.icon}
                    </div>
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-blue-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full py-3 px-4 hover:bg-blue-800 rounded-md transition-colors"
            >
              <div className="flex items-center justify-center w-8">
                <FiLogOut size={24} />
              </div>
              {!collapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile toggle button when sidebar is collapsed */}
      {collapsed && (
        <button
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
        >
          ☰
        </button>
      )}

      {/* Main content */}
      <div
        className={`flex-1 overflow-auto bg-white transition-all duration-300 p-6 pt-16 rounded-l-3xl
          ${collapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64'}
        `}
      >
        {children}
      </div>
    </div>
  );
}
