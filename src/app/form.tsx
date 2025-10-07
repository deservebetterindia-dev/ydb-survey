// app/Form.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FormData {
  [key: string]: string | string[] | number;
}

export default function Form() {
  const [formData, setFormData] = useState<FormData>({});
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const sectionRefs = useRef<{[key: number]: HTMLDivElement | null}>({});

  // Required fields for validation
  const requiredFields = useMemo(() => [
    'lifeStage', 'homeLocation', 'relationshipStatus', 'education', 
    'dailyActivities', 'incomeRange', 'diagnosisStatus', 'impactLevel',
    'monthlySpend'
  ], []);

  // Update progress based on filled required fields
  useEffect(() => {
    const filledFields = requiredFields.filter(field => {
      const value = formData[field];
      return value !== undefined && 
             value !== '' && 
             (!Array.isArray(value) || value.length > 0);
    }).length;
    
    setProgress(Math.round((filledFields / requiredFields.length) * 100));
  }, [formData, requiredFields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => {
      if (type === 'checkbox') {
        const currentValue = prevData[name] as string[] || [];
        if (checked) {
          return { ...prevData, [name]: [...currentValue, value] };
        } else {
          return { 
            ...prevData, 
            [name]: currentValue.filter(item => item !== value) 
          };
        }
      } else if (type === 'range') {
        return { ...prevData, [name]: parseInt(value, 10) };
      } else {
        return { ...prevData, [name]: value };
      }
    });

    // Clear error when field is filled
    if (errors[name] && value) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    requiredFields.forEach(field => {
      const value = formData[field];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        newErrors[field] = 'This field is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    
    if (!validateForm()) {
      alert('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📨 API response status:', response.status);
      const result = await response.json();
      console.log('📄 API response data:', result);
      
      if (result.success) {
        alert('Thank you for sharing your story! 💕');
      } else {
        alert('There was an error submitting your form. Please try again.');
      }
    } catch (error) {
      console.error('💥 Submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const scrollToSection = (sectionNumber: number) => {
    setCurrentSection(sectionNumber);
    const element = sectionRefs.current[sectionNumber];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Assign ref to each section
  const assignSectionRef = (sectionNumber: number, element: HTMLDivElement | null) => {
    sectionRefs.current[sectionNumber] = element;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-4 flex items-center justify-between gap-1 sm:gap-2">
          {/* Left: Back Link */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors">
              <span className="text-lg sm:text-2xl">←</span>
              <span className="font-semibold text-sm hidden sm:block">Back to Home</span>
              <span className="font-semibold text-sm sm:hidden">Back</span>
            </Link>
          </div>

          {/* Center: Logo (responsive container with Image fill) */}
          <div className="flex-1 flex justify-center">
            <div className="relative h-6 sm:h-9 md:h-10 w-24 sm:w-36 md:w-40">
              <Image
                src="/logo.png"
                alt="You Deserve Better"
                fill
                priority
                sizes="(max-width: 640px) 96px, (max-width: 768px) 144px, 160px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Right: Progress */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-slate-600 flex-shrink-0">
            <span className="hidden sm:inline">Progress</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-slate-700">
              {progress}%
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-1 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        {/* Hero Section */}
        <section className="text-center py-8 sm:py-12 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-pink-100">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Your Story, Your Strength, Your Community
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">Together We Rise, Together We Heal ✨</p>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <p className="font-bold text-pink-600 text-base sm:text-lg md:text-xl">
                🦋 You are not broken. You are not less than. You are beautifully, uniquely you. 🦋
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-3 sm:p-4 rounded-xl shadow-md text-center">
            <span className="text-pink-600 text-2xl sm:text-3xl font-bold block">1 in 5</span>
            <p className="text-gray-700 text-xs sm:text-sm">Indian women have PCOS</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 sm:p-4 rounded-xl shadow-md text-center">
            <span className="text-purple-600 text-2xl sm:text-3xl font-bold block">70%</span>
            <p className="text-gray-700 text-xs sm:text-sm">Never get proper diagnosis</p>
          </div>
          <div className="bg-gradient-to-br from-rose-100 to-purple-100 p-3 sm:p-4 rounded-xl shadow-md text-center sm:col-span-2 md:col-span-1">
            <span className="text-rose-600 text-2xl sm:text-3xl font-bold block">22.5%</span>
            <p className="text-gray-700 text-xs sm:text-sm">Prevalence growing</p>
          </div>
        </section>

        {/* Section Navigation */}
        <div className="mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  currentSection === section
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                }`}
              >
                Section {section}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Section 1 */}
          <div
            id="section-1"
            ref={(el) => assignSectionRef(1, el)}
            className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border-l-4 border-pink-400"
          >
            <h3 className="text-lg sm:text-xl font-bold text-pink-600 mb-4 sm:mb-6 flex items-center gap-2">
              <span className="bg-pink-100 p-1.5 sm:p-2 rounded-full text-xs sm:text-sm">🌸</span>
              1. Getting to Know You
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Life Stage *</label>
                <input
                  type="text"
                  name="lifeStage"
                  onChange={handleChange}
                  className="w-full p-3 sm:p-3 border border-pink-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-all text-sm sm:text-base"
                  required
                  placeholder="Early twenties..."
                />
                {errors.lifeStage && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.lifeStage}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Location *</label>
                <input
                  type="text"
                  name="homeLocation"
                  onChange={handleChange}
                  className="w-full p-3 sm:p-3 border border-pink-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-all text-sm sm:text-base"
                  required
                  placeholder="Mumbai, Delhi..."
                />
                {errors.homeLocation && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.homeLocation}</p>}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-700 font-medium mb-3 text-sm sm:text-base">Relationship Status *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Flying solo & loving it', 'Married & blessed', 'Independent & strong', "I&apos;d rather not share"].map(option => (
                  <label key={option} className="flex items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg border hover:border-pink-300 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="relationshipStatus"
                      value={option}
                      onChange={handleChange}
                      className="mr-2 sm:mr-3 text-pink-500 w-4 h-4"
                      required
                    />
                    <span className="text-gray-700 text-sm sm:text-base">{option}</span>
                  </label>
                ))}
              </div>
              {errors.relationshipStatus && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.relationshipStatus}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Education Journey *</label>
                <input
                  type="text"
                  name="education"
                  onChange={handleChange}
                  className="w-full p-3 sm:p-3 border border-pink-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-all text-sm sm:text-base"
                  required
                  placeholder="Bachelor's degree..."
                />
                {errors.education && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.education}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">How do you spend your days? *</label>
                <input
                  type="text"
                  name="dailyActivities"
                  onChange={handleChange}
                  className="w-full p-3 sm:p-3 border border-pink-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-all text-sm sm:text-base"
                  required
                  placeholder="Working professional..."
                />
                {errors.dailyActivities && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.dailyActivities}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Your family&apos;s monthly income range *</label>
              <input
                type="text"
                name="incomeRange"
                onChange={handleChange}
                className="w-full p-3 sm:p-3 border border-pink-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-all text-sm sm:text-base"
                required
                placeholder="₹25,000-50,000..."
              />
              {errors.incomeRange && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.incomeRange}</p>}
            </div>
          </div>

          {/* Section 2 */}
          <div 
            id="section-2" 
            ref={(el) => assignSectionRef(2, el)}
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-purple-400"
          >
            <h3 className="text-xl font-bold text-purple-600 mb-6 flex items-center gap-2">
              <span className="bg-purple-100 p-2 rounded-full text-sm">🔍💖</span>
              2. Your PCOS Discovery Story
            </h3>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">Has a doctor officially confirmed PCOS/PCOD for you? *</label>
              <div className="space-y-2">
                {['Yes, diagnosed with PCOS', 'Yes, diagnosed with PCOD', 'Not yet, but I strongly suspect I have it', "I'm here to learn and understand", "I'm confused about PCOS vs PCOD"].map(option => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg border hover:border-purple-300 cursor-pointer transition-all">
                    <input 
                      type="radio" 
                      name="diagnosisStatus" 
                      value={option} 
                      onChange={handleChange} 
                      className="mr-3 text-purple-500" 
                      required 
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {errors.diagnosisStatus && <p className="text-red-500 text-sm mt-1">{errors.diagnosisStatus}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">If diagnosed, when did you receive this news?</label>
              <input 
                type="text" 
                name="diagnosisDate" 
                onChange={handleChange} 
                className="w-full p-3 border border-purple-200 rounded-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-200 transition-all" 
                placeholder="2 years ago, Last month..." 
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">What initially made you seek medical help? (Choose all that feel true)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['My periods became unpredictable', 'Unexpected weight changes', 'Unwanted hair growth', 'Hair thinning or loss', 'Persistent skin issues', 'Challenges with conceiving', 'Emotional ups and downs', 'A loved one suggested I get checked', 'Discovered during routine health check'].map(option => (
                  <label key={option} className="flex items-center p-2 bg-gray-50 rounded-lg border hover:border-purple-300 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      name="initialSymptoms" 
                      value={option} 
                      onChange={handleChange} 
                      className="mr-2 text-purple-500" 
                    />
                    <span className="text-gray-700 text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">How many healthcare providers did you visit before getting clear answers?</label>
              <div className="space-y-2">
                {['Just one - I was fortunate!', '2-3 doctors', '4-5 doctors', 'More than 5 - it&apos;s been a journey', 'Still searching for the right answers', 'Haven&apos;t started this journey yet'].map(option => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg border hover:border-purple-300 cursor-pointer transition-all">
                    <input 
                      type="radio" 
                      name="doctorCount" 
                      value={option} 
                      onChange={handleChange} 
                      className="mr-3 text-purple-500" 
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div 
            id="section-3" 
            ref={(el) => assignSectionRef(3, el)}
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-rose-400"
          >
            <h3 className="text-xl font-bold text-rose-600 mb-6 flex items-center gap-2">
              <span className="bg-rose-100 p-2 rounded-full text-sm">🌺✨</span>
              3. How PCOS Shows Up in Your Beautiful Life
            </h3>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">Which of these experiences resonate with your current journey? (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {['My menstrual cycle has its own schedule (more than 35 days apart)', 'My periods take long breaks (3+ months missing)', 'When they come, they&apos;re intense and painful', 'My body gained weight without explanation', 'Weight loss feels like an uphill battle', 'Unwanted hair growth on face or body', 'My beautiful hair is thinning', 'Stubborn acne, especially around jawline', 'Dark skin patches (neck, underarms, groin area)', 'Emotional roller coaster days', 'Feelings of sadness or anxiety', 'Constant tiredness, low energy', 'Sleep doesn&apos;t come easily', 'Intense cravings for sweets', 'Brain fog and concentration challenges', 'Struggling with self-confidence'].map(option => (
                  <label key={option} className="flex items-center p-2 bg-gray-50 rounded-lg border hover:border-rose-300 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      name="currentExperiences" 
                      value={option} 
                      onChange={handleChange} 
                      className="mr-2 text-rose-500" 
                    />
                    <span className="text-gray-700 text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">How much do these experiences impact your daily life? *</label>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <span className="mr-4 text-green-600 font-medium">Minimal</span>
                  <input 
                    type="range" 
                    name="impactLevel" 
                    min="1" 
                    max="10" 
                    step="1" 
                    onChange={handleChange} 
                    className="flex-1" 
                    required 
                  />
                  <span className="ml-4 text-red-600 font-medium">Significant</span>
                </div>
                <p className="text-xs text-gray-600 text-center">1 - Life goes on normally, 10 - Affects everything I do</p>
              </div>
              {errors.impactLevel && <p className="text-red-500 text-sm mt-1">{errors.impactLevel}</p>}
            </div>
          </div>

          {/* Section 4 */}
          <div 
            id="section-4" 
            ref={(el) => assignSectionRef(4, el)}
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-green-400"
          >
            <h3 className="text-xl font-bold text-green-600 mb-6 flex items-center gap-2">
              <span className="bg-green-100 p-2 rounded-full text-sm">💊🌿</span>
              4. Your Healing & Wellness Journey
            </h3>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">What approaches have you tried on your healing path? (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['Birth control pills', 'Metformin for insulin resistance', 'Other hormonal medications', 'Weight management medications', 'Anti-androgen medications', 'Fertility treatments', 'Lifestyle modifications (diet & exercise)', 'Alternative medicine (Ayurveda, homeopathy)', 'Natural supplements (inositol, vitamin D, etc.)', 'Counseling or therapy', 'I haven\'t started any treatment yet'].map(option => (
                  <label key={option} className="flex items-center p-2 bg-gray-50 rounded-lg border hover:border-green-300 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      name="healingApproaches" 
                      value={option} 
                      onChange={handleChange} 
                      className="mr-2 text-green-500" 
                    />
                    <span className="text-gray-700 text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">How much do you spend monthly on PCOS management? *</label>
              <input 
                type="text" 
                name="monthlySpend" 
                onChange={handleChange} 
                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-400 focus:ring-1 focus:ring-green-200 transition-all" 
                required 
                placeholder="₹2,000-5,000..." 
              />
              {errors.monthlySpend && <p className="text-red-500 text-sm mt-1">{errors.monthlySpend}</p>}
            </div>
          </div>

          {/* Section 5 */}
          <div 
            id="section-5" 
            ref={(el) => assignSectionRef(5, el)}
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-indigo-400"
          >
            <h3 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-full text-sm">📅💭</span>
              5. Your Personal Story Timeline
            </h3>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">When did you first notice something felt different?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['During my teenage years (13-18)', 'Early twenties (19-25)', 'Late twenties (26-30)', 'After turning 30', 'After marriage', 'After having a baby', 'I can\'t pinpoint exactly when'].map(option => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg border hover:border-indigo-300 cursor-pointer transition-all">
                    <input 
                      type="radio" 
                      name="firstNotice" 
                      value={option} 
                      onChange={handleChange} 
                      className="mr-3 text-indigo-500" 
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">What do you think might have triggered or worsened your symptoms? (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['Stress (work or personal life)', 'Significant weight gain', 'Changes in eating habits', 'More sedentary lifestyle', 'Natural hormonal changes (puberty, pregnancy)', 'Certain medications', 'Family history/genetics', 'Environmental factors', 'I honestly don\'t know'].map(option => (
                  <label key={option} className="flex items-center p-2 bg-gray-50 rounded-lg border hover:border-indigo-300 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      name="symptomTriggers" 
                      value={option} 
                      onChange={handleChange} 
                      className="mr-2 text-indigo-500" 
                    />
                    <span className="text-gray-700 text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-6 sm:px-8 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mx-auto min-h-[48px] w-full max-w-xs sm:max-w-sm text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  ✨ Submit Your Story 💕
                </>
              )}
            </button>
            <p className="mt-3 text-gray-600 text-xs sm:text-sm">Your story helps other sisters 🌸</p>
          </div>
        </form>
      </div>
    </main>
  );
}