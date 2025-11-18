import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const QuizModule = ({ quiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
        <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-slate-600 font-medium">No Quiz Available</h3>
        <p className="text-sm text-slate-400">This video does not have associated board questions yet.</p>
      </div>
    );
  }

  const handleAnswer = (qIndex, option, correctAnswer) => {
    if (selectedAnswers[qIndex]) return; // Prevent changing answer once selected

    setSelectedAnswers(prev => ({ ...prev, [qIndex]: option }));
    setShowExplanation(prev => ({ ...prev, [qIndex]: true }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-24">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <h2 className="font-bold flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Board Review Quiz
        </h2>
        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded font-medium">AI Generated</span>
      </div>
      
      {/* Questions List */}
      <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto space-y-8">
        {quiz.questions.map((q, idx) => {
          const userAns = selectedAnswers[idx];
          const isAnswered = !!userAns;
          
          return (
            <div key={idx} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0 animate-in fade-in duration-500">
              <div className="flex gap-3 mb-3">
                <span className="text-slate-400 font-mono text-sm pt-0.5">{idx + 1}.</span>
                <p className="font-medium text-slate-800 text-sm leading-relaxed">{q.question}</p>
              </div>

              <div className="space-y-2 pl-7">
                {q.options.map((opt, oIdx) => {
                  let btnClass = "w-full text-left text-sm p-3 rounded-lg border transition relative ";
                  
                  if (isAnswered) {
                    if (opt === q.correctAnswer) {
                      btnClass += "bg-green-50 border-green-200 text-green-800 font-medium";
                    } else if (opt === userAns) {
                      btnClass += "bg-red-50 border-red-200 text-red-800";
                    } else {
                      btnClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-60";
                    }
                  } else {
                    btnClass += "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700";
                  }

                  return (
                    <button 
                      key={oIdx}
                      onClick={() => handleAnswer(idx, opt, q.correctAnswer)}
                      disabled={isAnswered}
                      className={btnClass}
                    >
                      <div className="flex items-center justify-between">
                        <span className="pr-6">{opt}</span>
                        {/* Status Icons */}
                        {isAnswered && opt === q.correctAnswer && (
                          <CheckCircle className="w-4 h-4 text-green-600 absolute right-3 top-3.5"/>
                        )}
                        {isAnswered && opt === userAns && opt !== q.correctAnswer && (
                          <XCircle className="w-4 h-4 text-red-600 absolute right-3 top-3.5"/>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {showExplanation[idx] && (
                <div className="mt-4 ml-7 p-3 bg-blue-50 text-blue-900 text-xs rounded-lg border border-blue-100 flex gap-2">
                  <HelpCircle className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Explanation:</span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizModule;