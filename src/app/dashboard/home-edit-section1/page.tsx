'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../../../utils/api-config';

interface Section {
  img: string;
  alt: string;
  caption: string;
  description: string;
  file?: File | null;
  previewUrl?: string;
}

export default function HomeEditSection1Page() {
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
        const response = await axios.get(API_ENDPOINTS.ADMIN.HOME_EDIT_SECTION1.GET_SECTION);
        // Add previewUrl for existing images
        const sectionsWithPreview = response.data.sections.map((section: Section) => ({
          ...section,
          file: null,
          previewUrl: section.img.startsWith('http') ? section.img : `${window.location.origin}/${section.img}`,
        }));
        setSections(sectionsWithPreview);
      } catch (err) {
        setError('Gagal mengambil data section');
        console.error('Error fetching section data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleInputChange = (index: number, field: keyof Section, value: string | File | null) => {
    const updatedSections = [...sections];
    if (field === 'file' && value instanceof File) {
      updatedSections[index].file = value;
      updatedSections[index].previewUrl = URL.createObjectURL(value);
    } else if (typeof value === 'string') {
      updatedSections[index][field] = value as string & File;
    }
    setSections(updatedSections);
  };

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      handleInputChange(index, 'file', file);
    }
  };

  const handleAddSection = () => {
    const newSection: Section = {
      img: '',
      alt: '',
      caption: '',
      description: '',
      file: null,
      previewUrl: '',
    };
    setSections([...sections, newSection]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      const formData = new FormData();
      // Prepare sections data without img field for files to be uploaded
      const sectionsData = sections.map(({ img, file, previewUrl, ...rest }) => ({
        ...rest,
        img: img, // keep current img path, will be replaced if file uploaded
      }));
      formData.append('sections', JSON.stringify(sectionsData));
      // Append files
      sections.forEach((section, index) => {
        if (section.file) {
          formData.append('images', section.file);
        }
      });

      await axios.put(API_ENDPOINTS.ADMIN.HOME_EDIT_SECTION1.UPDATE_SECTION, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Section berhasil disimpan');
    } catch (err) {
      setError('Gagal menyimpan section');
      console.error('Error saving section data:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl text-black font-bold mb-6">Edit Section 1</h1>

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
                  <label className="block font-semibold mb-1">Image</label>
                  <div className="flex items-center space-x-4">
                    {section.previewUrl && (
                      <img
                        src={section.previewUrl}
                        alt={section.alt}
                        className="w-48 h-32 object-cover rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(index, e)}
                      className="border border-gray-300 rounded px-3 py-2 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block font-semibold mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={section.alt}
                    onChange={(e) => handleInputChange(index, 'alt', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter alt text"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-semibold mb-1">Caption</label>
                  <input
                    type="text"
                    value={section.caption}
                    onChange={(e) => handleInputChange(index, 'caption', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter caption"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-semibold mb-1">Description</label>
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
    </>
  );
}
