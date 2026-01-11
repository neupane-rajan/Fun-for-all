import React, { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';

const AdBlockDetector = () => {
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    // Check if user has previously dismissed (stored for this session)
    return sessionStorage.getItem('adblock-warning-dismissed') === 'true';
  });

  useEffect(() => {
    if (dismissed) return;

    // Detection method: Try to load a bait element that adblockers typically block
    const detectAdBlock = async () => {
      // Method 1: Check if adsbygoogle is blocked
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox ad-banner textads banner-ads';
      testAd.style.cssText = 'height: 1px; width: 1px; position: absolute; left: -999px; top: -999px;';
      document.body.appendChild(testAd);

      // Wait a bit for adblockers to act
      await new Promise(resolve => setTimeout(resolve, 100));

      const isBlocked = testAd.offsetHeight === 0 || 
                        testAd.offsetWidth === 0 || 
                        testAd.clientHeight === 0;
      
      document.body.removeChild(testAd);

      // Method 2: Check if adsbygoogle script loaded
      const adsbyGoogleBlocked = typeof window.adsbygoogle === 'undefined';

      if (isBlocked || adsbyGoogleBlocked) {
        setAdBlockDetected(true);
      }
    };

    // Run detection after a short delay
    const timer = setTimeout(detectAdBlock, 1000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('adblock-warning-dismissed', 'true');
  };

  if (!adBlockDetected || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Dismiss"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Ad Blocker Detected
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4 leading-relaxed">
          We noticed you're using an ad blocker. Our free tools are supported by ads to keep them accessible to everyone.
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Please consider disabling your ad blocker for this site to support our work. 🙏
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDismiss}
            className="w-full py-3 px-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            I'll Disable It
          </button>
          <button
            onClick={handleDismiss}
            className="w-full py-2 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium transition-colors"
          >
            Continue Anyway
          </button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          This message won't appear again this session.
        </p>
      </div>
    </div>
  );
};

export default AdBlockDetector;
