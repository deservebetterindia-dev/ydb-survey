'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import surveyData from './data.json';
import { useRouter } from 'next/navigation';

export default function Form() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = surveyData.survey.sections.length;

  // Calculate progress based on filled fields
  const calculateProgress = () => {
    const totalQuestions = surveyData.survey.sections.reduce((total, section) =>
      total + section.questions.length, 0
    );
    const filledQuestions = Object.keys(formData).filter(key => {
      const value = formData[key];
      return value && (Array.isArray(value) ? value.length > 0 : value.toString().trim() !== '');
    }).length;
    return totalQuestions > 0 ? Math.round((filledQuestions / totalQuestions) * 100) : 0;
  };

  const progress = calculateProgress();

  // Check if current step's required fields are filled
  const isCurrentStepValid = () => {
    const currentSection = surveyData.survey.sections[currentStep];
    const requiredQuestions = currentSection.questions.filter((q: { required?: boolean }) => q.required);

    return requiredQuestions.every((question: { questionId: string }) => {
      const value = formData[question.questionId];
      if (!value) return false;
      if (Array.isArray(value)) return value.length > 0;
      return value.toString().trim() !== '';
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ?
        (checked ?
          (prevData[name] ? [...prevData[name], value] : [value]) :
          (prevData[name] ? (prevData[name] as string[]).filter((v: string) => v !== value) : [])
        ) : value
    }));
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    console.log('🔥 Form submission started');
    console.log('📋 Form data:', formData);

    try {
      // Get all questions for headers
      const allQuestions = surveyData.survey.sections.flatMap(section => section.questions);
      
      console.log('📡 Making API call to /api/submit-form');
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, questions: allQuestions }),
      });

      console.log('📨 API response status:', response.status);
      const result = await response.json();
      console.log('📄 API response data:', result);
      
      if (result.success) {
        console.log('✅ Form submitted successfully');
        router.push('/form/thank-you?submitted=true');
      } else {
        console.error('❌ Form submission failed:', result.error);
        alert('There was an error submitting your form. Please try again.');
      }
    } catch (error) {
      console.error('💥 Submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1 && isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
          {/* Left: Back Link */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
              <span className="text-xl">←</span>
              <span className="font-semibold text-sm hidden xs:block">Back</span>
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <div className="relative h-8 w-32">
              <Image
                src="/logo.png"
                alt="You Deserve Better"
                fill
                priority
                sizes="128px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Right: Progress */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 flex-shrink-0">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-slate-700">
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-1">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      <div className="max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
        {/* Step Progress */}
        <div className="mb-6 sm:mb-8 bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Step {currentStep + 1} of {totalSteps}</h2>
            <span className="text-xs sm:text-sm text-slate-600">{progress}% Complete</span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
            {surveyData.survey.sections.map((section, index) => (
              <div key={section.sectionId} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => goToStep(index)}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${index === currentStep
                      ? 'bg-blue-600 text-white shadow-lg'
                      : index < currentStep
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </button>
                {index < totalSteps - 1 && (
                  <div className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 rounded ${index < currentStep ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-base sm:text-lg font-semibold text-slate-700">
              {surveyData.survey.sections[currentStep].sectionTitle}
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current Step Content */}
          {(() => {
            const section = surveyData.survey.sections[currentStep];
            const sectionColors = [
              { border: 'border-blue-400', text: 'text-blue-700', bg: 'bg-blue-100', hover: 'hover:border-blue-300', accent: 'text-blue-600' },
              { border: 'border-indigo-400', text: 'text-indigo-700', bg: 'bg-indigo-100', hover: 'hover:border-indigo-300', accent: 'text-indigo-600' },
              { border: 'border-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-100', hover: 'hover:border-emerald-300', accent: 'text-emerald-600' },
              { border: 'border-teal-400', text: 'text-teal-700', bg: 'bg-teal-100', hover: 'hover:border-teal-300', accent: 'text-teal-600' },
              { border: 'border-cyan-400', text: 'text-cyan-700', bg: 'bg-cyan-100', hover: 'hover:border-cyan-300', accent: 'text-cyan-600' },
              { border: 'border-slate-400', text: 'text-slate-700', bg: 'bg-slate-100', hover: 'hover:border-slate-300', accent: 'text-slate-600' }
            ];
            const colors = sectionColors[currentStep % sectionColors.length];

            return (
              <div className={`bg-white/95 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border-l-4 ${colors.border} ${currentStep > 1 ? 'min-h-[400px] sm:min-h-[500px]' : ''} border border-slate-200`}>
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <span className={`${colors.bg} p-2 sm:p-3 rounded-full text-base sm:text-lg`}>📋</span>
                    <h3 className={`text-xl sm:text-2xl font-bold ${colors.text}`}>
                      {section.sectionTitle}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-600">Please answer the questions below to help us understand your journey better.</p>
                </div>

                <div className="space-y-6">
                  {section.questions.map((question) => (
                    <div key={question.questionId} className="mb-6 sm:mb-8">
                      <label className="block text-slate-700 font-medium mb-3 sm:mb-4 text-base sm:text-lg">
                        {question.question} {question.required && <span className="text-red-600">*</span>}
                      </label>

                      {question.type === 'text' && (
                        <input
                          type="text"
                          name={question.questionId}
                          value={formData[question.questionId] || ''}
                          onChange={handleChange}
                          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base bg-white text-slate-800 placeholder-slate-400"
                          required={question.required}
                          placeholder={question.placeholder}
                        />
                      )}

                      {question.type === 'email' && (
                        <input
                          type="email"
                          name={question.questionId}
                          value={formData[question.questionId] || ''}
                          onChange={handleChange}
                          className="w-full p-3 sm:p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base sm:text-lg bg-white text-slate-800 placeholder-slate-400"
                          required={question.required}
                          placeholder={question.placeholder}
                        />
                      )}

                      {question.type === 'textarea' && (
                        <textarea
                          name={question.questionId}
                          value={formData[question.questionId] || ''}
                          onChange={handleChange}
                          className="w-full p-3 sm:p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base sm:text-lg bg-white text-slate-800 placeholder-slate-400"
                          required={question.required}
                          placeholder={question.placeholder}
                          rows={4}
                        />
                      )}

                      {question.type === 'select' && (
                        <select
                          name={question.questionId}
                          value={formData[question.questionId] || ''}
                          onChange={handleChange}
                          className="w-full p-3 sm:p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base sm:text-lg bg-white text-slate-800 appearance-none"
                          required={question.required}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none'
                          }}
                        >
                          <option value="" className="text-slate-500 bg-white">Select an option...</option>
                          {question.options?.map((option) => (
                            <option key={option.value} value={option.value} className="text-slate-800 bg-white py-2">{option.label}</option>
                          ))}
                        </select>
                      )}

                      {question.type === 'radio' && (
                        <div className="space-y-2 sm:space-y-3">
                          {question.options?.map((option) => (
                            <label key={option.value} className={`flex items-center p-3 sm:p-4 bg-slate-50 rounded-xl border-2 ${colors.hover} cursor-pointer transition-all hover:shadow-md`}>
                              <input
                                type="radio"
                                name={question.questionId}
                                value={option.value}
                                checked={formData[question.questionId] === option.value}
                                onChange={handleChange}
                                className={`mr-3 sm:mr-4 scale-110 sm:scale-125 ${colors.accent}`}
                                required={question.required}
                              />
                              <span className="text-slate-700 text-sm sm:text-lg">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === 'checkbox' && (
                        <div className={question.questionId === 'pledge' ? 'space-y-4' : 'space-y-3'}>
                          {question.options?.map((option) => (
                            <label key={option.value} className={`flex items-center p-3 sm:p-4 ${question.questionId === 'pledge' ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200' : 'bg-slate-50 border-slate-200'} rounded-xl border-2 cursor-pointer transition-all hover:shadow-md hover:border-opacity-60`}>
                              <input
                                type="checkbox"
                                name={question.questionId}
                                value={option.value}
                                checked={formData[question.questionId]?.includes(option.value) || false}
                                onChange={handleChange}
                                className={`mr-3 scale-110 ${question.questionId === 'pledge' ? 'text-pink-600' : 'text-blue-600'} flex-shrink-0`}
                              />
                              <span className={`${question.questionId === 'pledge' ? 'text-gray-800 text-base sm:text-lg font-semibold' : 'text-slate-700 text-sm sm:text-base'}`}>
                                {option.label.replace('{NAME}', formData['name'] || '[Your Name]')}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === 'range' && (
                        <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border-2 border-slate-200">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                            <span className="hidden sm:inline text-emerald-600 font-medium">Minimal</span>
                            <input
                              type="range"
                              name={question.questionId}
                              min={question.min}
                              max={question.max}
                              value={formData[question.questionId] || question.default}
                              onChange={handleChange}
                              className="w-full sm:flex-1 min-w-0 h-3 bg-gradient-to-r from-emerald-200 to-red-400 rounded-lg"
                              required={question.required}
                            />
                            <span className="hidden sm:inline text-red-600 font-medium">Significant</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm text-slate-600">
                            <span>{question.scaleLabels?.min ?? 'Minimal'}</span>
                            <span>{question.scaleLabels?.max ?? 'Significant'}</span>
                          </div>
                          <div className="text-center mt-2">
                            <span className="text-base sm:text-lg font-semibold text-slate-700">
                              Current: {formData[question.questionId] || question.default}
                            </span>
                          </div>
                        </div>
                      )}

                      {question.type === 'display' && (
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 sm:p-8 rounded-xl border-2 border-pink-200">
                          <div className="text-center">
                            <p className="text-lg sm:text-xl font-semibold text-gray-800 leading-relaxed">
                              {question.content?.replace('{NAME}', formData['name'] || '[Your Name]')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 gap-3">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-slate-500 text-white font-medium py-2 px-4 rounded-full hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              ← Previous
            </button>

            <div className="text-center flex-1">
              <p className="text-slate-600 text-sm">Step {currentStep + 1} of {totalSteps}</p>
              <p className="text-slate-500 text-xs">1-2 mins</p>
            </div>

            {currentStep === totalSteps - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submit
                  </>
                ) : (
                  'Submit Story'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isCurrentStepValid()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2 px-4 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next →
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}