import React, { useEffect, useRef } from 'react';

const AdBanner = ({ 
  slotId, 
  format = 'auto', 
  className = '',
  style = {} 
}) => {
  const adRef = useRef(null);
  const isAdPushed = useRef(false);
  
  // Set to true to enable ads, false to hide all ads
  const isAdEnabled = true;

  useEffect(() => {
    if (!isAdEnabled || !slotId) return;
    
    // Only push the ad once
    if (isAdPushed.current) return;
    
    try {
      // Check if adsbygoogle is available
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        isAdPushed.current = true;
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [slotId, isAdEnabled]);

  if (!isAdEnabled || !slotId) {
    return null;
  }

  // Get responsive style based on format
  const getAdStyle = () => {
    switch(format) {
      case 'rectangle':
        return { display: 'block', width: '300px', height: '250px' };
      case 'leaderboard':
        return { display: 'block', width: '728px', height: '90px' };
      case 'mobile':
        return { display: 'block', width: '320px', height: '50px' };
      case 'in-article':
        return { display: 'block', textAlign: 'center' };
      case 'auto':
      default:
        return { display: 'block' };
    }
  };

  return (
    <div className={`ad-container my-4 mx-auto overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ ...getAdStyle(), ...style }}
        data-ad-client="ca-pub-4693886282991053"
        data-ad-slot={slotId}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={format === 'auto' ? 'true' : undefined}
      />
    </div>
  );
};

export default AdBanner;
