'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS, { API_BASE_URL } from '@/utils/api-config';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface InfoBeasiswa {
  id: number;
  title: string;
  description: string;
  date: string;
  photo: string;
}

export default function InfoBeasiswaPage() {
  const [infoBeasiswaList, setInfoBeasiswaList] = useState<InfoBeasiswa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 pt-16 sm:pt-20 md:pt-24 space-y-4 sm:space-y-6 md:space-y-8 bg-transparent">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">Info Beasiswa</h1>
      
      {error && (
        <div className="bg-red-800 bg-opacity-80 text-white p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center p-4 sm:p-6 md:p-8">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      ) : infoBeasiswaList.length === 0 ? (
        <div className="p-4 sm:p-6 md:p-8 text-center text-white bg-gray-900 bg-opacity-80 rounded-lg">
          Belum ada data info beasiswa
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {infoBeasiswaList.map((info) => (
            <article
              key={info.id}
              className="bg-gray-900 bg-opacity-80 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
            >
              {info.photo && (
                <div className="h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img 
                    src={`${API_BASE_URL}/${info.photo}`} 
                    alt={info.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 sm:p-5 md:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">{info.title}</h2>
                <time className="block text-xs sm:text-sm text-blue-400 mb-3 sm:mb-4">{formatDate(info.date)}</time>
                <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                  {info.description.length > 150 
                    ? `${info.description.substring(0, 150)}...` 
                    : info.description
                  }
                </p>
                <Link 
                  href={`/info-beasiswa/${info.id}`}
                  className="inline-flex items-center text-sm sm:text-base text-blue-400 hover:text-blue-300"
                >
                  Lihat Detail <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
