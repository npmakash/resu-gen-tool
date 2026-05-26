import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, ExternalLink } from 'lucide-react';

export default function ProjectModal({ project, index, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [tech, setTech] = useState('');
  const [dates, setDates] = useState('');
  const [link, setLink] = useState('');
  const [bullets, setBullets] = useState(['']);

  // Sync state with project prop when it opens
  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setTech(project.tech || '');
      setDates(project.dates || '');
      setLink(project.link || '');
      setBullets(project.bullets && project.bullets.length > 0 ? [...project.bullets] : ['']);
    } else {
      // Clear for new project
      setTitle('');
      setTech('');
      setDates('');
      setLink('');
      setBullets(['']);
    }
  }, [project]);

  const handleAddBullet = () => {
    setBullets([...bullets, '']);
  };

  const handleBulletChange = (idx, value) => {
    const newBullets = [...bullets];
    newBullets[idx] = value;
    setBullets(newBullets);
  };

  const handleRemoveBullet = (idx) => {
    const newBullets = bullets.filter((_, i) => i !== idx);
    setBullets(newBullets.length === 0 ? [''] : newBullets);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert('Project Title is required.');
      return;
    }

    const updatedProject = {
      title,
      tech,
      dates,
      link,
      bullets: bullets.filter(b => b.trim() !== '')
    };

    onSave(updatedProject, index);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem' }}>
            {project ? `Edit Project: ${project.title}` : 'Add New Project'}
          </h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                placeholder="e.g. E-Commerce Platform Architecture"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Technologies Used</label>
                <input
                  type="text"
                  placeholder="e.g. React, Next.js, Node.js, Prisma"
                  className="form-input"
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dates / Duration</label>
                <input
                  type="text"
                  placeholder="e.g. Nov 2025 - Jan 2026"
                  className="form-input"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Project Link (GitHub / Demo URL)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  className="form-input"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                {link && (
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', color: 'var(--secondary)' }}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Project Description / Bullet Points</span>
                <button
                  type="button"
                  onClick={handleAddBullet}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                >
                  <Plus size={12} />
                  Add Bullet
                </button>
              </label>

              <div className="bullet-points-list">
                {bullets.map((bullet, idx) => (
                  <div className="bullet-point-item" key={idx}>
                    <input
                      type="text"
                      placeholder="Detail what you engineered, tools used, and results (e.g. Optimized bundle sizes by 32%...)"
                      className="form-input"
                      value={bullet}
                      onChange={(e) => handleBulletChange(idx, e.target.value)}
                      style={{ fontSize: '0.875rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', opacity: bullets.length === 1 && !bullet ? 0.3 : 1 }}
                      disabled={bullets.length === 1 && !bullet}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
