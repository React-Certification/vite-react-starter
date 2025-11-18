import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Loader2, ArrowLeft } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db, appId } from '../services/firebase';
import VideoCard from '../components/VideoCard';
import { BODY_PARTS, COMPLEXITY } from '../utils/constants';

const Category = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterComplexity, setFilterComplexity] = useState('all');

  const categoryInfo = BODY_PARTS.find(p => p.id === id);
  const categoryLabel = categoryInfo ? categoryInfo.label : id;

  useEffect(() => {
    // Query logic: We fetch all videos and filter client-side for simplicity in this demo.
    // In production with many videos, use: query(ref, where('bodyPart', '==', id))
    const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'videos');
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(v => v.bodyPart === id);
      
      // Sort by date descending (newest first)
      fetched.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      setVideos(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching videos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const filteredVideos = filterComplexity === 'all' 
    ? videos 
    : videos.filter(v => v.complexity === filterComplexity);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600"/>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Breadcrumb / Back */}
      <Link 
        to="/" 
        className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Library
      </Link>

      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subspecialty</div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
            {categoryInfo && <categoryInfo.icon className="w-8 h-8 text-slate-800"/>}
            {categoryLabel}
          </h1>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-white p-1 rounded-lg border border-slate-200">
          <div className="px-3 text-slate-400">
            <Filter className="w-4 h-4" />
          </div>
          <select 
            className="bg-transparent text-sm font-medium text-slate-700 outline-none py-1 pr-2 cursor-pointer"
            value={filterComplexity}
            onChange={(e) => setFilterComplexity(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            {COMPLEXITY.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <h3 className="text-lg font-medium text-slate-700 mb-2">No videos found</h3>
          <p className="text-slate-500 mb-6">There are no videos in this category matching your filter.</p>
          <Link 
            to="/admin" 
            className="bg-white px-4 py-2 rounded-md border border-slate-300 text-sm font-medium hover:bg-slate-50 transition"
          >
            Upload a Video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;