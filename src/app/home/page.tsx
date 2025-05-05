'use client';

import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const texts = [
    "WELCOME!",
  ];

  const fullDescription = "Thhis website provides comprehensive scholarship information and resources to help you achieve your educational goals. Explore various scholarship opportunities, application tips, and success stories to guide you on your academic journey. Stay updated with the latest announcements, connect with fellow students, and access valuable tools designed to support your educational pursuits. Our mission is to empower you with knowledge and opportunities to succeed.";

  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [menuVisibleIndex, setMenuVisibleIndex] = useState(-1);
  const [extraVisibleIndex, setExtraVisibleIndex] = useState(-1);
  const [typedDescription, setTypedDescription] = useState('');

  useEffect(() => {
    let currentText = 0;
    const textInterval = setInterval(() => {
      setVisibleIndex(currentText);
      currentText++;
      if (currentText >= texts.length) {
        clearInterval(textInterval);
      }
    }, 400);

    let currentMenu = 0;
    const menuInterval = setInterval(() => {
      setMenuVisibleIndex(currentMenu);
      currentMenu++;
      if (currentMenu >= 4) {
        clearInterval(menuInterval);
      }
    }, 500);

    let currentExtra = 0;
    const extraInterval = setInterval(() => {
      setExtraVisibleIndex(currentExtra);
      currentExtra++;
      if (currentExtra >= 3) {
        clearInterval(extraInterval);
      }
    }, 500);

    return () => {
      clearInterval(textInterval);
      clearInterval(menuInterval);
      clearInterval(extraInterval);
    };
  }, []);

  // Typing animation for description with faster speed
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedDescription((prev) => prev + fullDescription.charAt(index));
      index++;
      if (index >= fullDescription.length) {
        clearInterval(typingInterval);
      }
    }, 20); // faster speed: 20ms per character

    return () => clearInterval(typingInterval);
  }, [fullDescription]);

  const extraSections = [
    {
      img: "/images/extra1.jpg",
      alt: "Extra Section 1",
      caption: "Explore new features",
      description: "Discover the latest tools and updates to enhance your workflow and productivity.",
    },
    {
      img: "/images/extra2.jpg",
      alt: "Extra Section 2",
      caption: "Stay connected with your team",
      description: "Collaborate seamlessly with your colleagues and keep everyone in the loop.",
    },
    {
      img: "/images/extra3.jpg",
      alt: "Extra Section 3",
      caption: "Boost your productivity",
      description: "Utilize advanced analytics and insights to make informed decisions quickly.",
    },
  ];

  return (
    <div className="space-y-8 ">
      <header className="flex flex-col items-center justify-start pt-20 min-h-[calc(100vh-4rem)] font-sans px-4">
        {texts.map((text, index) => (
          <h1
            key={index}
            className={`text-9xl font-extrabold uppercase text-white transform transition-all duration-500 ease-out ${
              visibleIndex >= index ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
          >
            {text}
          </h1>
        ))}
        <p className="mt-6 max-w-3xl text-center text-white text-xl whitespace-pre-wrap">
          {typedDescription}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            img: "/images/chart1.png",
            title: "Total Users",
            value: "1,234",
          },
          {
            img: "/images/chart2.png",
            title: "Active Sessions",
            value: "567",
          },
          {
            img: "/images/chart3.png",
            title: "Server Load",
            value: "72%",
          },
        ].map(({ img, title, value }, index) => (
          <div
            key={index}
            className={`bg-gray-900 bg-opacity-95 rounded-lg p-6 shadow-lg flex flex-col items-center text-white transform transition-all duration-500 ${
              menuVisibleIndex >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <img
              src={img}
              alt={title}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-4xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section
        className={`bg-gray-900 bg-opacity-95 rounded-lg p-6 shadow-lg text-white transform transition-all duration-500 ${
          menuVisibleIndex >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-2 max-h-48 overflow-auto">
          <li className="border-b border-blue-700 py-2">User John logged in</li>
          <li className="border-b border-blue-700 py-2">Report generated by Admin</li>
          <li className="border-b border-blue-700 py-2">Server restarted</li>
          <li className="border-b border-blue-700 py-2">New user registered</li>
        </ul>
      </section>

      {/* Additional sections with image left and text right */}
      {extraSections.map(({ img, alt, caption, description }, index) => (
        <section
          key={index}
          className={`bg-gray-900 bg-opacity-95 rounded-lg p-6 shadow-lg flex flex-col md:flex-row items-center text-white transform transition-all duration-500 ${
            extraVisibleIndex >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <img
            src={img}
            alt={alt}
            className="w-full md:w-1/2 h-64 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
          />
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-2">{caption}</h3>
            <p className="text-lg">{description}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
