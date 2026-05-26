import React, { useState } from 'react';
import { 
  FileText, Code, CheckCircle, Clock, ExternalLink, 
  FolderGit2, Edit, Plus, Trash2, ShieldCheck, Eye, Sparkles, Folder
} from 'lucide-react';
import ResumeForm from './ResumeForm';
import AtsAnalyzer, { calculateAtsMetrics } from './AtsAnalyzer';
import LatexPreview from './LatexPreview';
import ProjectModal from './ProjectModal';

export default function Dashboard({ 
  user, 
  resumes = [], 
  activeResumeId, 
  resumeData, 
  onUpdateResume, 
  onSwitchResume, 
  onCreateResume, 
  onDeleteResume 
}) {
  const [activeTab, setActiveTab] = useState('edit'); // edit, ats, latex
  
  // Project Modal States
  const [editingProject, setEditingProject] = useState(null);
  const [editingProjectIdx, setEditingProjectIdx] = useState(-1);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // New Resume Title State
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [newResumeError, setNewResumeError] = useState('');

  // Calculate overview stats for active resume
  const atsResult = calculateAtsMetrics(resumeData);
  const projectCount = resumeData?.projects?.length || 0;
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!resumeData) return 0;
    let fields = 0;
    let filled = 0;
    
    const p = resumeData.personal || {};
    const personalFields = ['name', 'email', 'phone', 'summary', 'github', 'linkedin'];
    personalFields.forEach(f => {
      fields++;
      if (p[f] && p[f].trim().length > 0) filled++;
    });

    fields += 4;
    if (resumeData.education?.length > 0) filled++;
    if (resumeData.experience?.length > 0) filled++;
    if (resumeData.projects?.length > 0) filled++;
    
    const s = resumeData.skills || {};
    const hasSkills = s.languages || s.frameworks || s.databases || s.tools || s.concepts;
    if (hasSkills) filled++;

    return Math.round((filled / fields) * 100);
  };

  const completionPercent = calculateCompletion();

  // Create Resume Handler
  const handleCreateResumeSubmit = (e) => {
    e.preventDefault();
    setNewResumeError('');
    if (!newResumeTitle.trim()) {
      setNewResumeError('Portfolio title is required.');
      return;
    }
    onCreateResume(newResumeTitle.trim());
    setNewResumeTitle('');
  };

  // Project Modal Handlers
  const handleOpenProjectModal = (proj = null, idx = -1) => {
    setEditingProject(proj);
    setEditingProjectIdx(idx);
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setEditingProject(null);
    setEditingProjectIdx(-1);
    setIsProjectModalOpen(false);
  };

  const handleSaveProject = (updatedProject, idx) => {
    if (!resumeData) return;
    const projects = [...(resumeData.projects || [])];
    if (idx >= 0) {
      projects[idx] = updatedProject;
    } else {
      projects.push(updatedProject);
    }

    const updatedResume = {
      ...resumeData,
      projects
    };
    onUpdateResume(updatedResume);
    handleCloseProjectModal();
  };

  const handleDeleteProject = (idx, e) => {
    e.stopPropagation();
    if (!resumeData) return;
    if (confirm('Are you sure you want to delete this project?')) {
      const projects = (resumeData.projects || []).filter((_, i) => i !== idx);
      const updatedResume = {
        ...resumeData,
        projects
      };
      onUpdateResume(updatedResume);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
      
      {/* SIDEBAR: Portfolio Selector */}
      <aside className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
        
        {/* Header Stats */}
        <div>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <Folder size={18} style={{ color: 'var(--primary)' }} />
            My Portfolios
            <span className="badge" style={{ marginLeft: 'auto', background: 'var(--primary-glow)', color: '#c084fc', fontSize: '0.7rem' }}>
              {resumes.length} Active
            </span>
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Switch or create custom versions for different job descriptions.
          </p>
        </div>

        {/* Resumes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.2rem' }}>
          {resumes.map((res) => {
            const isActive = res._id === activeResumeId;
            return (
              <div 
                key={res._id}
                onClick={() => onSwitchResume(res._id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem', 
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                  <FileText size={14} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: isActive ? '600' : '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {res.title}
                  </span>
                </div>
                {resumes.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteResume(res._id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: isActive ? 0.7 : 0.3 }}
                    className="delete-resume-btn"
                    title="Delete resume portfolio"
                  >
                    <Trash2 size={12} style={{ color: 'var(--danger)' }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Create Resume Form */}
        <form onSubmit={handleCreateResumeSubmit} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="form-label" style={{ fontSize: '0.75rem' }}>Add New Version</label>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="text"
              placeholder="e.g. Backend Dev CV"
              className="form-input"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}
              value={newResumeTitle}
              onChange={(e) => setNewResumeTitle(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}>
              <Plus size={14} />
            </button>
          </div>
          {newResumeError && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>{newResumeError}</span>}
        </form>

      </aside>

      {/* MAIN CONTAINER: Workspace Dashboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Welcome Banner */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '1.5rem' 
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>
              Welcome back, <span style={{ color: 'var(--primary)' }}>{user.name}</span>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Currently editing version: <strong style={{ color: 'var(--secondary)' }}>{resumeData?.title || 'Loading...'}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => setActiveTab('latex')} 
              className="btn btn-outline btn-sm"
              style={{ borderColor: 'var(--primary)', color: '#a78bfa' }}
            >
              <Code size={16} />
              LaTeX Code
            </button>
            <button 
              onClick={() => handleOpenProjectModal(null, -1)} 
              className="btn btn-primary btn-sm"
              disabled={!resumeData}
            >
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-icon primary">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <h3>{completionPercent}%</h3>
              <p>Profile Completeness</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <ShieldCheck size={24} style={{ color: atsResult.score >= 80 ? 'var(--success)' : atsResult.score >= 50 ? 'var(--warning)' : 'var(--danger)' }} />
            </div>
            <div className="stat-info">
              <h3>{atsResult.score}</h3>
              <p>ATS Match Score</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon secondary">
              <FolderGit2 size={24} />
            </div>
            <div className="stat-info">
              <h3>{projectCount}</h3>
              <p>Portfolio Projects</p>
            </div>
          </div>
        </div>

        {/* Main Work Grid */}
        {resumeData ? (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left Workspace Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '1.5rem' }}>
                <button 
                  onClick={() => setActiveTab('edit')} 
                  className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
                  style={{ fontSize: '1.05rem', paddingBottom: '0.85rem' }}
                >
                  Resume Form Builder
                </button>
                <button 
                  onClick={() => setActiveTab('ats')} 
                  className={`tab-btn ${activeTab === 'ats' ? 'active' : ''}`}
                  style={{ fontSize: '1.05rem', paddingBottom: '0.85rem' }}
                >
                  ATS Optimization Scorer
                </button>
                <button 
                  onClick={() => setActiveTab('latex')} 
                  className={`tab-btn ${activeTab === 'latex' ? 'active' : ''}`}
                  style={{ fontSize: '1.05rem', paddingBottom: '0.85rem' }}
                >
                  LaTeX Generator
                </button>
              </div>

              <div>
                {activeTab === 'edit' && <ResumeForm data={resumeData} onChange={onUpdateResume} />}
                {activeTab === 'ats' && <AtsAnalyzer resumeData={resumeData} />}
                {activeTab === 'latex' && <LatexPreview resumeData={resumeData} />}
              </div>
            </div>

            {/* Right Project Sidebar Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.25rem' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FolderGit2 size={18} style={{ color: 'var(--secondary)' }} />
                    Projects Grid
                  </h3>
                  <button 
                    onClick={() => handleOpenProjectModal(null, -1)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--secondary)', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.2rem',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {projectCount === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                    <FolderGit2 size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No projects inputted yet.</p>
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Project Title</th>
                          <th>Stack</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumeData.projects.map((proj, idx) => (
                          <tr 
                            key={idx} 
                            onClick={() => handleOpenProjectModal(proj, idx)}
                            style={{ cursor: 'pointer' }}
                            title="Click to view & edit details in modal"
                          >
                            <td style={{ fontWeight: '600', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {proj.title || 'Untitled Project'}
                            </td>
                            <td style={{ maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {proj.tech ? (
                                <span className="badge" style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem' }}>{proj.tech.split(',')[0]}</span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.7rem' }}>None</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }} onClick={e => e.stopPropagation()}>
                                <button 
                                  onClick={() => handleOpenProjectModal(proj, idx)} 
                                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                  title="Open Project Details Form"
                                >
                                  <Eye size={14} style={{ color: 'var(--secondary)' }} />
                                </button>
                                <button 
                                  onClick={(e) => handleDeleteProject(idx, e)} 
                                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                  title="Delete Project"
                                >
                                  <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
                  💡 Click any project row to edit details in a dynamic form modal.
                </p>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p>Loading resume details...</p>
          </div>
        )}

      </div>

      {/* Project Details Modal */}
      {isProjectModalOpen && (
        <ProjectModal
          project={editingProject}
          index={editingProjectIdx}
          onClose={handleCloseProjectModal}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
}
