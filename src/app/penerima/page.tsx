'use client';

import React, { useEffect, useState } from 'react';

const profiles = Array(32).fill({
  nama: 'Ahmad Fauzi',
  NRP: '123456789',
  IPK: '3.75',
  NamaBank: 'Bank Central Asia',
  NoRek: '9876543210',
  Departemen: 'Teknik Informatika',
  NoHp: '+62 812 3456 7890',
  PekerjaanAyah: 'PNS',
  PekerjaanIbu: 'Guru',
  PemberiRekomendasi: 'Dr. Budi Santoso',
  KeteranganLulus: 'Lulus Tepat Waktu',
  PekerjaanSaatIni: 'Software Engineer',
  imgSrc: '/images/profile.jpg',
});

export default function ManagementPage() {
  const [visibleIndex, setVisibleIndex] = useState(-1);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setVisibleIndex(currentIndex);
      currentIndex++;
      if (currentIndex >= profiles.length) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className={`bg-gray-900 bg-opacity-70 rounded-3xl shadow-lg overflow-hidden flex flex-col items-center text-center p-6 mx-auto transform transition-all duration-500 ${
              visibleIndex >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ minHeight: '320px', maxWidth: '280px' }}
          >
            <h2 className="text-2xl font-extrabold mb-4 text-white">{profile.nama}</h2>
            <img
              src={profile.imgSrc}
              alt={profile.nama}
              className="rounded-full w-32 h-32 object-cover shadow-md mb-4"
            />
            <div className="text-left text-gray-300 text-sm space-y-1 w-full">
              <p><strong>Nama:</strong> {profile.nama}</p>
              <p><strong>NRP:</strong> {profile.NRP}</p>
              <p><strong>IPK:</strong> {profile.IPK}</p>
              <p><strong>Nama Bank:</strong> {profile.NamaBank}</p>
              <p><strong>No Rek:</strong> {profile.NoRek}</p>
              <p><strong>Departemen:</strong> {profile.Departemen}</p>
              <p><strong>No.Hp:</strong> {profile.NoHp}</p>
              <p><strong>Pekerjaan Ayah:</strong> {profile.PekerjaanAyah}</p>
              <p><strong>Pekerjaan Ibu:</strong> {profile.PekerjaanIbu}</p>
              <p><strong>Pemberi Rekomendasi:</strong> {profile.PemberiRekomendasi}</p>
              <p><strong>Keterangan Lulus:</strong> {profile.KeteranganLulus}</p>
              <p><strong>Pekerjaan Saat Ini:</strong> {profile.PekerjaanSaatIni}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
