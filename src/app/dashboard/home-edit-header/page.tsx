'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../../../utils/api-config';

export default function HomeEditHeaderPage() {
  const [welcomeText, setWelcomeText] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTexts = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(API_ENDPOINTS.ADMIN.HOME_EDIT_HEADER.GET_TEXTS);
        const data = response.data;
        setWelcomeText(data.welcomeText || '');
        setDescriptionText(data.descriptionText || '');
      } catch (err) {
        setError('Gagal mengambil data teks header');
        console.error('Error fetching header texts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTexts();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      await axios.put(API_ENDPOINTS.ADMIN.HOME_EDIT_HEADER.UPDATE_TEXTS, {
        welcomeText,
        descriptionText,
      });
      setSuccessMessage('Teks header berhasil disimpan');
    } catch (err) {
      setError('Gagal menyimpan teks header');
      console.error('Error saving header texts:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl text-black font-bold mb-6">Edit Teks Header</h1>

      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}
          {successMessage && (
            <div
              className="mb-4 p-3 bg-green-100 text-green-700 rounded cursor-pointer"
              role="alert"
              onClick={() => setSuccessMessage('')}
              title="Click to dismiss"
            >
              {successMessage}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="welcomeText" className="block font-semibold mb-1">
              Welcome Text
            </label>
            <input
              id="welcomeText"
              type="text"
              value={welcomeText}
              onChange={(e) => setWelcomeText(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Masukkan welcome text"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="descriptionText" className="block font-semibold mb-1">
              Description Text
            </label>
            <textarea
              id="descriptionText"
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Masukkan description text"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded text-white ${
              isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </>
      )}
    </div>
  );
}
