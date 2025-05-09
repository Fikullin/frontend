'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [] = useState({
  });

  const [] = useState(false);



  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full rounded-3xl shadow-xl overflow-hidden">
        <div className="p-12 flex flex-col justify-center items-center text-white bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-500">
          <h1 className="text-5xl font-extrabold mb-6 text-center">Contact Operasional</h1>
          <p className="text-lg leading-relaxed text-center max-w-xl">
            .
          </p>
          
          {/* Card Kontak */}
          <div className="mt-10 bg-white bg-opacity-40 p-8 rounded-xl backdrop-blur-sm shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Kontak Kami</h2>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="font-bold text-gray-700 text-lg">Nama:</p>
                  <p className="text-gray-700 font-medium text-lg">.</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-bold text-gray-700 text-lg">Email:</p>
                  <p className="text-gray-700 font-medium text-lg">.</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-bold text-gray-700 text-lg">Telepon:</p>
                  <p className="text-gray-700 font-medium text-lg">+62 </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
