'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiFileText, FiUserPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

import API_ENDPOINTS from '../../utils/api-config';

export default function Dashboard() {
  const router = useRouter();
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-50" onClick={() => router.push('/dashboard/recipients')}>
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
        
        <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-50" onClick={() => router.push('/dashboard/finance')}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiFileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">KEUANGAN</p>
              <p className="text-2xl font-semibold">Kelola</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-50" onClick={() => router.push('/dashboard/admin')}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiUserPlus size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">ADMIN</p>
              <p className="text-2xl font-semibold">Kelola</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Akses Cepat</h2>
          <div className="space-y-2">
            <button 
              onClick={() => router.push('/dashboard/recipients/new')}
              className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center"
            >
              <FiUsers className="mr-2 text-blue-600" /> Tambah Penerima Baru
            </button>
            <button 
              onClick={() => router.push('/dashboard/admin/new')}
              className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md flex items-center"
            >
              <FiUserPlus className="mr-2 text-purple-600" /> Tambah Admin Baru
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informasi Sistem</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Pengguna:</span> {user?.username || 'Tidak diketahui'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Role:</span> {user?.role || 'Tidak diketahui'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
