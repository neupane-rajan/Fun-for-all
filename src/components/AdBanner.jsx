import React from 'react';

const AdBanner = ({ slotId, format = 'auto', className = '' }) => {
  // In a real app, this would integrate with Google AdSense or another provider
  // For now, we simulate the layout impact and "loading" state
  const isAdEnabled = false; // Toggle this to true to see ad placeholders
  
  if (!isAdEnabled) {
    return null;
  }
  
  const getDimensions = () => {
    switch(format) {
      case 'rectangle': return { width: '300px', height: '250px' };
      case 'leaderboard': return { width: '728px', height: '90px' };
      case 'mobile': return { width: '320px', height: '50px' };
      default: return { width: '100%', height: 'auto' };
    }
  };

  const dimensions = getDimensions();

  return (
    <div 
      className={`ad-container bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg flex flex-col items-center justify-center overflow-hidden mx-auto ${className}`}
      style={{ 
        maxWidth: '100%',
        minHeight: dimensions.height === 'auto' ? '90px' : dimensions.height 
      }}
    >
      <span className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Advertisement</span>
      <div className="w-full h-full flex items-center justify-center bg-gray-200/50 dark:bg-white/5 p-4 text-center text-gray-400 text-sm">
        Slot: {slotId || 'auto'}
        <br/>
        {format}
      </div>
    </div>
  );
};

export default AdBanner;
