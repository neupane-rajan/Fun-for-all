import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, Trash2, Plus, TrendingUp, Award, Target, MoreVertical, ChevronUp, ChevronDown, BarChart3 } from 'lucide-react';
import { format, differenceInDays, addDays, isSameDay } from 'date-fns';
import ToolCard from '../../components/ToolCard';
import InputField from '../../components/InputField';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const PRIORITY_LEVELS = [
  { id: 'high', name: 'High', color: 'red' },
  { id: 'medium', name: 'Medium', color: 'yellow' },
  { id: 'low', name: 'Low', color: 'green' },
];

const StudyPlanner = () => {
  // --- State ---
  const [examDate, setExamDate] = useLocalStorage('study-planner-date', '');
  const [dailyHours, setDailyHours] = useLocalStorage('study-planner-daily-hours', '2');
  const [subjects, setSubjects] = useLocalStorage('study-planner-subjects', []);
  const [completedSessions, setCompletedSessions] = useLocalStorage('study-planner-completed-sessions', []); 
  const [streak, setStreak] = useLocalStorage('study-planner-streak', { count: 0, lastActive: null });
  
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [showStats, setShowStats] = useState(true);

  // --- Derived State (Schedule) ---
  const schedule = useMemo(() => {
    if (examDate && subjects.length > 0 && dailyHours) {
      const start = new Date();
      const end = new Date(examDate);
      const daysRemaining = differenceInDays(end, start);
      
      if (daysRemaining <= 0) return [];

      // Sort subjects by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const sortedSubjects = [...subjects].sort((a, b) => 
        (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1)
      );

      const newSchedule = [];
      let currentDay = start;

      for (let i = 0; i < Math.min(daysRemaining, 14); i++) {
        currentDay = addDays(start, i + 1);
        const subject = sortedSubjects[i % sortedSubjects.length];
        const sessionKey = `${format(currentDay, 'yyyy-MM-dd')}-${subject?.id}`;
        
        newSchedule.push({
          date: currentDay,
          subject: subject,
          focus: subject?.name || 'Revision',
          priority: subject?.priority || 'medium',
          hours: parseFloat(dailyHours),
          isCompleted: completedSessions.includes(sessionKey),
          sessionKey: sessionKey
        });
      }
      return newSchedule;
    }
    return [];
  }, [examDate, subjects, dailyHours, completedSessions]);

  // --- Statistics ---
  const stats = useMemo(() => {
    const total = schedule.length;
    const completed = schedule.filter(s => s.isCompleted).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    const hoursStudied = completed * parseFloat(dailyHours || 0);
    const hoursRemaining = (total - completed) * parseFloat(dailyHours || 0);
    
    // Subject breakdown
    const subjectStats = subjects.map(subject => {
      const subjectSessions = schedule.filter(s => s.subject?.id === subject.id);
      const subjectCompleted = subjectSessions.filter(s => s.isCompleted).length;
      return {
        ...subject,
        total: subjectSessions.length,
        completed: subjectCompleted,
        progress: subjectSessions.length === 0 ? 0 : Math.round((subjectCompleted / subjectSessions.length) * 100)
      };
    });

    return { total, completed, progress, hoursStudied, hoursRemaining, subjectStats };
  }, [schedule, dailyHours, subjects]);

  // --- Actions ---
  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, { id: Date.now(), name: newSubject, priority: newPriority }]);
      setNewSubject('');
    }
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const toggleSubjectPriority = (id) => {
    const order = ['low', 'medium', 'high'];
    setSubjects(subjects.map(s => {
      if (s.id === id) {
        const currentIdx = order.indexOf(s.priority || 'medium');
        return { ...s, priority: order[(currentIdx + 1) % 3] };
      }
      return s;
    }));
  };

  const toggleSession = (sessionKey) => {
    const isCompleted = completedSessions.includes(sessionKey);
    let newCompleted;
    
    if (isCompleted) {
      newCompleted = completedSessions.filter(k => k !== sessionKey);
    } else {
      newCompleted = [...completedSessions, sessionKey];
      updateStreak();
    }
    setCompletedSessions(newCompleted);
  };

  const updateStreak = () => {
    const today = new Date();
    const lastActive = streak.lastActive ? new Date(streak.lastActive) : null;
    
    if (!lastActive || !isSameDay(lastActive, today)) {
      const isConsecutive = lastActive && isSameDay(addDays(lastActive, 1), today);
      
      setStreak({
        count: isConsecutive ? streak.count + 1 : 1,
        lastActive: today.toISOString()
      });
    }
  };

  const resetData = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      setExamDate('');
      setSubjects([]);
      setCompletedSessions([]);
      setStreak({ count: 0, lastActive: null });
    }
  };

  // --- Render Helpers ---
  const ProgressBar = ({ progress, color = "bg-indigo-500" }) => (
    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      default: return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  return (
    <ToolCard title="Study Master" subtitle="Plan, track, and achieve your academic goals.">
      <div className="space-y-6">
        
        {/* Dashboard Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-linear-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-indigo-500" />
              <span className="text-xs font-bold uppercase text-indigo-500 tracking-wider">Streak</span>
            </div>
            <div className="text-2xl font-black text-gray-800 dark:text-white flex items-end gap-1">
              {streak.count} <span className="text-xs font-medium text-gray-400 mb-0.5">days</span>
            </div>
          </div>
          
          <div className="bg-linear-to-br from-pink-500/10 to-rose-500/10 p-4 rounded-2xl border border-pink-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-pink-500" />
              <span className="text-xs font-bold uppercase text-pink-500 tracking-wider">Progress</span>
            </div>
            <div className="text-2xl font-black text-gray-800 dark:text-white flex items-end gap-1">
              {stats.progress}% <span className="text-xs font-medium text-gray-400 mb-0.5">complete</span>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-2xl border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-green-500" />
              <span className="text-xs font-bold uppercase text-green-500 tracking-wider">Studied</span>
            </div>
            <div className="text-2xl font-black text-gray-800 dark:text-white flex items-end gap-1">
              {stats.hoursStudied} <span className="text-xs font-medium text-gray-400 mb-0.5">hrs</span>
            </div>
          </div>

          <div className="bg-linear-to-br from-amber-500/10 to-orange-500/10 p-4 rounded-2xl border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="text-amber-500" />
              <span className="text-xs font-bold uppercase text-amber-500 tracking-wider">Remaining</span>
            </div>
            <div className="text-2xl font-black text-gray-800 dark:text-white flex items-end gap-1">
              {stats.hoursRemaining} <span className="text-xs font-medium text-gray-400 mb-0.5">hrs</span>
            </div>
          </div>
        </div>

        {/* Subject Progress Chart */}
        {stats.subjectStats.length > 0 && (
          <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
            <button 
              onClick={() => setShowStats(!showStats)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-500" />
                <h3 className="text-sm font-bold text-gray-800 dark:text-white">Subject Progress</h3>
              </div>
              {showStats ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>
            
            {showStats && (
              <div className="mt-4 space-y-3">
                {stats.subjectStats.map(subject => (
                  <div key={subject.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{subject.name}</span>
                      <span className="text-gray-500">{subject.completed}/{subject.total} ({subject.progress}%)</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Schedule (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-indigo-500" />
              Your Schedule (Next 14 Days)
            </h3>

            {schedule.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {schedule.map((session) => (
                  <div 
                    key={session.sessionKey}
                    className={`group relative overflow-hidden p-3 rounded-xl border transition-all duration-300 ${
                      session.isCompleted 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : 'bg-white/60 dark:bg-white/5 border-white/20 hover:border-indigo-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Date Box */}
                        <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center border text-xs ${
                          isSameDay(session.date, new Date()) 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                            : 'bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 text-gray-500'
                        }`}>
                          <span className="font-bold uppercase">{format(session.date, 'MMM')}</span>
                          <span className="text-lg font-bold">{format(session.date, 'd')}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`text-base font-bold ${session.isCompleted ? 'text-green-600 dark:text-green-400 line-through' : 'text-gray-800 dark:text-white'}`}>
                              {session.focus}
                            </h4>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${getPriorityColor(session.priority)}`}>
                              {session.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1"><Clock size={12}/> {session.hours} hrs</span>
                            {isSameDay(session.date, new Date()) && (
                              <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">TODAY</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => toggleSession(session.sessionKey)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          session.isCompleted
                            ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-500/30'
                            : 'bg-gray-100 dark:bg-white/10 text-gray-400 hover:bg-green-500 hover:text-white'
                        }`}
                      >
                        <CheckCircle size={20} className={session.isCompleted ? 'fill-current' : ''} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-gray-500 bg-white/30 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <CalendarIcon size={40} className="mb-3 opacity-50" />
                <p className="text-sm">Add subjects and set a date to generate your plan.</p>
              </div>
            )}
          </div>

          {/* Right Column: Config (1/3 width) */}
          <div className="space-y-6">
            
            {/* Config Card */}
            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <MoreVertical size={16} className="text-gray-400" />
                Settings
              </h3>
              
              <div className="space-y-3">
                <InputField 
                  label="Target Exam Date"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
                <InputField 
                  label="Daily Commitment (Hours)"
                  type="number"
                  min="0.5" max="24" step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Subjects</h4>
                <div className="flex gap-2 mb-3">
                  <InputField 
                    placeholder="Add subject..."
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="flex-1"
                  />
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-xs"
                  >
                    {PRIORITY_LEVELS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <button onClick={addSubject} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {subjects.map(subject => (
                    <div key={subject.id} className="flex items-center justify-between p-2 bg-white/50 dark:bg-white/5 rounded-lg text-sm group">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleSubjectPriority(subject.id)}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${getPriorityColor(subject.priority)}`}
                        >
                          {subject.priority || 'Med'}
                        </button>
                        <span className="text-gray-700 dark:text-gray-200">{subject.name}</span>
                      </div>
                      <button 
                        onClick={() => removeSubject(subject.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={resetData}
                className="w-full mt-4 flex items-center justify-center gap-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-xs font-medium"
              >
                <Trash2 size={14} />
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
};

export default StudyPlanner;
