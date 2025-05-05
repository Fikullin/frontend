'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just simulate submission
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-5xl w-full rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-12 flex flex-col justify-center text-white bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-500">
          <h1 className="text-5xl font-extrabold mb-6">Get in Touch</h1>
          <p className="text-lg leading-relaxed">
            We would love to hear from you. Whether you have a question, feedback, or just want to say hello, feel free to reach out!
          </p>
          <div className="mt-10">
            <p className="font-semibold">Email:</p>
            <p>contact@beasiswa.com</p>
            <p className="mt-4 font-semibold">Phone:</p>
            <p>+62 123 4567 890</p>
          </div>
        </div>
        <div className="md:w-1/2 p-12 bg-white">
          {submitted ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-700 mb-4">Thank you!</h2>
              <p className="text-gray-700">Your message has been sent successfully. We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 font-semibold text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
