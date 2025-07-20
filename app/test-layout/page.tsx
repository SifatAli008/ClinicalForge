export default function TestLayoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Layout Test Page
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          This page tests if the simplified layout works correctly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">✅ Layout Working</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The layout is loading correctly without syntax errors.
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">🔥 Firebase Ready</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Firebase configuration is ready for testing.
            </p>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Next Steps:</h3>
          <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Add back ThemeProvider</li>
            <li>• Add back Navigation component</li>
            <li>• Add back AuthProvider</li>
            <li>• Add back AdminProvider</li>
            <li>• Test Firebase connection</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 