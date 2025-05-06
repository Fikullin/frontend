'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import API_ENDPOINTS, { API_BASE_URL } from '@/utils/api-config';

export default function AddRecipientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    nrp: '',
    ipk: '',
    namaBank: '',
    noRekening: '',
    departemen: '',
    noHp: '',
    pekerjaanAyah: '',
    pekerjaanIbu: '',
    pemberiRekomendasi: '',
    keteranganLulus: '',
    pekerjaanSaatIni: '',
    status: 'Active',
    email: ''
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      if (!formData.name || !formData.nrp || !formData.ipk || !formData.departemen || !formData.noHp) {
        throw new Error('Nama, NRP, IPK, Departemen, dan No. HP wajib diisi');
      }

      if (!photo) {
        throw new Error('Foto wajib diupload');
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

      // Ambil token dari localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Anda harus login terlebih dahulu');
      }

      // Kirim data ke API dengan endpoint yang benar
      const response = await axios.post(API_ENDPOINTS.ADMIN.RECIPIENTS.CREATE, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response:', response);
      
      // Redirect ke halaman daftar penerima
      router.push('/dashboard/recipients');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError(`Endpoint tidak ditemukan: ${err.config?.url}. Pastikan API server berjalan dan endpoint tersedia.`);
        } else if (err.response?.status === 401) {
          setError('Sesi login Anda telah berakhir. Silakan login kembali.');
          // Redirect ke halaman login jika token tidak valid
          router.push('/login');
        } else {
          setError(err.response?.data?.message || `Error ${err.response?.status}: ${err.response?.statusText || 'Terjadi kesalahan saat menyimpan data'}`);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat menyimpan data');
      }
      console.error('Error adding recipient:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/recipients')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          Tambah Penerima Baru
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Pribadi */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Data Pribadi</h2>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="nrp" className="block text-sm font-medium text-gray-700 mb-1">
                  NRP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nrp"
                  name="nrp"
                  value={formData.nrp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="departemen" className="block text-sm font-medium text-gray-700 mb-1">
                  Departemen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="departemen"
                  name="departemen"
                  value={formData.departemen}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="noHp" className="block text-sm font-medium text-gray-700 mb-1">
                  No. HP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="noHp"
                  name="noHp"
                  value={formData.noHp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Data Tambahan */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Data Tambahan</h2>
              
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Foto <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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