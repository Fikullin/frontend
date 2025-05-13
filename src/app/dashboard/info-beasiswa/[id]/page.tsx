'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import API_ENDPOINTS, { API_BASE_URL } from '@/utils/api-config';
import Image from 'next/image';

interface InfoBeasiswaFormData {
  title: string;
  description: string;
  date: string;
}

export default function EditInfoBeasiswaPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const [formData, setFormData] = useState<InfoBeasiswaFormData>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInfoBeasiswa = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.ADMIN.INFO_BEASISWA.DETAIL(unwrappedParams.id));
        const data = response.data;
        
        setFormData({
          title: data.title,
          description: data.description,
          date: data.date
        });
        
        if (data.photo) {
          setCurrentPhoto(data.photo);
        }
      } catch (error) {
        setError('Gagal mengambil data info beasiswa');
        console.error('Error fetching info beasiswa:', error);
      }
    };

    fetchInfoBeasiswa();
  }, [unwrappedParams.id]); // Hanya bergantung pada ID

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validasi data
      if (!formData.title || !formData.description || !formData.date) {
        throw new Error('Judul, deskripsi, dan tanggal wajib diisi');
      }

      // Ambil token dari localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Anda harus login terlebih dahulu');
      }

      // Buat FormData untuk mengirim data termasuk file
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '') {
          data.append(key, value.toString());
        }
      });
      
      if (photo) {
        data.append('photo', photo);
      }

      // Kirim data ke API
      await axios.put(
        API_ENDPOINTS.ADMIN.INFO_BEASISWA.UPDATE(unwrappedParams.id), 
        data, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Redirect ke halaman daftar info beasiswa
      router.push('/dashboard/info-beasiswa');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Error: ${err.message}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat menyimpan data');
      }
      console.error('Error updating info beasiswa:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/info-beasiswa')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          Edit Info Beasiswa
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Foto
            </label>
            {currentPhoto && !photo && (
              <div className="mb-2">
                
                <Image 
                  src={`${API_BASE_URL}/${currentPhoto}`} 
                  alt="Current Photo" 
                  width={160} 
                  height={160} 
                  className="h-40 object-cover rounded mb-2" 
                />
                <p className="text-sm text-gray-500">Foto saat ini</p>
              </div>
            )}
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah foto</p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/info-beasiswa')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              <FiSave className="mr-2" />
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}