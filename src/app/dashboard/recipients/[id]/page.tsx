'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import API_ENDPOINTS from '@/utils/api-config';

interface RecipientFormData {
  name: string;
  photo: File | null;
  // Add other fields based on your backend model
}

export default function RecipientForm({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const [formData, setFormData] = useState<RecipientFormData>({
    name: '',
    photo: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isNew = unwrappedParams.id === 'new';

  useEffect(() => {
    if (!isNew) {
      fetchRecipient();
    }
  }, [isNew]);

  const fetchRecipient = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN.RECIPIENTS.DETAIL(unwrappedParams.id));
      setFormData({
        name: response.data.name,
        photo: null,
      });
    } catch (error) {
      setError('Gagal mengambil data penerima');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      if (isNew) {
        await axios.post(API_ENDPOINTS.ADMIN.RECIPIENTS.CREATE, formDataToSend);
      } else {
        await axios.put(API_ENDPOINTS.ADMIN.RECIPIENTS.UPDATE(unwrappedParams.id), formDataToSend);
      }

      router.push('/dashboard/recipients');
    } catch (error) {
      setError('Gagal menyimpan data penerima');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/recipients')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isNew ? 'Tambah Penerima Baru' : 'Edit Penerima'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Foto
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={isNew}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/recipients')}
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
