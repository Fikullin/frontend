'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiSearch, FiRefreshCw, FiPlus, FiDownload } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import API_ENDPOINTS from '@/utils/api-config';

interface Finance {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  description: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function FinancePage() {
  const router = useRouter();
  const [finances, setFinances] = useState<Finance[]>([]);
  const [summary, setSummary] = useState<FinanceSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN.FINANCE.LIST);
      setFinances(response.data.finances || []);
      setSummary(response.data.summary || {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
      });
      setError('');
    } catch (error) {
      setError('Gagal mengambil data keuangan');
      console.error('Error fetching finances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data keuangan ini?')) {
      try {
        await axios.delete(API_ENDPOINTS.ADMIN.FINANCE.DELETE(id.toString()));
        fetchFinances();
      } catch (error) {
        setError('Gagal menghapus data keuangan');
        console.error('Error deleting finance:', error);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredFinances = finances.filter(finance =>
    finance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    finance.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Laporan Keuangan</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/dashboard/finance/new')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Tambah Transaksi
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiDownload size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">TOTAL PEMASUKAN</p>
              <p className="text-2xl font-semibold">{formatCurrency(summary.totalIncome)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FiDownload size={24} className="transform rotate-180" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">TOTAL PENGELUARAN</p>
              <p className="text-2xl font-semibold">{formatCurrency(summary.totalExpense)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${summary.balance >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'} mr-4`}>
              <FiDownload size={24} className={summary.balance >= 0 ? '' : 'transform rotate-180'} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">SALDO</p>
              <p className={`text-2xl font-semibold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </div>
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
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={fetchFinances}
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
        ) : filteredFinances.length === 0 ? (
          <div className="p-8 text-center text-gray-900">
            {searchTerm ? 'Tidak ada transaksi yang sesuai dengan pencarian' : 'Belum ada data keuangan'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Tipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Catatan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFinances.map((finance) => (
                  <tr key={finance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(finance.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        finance.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {finance.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      finance.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(finance.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{finance.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {finance.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/dashboard/finance/${finance.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(finance.id)}
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