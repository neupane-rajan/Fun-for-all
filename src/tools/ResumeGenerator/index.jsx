import React, { useState, useRef, useEffect } from 'react';
import { Download, Plus, Trash2, User, Briefcase, GraduationCap, Wrench, Code, Save, FolderOpen, Layout } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ResumePreview from './ResumePreview';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', color: 'blue' },
  { id: 'classic', name: 'Classic', color: 'gray' },
  { id: 'creative', name: 'Creative', color: 'purple' },
];

const DEFAULT_RESUME = {
  personalInfo: {
    fullName: 'Rohit Neupane',
    title: 'Professional',
    email: 'rohit@example.com',
    phone: '+977 98XXXXXXXX',
    address: 'Kathmandu, Nepal',
    summary: 'Dedicated and results-driven professional with strong problem-solving abilities and excellent communication skills. Committed to delivering high-quality work and contributing to team success.',
    linkedin: 'linkedin.com/in/rohitneupane',
    website: ''
  },
  experience: [
    {
      id: 1,
      title: 'Senior Associate',
      company: 'ABC Company',
      startDate: '2020-01',
      endDate: 'Present',
      description: 'Led cross-functional teams to achieve project goals. Improved operational efficiency by 25% through process optimization.'
    }
  ],
  education: [
    {
      id: 1,
      degree: 'Bachelor\'s Degree',
      school: 'Tribhuvan University',
      year: '2016-2020'
    }
  ],
  projects: [
    {
      id: 1,
      name: 'Community Initiative',
      tech: 'Leadership, Event Planning',
      description: 'Organized community outreach programs that benefited over 500 participants.',
      link: ''
    }
  ],
  skills: ['Leadership', 'Communication', 'Problem Solving', 'Team Management', 'MS Office']
};

