'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiSend, FiRefreshCw, FiSearch } from 'react-icons/fi';
import BROADCAST_API_ENDPOINTS from '../../../utils/api-broadcast-config';

interface Broadcast {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  sentAt?: string;
}

export default function BroadcastPage() {
  const router = useRouter();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  // Pindahkan state modal ke dalam komponen
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedBroadcastId, setSelectedBroadcastId] = useState<number | null>(null);
  const [sendMethod, setSendMethod] = useState('whatsapp');
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(BROADCAST_API_ENDPOINTS.LIST);
      setBroadcasts(response.data || []);
      setError('');
    } catch (error) {
      setError('Gagal mengambil data broadcast');
      console.error('Error fetching broadcasts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
  
    try {
      // Validasi data
      if (!title.trim()) {
        throw new Error('Judul tidak boleh kosong');
      }
      
      if (!content.trim()) {
        throw new Error('Pesan tidak boleh kosong');
      }

      // Ambil token dari localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Anda harus login terlebih dahulu');
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };
  
      let responseData;
      
      if (editingId) {
        // Update existing broadcast
        const response = await axios.put(
          BROADCAST_API_ENDPOINTS.DETAIL(editingId.toString()), 
          { title, content },
          { headers }
        );
        
        responseData = response.data;
        
        // Update the broadcasts list
        setBroadcasts(prevBroadcasts => 
          prevBroadcasts.map(broadcast => 
            broadcast.id === editingId 
              ? { ...broadcast, title, content, updatedAt: new Date().toISOString() } 
              : broadcast
          )
        );
      } else {
        // Create new broadcast
        const response = await axios.post(
          BROADCAST_API_ENDPOINTS.CREATE, 
          { title, content },
          { headers }
        );
        
        responseData = response.data;
        
        // Add the new broadcast to the list
        if (responseData) {
          // Check if the response has a broadcast property
          const newBroadcast = responseData.broadcast || responseData;
          setBroadcasts(prevBroadcasts => [newBroadcast, ...prevBroadcasts]);
        }
      }
      
      // Reset form and state
      setTitle('');
      setContent('');
      setShowForm(false);
      setEditingId(null);
      
      // Show success message
      alert(editingId ? 'Broadcast berhasil diperbarui!' : 'Broadcast berhasil dibuat!');
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Terjadi kesalahan saat ${editingId ? 'memperbarui' : 'membuat'} broadcast`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`Terjadi kesalahan saat ${editingId ? 'memperbarui' : 'membuat'} broadcast`);
      }
      console.error(`Error ${editingId ? 'updating' : 'creating'} broadcast:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (broadcast: Broadcast) => {
    setTitle(broadcast.title);
    setContent(broadcast.content);
    setEditingId(broadcast.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus broadcast ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Anda harus login terlebih dahulu');
      }

      await axios.delete(BROADCAST_API_ENDPOINTS.DETAIL(id.toString()), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Remove the deleted broadcast from the list
      setBroadcasts(prevBroadcasts => prevBroadcasts.filter(broadcast => broadcast.id !== id));
      
      alert('Broadcast berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting broadcast:', error);
      alert('Gagal menghapus broadcast');
    }
  };

  const handleSendClick = (id: number) => {
    // Navigate to select recipients page with broadcastId as query param
    router.push(`/dashboard/broadcast/select-recipients?broadcastId=${id}`);
  };

  const handleSendConfirm = async () => {
    if (!selectedBroadcastId) return;
    if (!selectedRecipients || selectedRecipients.length === 0) {
      alert('Pilih penerima terlebih dahulu');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Anda harus login terlebih dahulu');
      }

      console.log('Sending to URL:', BROADCAST_API_ENDPOINTS.SEND(selectedBroadcastId.toString()));

      await axios.post(BROADCAST_API_ENDPOINTS.SEND(selectedBroadcastId.toString()), {
        method: sendMethod, // Kirim metode pengiriman ke backend
        recipients: selectedRecipients // Kirim daftar penerima ke backend
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'  // Explicitly set content type
        }
      });

      // Update the broadcast status in the list
      setBroadcasts(prevBroadcasts => 
        prevBroadcasts.map(broadcast => 
          broadcast.id === selectedBroadcastId 
            ? { ...broadcast, status: 'Sent', sentAt: new Date().toISOString() } 
            : broadcast
        )
      );

      setShowSendModal(false);
      alert(`Broadcast berhasil dikirim via ${sendMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}!`);
    } catch (error) {
      console.error('Error sending broadcast:', error);
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;

        alert(`Gagal mengirim broadcast (${statusCode}): ${errorMessage}`);
      } else {
        alert('Gagal mengirim broadcast');
      }
      setShowSendModal(false);
    }
  };

  // Parse query params to get broadcastId and recipients when navigated back from select-recipients page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const broadcastIdParam = params.get('broadcastId');
    const recipientsParam = params.get('recipients');

    if (broadcastIdParam) {
      setSelectedBroadcastId(parseInt(broadcastIdParam));
    }

    if (recipientsParam) {
      const recipientIds = recipientsParam.split(',').map(id => parseInt(id));
      setSelectedRecipients(recipientIds);
      setShowSendModal(true);
    }
  }, []);

  const filteredBroadcasts = broadcasts.filter(broadcast =>
    broadcast.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Broadcast Pesan
        </h1>
        <button
          onClick={() => {
            setTitle('');
            setContent('');
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          {showForm ? 'Tutup Form' : 'Buat Broadcast Baru'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Broadcast' : 'Buat Broadcast Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Judul Broadcast
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Masukkan judul broadcast"
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Pesan Broadcast
              </label>
              <textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Tulis pesan broadcast di sini..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isSubmitting ? 'Menyimpan...' : editingId ? 'Perbarui Broadcast' : 'Buat Broadcast'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Cari broadcast..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={fetchBroadcasts}
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
        ) : filteredBroadcasts.length === 0 ? (
          <div className="p-8 text-center text-gray-900">
            {searchTerm ? 'Tidak ada broadcast yang sesuai dengan pencarian' : 'Belum ada data broadcast'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Tanggal Dibuat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBroadcasts.map((broadcast) => (
                  <tr key={broadcast.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{broadcast.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(broadcast.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {broadcast.status === 'Sent' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Terkirim
                        </span>
                      ) : broadcast.status === 'Failed' ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          Gagal
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(broadcast)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(broadcast.id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                        title="Hapus"
                      >
                        <FiTrash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleSendClick(broadcast.id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                        title="Kirim Broadcast"
                      >
                        <FiSend />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[450px] max-w-[90%]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-blue-700">Pilih Metode Pengiriman</h3>
              <button 
                onClick={() => setShowSendModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700 mb-2 font-medium">Informasi Pengiriman</p>
              <p className="text-sm text-gray-600">
                Pilih metode pengiriman untuk broadcast ini. Pastikan penerima memiliki data kontak yang valid sesuai metode yang dipilih.
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSendMethod('whatsapp')}>
                <input
                  type="radio"
                  id="whatsapp"
                  name="sendMethod"
                  value="whatsapp"
                  checked={sendMethod === 'whatsapp'}
                  onChange={() => setSendMethod('whatsapp')}
                  className="mr-3 h-5 w-5 text-blue-600"
                />
                <div className="flex items-center">
                  <div className="bg-green-500 text-white p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <label htmlFor="whatsapp" className="font-medium text-gray-700 cursor-pointer">WhatsApp</label>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSendMethod('email')}>
                <input
                  type="radio"
                  id="email"
                  name="sendMethod"
                  value="email"
                  checked={sendMethod === 'email'}
                  onChange={() => setSendMethod('email')}
                  className="mr-3 h-5 w-5 text-blue-600"
                />
                <div className="flex items-center">
                  <div className="bg-blue-500 text-white p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <label htmlFor="email" className="font-medium text-gray-700 cursor-pointer">Email</label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleSendConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}