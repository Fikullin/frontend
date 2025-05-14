import React from 'react';
import axios from 'axios';
import API_ENDPOINTS, { API_BASE_URL } from '../../utils/api-config';
import AnimatedPopup from './AnimatedPopup';
import AnimatedDescription from './AnimatedDescription';
import Image from 'next/image';

interface Section {
  img: string;
  alt: string;
  caption: string;
  description: string;
}

interface SectionText {
  alt: string;
  caption: string;
  description: string;
}

async function fetchHomeHeaderTexts() {
  try {
    const response = await axios.get(API_ENDPOINTS.ADMIN.HOME_EDIT_HEADER.GET_TEXTS);
    return {
      welcomeText: response.data.welcomeText || 'WELCOME!',
      descriptionText: response.data.descriptionText || '',
    };
  } catch (error) {
    console.error('Failed to fetch home header texts:', error);
    return {
      welcomeText: 'WELCOME!',
      descriptionText: '',
    };
  }
}

async function fetchHomeEditSection1() {
  try {
    const response = await axios.get(API_ENDPOINTS.ADMIN.HOME_EDIT_SECTION1.GET_SECTION);
    return response.data.sections as Section[] || [];
  } catch (error) {
    console.error('Failed to fetch home edit section1:', error);
    return [];
  }
}

async function fetchHomeEditSectionText() {
  try {
    const response = await axios.get(API_ENDPOINTS.ADMIN.HOME_EDIT_SECTIONTEXT.GET_SECTION);
    return response.data.sections as SectionText[] || [];
  } catch (error) {
    console.error('Failed to fetch home edit section text:', error);
    return [];
  }
}

function getImageUrl(img: string) {
  if (img.startsWith('http')) {
    return img;
  } else if (img.startsWith('/images')) {
    return `${API_BASE_URL}/public${img}`;
  } else if (img.startsWith('uploads')) {
    return `${API_BASE_URL}/${img}`;
  } else {
    return `${API_BASE_URL}/uploads/${img}`;
  }
}

export default async function HomePage() {
  const { welcomeText, descriptionText } = await fetchHomeHeaderTexts();
  const sections = await fetchHomeEditSection1();
  const sectionTexts = await fetchHomeEditSectionText();

  return (
    <div className="space-y-16">
      <header className="flex flex-col items-center justify-start pt-20 min-h-[calc(100vh-4rem)] font-sans px-4">
        <h1 className="text-9xl font-extrabold uppercase text-white">
          <AnimatedPopup text={welcomeText} />
        </h1>
        <AnimatedDescription text={descriptionText} />
      </header>

      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((section: Section, index: number) => (
          <div key={index} className="relative rounded-lg shadow-md overflow-hidden">
            <Image
              src={getImageUrl(section.img)}
              alt={section.alt}
              width={500}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center p-6 text-white">
              <h3 className="text-2xl font-semibold mb-2">{section.caption}</h3>
              <p className="text-lg">{section.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 space-y-8 border border-blue-500 rounded p-4">
        {sectionTexts.map((sectionText: SectionText, index: number) => (
          <div key={index} className="border border-blue-500 rounded p-6">
            <h3 className="text-xl font-semibold mb-2 text-white">{sectionText.caption}</h3>
            <p className="text-white mb-1"><strong>Pertanyaan :</strong> {sectionText.alt}</p>
            <p className="text-white mb-1"><strong>Jawaban : </strong>{sectionText.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
