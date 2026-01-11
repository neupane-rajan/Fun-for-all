import React, { useEffect } from 'react';
import { Trash2, History, Save } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculatePercentage } from '../utils/calculations';
import ToolCard from '../components/ToolCard';
import ResultDisplay from '../components/ResultDisplay';
import InputField from '../components/InputField';
import ActionButtons from '../components/ActionButtons';

const GPACalculator = () => {
  const [subjects, setSubjects] = useLocalStorage('gpa-calculator-subjects', [
    { id: 1, name: 'Mathematics', obtained: '', total: 100 },
    { id: 2, name: 'Science', obtained: '', total: 100 },
    { id: 3, name: 'History', obtained: '', total: 100 },
  ]);

  const [percentage, setPercentage] = React.useState(0);
  const [history, setHistory] = useLocalStorage('gpa-calculator-history', []);

  useEffect(() => {
    setPercentage(calculatePercentage(subjects));
  }, [subjects]);

  const addSubject = () => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
    setSubjects([...subjects, { id: newId, name: '', obtained: '', total: 100 }]);
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(sub => sub.id !== id));
    } else {
      alert("At least one subject is required.");
    }
  };

  const saveResult = () => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      percentage: percentage,
      subjects: subjects.length
    };
    setHistory([newEntry, ...history].slice(0, 5)); // Keep last 5
  };

  const clearHistory = () => {
    if (confirm("Clear history?")) setHistory([]);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      setSubjects([{ id: 1, name: '', obtained: '', total: 100 }]);
    }
  };

  const handleShare = async () => {
    const text = `I scored ${percentage.toFixed(2)}% in my exams! Calculated using the Ultimate GPA Calculator.`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Results',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Result copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <ToolCard 
      title="GPA Calculator" 
      subtitle="Track your academic performance in real-time."
    >
      <ResultDisplay percentage={percentage} />
      
      <div className="flex justify-center my-6">
        <button 
          onClick={saveResult}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-purple-500/25"
        >
          <Save size={18} />
          Save Result
        </button>
      </div>

      <AdBanner format="leaderboard" slotId="gpa-top" className="hidden md:flex mb-6" />
      <AdBanner format="mobile" slotId="gpa-mobile" className="md:hidden flex mb-6" />

      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <div 
            key={subject.id} 
            className="flex flex-col md:flex-row items-end gap-3 p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-white/5 transition-all hover:bg-white/50 dark:hover:bg-black/30 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
          >
            <div className="w-full md:flex-1">
              <InputField
                label={index === 0 ? "Subject" : ""}
                placeholder="e.g. Mathematics"
                value={subject.name}
                onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
              />
            </div>
            <div className="w-full md:w-32">
              <InputField
                type="number"
                label={index === 0 ? "Obtained" : ""}
                placeholder="0"
                min="0"
                value={subject.obtained}
                onChange={(e) => updateSubject(subject.id, 'obtained', e.target.value)}
              />
            </div>
            <div className="w-full md:w-32">
                <InputField
                type="number"
                label={index === 0 ? "Total" : ""}
                placeholder="100"
                min="1"
                value={subject.total}
                onChange={(e) => updateSubject(subject.id, 'total', e.target.value)}
              />
            </div>
            
            <button
              onClick={() => removeSubject(subject.id)}
              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all mb-px"
              aria-label="Remove subject"
              title="Remove subject"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <ActionButtons 
        onAdd={addSubject} 
        onReset={handleReset} 
        onShare={handleShare} 
      />

      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <History size={20} className="text-gray-400" />
              Recent History
            </h3>
            <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-600 font-medium">Clear</button>
          </div>
          <div className="space-y-2">
            {history.map(entry => (
              <div key={entry.id} className="flex justify-between items-center p-3 bg-white/40 dark:bg-black/20 rounded-lg text-sm">
                <div>
                  <div className="font-bold text-gray-800 dark:text-gray-200">{entry.percentage.toFixed(2)}%</div>
                  <div className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()} • {entry.subjects} subjects</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolCard>
  );
};

export default GPACalculator;
