'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi';
import API_ENDPOINTS, { API_BASE_URL } from '@/utils/api-config';
import Image from 'next/image';

interface RecipientFormData {
  name: string;
  email: string;
  noHp: string;
  nrp: string;
  ipk: string;
  departemen: string;
  namaBank: string;
  noRekening: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  pemberiRekomendasi: string;
  pekerjaanSaatIni: string;
  keteranganLulus: string;
  status: string;
  photo?: string;
}

export default function EditRecipientPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const [formData, setFormData] = useState<RecipientFormData>({
    name: '',
    email: '',
    noHp: '',
    nrp: '',
    ipk: '',
    departemen: '',
    namaBank: '',
    noRekening: '',
    pekerjaanAyah: '',
    pekerjaanIbu: '',
    pemberiRekomendasi: '',
    pekerjaanSaatIni: '',
    keteranganLulus: '',
    status: 'Active',
    photo: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Anda harus login terlebih dahulu');
        }

        const response = await axios.get(
          API_ENDPOINTS.ADMIN.RECIPIENTS.DETAIL(unwrappedParams.id),
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Log data untuk debugging
        console.log('Data dari API:', response.data);
        
        const data = response.data;
        
        // Sesuaikan nama field dengan yang ada di backend
        setFormData({
          name: data.name || '',
          email: data.email || '',
          noHp: data.noHp || '',
          nrp: data.nrp || '',
          ipk: data.ipk || '',
          departemen: data.departemen || '',
          namaBank: data.namaBank || '',
          noRekening: data.noRekening || '',
          pekerjaanAyah: data.pekerjaanAyah || '',
          pekerjaanIbu: data.pekerjaanIbu || '',
          pemberiRekomendasi: data.pemberiRekomendasi || '',
          pekerjaanSaatIni: data.pekerjaanSaatIni || '',
          keteranganLulus: data.keteranganLulus || '',
          status: data.status || 'Active',
          photo: data.photo || ''
        });

        // Set photo preview jika ada foto
        if (data.photo) {
          setPhotoPreview(`${API_BASE_URL}/${data.photo}`);
        }
      } catch (_error) {
        setError('Gagal mengambil data penerima beasiswa');
        console.error('Error fetching recipient:', _error);
      }
    };

    fetchRecipient();
  }, [unwrappedParams.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Pastikan nama field di form sesuai dengan nama field di state
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      
      // Buat preview foto
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validasi data
      if (!formData.name || !formData.nrp || !formData.ipk || !formData.departemen || !formData.noHp) {
        throw new Error('Nama, NRP, IPK, Departemen, dan No. HP wajib diisi');
      }

      // Ambil token dari localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Anda harus login terlebih dahulu');
      }

      // Buat FormData untuk mengirim data termasuk file
      const submitFormData = new FormData();
      
      // Tambahkan semua field ke FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'photo') { // Skip photo karena akan ditangani secara terpisah
          submitFormData.append(key, value.toString());
        }
      });
      
      // Tambahkan file foto jika ada
      if (photoFile) {
        submitFormData.append('photo', photoFile);
      }

      // Log data yang akan dikirim untuk debugging
      console.log('Data yang akan dikirim:', formData);
      console.log('File foto:', photoFile);

      // Kirim data ke API
      const response = await axios.put(
        API_ENDPOINTS.ADMIN.RECIPIENTS.UPDATE(unwrappedParams.id), 
        submitFormData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('Response dari API:', response.data);
      
      // Redirect ke halaman daftar penerima beasiswa
      router.push('/dashboard/recipients');
    } catch (_error) {
      if (axios.isAxiosError(_error)) {
        setError(_error.response?.data?.message || `Error: ${_error.message}`);
        console.error('Error detail:', _error.response?.data);
      } else if (_error instanceof Error) {
        setError(_error.message);
      } else {
        setError('Terjadi kesalahan saat menyimpan data');
      }
      console.error('Error updating recipient:', _error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex items-center mb-4 sm:mb-6">
        <button
          onClick={() => router.push('/dashboard/recipients')}
          className="mr-3 sm:mr-4 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft size={20} className="sm:hidden" />
          <FiArrowLeft size={24} className="hidden sm:block" />
        </button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Edit Penerima Beasiswa
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Foto Penerima */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">Foto Penerima</h2>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-40 h-40 bg-gray-200 rounded-md overflow-hidden relative">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Preview foto"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    unoptimized={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700">
                    Tidak ada foto
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                  Unggah Foto
                </label>
                <div className="flex items-center">
                  <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-200">
                    <FiUpload className="mr-2" />
                    <span>Pilih Foto</span>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {photoFile && (
                    <span className="ml-3 text-sm text-gray-600">
                      {photoFile.name}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Format yang didukung: JPG, PNG. Ukuran maksimal: 2MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Data Pribadi */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">Data Pribadi</h2>
              
              <div className="mb-3 sm:mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-3 sm:mb-4">
                <label htmlFor="nrp" className="block text-sm font-medium text-gray-700 mb-1">
                  NRP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nrp"
                  name="nrp"
                  value={formData.nrp}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-3 sm:mb-4">
                <label htmlFor="departemen" className="block text-sm font-medium text-gray-700 mb-1">
                  Departemen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="departemen"
                  name="departemen"
                  value={formData.departemen}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-3 sm:mb-4">
                <label htmlFor="ipk" className="block text-sm font-medium text-gray-700 mb-1">
                  IPK <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="ipk"
                  name="ipk"
                  value={formData.ipk}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="4"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-3 sm:mb-4">
                <label htmlFor="noHp" className="block text-sm font-medium text-gray-700 mb-1">
                  No. HP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="noHp"
                  name="noHp"
                  value={formData.noHp}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-3 sm:mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Data Tambahan */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">Data Tambahan</h2>
              
              <div className="mb-4">
                <label htmlFor="namaBank" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Bank
                </label>
                <input
                  type="text"
                  id="namaBank"
                  name="namaBank"
                  value={formData.namaBank}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="noRekening" className="block text-sm font-medium text-gray-700 mb-1">
                  No. Rekening
                </label>
                <input
                  type="text"
                  id="noRekening"
                  name="noRekening"
                  value={formData.noRekening}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="pekerjaanAyah" className="block text-sm font-medium text-gray-700 mb-1">
                  Pekerjaan Ayah
                </label>
                <input
                  type="text"
                  id="pekerjaanAyah"
                  name="pekerjaanAyah"
                  value={formData.pekerjaanAyah}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="pekerjaanIbu" className="block text-sm font-medium text-gray-700 mb-1">
                  Pekerjaan Ibu
                </label>
                <input
                  type="text"
                  id="pekerjaanIbu"
                  name="pekerjaanIbu"
                  value={formData.pekerjaanIbu}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="pemberiRekomendasi" className="block text-sm font-medium text-gray-700 mb-1">
                  Pemberi Rekomendasi
                </label>
                <input
                  type="text"
                  id="pemberiRekomendasi"
                  name="pemberiRekomendasi"
                  value={formData.pemberiRekomendasi}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="pekerjaanSaatIni" className="block text-sm font-medium text-gray-700 mb-1">
                  Pekerjaan Saat Ini
                </label>
                <input
                  type="text"
                  id="pekerjaanSaatIni"
                  name="pekerjaanSaatIni"
                  value={formData.pekerjaanSaatIni}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Aktif</option>
                  <option value="Inactive">Tidak Aktif</option>
                  <option value="Graduated">Lulus</option>
                  <option value="Suspended">Ditangguhkan</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="keteranganLulus" className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan Lulus
            </label>
            <textarea
              id="keteranganLulus"
              name="keteranganLulus"
              value={formData.keteranganLulus}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 sm:space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/recipients')}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 text-sm sm:text-base"
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
