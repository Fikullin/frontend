'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS, { API_BASE_URL } from '@/utils/api-config';
import Image from 'next/image';

interface Recipient {
  id: number;
  name: string;
  photo: string;
  nrp: string;
  ipk: number;
  departemen: string;
  noHp: string;
  email: string;
  namaBank: string;
  noRekening: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  pemberiRekomendasi: string;
  pekerjaanSaatIni: string;
  status: string;
  keteranganLulus: string;
}

export default function PenerimaPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Penerima Beasiswa</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-900 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : recipients.length === 0 ? (
          <div className="p-8 text-center text-white">
            Belum ada data penerima beasiswa
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipients.map((recipient) => (
              <div key={recipient.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative">
                  {recipient.photo ? (
                    <Image
                      src={`${API_BASE_URL}/${recipient.photo}`}
                      alt={recipient.name}
                      height={48}
                      width={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 text-lg font-medium">
                      Tidak ada foto
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h2 className="text-white text-xl font-bold">{recipient.name}</h2>
                    <p className="text-white text-sm">{recipient.departemen}</p>
                  </div>
                </div>
                <div className="p-4 text-gray-800">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">NRP:</p>
                      <p className="text-gray-800">{recipient.nrp}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">IPK:</p>
                      <p className="text-gray-800">{recipient.ipk}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Status:</p>
                      <p className="text-gray-800">{recipient.status === 'Active' ? 'Aktif' : 
                          recipient.status === 'Inactive' ? 'Tidak Aktif' : 
                          recipient.status === 'Graduated' ? 'Lulus' : 
                          recipient.status === 'Suspended' ? 'Ditangguhkan' : recipient.status}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email:</p>
                      <p className="truncate text-gray-800">{recipient.email || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="font-semibold mb-1 text-gray-900">Pekerjaan Saat Ini:</p>
                    <p className="text-gray-800">{recipient.pekerjaanSaatIni || '-'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

