import React, { useState, useCallback } from 'react';
import { RefreshCw, Lock, Unlock, Copy, Check, Download, Palette, Sparkles } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

const ColorPaletteGenerator = () => {
  // Color harmony modes
  const harmonyModes = [
    { id: 'random', name: 'Random', icon: Sparkles },
    { id: 'analogous', name: 'Analogous', icon: Palette },
    { id: 'complementary', name: 'Complementary', icon: Palette },
    { id: 'triadic', name: 'Triadic', icon: Palette },
    { id: 'monochromatic', name: 'Monochromatic', icon: Palette },
  ];

  const [harmonyMode, setHarmonyMode] = useState('random');
  const [colors, setColors] = useState(() => {
    // Lazy initialization: generate initial palette synchronously
    const letters = '0123456789ABCDEF';
    return Array(5).fill(null).map(() => {
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    });
  });
  const [locked, setLocked] = useState([false, false, false, false, false]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showExport, setShowExport] = useState(false);

  // Helper: HSL to Hex
  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  // Helper: Hex to HSL
  const hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
        case g: h = ((b - r) / d + 2) * 60; break;
        case b: h = ((r - g) / d + 4) * 60; break;
        default: h = 0;
      }
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateHarmonyPalette = useCallback((mode) => {
    const baseHue = Math.floor(Math.random() * 360);
    const baseSat = 60 + Math.floor(Math.random() * 30);
    const baseLit = 45 + Math.floor(Math.random() * 20);

    switch (mode) {
      case 'analogous':
        return [
          hslToHex((baseHue - 30 + 360) % 360, baseSat, baseLit),
          hslToHex((baseHue - 15 + 360) % 360, baseSat, baseLit + 10),
          hslToHex(baseHue, baseSat, baseLit),
          hslToHex((baseHue + 15) % 360, baseSat, baseLit + 10),
          hslToHex((baseHue + 30) % 360, baseSat, baseLit),
        ];
      case 'complementary':
        return [
          hslToHex(baseHue, baseSat, baseLit - 15),
          hslToHex(baseHue, baseSat - 20, baseLit + 20),
          hslToHex(baseHue, baseSat, baseLit),
          hslToHex((baseHue + 180) % 360, baseSat - 20, baseLit + 20),
          hslToHex((baseHue + 180) % 360, baseSat, baseLit - 15),
        ];
      case 'triadic':
        return [
          hslToHex(baseHue, baseSat, baseLit),
          hslToHex(baseHue, baseSat - 30, baseLit + 25),
          hslToHex((baseHue + 120) % 360, baseSat, baseLit),
          hslToHex((baseHue + 120) % 360, baseSat - 30, baseLit + 25),
          hslToHex((baseHue + 240) % 360, baseSat, baseLit),
        ];
      case 'monochromatic':
        return [
          hslToHex(baseHue, baseSat, 25),
          hslToHex(baseHue, baseSat, 40),
          hslToHex(baseHue, baseSat, 55),
          hslToHex(baseHue, baseSat, 70),
          hslToHex(baseHue, baseSat, 85),
        ];
      default:
        return Array(5).fill(null).map(() => generateRandomColor());
    }
  }, []);

  const generatePalette = useCallback(() => {
    const newPalette = generateHarmonyPalette(harmonyMode);
    setColors(prevColors => {
      if (prevColors.length === 0) return newPalette;
      return prevColors.map((color, index) => {
        if (locked[index]) return color;
        return newPalette[index];
      });
    });
  }, [harmonyMode, locked, generateHarmonyPalette]);



  const toggleLock = (index) => {
    setLocked(prev => {
      const newLocked = [...prev];
      newLocked[index] = !newLocked[index];
      return newLocked;
    });
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const exportAsCSS = () => {
    const css = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
    copyToClipboard(css, 'css');
  };

  const exportAsJSON = () => {
    const json = JSON.stringify({ palette: colors }, null, 2);
    copyToClipboard(json, 'json');
  };

  const exportAsTailwind = () => {
    const tailwind = `colors: {\n${colors.map((c, i) => `  'palette-${i + 1}': '${c}',`).join('\n')}\n}`;
    copyToClipboard(tailwind, 'tailwind');
  };

  // Get contrast color for text
  const getContrastColor = (hex) => {
    const { l } = hexToHsl(hex);
    return l > 55 ? '#1F2937' : '#FFFFFF';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
          Color Palette Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Create stunning color palettes with different harmony modes. Lock your favorites and export in multiple formats.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {harmonyModes.map(mode => (
          <button
            key={mode.id}
            onClick={() => setHarmonyMode(mode.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              harmonyMode === mode.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-white dark:bg-black/20 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-black/30 border border-gray-200 dark:border-white/10'
            }`}
          >
            <mode.icon size={16} />
            {mode.name}
          </button>
        ))}
      </div>

      {/* Color Palette Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-8">
        {colors.map((color, index) => (
          <div 
            key={index}
            className="relative group rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 flex flex-col justify-between p-4 border border-black/5 dark:border-white/5 aspect-3/4 md:aspect-2/3"
            style={{ backgroundColor: color }}
          >
            {/* Lock indicator */}
            {locked[index] && (
              <div className="absolute top-3 right-3">
                <Lock size={16} style={{ color: getContrastColor(color) }} className="opacity-70" />
              </div>
            )}

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            
            {/* Actions */}
            <div className="relative z-10 flex flex-col items-center gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <button
                onClick={() => toggleLock(index)}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-colors"
                title={locked[index] ? 'Unlock' : 'Lock'}
              >
                {locked[index] ? <Lock size={18} /> : <Unlock size={18} />}
              </button>
              
              <button
                onClick={() => copyToClipboard(color, index)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-900 dark:text-white font-mono text-sm font-bold hover:scale-105 transition-transform cursor-copy shadow-lg"
              >
                {color}
                {copiedIndex === index ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={generatePalette}
          className="flex items-center gap-3 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <RefreshCw size={20} />
          Generate Palette
        </button>

        <div className="relative">
          <button
            onClick={() => setShowExport(!showExport)}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-black/30 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-black/40 transition-all"
          >
            <Download size={20} />
            Export
          </button>

          {showExport && (
            <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 min-w-[160px] z-20 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => { exportAsCSS(); setShowExport(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {copiedIndex === 'css' ? '✓ Copied!' : 'CSS Variables'}
              </button>
              <button
                onClick={() => { exportAsJSON(); setShowExport(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {copiedIndex === 'json' ? '✓ Copied!' : 'JSON'}
              </button>
              <button
                onClick={() => { exportAsTailwind(); setShowExport(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {copiedIndex === 'tailwind' ? '✓ Copied!' : 'Tailwind Config'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-full">
          <Palette size={14} />
          Mode: <span className="font-medium text-purple-600 dark:text-purple-400">{harmonyModes.find(m => m.id === harmonyMode)?.name}</span>
        </span>
      </div>

      {/* Ad Banner */}
      <AdBanner slotId="palette-bottom" format="auto" className="max-w-3xl mx-auto" />
    </div>
  );
};

export default ColorPaletteGenerator;
