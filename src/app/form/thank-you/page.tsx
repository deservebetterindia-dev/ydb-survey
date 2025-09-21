'use client';
import { useState } from 'react';

export default function ThankYouPage() {
  const [agreed, setAgreed] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 max-w-xl w-full text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">✅</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">Thank you for sharing your story!</h1>
        <p className="text-slate-600 mb-6">
          Your responses have been submitted successfully. We truly appreciate your time and honesty.
        </p>

        {/* Checkbox */}
        <div className="flex items-center justify-center mb-6">
          <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 accent-blue-600 align-middle"
            />
            <span className="leading-tight">Keep me updated with the latest news, tips, and stories from YDB via WhatsApp, email, or newsletter.</span>
          </label>
        </div>


        {/* Show button only if agreed */}
        {agreed && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="inline-flex justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-medium shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Join The Waiting List
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
