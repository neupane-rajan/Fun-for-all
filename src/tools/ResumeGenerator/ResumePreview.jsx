import React, { forwardRef } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Code } from 'lucide-react';

const TEMPLATE_STYLES = {
  modern: {
    accent: '#3B82F6',
    headerBg: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    headerText: '#FFFFFF',
  },
  classic: {
    accent: '#374151',
    headerBg: '#F9FAFB',
    headerText: '#111827',
  },
  creative: {
    accent: '#8B5CF6',
    headerBg: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    headerText: '#FFFFFF',
  },
};

// Explicit colors for html2canvas compatibility (doesn't support oklch)
const COLORS = {
  white: '#FFFFFF',
  gray800: '#1F2937',
  gray700: '#374151',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
};

const ResumePreview = forwardRef(({ data, template = 'modern' }, ref) => {
  const { personalInfo, experience, education, projects, skills } = data;
  const style = TEMPLATE_STYLES[template] || TEMPLATE_STYLES.modern;

  return (
    <div 
      ref={ref} 
      id="resume-preview" 
      style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: COLORS.white,
        color: COLORS.gray800,
        width: '210mm', // A4 width
        minHeight: '297mm', // A4 height
        maxWidth: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div 
        style={{ 
          background: style.headerBg, 
          color: style.headerText,
          padding: '2rem',
          paddingBottom: '1.5rem',
        }}
      >
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 700, 
          letterSpacing: '-0.025em',
          marginBottom: '0.25rem',
        }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <div style={{ 
            fontSize: '1.125rem', 
            fontWeight: 500, 
            opacity: 0.9,
            marginBottom: '1rem',
          }}>
            {personalInfo.title}
          </div>
        )}
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          fontSize: '0.875rem',
          opacity: 0.9,
        }}>
          {personalInfo.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Mail size={14} />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Phone size={14} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <MapPin size={14} />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Linkedin size={14} />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Globe size={14} />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '2rem', paddingTop: '1.5rem' }}>
        {/* Summary */}
        {personalInfo.summary && (
          <section style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '0.875rem', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
              color: style.accent,
            }}>
              Profile
            </h2>
            <p style={{ 
              fontSize: '0.875rem', 
              lineHeight: 1.625, 
              color: COLORS.gray600,
            }}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '0.875rem', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              color: style.accent,
            }}>
              Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {experience.map(exp => (
                <div key={exp.id}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'baseline',
                    marginBottom: '0.125rem',
                  }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.gray800 }}>
                      {exp.title || 'Position'}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: COLORS.gray500 }}>
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    color: COLORS.gray600,
                    marginBottom: '0.25rem',
                  }}>
                    {exp.company}
                  </div>
                  {exp.description && (
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: COLORS.gray600, 
                      lineHeight: 1.625,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '0.875rem', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              color: style.accent,
            }}>
              Projects & Achievements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {projects.map(proj => (
                <div key={proj.id}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '0.125rem',
                  }}>
                    <Code size={14} style={{ color: style.accent }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.gray800 }}>
                      {proj.name || 'Project'}
                    </h3>
                    {proj.link && (
                      <span style={{ fontSize: '0.75rem', color: COLORS.gray400 }}>
                        ({proj.link})
                      </span>
                    )}
                  </div>
                  {proj.tech && (
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 500, 
                      color: COLORS.gray500,
                      marginBottom: '0.25rem',
                    }}>
                      {proj.tech}
                    </div>
                  )}
                  {proj.description && (
                    <p style={{ fontSize: '0.875rem', color: COLORS.gray600, lineHeight: 1.625 }}>
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '0.875rem', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              color: style.accent,
            }}>
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {education.map(edu => (
                <div key={edu.id}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'baseline',
                    marginBottom: '0.125rem',
                  }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.gray800 }}>
                      {edu.school}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: COLORS.gray500 }}>
                      {edu.year}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: COLORS.gray600 }}>
                    {edu.degree}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && skills[0] && (
          <section>
            <h2 style={{ 
              fontSize: '0.875rem', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              color: style.accent,
            }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((skill, index) => (
                skill && (
                  <span 
                    key={index} 
                    style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      backgroundColor: `${style.accent}20`,
                      color: style.accent,
                    }}
                  >
                    {skill}
                  </span>
                )
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
