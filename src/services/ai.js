export const generateQuizWithGemini = async (transcript, apiKey) => {
    const systemPrompt = `
      You are a Radiology Residency Program Director.
      Based on the provided video transcript, create a quiz with 3-5 multiple choice questions.
      Return strictly valid JSON.
      
      Format:
      {
        "questions": [
          {
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option B",
            "explanation": "Detailed explanation of why B is correct and others are wrong."
          }
        ]
      }
    `;
  
    // Limit length to prevent token overflow, though Gemini 1.5 Flash handles long context well.
    const userPrompt = `Transcript: ${transcript.substring(0, 20000)}`; 
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { 
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  questions: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        question: { type: "STRING" },
                        options: { type: "ARRAY", items: { type: "STRING" } },
                        correctAnswer: { type: "STRING" },
                        explanation: { type: "STRING" }
                      },
                      required: ["question", "options", "correctAnswer", "explanation"]
                    }
                  }
                }
              }
            }
          })
        }
      );
  
      if (!response.ok) throw new Error('Gemini API Error');
      const data = await response.json();
      const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("AI Gen Error:", error);
      throw error;
    }
  };