'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiSearch, FiRefreshCw, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import API_ENDPOINTS, { API_BASE_URL } from '@/utils/api-config';

interface InfoBeasiswa {
  id: number;
  title: string;
  description: string;
  date: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

export default function InfoBeasiswaPage() {
  const router = useRouter();
  const [infoBeasiswaList, setInfoBeasiswaList] = useState<InfoBeasiswa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInfoBeasiswa();
  }, []);

  const fetchInfoBeasiswa = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN.INFO_BEASISWA.LIST);
      setInfoBeasiswaList(response.data.info_beasiswa || []);
      setError('');
    } catch (error) {
      setError('Gagal mengambil data info beasiswa');
      console.error('Error fetching info beasiswa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus info beasiswa ini?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Anda harus login terlebih dahulu');
        }
        
        await axios.delete(API_ENDPOINTS.ADMIN.INFO_BEASISWA.DELETE(id.toString()), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchInfoBeasiswa();
      } catch (error) {
        setError('Gagal menghapus info beasiswa');
        console.error('Error deleting info beasiswa:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredInfoBeasiswa = infoBeasiswaList.filter(info =>
    info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    info.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Info Beasiswa</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/dashboard/info-beasiswa/new')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Tambah Baru
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-900 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Cari info beasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={fetchInfoBeasiswa}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            <FiRefreshCw className="mr-1" />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        ) : filteredInfoBeasiswa.length === 0 ? (
          <div className="p-8 text-center text-gray-900">
            {searchTerm ? 'Tidak ada info beasiswa yang sesuai dengan pencarian' : 'Belum ada data info beasiswa'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInfoBeasiswa.map((info) => (
                  <tr key={info.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {info.photo ? (
                        <img 
                          src={`${API_BASE_URL}/${info.photo}`} 
                          alt={info.title} 
                          className="h-16 w-16 object-cover rounded"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{info.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(info.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs overflow-hidden text-ellipsis">
                        {info.description.length > 100 
                          ? `${info.description.substring(0, 100)}...` 
                          : info.description
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/dashboard/info-beasiswa/${info.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(info.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}