'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiFileText } from 'react-icons/fi';

import API_ENDPOINTS from '@/utils/api-config';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRecipients: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }

        // Get stats
        const response = await axios.get(API_ENDPOINTS.ADMIN.RECIPIENTS.LIST);
        setStats({
          totalRecipients: response.data.length || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Welcome message */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="text-gray-700">
          Ini adalah dashboard admin untuk mengelola data penerima beasiswa.
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">TOTAL PENERIMA</p>
              <p className="text-2xl font-semibold">{stats.totalRecipients}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiFileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">LAPORAN</p>
              <p className="text-2xl font-semibold">Tersedia</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center h-32">
            <FiUsers size={32} className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center h-32">
            <FiUsers size={32} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}