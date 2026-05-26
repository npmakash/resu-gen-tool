import React, { useState } from 'react';
import { User, GraduationCap, Briefcase, Code, Plus, Trash2, ChevronRight, HelpCircle } from 'lucide-react';

export default function ResumeForm({ data, onChange }) {
  const [activeTab, setActiveTab] = useState('personal');

  const updatePersonal = (field, value) => {
    const updated = {
      ...data,
      personal: {
        ...data.personal,
        [field]: value
      }
    };
    onChange(updated);
  };

  const updateSkills = (field, value) => {
    const updated = {
      ...data,
      skills: {
        ...data.skills,
        [field]: value
      }
    };
    onChange(updated);
  };

  // Education list handlers
  const addEducation = () => {
    const newEdu = { school: '', degree: '', major: '', dates: '', location: '', gpa: '' };
    const updated = {
      ...data,
      education: [...(data.education || []), newEdu]
    };
    onChange(updated);
  };

  const updateEducation = (idx, field, value) => {
    const list = [...(data.education || [])];
    list[idx] = { ...list[idx], [field]: value };
    const updated = { ...data, education: list };
    onChange(updated);
  };

  const removeEducation = (idx) => {
    const list = (data.education || []).filter((_, i) => i !== idx);
    const updated = { ...data, education: list };
    onChange(updated);
  };

  // Experience list handlers
  const addExperience = () => {
    const newExp = { company: '', role: '', dates: '', location: '', bullets: [''] };
    const updated = {
      ...data,
      experience: [...(data.experience || []), newExp]
    };
    onChange(updated);
  };

  const updateExperience = (idx, field, value) => {
    const list = [...(data.experience || [])];
    list[idx] = { ...list[idx], [field]: value };
    const updated = { ...data, experience: list };
    onChange(updated);
  };

  const removeExperience = (idx) => {
    const list = (data.experience || []).filter((_, i) => i !== idx);
    const updated = { ...data, experience: list };
    onChange(updated);
  };

  const addExperienceBullet = (expIdx) => {
    const list = [...(data.experience || [])];
    list[expIdx].bullets = [...(list[expIdx].bullets || []), ''];
    const updated = { ...data, experience: list };
    onChange(updated);
  };

  const updateExperienceBullet = (expIdx, bulletIdx, value) => {
    const list = [...(data.experience || [])];
    const bullets = [...(list[expIdx].bullets || [])];
    bullets[bulletIdx] = value;
    list[expIdx].bullets = bullets;
    const updated = { ...data, experience: list };
    onChange(updated);
  };

  const removeExperienceBullet = (expIdx, bulletIdx) => {
    const list = [...(data.experience || [])];
    const bullets = (list[expIdx].bullets || []).filter((_, i) => i !== bulletIdx);
    list[expIdx].bullets = bullets.length === 0 ? [''] : bullets;
    const updated = { ...data, experience: list };
    onChange(updated);
  };

  // Project list handlers
  const addProject = () => {
    const newProj = { title: '', tech: '', dates: '', link: '', bullets: [''] };
    const updated = {
      ...data,
      projects: [...(data.projects || []), newProj]
    };
    onChange(updated);
  };

  const updateProject = (idx, field, value) => {
    const list = [...(data.projects || [])];
    list[idx] = { ...list[idx], [field]: value };
    const updated = { ...data, projects: list };
    onChange(updated);
  };

  const removeProject = (idx) => {
    const list = (data.projects || []).filter((_, i) => i !== idx);
    const updated = { ...data, projects: list };
    onChange(updated);
  };

  const addProjectBullet = (projIdx) => {
    const list = [...(data.projects || [])];
    list[projIdx].bullets = [...(list[projIdx].bullets || []), ''];
    const updated = { ...data, projects: list };
    onChange(updated);
  };

  const updateProjectBullet = (projIdx, bulletIdx, value) => {
    const list = [...(data.projects || [])];
    const bullets = [...(list[projIdx].bullets || [])];
    bullets[bulletIdx] = value;
    list[projIdx].bullets = bullets;
    const updated = { ...data, projects: list };
    onChange(updated);
  };

  const removeProjectBullet = (projIdx, bulletIdx) => {
    const list = [...(data.projects || [])];
    const bullets = (list[projIdx].bullets || []).filter((_, i) => i !== bulletIdx);
    list[projIdx].bullets = bullets.length === 0 ? [''] : bullets;
    const updated = { ...data, projects: list };
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Sub-Tabs */}
      <div className="tab-container" style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('personal')}
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <User size={16} />
          Contact Info
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <GraduationCap size={16} />
          Education
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Briefcase size={16} />
          Experience
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Code size={16} />
          Projects
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Code size={16} />
          Skills
        </button>
      </div>

      {/* Tab Contents */}
      <div className="card">
        {/* PERSONAL DETAILS */}
        {activeTab === 'personal' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Personal Contact Info</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="form-input"
                  value={data.personal?.name || ''}
                  onChange={(e) => updatePersonal('name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="johndoe@example.com"
                  className="form-input"
                  value={data.personal?.email || ''}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  className="form-input"
                  value={data.personal?.phone || ''}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub Username (optional)</label>
                <input
                  type="text"
                  placeholder="johndoe"
                  className="form-input"
                  value={data.personal?.github || ''}
                  onChange={(e) => updatePersonal('github', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">LinkedIn Username (optional)</label>
                <input
                  type="text"
                  placeholder="johndoe-dev"
                  className="form-input"
                  value={data.personal?.linkedin || ''}
                  onChange={(e) => updatePersonal('linkedin', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio Website (optional)</label>
                <input
                  type="url"
                  placeholder="https://johndoe.com"
                  className="form-input"
                  value={data.personal?.website || ''}
                  onChange={(e) => updatePersonal('website', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Summary</label>
              <textarea
                placeholder="Highly motivated Software Engineer with 3+ years of experience engineering scalable web applications. Expert in React, Node.js, and cloud platforms..."
                className="form-textarea"
                value={data.personal?.summary || ''}
                onChange={(e) => updatePersonal('summary', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* EDUCATION */}
        {activeTab === 'education' && (
          <div>
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Educational History</h3>
              <button onClick={addEducation} className="btn btn-secondary btn-sm">
                <Plus size={16} />
                Add School
              </button>
            </div>

            {(!data.education || data.education.length === 0) ? (
              <p style={{ textAlign: 'center', padding: '2rem 0' }}>No education history added yet. Click 'Add School' above.</p>
            ) : (
              data.education.map((edu, idx) => (
                <div className="dynamic-item" key={idx}>
                  <div className="dynamic-item-header">
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Education #{idx + 1}</span>
                    <button onClick={() => removeEducation(idx)} className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">School / Institution</label>
                      <input
                        type="text"
                        placeholder="e.g. Stanford University"
                        className="form-input"
                        value={edu.school || ''}
                        onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Degree</label>
                      <input
                        type="text"
                        placeholder="e.g. Bachelor of Science"
                        className="form-input"
                        value={edu.degree || ''}
                        onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Field of Study / Major</label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science"
                        className="form-input"
                        value={edu.major || ''}
                        onChange={(e) => updateEducation(idx, 'major', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Stanford, CA"
                        className="form-input"
                        value={edu.location || ''}
                        onChange={(e) => updateEducation(idx, 'location', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Dates (Start - End)</label>
                      <input
                        type="text"
                        placeholder="e.g. Sep 2021 - Jun 2025"
                        className="form-input"
                        value={edu.dates || ''}
                        onChange={(e) => updateEducation(idx, 'dates', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">GPA (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 3.85 / 4.00"
                        className="form-input"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* EXPERIENCE */}
        {activeTab === 'experience' && (
          <div>
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Professional Experience</h3>
              <button onClick={addExperience} className="btn btn-secondary btn-sm">
                <Plus size={16} />
                Add Position
              </button>
            </div>

            {(!data.experience || data.experience.length === 0) ? (
              <p style={{ textAlign: 'center', padding: '2rem 0' }}>No work experience added yet. Click 'Add Position' above.</p>
            ) : (
              data.experience.map((exp, idx) => (
                <div className="dynamic-item" key={idx}>
                  <div className="dynamic-item-header">
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Work Experience #{idx + 1}</span>
                    <button onClick={() => removeExperience(idx)} className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Google"
                        className="form-input"
                        value={exp.company || ''}
                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Job Title / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Software Engineer II"
                        className="form-input"
                        value={exp.role || ''}
                        onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Dates Employed</label>
                      <input
                        type="text"
                        placeholder="e.g. Jun 2023 - Present"
                        className="form-input"
                        value={exp.dates || ''}
                        onChange={(e) => updateExperience(idx, 'dates', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Mountain View, CA"
                        className="form-input"
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Responsibilities & Accomplishments</span>
                      <button
                        type="button"
                        onClick={() => addExperienceBullet(idx)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                      >
                        <Plus size={12} />
                        Add Bullet
                      </button>
                    </label>

                    <div className="bullet-points-list">
                      {(exp.bullets || ['']).map((bullet, bulletIdx) => (
                        <div className="bullet-point-item" key={bulletIdx}>
                          <input
                            type="text"
                            placeholder="e.g. Spearheaded re-architecture of microservice stack, boosting performance by 25%."
                            className="form-input"
                            value={bullet}
                            onChange={(e) => updateExperienceBullet(idx, bulletIdx, e.target.value)}
                            style={{ fontSize: '0.875rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExperienceBullet(idx, bulletIdx)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Personal & Side Projects</h3>
              <button onClick={addProject} className="btn btn-secondary btn-sm">
                <Plus size={16} />
                Add Project
              </button>
            </div>

            {(!data.projects || data.projects.length === 0) ? (
              <p style={{ textAlign: 'center', padding: '2rem 0' }}>No projects added yet. Click 'Add Project' above or manage in the Dashboard table.</p>
            ) : (
              data.projects.map((proj, idx) => (
                <div className="dynamic-item" key={idx}>
                  <div className="dynamic-item-header">
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Project #{idx + 1}</span>
                    <button onClick={() => removeProject(idx)} className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g. AI-Powered Portfolio Optimizer"
                        className="form-input"
                        value={proj.title || ''}
                        onChange={(e) => updateProject(idx, 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Technologies Used</label>
                      <input
                        type="text"
                        placeholder="e.g. React, Python, OpenAI API, AWS"
                        className="form-input"
                        value={proj.tech || ''}
                        onChange={(e) => updateProject(idx, 'tech', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Dates / Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. Oct 2025 - Dec 2025"
                        className="form-input"
                        value={proj.dates || ''}
                        onChange={(e) => updateProject(idx, 'dates', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Project URL / Repository</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username/project"
                        className="form-input"
                        value={proj.link || ''}
                        onChange={(e) => updateProject(idx, 'link', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Project Features & Contributions</span>
                      <button
                        type="button"
                        onClick={() => addProjectBullet(idx)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                      >
                        <Plus size={12} />
                        Add Bullet
                      </button>
                    </label>

                    <div className="bullet-points-list">
                      {(proj.bullets || ['']).map((bullet, bulletIdx) => (
                        <div className="bullet-point-item" key={bulletIdx}>
                          <input
                            type="text"
                            placeholder="e.g. Designed interactive SVG layout displays which minimized load lag by 40%."
                            className="form-input"
                            value={bullet}
                            onChange={(e) => updateProjectBullet(idx, bulletIdx, e.target.value)}
                            style={{ fontSize: '0.875rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeProjectBullet(idx, bulletIdx)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SKILLS */}
        {activeTab === 'skills' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Technical Skills</h3>
            
            <div className="form-group">
              <label className="form-label">Programming Languages</label>
              <input
                type="text"
                placeholder="JavaScript, TypeScript, Python, Java, C++, SQL"
                className="form-input"
                value={data.skills?.languages || ''}
                onChange={(e) => updateSkills('languages', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Frameworks & Libraries</label>
              <input
                type="text"
                placeholder="React, React Native, Next.js, Node.js, Express, Django"
                className="form-input"
                value={data.skills?.frameworks || ''}
                onChange={(e) => updateSkills('frameworks', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Databases</label>
              <input
                type="text"
                placeholder="PostgreSQL, MongoDB, Redis, MySQL, DynamoDB"
                className="form-input"
                value={data.skills?.databases || ''}
                onChange={(e) => updateSkills('databases', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Developer Tools & Infrastructure</label>
              <input
                type="text"
                placeholder="Git, Docker, AWS, Google Cloud, CI/CD, Kubernetes, Vercel"
                className="form-input"
                value={data.skills?.tools || ''}
                onChange={(e) => updateSkills('tools', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Concepts & Methods</label>
              <input
                type="text"
                placeholder="Agile, RESTful APIs, System Design, Unit Testing, OOP"
                className="form-input"
                value={data.skills?.concepts || ''}
                onChange={(e) => updateSkills('concepts', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
