'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ThankYouPage() {
  const [agreed, setAgreed] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const submitted = searchParams.get('submitted');
    if (!submitted) {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [router, searchParams]);
  
  if (!isAuthorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 max-w-xl w-full text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">✅</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">Thank you for sharing your story!</h1>
        <p className="text-slate-600 mb-6">
          Your responses have been submitted successfully. We truly appreciate your time and honesty.
        </p>

        


        <div className="flex flex-col gap-3 justify-center">
          <a
            href="/blog"
            className="inline-flex justify-center rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 text-white font-medium shadow-lg hover:from-pink-700 hover:to-purple-700 transition-all"
          >
            📖 Watch Other Stories
          </a>
          
          {/* Show waiting list button only if agreed */}
          {agreed && (
            <a
              href="/"
              className="inline-flex justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-medium shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Join The Waiting List
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
