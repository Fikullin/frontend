'use client';

import React from 'react';

const scholarshipPosts = [
  {
    id: 1,
    title: 'Beasiswa Prestasi Akademik 2024',
    date: '01 June 2024',
    description: 'Beasiswa untuk mahasiswa berprestasi dengan IPK minimal 3.5. Pendaftaran dibuka hingga 30 Juni 2024.',
  },
  {
    id: 2,
    title: 'Beasiswa Bantuan Biaya Kuliah',
    date: '15 May 2024',
    description: 'Beasiswa untuk mahasiswa kurang mampu yang membutuhkan bantuan biaya kuliah. Pendaftaran dibuka hingga 15 Juli 2024.',
  },
  {
    id: 3,
    title: 'Beasiswa Riset dan Inovasi',
    date: '20 April 2024',
    description: 'Beasiswa untuk mahasiswa yang aktif dalam riset dan inovasi di bidang teknologi dan sains. Pendaftaran dibuka hingga 31 Juli 2024.',
  },
];

export default function InfoBeasiswaPage() {
  return (
    <div className="min-h-screen p-6 pt-24 space-y-8 bg-transparent">
      <h1 className="text-4xl font-bold text-white mb-6">Info Beasiswa</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarshipPosts.map(({ id, title, date, description }) => (
          <article
            key={id}
            className="bg-gray-900 bg-opacity-80 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
            <time className="block text-sm text-blue-400 mb-4">{date}</time>
            <p className="text-gray-300">{description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