const ResumeGenerator = () => {
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('resume-data');
    return saved ? JSON.parse(saved) : DEFAULT_RESUME;
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const previewRef = useRef(null);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(resumeData));
  }, [resumeData]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), title: '', company: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const handleEducationChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), degree: '', school: '', year: '' }]
    }));
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const handleProjectChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { id: Date.now(), name: '', tech: '', description: '', link: '' }]
    }));
  };

  const removeProject = (id) => {
    setResumeData(prev => ({ ...prev, projects: prev.projects.filter(proj => proj.id !== id) }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim());
    setResumeData(prev => ({ ...prev, skills: skillsArray }));
  };

  const generatePDF = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    
    try {
      const element = previewRef.current;
      
      // Create canvas with proper settings for A4
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 794, // A4 width in pixels at 96 DPI
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ 
        orientation: 'portrait', 
        unit: 'mm', 
        format: 'a4' 
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      // Add more pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToFile = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_resume.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSaveMessage('Saved!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const loadFromFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        setResumeData(data);
        setSaveMessage('Loaded!');
        setTimeout(() => setSaveMessage(''), 2000);
      } catch {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const resetToDefault = () => {
    if (confirm('Reset to default resume? This will clear your current data.')) {
      setResumeData(DEFAULT_RESUME);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
          : 'bg-white dark:bg-black/20 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-black/30'
      }`}
    >
      <Icon size={16} />
      <span className="hidden sm:inline font-medium">{label}</span>
    </button>
  );

  const InputField = ({ label, className = '', ...props }) => (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</label>}
      <input
        {...props}
        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Resume Builder</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Build your professional resume in minutes.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Save/Load Menu */}
          <div className="relative">
            <button
              onClick={() => setShowSaveMenu(!showSaveMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-black/30 transition-all"
            >
              <Save size={16} />
              {saveMessage || 'Save/Load'}
            </button>
            {showSaveMenu && (
              <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 min-w-[160px] z-20">
                <button onClick={saveToFile} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                  <Save size={14} /> Save to File
                </button>
                <label className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2 cursor-pointer">
                  <FolderOpen size={14} /> Load from File
                  <input type="file" accept=".json" onChange={loadFromFile} className="hidden" />
                </label>
                <button onClick={resetToDefault} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2">
                  <Trash2 size={14} /> Reset
                </button>
              </div>
            )}
          </div>

          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            {isGenerating ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Download size={16} />}
            Download PDF
          </button>
        </div>
      </div>

      {/* Template Selector */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        <Layout size={16} className="text-gray-400 shrink-0" />
        <span className="text-sm text-gray-500 shrink-0">Template:</span>
        {TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
              selectedTemplate === template.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-black/20 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-black/30'
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <TabButton id="personal" icon={User} label="Personal" />
            <TabButton id="experience" icon={Briefcase} label="Experience" />
            <TabButton id="education" icon={GraduationCap} label="Education" />
            <TabButton id="projects" icon={Code} label="Projects" />
            <TabButton id="skills" icon={Wrench} label="Skills" />
          </div>

          <div className="bg-white/50 dark:bg-black/20 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 shadow-xl max-h-[600px] overflow-y-auto">
            {activeTab === 'personal' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField label="Full Name" name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalChange} />
                  <InputField label="Job Title" name="title" value={resumeData.personalInfo.title || ''} onChange={handlePersonalChange} />
                  <InputField label="Email" type="email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalChange} />
                  <InputField label="Phone" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalChange} />
                  <InputField label="Address" name="address" value={resumeData.personalInfo.address} onChange={handlePersonalChange} />
                  <InputField label="LinkedIn" name="linkedin" value={resumeData.personalInfo.linkedin || ''} onChange={handlePersonalChange} placeholder="linkedin.com/in/..." />
                  <InputField label="Website" name="website" value={resumeData.personalInfo.website || ''} onChange={handlePersonalChange} placeholder="yoursite.com" className="sm:col-span-2" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Professional Summary</label>
                  <textarea
                    name="summary"
                    value={resumeData.personalInfo.summary}
                    onChange={handlePersonalChange}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 rounded-xl bg-white/40 dark:bg-black/30 border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Experience #{index + 1}</h3>
                      <button onClick={() => removeExperience(exp.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <InputField placeholder="Job Title" value={exp.title} onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)} />
                      <InputField placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} />
                      <InputField placeholder="Start Date" value={exp.startDate} onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)} />
                      <InputField placeholder="End Date" value={exp.endDate} onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)} />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 outline-none resize-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                ))}
                <button onClick={addExperience} className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Plus size={18} /> Add Experience
                </button>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="p-4 rounded-xl bg-white/40 dark:bg-black/30 border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Education #{index + 1}</h3>
                      <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="space-y-3">
                      <InputField placeholder="Degree / Major" value={edu.degree} onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)} />
                      <InputField placeholder="School / University" value={edu.school} onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)} />
                      <InputField placeholder="Year (e.g. 2016 - 2020)" value={edu.year} onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Plus size={18} /> Add Education
                </button>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {(resumeData.projects || []).map((proj, index) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-white/40 dark:bg-black/30 border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Project #{index + 1}</h3>
                      <button onClick={() => removeProject(proj.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="space-y-3">
                      <InputField placeholder="Project / Achievement Name" value={proj.name} onChange={(e) => handleProjectChange(proj.id, 'name', e.target.value)} />
                      <InputField placeholder="Skills / Tools Used" value={proj.tech} onChange={(e) => handleProjectChange(proj.id, 'tech', e.target.value)} />
                      <InputField placeholder="Link (optional)" value={proj.link || ''} onChange={(e) => handleProjectChange(proj.id, 'link', e.target.value)} />
                      <textarea
                        placeholder="Description"
                        value={proj.description}
                        onChange={(e) => handleProjectChange(proj.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 outline-none resize-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                ))}
                <button onClick={addProject} className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Plus size={18} /> Add Project / Achievement
                </button>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skills (Comma separated)</label>
                  <textarea
                    value={resumeData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    rows={4}
                    placeholder="Java, Python, Leadership, Communication..."
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    skill && (
                      <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-4 h-fit">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="overflow-auto max-h-[700px] custom-scrollbar">
              <ResumePreview ref={previewRef} data={resumeData} template={selectedTemplate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerator;
