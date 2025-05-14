'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import API_ENDPOINTS from '../../../../utils/api-config';
import { FiRefreshCw } from 'react-icons/fi';

interface Recipient {
  id: number;
  name: string;
  photo: string;
  nrp: string;
  ipk: number;
  departemen: string;
  noHp: string;
  email: string;
  status: string;
  keteranganLulus: string;
}

export default function SelectRecipientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const broadcastId = searchParams.get('broadcastId');

  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN.RECIPIENTS.LIST);
      setRecipients(response.data.recipients || response.data || []);
      setError('');
    } catch (error) {
      setError('Gagal mengambil data penerima beasiswa');
      console.error('Error fetching recipients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecipientSelection = (id: number) => {
    setSelectedRecipients((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rid) => rid !== id)
        : [...prevSelected, id]
    );
  };

  const handleConfirm = () => {
    if (!broadcastId) {
      alert('Broadcast ID tidak ditemukan');
      return;
    }
    if (selectedRecipients.length === 0) {
      alert('Pilih minimal satu penerima');
      return;
    }
    router.push(`/dashboard/broadcast?broadcastId=${broadcastId}&recipients=${selectedRecipients.join(',')}`);
  };

  const filteredRecipients = recipients.filter((recipient) =>
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Pilih Penerima Beasiswa</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-900 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Cari penerima..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
        />
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
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      ) : filteredRecipients.length === 0 ? (
        <div className="p-8 text-center text-gray-900">
          {searchTerm ? 'Tidak ada penerima yang sesuai dengan pencarian' : 'Belum ada data penerima beasiswa'}
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-gray-300 rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Pilih
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider hidden sm:table-cell">
                  NRP
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider hidden md:table-cell">
                  IPK
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider hidden md:table-cell">
                  Departemen
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider hidden lg:table-cell">
                  No. HP
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider hidden lg:table-cell">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecipients.map((recipient) => (
                <tr key={recipient.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(recipient.id)}
                      onChange={() => toggleRecipientSelection(recipient.id)}
                      className="h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {recipient.name}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{recipient.nrp}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">{recipient.ipk}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">{recipient.departemen}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">{recipient.noHp}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">{recipient.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleConfirm}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Konfirmasi Penerima
        </button>
      </div>
    </div>
  );
}