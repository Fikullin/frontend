'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import API_ENDPOINTS, { API_BASE_URL } from '@/utils/api-config';
import Link from 'next/link';

interface InfoBeasiswa {
  id: number;
  title: string;
  description: string;
  date: string;
  photo: string;
}

export default function InfoBeasiswaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [infoBeasiswa, setInfoBeasiswa] = useState<InfoBeasiswa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInfoBeasiswa();
  }, []);

  const fetchInfoBeasiswa = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN.INFO_BEASISWA.DETAIL(unwrappedParams.id));
      setInfoBeasiswa(response.data);
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

  const handleDownloadImage = async () => {
    if (infoBeasiswa?.photo) {
      try {
        // Menampilkan indikator loading
        setIsLoading(true);
        
        // Menggunakan URL foto langsung daripada endpoint khusus
        const response = await axios.get(
          `${API_BASE_URL}/${infoBeasiswa.photo}`, 
          { responseType: 'blob' }
        );
        
        // Membuat URL objek dari blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        
        // Mendapatkan ekstensi file dari URL asli
        const extension = infoBeasiswa.photo.split('.').pop() || 'jpg';
        
        // Membuat nama file yang lebih baik
        const fileName = `beasiswa-${infoBeasiswa.title.replace(/\s+/g, '-')}-${infoBeasiswa.id}.${extension}`;
        
        // Membuat link download dan mengkliknya secara otomatis
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        
        // Membersihkan URL objek dan link
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        // Menampilkan pesan sukses (opsional)
        alert('Gambar berhasil diunduh!');
      } catch (error) {
        console.error('Error downloading image:', error);
        alert('Gagal mengunduh gambar. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Tidak ada gambar yang tersedia untuk diunduh.');
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 pt-16 sm:pt-20 md:pt-24 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <Link href="/info-beasiswa" className="inline-flex items-center text-sm sm:text-base text-blue-400 hover:text-blue-300 mb-4 sm:mb-6">
          <FiArrowLeft className="mr-2" />
          Kembali ke Daftar Beasiswa
        </Link>

        {error && (
          <div className="bg-red-800 bg-opacity-80 text-white p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center p-4 sm:p-6 md:p-8">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        ) : !infoBeasiswa ? (
          <div className="p-4 sm:p-6 md:p-8 text-center text-white bg-gray-900 bg-opacity-80 rounded-lg">
            Info beasiswa tidak ditemukan
          </div>
        ) : (
          <div className="bg-gray-900 bg-opacity-80 rounded-lg overflow-hidden shadow-lg">
            {infoBeasiswa.photo && (
              <div className="relative">
                <img 
                  src={`${API_BASE_URL}/${infoBeasiswa.photo}`} 
                  alt={infoBeasiswa.title} 
                  className="w-full h-48 sm:h-56 md:h-64 object-cover"
                />
                <button 
                  onClick={handleDownloadImage}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
                  title="Download Gambar"
                >
                  <FiDownload size={20} className="sm:hidden" />
                  <FiDownload size={24} className="hidden sm:block" />
                </button>
              </div>
            )}
            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{infoBeasiswa.title}</h1>
              <time className="block text-xs sm:text-sm text-blue-400 mb-4 sm:mb-6">{formatDate(infoBeasiswa.date)}</time>
              
              <div className="prose prose-sm sm:prose-base md:prose-lg prose-invert max-w-none">
                <p className="text-sm sm:text-base text-gray-300 whitespace-pre-line">{infoBeasiswa.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}