import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import ToolCard from '../../components/ToolCard';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import AdBanner from '../../components/AdBanner';

const SAMPLE_TEXTS = {
  Easy: [
    "The sun rises in the east and sets in the west. Every morning brings new hope and every evening brings peace. Nature teaches us patience and persistence.",
    "Cats are known for their agility and independent nature. They have been companions to humans for thousands of years. Dogs are loyal friends who love to play fetch and go on walks.",
    "A journey of a thousand miles begins with a single step. Take that first step today and never look back. Every great achievement starts with the decision to try.",
    "Reading books can take you to many different worlds. Libraries are treasure troves of knowledge and adventure. Open a book and discover something new today.",
    "The park is a wonderful place to spend time with family and friends. Children love to play on swings and slides. Fresh air and sunshine make everyone feel happy and healthy."
  ],
  Medium: [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is used for typing practice. Mastering the keyboard takes time and dedication, but the results are worth it.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. Every setback is a setup for a comeback. Keep pushing forward and never give up on your dreams.",
    "Technology is best when it brings people together. It has become appallingly obvious that our technology has exceeded our humanity. We need to ensure that technology serves us, not the other way around.",
    "In the middle of difficulty lies opportunity. Life is what happens when you are busy making other plans. Embrace the challenges that come your way, for they shape who you become.",
    "Programming is the art of telling another human what one wants the computer to do. Good code is its own best documentation. Keep learning, keep coding, and keep building amazing things."
  ],
  Hard: [
    "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them.",
    "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It forms the foundation for all quantum physics.",
    "The Industrial Revolution marked a major turning point in history; almost every aspect of daily life was influenced in some way. Average income and population began to exhibit unprecedented sustained growth.",
    "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that can later be released to fuel the activities of the organism. This is essential for life on Earth.",
    "Cryptocurrency is a digital currency designed to work as a medium of exchange through a computer network that is not reliant on any central authority, such as a government or bank, to uphold or maintain it."
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

  const endTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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

  const startTest = useCallback((level) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
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

  // Timer effect - fixed to avoid multiple intervals
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [isActive]);

  // End test when time runs out
  useEffect(() => {
    if (isActive && timeLeft === 0) {
      endTest();
    }
  }, [timeLeft, isActive, endTest]);

  const handleInput = (e) => {
    const value = e.target.value;
    
    // Start the timer on first character
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

    const currentStartTime = !isActive ? Date.now() : startTime;
    if (currentStartTime) {
      const timeElapsed = (Date.now() - currentStartTime) / 1000 / 60; // in minutes
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
    if (index >= userInput.length) return "text-gray-400 dark:text-gray-500";
    return userInput[index] === text[index] 
      ? "text-green-600 dark:text-green-400 bg-green-100/30 dark:bg-green-500/10" 
      : "text-red-600 dark:text-red-400 bg-red-100/30 dark:bg-red-500/10 underline decoration-red-500";
  };

  return (
    <ToolCard title="Typing Speed Test" subtitle="How fast can you type?">
      <div className="space-y-6">
        
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
        <div className="flex justify-around items-center bg-white/30 dark:bg-black/20 p-6 rounded-2xl border border-white/20 dark:border-white/10">
           <div className="text-center">
             <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider mb-1">Time</div>
             <div className={`text-4xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-800 dark:text-white'}`}>
               {timeLeft}s
             </div>
           </div>
           <div className="text-center">
             <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider mb-1">WPM</div>
             <div className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400">{wpm}</div>
           </div>
           <div className="text-center">
             <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider mb-1">Accuracy</div>
             <div className={`text-4xl font-mono font-bold ${accuracy >= 95 ? 'text-green-500' : accuracy >= 80 ? 'text-yellow-500' : 'text-red-500'}`}>
               {Math.round(accuracy)}%
             </div>
           </div>
        </div>

        {/* Typing Area - Full Width */}
        <div 
          className="relative p-8 bg-white/50 dark:bg-black/30 rounded-2xl border border-white/20 dark:border-white/10 min-h-[280px] text-xl md:text-2xl leading-loose font-mono cursor-text shadow-inner"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="pointer-events-none select-none break-words whitespace-pre-wrap">
            {text.split('').map((char, index) => (
              <span key={index} className={`${getCharClass(index)} transition-colors duration-75`}>{char}</span>
            ))}
          </div>
          <textarea 
            ref={inputRef}
            value={userInput}
            onChange={handleInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
            disabled={timeLeft === 0}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
          
          {/* Click to start hint */}
          {!isActive && userInput.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/70 text-white px-6 py-3 rounded-full text-sm font-medium animate-pulse">
                Click here and start typing to begin...
              </div>
            </div>
          )}
        </div>

        {/* Restart Button */}
        <button
          onClick={() => startTest()}
          className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <RotateCcw size={20} />
          Restart Test
        </button>
        
        <AdBanner format="auto" slotId="typing-main" className="mt-4" />

        {/* High Scores */}
        {highScores.length > 0 && (
          <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-white/10 pb-2">🏆 Top Scores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {highScores.map((score, idx) => (
                <div key={idx} className="flex flex-col items-center p-4 bg-white/40 dark:bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{score.wpm} WPM</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{Math.round(score.accuracy)}% Acc</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(score.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
};

export default TypingSpeedTest;
