'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../../../utils/api-config';

interface Section {
  alt: string;
  caption: string;
  description: string;
}

export default function HomeEditSectionTextPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSections = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(API_ENDPOINTS.ADMIN.HOME_EDIT_SECTIONTEXT.GET_SECTION);
        // Extract only text fields
        const sectionsTextOnly = response.data.sections.map((section: Section) => ({
          alt: section.alt,
          caption: section.caption,
          description: section.description,
        }));
        setSections(sectionsTextOnly);
      } catch (err) {
        setError('Gagal mengambil data section');
        console.error('Error fetching section data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleInputChange = (index: number, field: keyof Section, value: string) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const handleAddSection = () => {
    const newSection: Section = {
      alt: '',
      caption: '',
      description: '',
    };
    setSections([...sections, newSection]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      // Prepare sections data with empty img fields since no image upload here
      const sectionsData = sections.map((section) => ({
        ...section,
        img: '', // no image update here
      }));

      await axios.put(
        API_ENDPOINTS.ADMIN.HOME_EDIT_SECTIONTEXT.UPDATE_SECTION,
        new URLSearchParams({
          sections: JSON.stringify(sectionsData),
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      setSuccessMessage('Section berhasil disimpan');
    } catch (err) {
      setError('Gagal menyimpan section');
      console.error('Error saving section data:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white  rounded shadow">
      <h1 className="text-2xl text-black font-bold mb-6">Edit Section Teks</h1>

      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
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

          {sections.map((section, index) => (
            <div key={index} className="mb-6 border border-gray-300 rounded p-4">
                <div className="mb-2">
                <label className="block font-semibold mb-1">Judul</label>
                <input
                  type="text"
                  value={section.caption}
                  onChange={(e) => handleInputChange(index, 'caption', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter caption"
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold mb-1">Pertanyaan</label>
                <input
                  type="text"
                  value={section.alt}
                  onChange={(e) => handleInputChange(index, 'alt', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter alt text"
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold mb-1">Jaawaban</label>
                <textarea
                  value={section.description}
                  onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter description"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleAddSection}
            className="mb-4 px-6 py-2 rounded text-white bg-green-600 hover:bg-green-700"
          >
            Tambah Section
          </button>

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
