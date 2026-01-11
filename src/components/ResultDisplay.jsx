import React, { useEffect, useState } from 'react';
import { getGrade, getGradeColor } from '../utils/calculations';

const ResultDisplay = ({ percentage }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const duration = 1000; // 1 second animation
    const startValue = displayValue;
    const endValue = percentage;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // East out cubic easing
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const current = startValue + (endValue - startValue) * easeOutCubic;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  const grade = getGrade(displayValue);
  const gradeColor = getGradeColor(displayValue);

  return (
    <div className="bg-white/30 dark:bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-xl border border-white/20 dark:border-white/5 text-center transform transition-all hover:scale-[1.01]">
      <div className="text-gray-600 dark:text-gray-300 font-medium mb-1 tracking-wide uppercase text-sm">Overall Score</div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2 font-mono">
          {displayValue.toFixed(2)}%
        </div>
        <div className={`text-4xl font-extrabold ${gradeColor} drop-shadow-sm`}>
          Grade: {grade}
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4 overflow-hidden">
        <div 
          className="bg-linear-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${Math.min(displayValue, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ResultDisplay;
