import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, appId } from '../services/firebase';
import { Loader2, ArrowLeft } from 'lucide-react';
import { COMPLEXITY, BODY_PARTS } from '../utils/constants';
import QuizModule from '../components/QuizModule';

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'videos', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setVideo({ id: snap.id, ...snap.data() });
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>;
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Video not found</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 block">Return Home</Link>
      </div>
    );
  }

  const complexityInfo = COMPLEXITY.find(c => c.id === video.complexity);
  const bodyPartInfo = BODY_PARTS.find(b => b.id === video.bodyPart);

  return (
    <div className="container mx-auto px-4 py-6 animate-in fade-in duration-500">
      {/* Back Navigation */}
      <Link 
        to={`/category/${video.bodyPart}`}
        className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> 
        Back to {bodyPartInfo ? bodyPartInfo.label : 'Category'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Video & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Wrapper */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl">
            <iframe 
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>

          {/* Video Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{video.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${complexityInfo?.color || 'bg-slate-100'}`}>
                {complexityInfo?.label || 'Unknown Level'}
              </span>
              <span className="text-slate-400 text-sm">|</span>
              <span className="text-slate-600 text-sm font-medium uppercase tracking-wide">
                {bodyPartInfo?.label || video.bodyPart}
              </span>
            </div>

            {/* Tags Box */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Concepts</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags && video.tags.length > 0 ? (
                  video.tags.map((t, i) => (
                    <span key={i} className="bg-white text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                      #{t}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">No tags added.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quiz */}
        <div className="lg:col-span-1">
          <QuizModule quiz={video.quiz} />
        </div>
      </div>
    </div>
  );
};

export default Watch;