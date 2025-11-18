import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Youtube, Loader2, Brain, CheckCircle, AlertCircle } from 'lucide-react';

// Firebase Imports
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase'; // Ensure this file exists and exports db/auth

// Internal Imports
import { generateQuizWithGemini } from '../services/ai';
import { BODY_PARTS, COMPLEXITY } from '../utils/constants';

const Admin = () => {
  const navigate = useNavigate();
  
  // Form State
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [bodyPart, setBodyPart] = useState('chest');
  const [complexity, setComplexity] = useState('beginner');
  const [tags, setTags] = useState('');
  const [transcript, setTranscript] = useState('');
  
  // Process State
  const [quiz, setQuiz] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Helper: Extract YouTube ID
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // 1. Simulate fetching transcript (Or call your Cloud Function here)
  const handleFetchTranscript = () => {
    setTranscript(`
      [Simulated Transcript] 
      Today we are discussing Interstitial Lung Disease (ILD). 
      The key pattern to recognize on HRCT for UIP (Usual Interstitial Pneumonia) is honeycombing with a basal and subpleural predominance. 
      Ground glass opacities are less common in pure UIP and may suggest NSIP (Nonspecific Interstitial Pneumonia) instead.
      Remember, traction bronchiectasis is a sign of fibrosis. 
      When you see air trapping on expiratory images, consider Hypersensitivity Pneumonitis.
    `.trim());
  };

  // 2. Call AI Service
  const handleGenerateQuiz = async () => {
    if (!transcript) return alert("Please fetch or paste a transcript first.");
    
    setIsGenerating(true);
    try {
      // Ideally, fetch this key from a secure backend or environment variable in Vite (import.meta.env.VITE_GEMINI_KEY)
      const apiKey = ""; 
      const result = await generateQuizWithGemini(transcript, apiKey);
      setQuiz(result);
    } catch (e) {
      alert("Failed to generate quiz. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Save to Firestore
  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to upload.");
      return;
    }

    setIsSaving(true);
    try {
      const youtubeId = getYoutubeId(url);
      if (!youtubeId) throw new Error("Invalid YouTube URL");

      // Use the global appId if defined (for the demo environment), otherwise a default string
      const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'radiology-app';

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'videos'), {
        title: title || "Untitled Lecture",
        youtubeUrl: url,
        youtubeId,
        bodyPart,
        complexity,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        transcript,
        quiz,
        createdAt: serverTimestamp(),
        uploadedBy: auth.currentUser.uid
      });

      alert("Video & Quiz Published Successfully!");
      navigate(`/category/${bodyPart}`);
    } catch (e) {
      console.error(e);
      alert("Error saving to database: " + e.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Admin Upload Portal</h1>
        <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
          v1.0.0
        </div>
      </div>
      
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-8">
        
        {/* Section 1: Video Metadata */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</div>
            <h2 className="text-lg font-semibold text-slate-800">Video Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL</label>
              <input 
                type="text" 
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Video Title</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Approach to Mediastinal Masses"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Body Part</label>
              <select 
                value={bodyPart}
                onChange={e => setBodyPart(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none bg-white"
              >
                {BODY_PARTS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Complexity</label>
              <select 
                value={complexity}
                onChange={e => setComplexity(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none bg-white"
              >
                {COMPLEXITY.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
              <input 
                type="text" 
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="e.g., ultrasound, liver, doppler"
                className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none transition"
              />
            </div>
          </div>
        </section>

        {/* Section 2: AI Generation */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="text-lg font-semibold text-slate-800">Transcript & Quiz</h2>
            </div>
            <button 
              onClick={handleFetchTranscript}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded transition flex items-center"
            >
              <Youtube className="w-3 h-3 mr-1" /> Mock Auto-Fetch
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Transcript</label>
            <textarea 
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              className="w-full h-32 border border-slate-300 rounded-md px-3 py-2 text-xs font-mono outline-none focus:border-purple-500 transition"
              placeholder="Paste transcript here or use auto-fetch..."
            />
          </div>

          <button 
            onClick={handleGenerateQuiz}
            disabled={isGenerating || !transcript}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-md font-semibold flex items-center justify-center transition disabled:opacity-50 shadow-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2"/> Processing Transcript...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2"/> Generate Quiz with AI
              </>
            )}
          </button>

          {quiz && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-green-800 font-bold text-sm mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1"/> Quiz Ready!
              </h3>
              <p className="text-xs text-green-700 mb-2 line-clamp-2">
                <span className="font-semibold">Q1:</span> {quiz.questions[0]?.question}
              </p>
              <div className="flex gap-2 text-xs text-slate-500 italic">
                <span>• {quiz.questions.length} Questions Generated</span>
                <span>• JSON Validated</span>
              </div>
            </div>
          )}
        </section>

        {/* Section 3: Publish */}
        <section className="pt-4 border-t border-slate-100">
          <button 
            onClick={handleSave}
            disabled={isSaving || !quiz}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSaving ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2"/> Saving to Database...
              </span>
            ) : (
              "Publish Video & Quiz"
            )}
          </button>
        </section>

      </div>
    </div>
  );
};

export default Admin;