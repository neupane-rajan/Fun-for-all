import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AdBlockDetector from './components/AdBlockDetector';

// Lazy load all tools for code-splitting
const GPACalculator = lazy(() => import('./tools/GPACalculator'));
const TypingSpeedTest = lazy(() => import('./tools/TypingSpeedTest'));
const StudyPlanner = lazy(() => import('./tools/StudyPlanner'));
const EMICalculator = lazy(() => import('./tools/EMICalculator'));
const ColorPaletteGenerator = lazy(() => import('./tools/ColorPaletteGenerator'));
const ResumeGenerator = lazy(() => import('./tools/ResumeGenerator'));
const LinuxCheatSheet = lazy(() => import('./tools/LinuxCheatSheet'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
      <p className="text-gray-500 dark:text-gray-400">Loading tool...</p>
    </div>
  </div>
);

const App = () => {
  const [currentTool, setCurrentTool] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tool');
  });

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentTool(params.get('tool'));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleToolSelect = (toolId) => {
    setCurrentTool(toolId);
    const url = new URL(window.location);
    if (toolId) {
      url.searchParams.set('tool', toolId);
    } else {
      url.searchParams.delete('tool');
    }
    window.history.pushState({}, '', url);
  };

  const renderTool = () => {
    switch (currentTool) {
      case 'gpa':
        return <GPACalculator />;
      case 'typing':
        return <TypingSpeedTest />;
      case 'planner':
        return <StudyPlanner />;
      case 'emi':
        return <EMICalculator />;
      case 'palette':
        return <ColorPaletteGenerator />;
      case 'resume':
        return <ResumeGenerator />;
      case 'linux':
        return <LinuxCheatSheet />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900 transition-colors duration-500 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Ad Block Detection Warning */}
      <AdBlockDetector />
      {currentTool ? (
        <div className="animate-in fade-in slide-in-from-right duration-300">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <button 
              onClick={() => handleToolSelect(null)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors mb-4 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            {renderTool()}
          </Suspense>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-left duration-300">
          <Dashboard onSelectTool={handleToolSelect} />
        </div>
      )}
    </div>
  );
};

export default App;
