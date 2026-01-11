import React from 'react';

const ToolCard = ({ children, title, subtitle }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="bg-white/10 dark:bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden">
        <div className="p-6 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-3 tracking-tight">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
