import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
    <div className="container mx-auto px-4 text-center">
      <p className="text-sm">© 2025 Radiology Residency App. For educational purposes only.</p>
      <p className="text-xs text-slate-600 mt-2">HIPAA Compliance: Do not upload patient identifiers.</p>
    </div>
  </footer>
);

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* The Outlet renders the child route (Home, Category, Watch, etc.) */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;