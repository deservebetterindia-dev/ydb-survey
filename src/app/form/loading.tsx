export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 animate-pulse">
            <div className="w-6 h-6 bg-blue-500 rounded-full absolute top-0 left-1.5 transform rotate-45"></div>
            <div className="w-6 h-6 bg-blue-500 rounded-full absolute top-0 right-1.5 transform rotate-45"></div>
            <div className="w-8 h-8 bg-blue-500 transform rotate-45 absolute top-2 left-2"></div>
          </div>
        </div>
        <p className="text-gray-600 font-medium">Loading form...</p>
      </div>
    </div>
  );
}