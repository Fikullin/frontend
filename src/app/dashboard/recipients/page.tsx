'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiDownload,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';

import API_ENDPOINTS from '@/utils/api-config';
import { API_BASE_URL } from '@/utils/api-config';

interface Recipient {
  id: number;
  name: string;
  photo: string;
  // Add other fields based on your backend model
}

export default function RecipientsPage() {
  const router = useRouter();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN.RECIPIENTS.LIST);
      setRecipients(response.data.recipients);
      setError('');
    } catch (error) {
      setError('Gagal mengambil data penerima beasiswa');
      console.error('Error fetching recipients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus penerima ini?')) {
      try {
        await axios.delete(API_ENDPOINTS.ADMIN.RECIPIENTS.DELETE(id.toString()));
        fetchRecipients();
      } catch (error) {
        setError('Gagal menghapus penerima beasiswa');
        console.error('Error deleting recipient:', error);
      }
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN.RECIPIENTS.EXPORT, {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'penerima-beasiswa.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Gagal mengekspor data ke Excel');
      console.error('Error exporting to Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredRecipients = recipients.filter(recipient => 
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Penerima Beasiswa</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/dashboard/recipients/new')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Tambah Baru
          </button>
          <button
            onClick={handleExportExcel}
            disabled={isExporting || recipients.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
          >
            <FiDownload className="mr-2" />
            {isExporting ? 'Mengekspor...' : 'Export Excel'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Cari penerima..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={fetchRecipients}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            <FiRefreshCw className="mr-1" />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredRecipients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'Tidak ada penerima yang sesuai dengan pencarian' : 'Belum ada data penerima beasiswa'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecipients.map((recipient) => (
                  <tr key={recipient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        {recipient.photo ? (
                          // Dalam bagian render, perbarui URL gambar
                          <img
                            src={`${API_BASE_URL}/${recipient.photo}`}
                            alt={recipient.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{recipient.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/dashboard/recipients/${recipient.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(recipient.id)}
                        className="text-red-600 hover:text-red-900"
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