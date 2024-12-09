import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center flex-grow px-6">
        <h1 className="text-6xl font-bold mb-4">
          Welcome to <span className="text-blue-500">OpenHousePro</span>
        </h1>
        <p className="text-xl max-w-2xl mb-8">
          Streamline your open house management with customizable templates, visitor tracking, and modern tools designed for real estate agents.
        </p>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/register"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-400">
        <p>© {new Date().getFullYear()} OpenHousePro. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
