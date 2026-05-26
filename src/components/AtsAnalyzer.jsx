import React from 'react';
import { Award, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

// List of active industry action verbs for scanning
const ACTION_VERBS = [
  'spearheaded', 'designed', 'engineered', 'developed', 'optimized', 
  'built', 'implemented', 'managed', 'led', 'created', 'automated', 
  'solved', 'refactored', 'coordinated', 'launched', 'configured', 
  'designed', 'reduced', 'increased', 'maximized', 'integrated', 
  'accelerated', 'improved', 'standardized', 'modernized', 'deployed'
];

export function calculateAtsMetrics(data) {
  let score = 0;
  const reports = [];

  if (!data) return { score: 0, reports: [], details: {} };

  const { personal = {}, education = [], experience = [], projects = [], skills = {} } = data;

  // 1. Contact Details (Max 15 pts)
  let contactScore = 0;
  const missingContacts = [];
  if (personal.email) contactScore += 3; else missingContacts.push('Email');
  if (personal.phone) contactScore += 3; else missingContacts.push('Phone number');
  if (personal.linkedin) contactScore += 3; else missingContacts.push('LinkedIn profile');
  if (personal.github) contactScore += 3; else missingContacts.push('GitHub profile');
  if (personal.website) contactScore += 3; else missingContacts.push('Portfolio website');
  
  score += contactScore;
  if (missingContacts.length > 0) {
    reports.push({
      type: 'warning',
      category: 'Contact Info',
      message: `Add missing profiles to boost ATS reach: ${missingContacts.join(', ')}.`
    });
  } else {
    reports.push({
      type: 'success',
      category: 'Contact Info',
      message: 'All standard contact credentials and links are included!'
    });
  }

  // 2. Sections Complete (Max 25 pts)
  let sectionScore = 0;
  if (personal.summary && personal.summary.trim().length > 20) {
    sectionScore += 5;
  } else {
    reports.push({
      type: 'warning',
      category: 'Profile Summary',
      message: 'Write a professional summary (at least 2-3 sentences) detailing your expertise.'
    });
  }
  if (education && education.length > 0) sectionScore += 5; else {
    reports.push({
      type: 'danger',
      category: 'Education',
      message: 'Add at least one Educational institution.'
    });
  }
  if (experience && experience.length > 0) sectionScore += 5; else {
    reports.push({
      type: 'warning',
      category: 'Work Experience',
      message: 'Add work experience. If you are a student, add internships or freelance roles.'
    });
  }
  if (projects && projects.length > 0) sectionScore += 5; else {
    reports.push({
      type: 'danger',
      category: 'Projects',
      message: 'Highlight your technical capabilities by adding at least one project.'
    });
  }

  // Check if at least some skills are filled
  const allSkillsText = `${skills.languages || ''} ${skills.frameworks || ''} ${skills.databases || ''} ${skills.tools || ''} ${skills.concepts || ''}`.trim();
  if (allSkillsText.length > 5) sectionScore += 5; else {
    reports.push({
      type: 'danger',
      category: 'Skills',
      message: 'Fill out your skills list (languages, libraries, frameworks).'
    });
  }
  score += sectionScore;

  // 3. Action Verbs Usage (Max 25 pts)
  let verbCount = 0;
  const foundVerbs = [];
  
  // Combine all texts from experience highlights
  const experienceText = experience.map(exp => {
    const bulletText = (exp.bullets || []).join(' ');
    return `${exp.role} ${exp.company} ${exp.summary || ''} ${bulletText}`;
  }).join(' ').toLowerCase();

  ACTION_VERBS.forEach(verb => {
    if (experienceText.includes(verb)) {
      verbCount++;
      if (foundVerbs.length < 5) foundVerbs.push(verb);
    }
  });

  let verbScore = 0;
  if (verbCount === 0) {
    verbScore = 0;
    if (experience.length > 0) {
      reports.push({
        type: 'danger',
        category: 'Action Verbs',
        message: 'No strong action verbs found. Start your work bullets with action verbs like "Spearheaded", "Engineered", "Optimized".'
      });
    }
  } else if (verbCount <= 2) {
    verbScore = 10;
    reports.push({
      type: 'warning',
      category: 'Action Verbs',
      message: `Weak action verb diversity. Found verbs: [${foundVerbs.join(', ')}]. Add more to showcase leadership.`
    });
  } else if (verbCount <= 4) {
    verbScore = 20;
    reports.push({
      type: 'success',
      category: 'Action Verbs',
      message: `Good action verb usage. Found verbs: [${foundVerbs.join(', ')}].`
    });
  } else {
    verbScore = 25;
    reports.push({
      type: 'success',
      category: 'Action Verbs',
      message: `Outstanding job experience description! Used ${verbCount} diverse action verbs.`
    });
  }
  score += verbScore;

  // 4. Skills Density (Max 20 pts)
  // Split skills by commas, spaces, or semicolons
  const skillList = allSkillsText.split(/[\s,;]+/).filter(s => s.trim().length > 1);
  let skillScore = 0;
  if (skillList.length === 0) {
    skillScore = 0;
  } else if (skillList.length < 6) {
    skillScore = 8;
    reports.push({
      type: 'warning',
      category: 'Skills Count',
      message: `Only ${skillList.length} skills found. ATS scans look for 10-15 relevant keywords. Add more specific technologies.`
    });
  } else if (skillList.length < 12) {
    skillScore = 15;
    reports.push({
      type: 'success',
      category: 'Skills Count',
      message: `Good skills list (${skillList.length} key terms). Keep aligning with job requirements.`
    });
  } else {
    skillScore = 20;
    reports.push({
      type: 'success',
      category: 'Skills Count',
      message: `Rich technology density (${skillList.length} keywords). Excellent for parser indexing!`
    });
  }
  score += skillScore;

  // 5. Project Quality & Links (Max 15 pts)
  let projectQualityScore = 0;
  const projectLinkMissing = projects.some(proj => !proj.link || proj.link.trim() === '');
  
  if (projects.length > 0) {
    projectQualityScore += 5; // Has projects
    if (!projectLinkMissing) {
      projectQualityScore += 10; // All have links
      reports.push({
        type: 'success',
        category: 'Project Credentials',
        message: 'All portfolio projects provide clickable links (GitHub/Live)! Highly recommended for tech ATS.'
      });
    } else {
      projectQualityScore += 3;
      reports.push({
        type: 'warning',
        category: 'Project Credentials',
        message: 'Some projects lack demo/repository URLs. Add links to prove design execution.'
      });
    }
  } else {
    reports.push({
      type: 'danger',
      category: 'Projects',
      message: 'Provide projects with descriptive links to validate coding capability.'
    });
  }
  score += projectQualityScore;

  // Normalize final score to max 100
  const finalScore = Math.min(100, score);

  return {
    score: finalScore,
    reports,
    details: {
      contact: contactScore,
      sections: sectionScore,
      verbs: verbScore,
      skills: skillScore,
      projects: projectQualityScore
    }
  };
}

export default function AtsAnalyzer({ resumeData }) {
  const { score, reports, details } = calculateAtsMetrics(resumeData);
  
  // Calculate SVG stroke offset
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColorClass = 'danger';
  let scoreColorHex = 'var(--danger)';
  if (score >= 80) {
    scoreColorClass = 'success';
    scoreColorHex = 'var(--success)';
  } else if (score >= 50) {
    scoreColorClass = 'warning';
    scoreColorHex = 'var(--warning)';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        
        {/* Progress Circle Card */}
        <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
          <div className="score-circle-container">
            <svg className="score-svg">
              <circle className="score-circle-bg" cx="60" cy="60" r={radius} />
              <circle 
                className="score-circle-progress" 
                cx="60" 
                cy="60" 
                r={radius} 
                style={{ 
                  strokeDasharray: circumference, 
                  strokeDashoffset: strokeDashoffset,
                  stroke: scoreColorHex
                }}
              />
            </svg>
            <div className="score-text">
              <span>{score}</span>
              <span className="score-percent">Score</span>
            </div>
          </div>
          <h3 style={{ marginBottom: '0.25rem' }}>ATS Match Rate</h3>
          <p style={{ fontSize: '0.85rem' }}>
            {score >= 80 ? 'Excellent! Ready to submit.' : score >= 50 ? 'Good, but needs refinement.' : 'Action required to pass parser filters.'}
          </p>
        </div>

        {/* Metrics Grid */}
        <div style={{ flex: '2 1 350px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
            Score Breakdown
          </h4>
          <div className="metric-row">
            <span>Contact Information</span>
            <span style={{ fontWeight: '600' }}>{details.contact} / 15</span>
          </div>
          <div className="metric-row">
            <span>Section Coverage</span>
            <span style={{ fontWeight: '600' }}>{details.sections} / 25</span>
          </div>
          <div className="metric-row">
            <span>Impact Action Verbs</span>
            <span style={{ fontWeight: '600' }}>{details.verbs} / 25</span>
          </div>
          <div className="metric-row">
            <span>Key Skill Densities</span>
            <span style={{ fontWeight: '600' }}>{details.skills} / 20</span>
          </div>
          <div className="metric-row">
            <span>Project Completeness</span>
            <span style={{ fontWeight: '600' }}>{details.projects} / 15</span>
          </div>
        </div>

      </div>

      {/* Recommendations Card */}
      <div className="card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', marginBottom: '1.25rem' }}>
          <Award size={20} style={{ color: 'var(--primary)' }} />
          ATS Scanner Optimization Feedback
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reports.map((report, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                alignItems: 'flex-start',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: report.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.05)' 
                  : report.type === 'warning' 
                    ? 'rgba(245, 158, 11, 0.05)' 
                    : 'rgba(239, 68, 68, 0.05)',
                border: report.type === 'success'
                  ? '1px solid rgba(16, 185, 129, 0.15)'
                  : report.type === 'warning'
                    ? '1px solid rgba(245, 158, 11, 0.15)'
                    : '1px solid rgba(239, 68, 68, 0.15)'
              }}
            >
              {report.type === 'success' && <CheckCircle2 size={18} style={{ color: 'var(--success)', marginTop: '0.1rem', flexShrink: 0 }} />}
              {report.type === 'warning' && <AlertTriangle size={18} style={{ color: 'var(--warning)', marginTop: '0.1rem', flexShrink: 0 }} />}
              {report.type === 'danger' && <XCircle size={18} style={{ color: 'var(--danger)', marginTop: '0.1rem', flexShrink: 0 }} />}
              
              <div>
                <span style={{ 
                  fontWeight: '600', 
                  fontSize: '0.8rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  color: report.type === 'success' ? '#a7f3d0' : report.type === 'warning' ? '#fde68a' : '#fca5a5',
                  display: 'block',
                  marginBottom: '0.15rem'
                }}>
                  {report.category}
                </span>
                <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--text-main)' }}>
                  {report.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
