import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import ToolCard from '../../components/ToolCard';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import AdBanner from '../../components/AdBanner'; // Import AdBanner

const SAMPLE_TEXTS = {
  Easy: [
    "The sun rises in the east and sets in the west.",
    "Cats are known for their agility and independent nature.",
    "A journey of a thousand miles begins with a single step.",
    "Apples are red, bananas are yellow, and grapes are green.",
    "Reading books can take you to many different worlds."
  ],
  Medium: [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "In the middle of difficulty lies opportunity. Life is what happens when you're busy.",
    "Technology is best when it brings people together. It has become appallingly obvious.",
    "Do not go gentle into that good night. Rage, rage against the dying of the light."
  ],
  Hard: [
    "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer.",
    "Quantum mechanics is a fundamental theory in physics that provides a description of nature.",
    "The Industrial Revolution marked a major turning point in history; almost every aspect of daily life.",
    "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy.",
    "Cryptocurrency is a digital currency designed to work as a medium of exchange through a computer network."
  ]
};

const TypingSpeedTest = () => {
  const [difficulty, setDifficulty] = useState('Medium');
  const [text, setText] = useState(() => {
    const texts = SAMPLE_TEXTS['Medium'];
    return texts[Math.floor(Math.random() * texts.length)];
  });
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [highScores, setHighScores] = useLocalStorage('typing-high-scores', []);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const startTest = useCallback((level) => {
    const currentDifficulty = level || difficulty;
    const texts = SAMPLE_TEXTS[currentDifficulty];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setText(randomText);
    setUserInput('');
    setTimeLeft(60);
    setIsActive(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    if (inputRef.current) inputRef.current.focus();
  }, [difficulty]);

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    startTest(level);
  };

  const endTest = useCallback(() => {
    clearInterval(timerRef.current);
    setIsActive(false);
    
    // Save Score
    if (wpm > 0) {
      const newScore = { wpm, accuracy, date: new Date().toISOString() };
      const updatedScores = [...highScores, newScore]
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 5);
      setHighScores(updatedScores);
    }
  }, [wpm, accuracy, highScores, setHighScores]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, endTest]);

  const handleInput = (e) => {
    const value = e.target.value;
    
    if (!isActive && value.length === 1) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    setUserInput(value);

    // Calculate Stats
    const correctChars = value.split('').filter((char, i) => char === text[i]).length;
    const totalChars = value.length;
    const accuracyVal = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;
    setAccuracy(accuracyVal);

    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
      if (timeElapsed > 0) {
        const wpmVal = Math.round((correctChars / 5) / timeElapsed);
        setWpm(wpmVal);
      }
    }

    if (value.length >= text.length) {
      endTest();
    }
  };

  const getCharClass = (index) => {
    if (index >= userInput.length) return "text-gray-400";
    return userInput[index] === text[index] 
      ? "text-green-500 bg-green-100/20" 
      : "text-red-500 bg-red-100/20 decoration-red-500 underline";
  };

  return (
    <ToolCard title="Typing Speed Test" subtitle="How fast can you type?">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Typing Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Difficulty Selector */}
          <div className="flex gap-2 justify-center pb-2">
            {['Easy', 'Medium', 'Hard'].map(level => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  difficulty === level 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'bg-gray-200 dark:bg-white/10 text-gray-500 hover:bg-gray-300 dark:hover:bg-white/20'
                }`}
                disabled={isActive}
              >
                {level}
              </button>
            ))}
          </div>
          
          {/* Stats Bar */}
          <div className="flex justify-between items-center bg-white/20 dark:bg-black/20 p-4 rounded-2xl border border-white/10">
             <div className="text-center">
               <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Time</div>
               <div className={`text-3xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                 {timeLeft}s
               </div>
             </div>
             <div className="text-center">
               <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">WPM</div>
               <div className="text-3xl font-mono font-bold text-purple-600 dark:text-purple-400">{wpm}</div>
             </div>
             <div className="text-center">
               <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Accuracy</div>
               <div className={`text-3xl font-mono font-bold ${accuracy >= 95 ? 'text-green-500' : 'text-yellow-500'}`}>
                 {Math.round(accuracy)}%
               </div>
             </div>
          </div>

          <div 
            className="relative p-6 bg-white/40 dark:bg-black/30 rounded-2xl border border-white/20 dark:border-white/10 min-h-[200px] text-xl leading-relaxed font-mono cursor-text"
            onClick={() => inputRef.current.focus()}
          >
            <div className="pointer-events-none select-none wrap-break-word whitespace-pre-wrap">
              {text.split('').map((char, index) => (
                <span key={index} className={getCharClass(index)}>{char}</span>
              ))}
            </div>
            <textarea 
              ref={inputRef}
              value={userInput}
              onChange={handleInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
              disabled={timeLeft === 0}
              autoFocus
            />
          </div>

          <button
            onClick={() => startTest()}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <RotateCcw size={20} />
            Restart Test
          </button>
          
          <AdBanner format="leaderboard" slotId="typing-main" className="hidden md:flex mt-4" />
        </div>

        {/* Sidebar / Leaderboard */}
        <div className="lg:col-span-1">
          <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/10 h-full">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-white/10 pb-2">Top Scores</h3>
            {highScores.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No scores yet. Start typing!</p>
            ) : (
              <div className="space-y-3">
                {highScores.map((score, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white/30 dark:bg-white/5 rounded-xl">
                    <div>
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{score.wpm} WPM</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(score.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{Math.round(score.accuracy)}% Acc</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <AdBanner format="rectangle" slotId="typing-sidebar" className="mt-6" />
        </div>

      </div>
    </ToolCard>
  );
};

export default TypingSpeedTest;
