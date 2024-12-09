import React from 'react';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 bg-gray-800 text-center shadow-md">
        <h1 className="text-3xl font-bold text-blue-400">OpenHousePro</h1>
      </header>

      <main className="flex-grow container mx-auto px-6 py-8">
        {children}
      </main>

      <footer className="text-center py-4 bg-gray-800 text-gray-400">
        <p>© {new Date().getFullYear()} OpenHousePro. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;
