import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BODY_PARTS } from '../utils/constants';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Radiology Resident Curriculum
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A curated library of video lectures organized by subspecialty, featuring AI-generated board review questions to test your knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {BODY_PARTS.map((part) => {
          const Icon = part.icon;
          return (
            <Link 
              key={part.id} 
              to={`/category/${part.id}`}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{part.label}</h3>
              <span className="text-sm font-medium text-slate-400 group-hover:text-blue-600 flex items-center transition-colors mt-auto pt-4">
                Browse Videos <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;