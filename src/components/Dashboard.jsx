import React from 'react';
import { Calculator, Keyboard, Calendar, DollarSign, Palette, FileText, Terminal } from 'lucide-react';

import HeroSection from './HeroSection';

const ToolButton = ({ icon: Icon, title, description, onClick, color }) => (
  <button 
    onClick={onClick}
    className="group relative flex flex-col items-center p-8 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 hover:scale-[1.02] shadow-xl"
  >
    <div className={`p-4 rounded-2xl mb-4 ${color} bg-opacity-20 text-white shadow-lg`}>
      <Icon size={40} className="stroke-[1.5]" />
    </div>
    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-center font-light">{description}</p>
  </button>
);

const Dashboard = ({ onSelectTool }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <HeroSection />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolButton 
          icon={Calculator} 
          title="GPA Calculator" 
          description="Track your grades and calculate your GPA with ease."
          onClick={() => onSelectTool('gpa')}
          color="bg-purple-600"
        />
        <ToolButton 
          icon={Keyboard} 
          title="Typing Test" 
          description="Test your typing speed and improve your accuracy."
          onClick={() => onSelectTool('typing')}
          color="bg-pink-600"
        />
        <ToolButton 
          icon={Calendar} 
          title="Study Planner" 
          description="Organize your study schedule effectively."
          onClick={() => onSelectTool('planner')}
          color="bg-indigo-600"
        />
        <ToolButton 
          icon={DollarSign} 
          title="EMI Calculator" 
          description="Plan your loans and finance smartly."
          onClick={() => onSelectTool('emi')}
          color="bg-green-600"
        />
        <ToolButton 
          icon={Palette} 
          title="Color Palette" 
          description="Generate beautiful color combinations."
          onClick={() => onSelectTool('palette')}
          color="bg-orange-600"
        />
        <ToolButton 
          icon={FileText} 
          title="Resume Builder" 
          description="Create a professional resume in minutes."
          onClick={() => onSelectTool('resume')}
          color="bg-blue-600"
        />
        <ToolButton 
          icon={Terminal} 
          title="Linux Cheat Sheet" 
          description="Essential Linux commands reference."
          onClick={() => onSelectTool('linux')}
          color="bg-slate-700"
        />
      </div>
    </div>
  );
};

export default Dashboard;
