import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Activity, Library, Upload } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl hover:opacity-90 transition">
          <Activity className="text-blue-400 w-6 h-6" />
          <span>RadResidency</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-1 md:space-x-4 text-sm font-medium">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md transition ${isActive ? 'bg-slate-800 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`
            }
          >
            <Library className="w-4 h-4 mr-2" />
            Library
          </NavLink>
          
          <NavLink 
            to="/admin" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md transition ${isActive ? 'bg-slate-800 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`
            }
          >
            <Upload className="w-4 h-4 mr-2" />
            Admin
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;