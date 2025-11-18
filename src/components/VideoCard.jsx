import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { COMPLEXITY } from '../utils/constants';

const VideoCard = ({ video }) => {
  // Helper to find color for complexity tag
  const complexityInfo = COMPLEXITY.find(c => c.id === video.complexity);
  
  // Format Date
  const dateStr = video.createdAt 
    ? new Date(video.createdAt.seconds * 1000).toLocaleDateString() 
    : 'Recently';

  return (
    <Link 
      to={`/watch/${video.id}`}
      className="group bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition flex flex-col sm:flex-row gap-4"
    >
      {/* Thumbnail Section */}
      <div className="w-full sm:w-48 h-32 bg-slate-100 rounded-md overflow-hidden relative flex-shrink-0">
        <img 
          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail'}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition">
          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
            <Play className="w-5 h-5 text-blue-600 ml-1" />
          </div>
        </div>
      </div>
      
      {/* Details Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition line-clamp-2">
            {video.title}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Complexity Badge */}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${complexityInfo?.color || 'bg-gray-100'}`}>
            {complexityInfo?.label || 'Unknown'}
          </span>
          
          {/* Tags (Limit to 3) */}
          {video.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs border border-slate-200">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center text-xs text-slate-400 mt-auto">
          <Clock className="w-3 h-3 mr-1" />
          Added {dateStr}
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;