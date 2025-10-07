import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-pink-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            🏠 Go Home
          </Link>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/form"
              className="text-pink-600 hover:text-pink-800 font-medium"
            >
              Take Survey
            </Link>
            <Link 
              href="/blog"
              className="text-pink-600 hover:text-pink-800 font-medium"
            >
              Read Stories
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}