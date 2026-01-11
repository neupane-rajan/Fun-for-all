import React from 'react';
import { Plus, RotateCcw, Share2 } from 'lucide-react';

const ActionButtons = ({ onAdd, onReset, onShare }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        onClick={onAdd}
        className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus size={20} />
        Add Subject
      </button>
      
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          aria-label="Reset"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={onShare}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          aria-label="Share"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
