import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { Sparkles, LogOut, Info } from 'lucide-react';
import { api } from './lib/api';

export default function App() {
  const [activeUser, setActiveUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState('');

  // 1. Initial Session Check
  useEffect(() => {
    const checkSession = async () => {
      const session = localStorage.getItem('resume_system_active_user');
      if (session) {
        try {
          const parsedUser = JSON.parse(session);
          setActiveUser(parsedUser);
          await loadUserResumes(parsedUser.id);
        } catch (err) {
          console.error("Session restored failed:", err);
          localStorage.removeItem('resume_system_active_user');
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  // Helper to load all resumes for a user from MongoDB backend
  const loadUserResumes = async (userId) => {
    try {
      setDbError('');
      const list = await api.resumes.list(userId);
      setResumes(list);
      
      if (list.length > 0) {
        // Default to the first resume (newest updated due to backend sort)
        setResumeData(list[0]);
        setActiveResumeId(list[0]._id);
      } else {
        setResumeData(null);
        setActiveResumeId(null);
      }
    } catch (err) {
      setDbError('Cannot connect to local database server. Make sure MongoDB and backend server are running.');
      console.error(err);
    }
  };

  const handleAuthSuccess = async (userRecord) => {
    setActiveUser(userRecord);
    setLoading(true);
    await loadUserResumes(userRecord.id);
    setLoading(false);
  };

  // 2. Switch Active Resume Version
  const handleSwitchResume = (resumeId) => {
    const selected = resumes.find(r => r._id === resumeId);
    if (selected) {
      setActiveResumeId(resumeId);
      setResumeData(selected);
    }
  };

  // 3. Create a New Resume Version
  const handleCreateResume = async (title) => {
    if (!activeUser) return;
    try {
      const newResume = await api.resumes.create(activeUser.id, title);
      
      // Update state
      const updatedList = [newResume, ...resumes];
      setResumes(updatedList);
      
      // Auto-switch to new resume
      setActiveResumeId(newResume._id);
      setResumeData(newResume);
    } catch (err) {
      alert(err.message || 'Failed to create resume version.');
    }
  };

  // 4. Update Resume Form Content (Debounced or instant triggers)
  const handleUpdateResume = async (updatedResumeData) => {
    if (!activeUser || !activeResumeId) return;

    // Reactively update local state for snappy typing/rendering
    setResumeData(updatedResumeData);
    
    // Update matching record in the resumes list
    setResumes(prevList => 
      prevList.map(r => r._id === activeResumeId ? updatedResumeData : r)
    );

    // Save changes to MongoDB database in backend
    try {
      await api.resumes.update(activeUser.id, activeResumeId, updatedResumeData);
    } catch (err) {
      console.error("Failed saving resume updates to database:", err);
    }
  };

  // 5. Delete Resume Version
  const handleDeleteResume = async (resumeId) => {
    if (!activeUser) return;
    try {
      await api.resumes.delete(activeUser.id, resumeId);
      
      const updatedList = resumes.filter(r => r._id !== resumeId);
      setResumes(updatedList);

      // If we deleted the active resume, switch active target
      if (activeResumeId === resumeId) {
        if (updatedList.length > 0) {
          setActiveResumeId(updatedList[0]._id);
          setResumeData(updatedList[0]);
        } else {
          setActiveResumeId(null);
          setResumeData(null);
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to delete resume version.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('resume_system_active_user');
    setActiveUser(null);
    setResumes([]);
    setResumeData(null);
    setActiveResumeId(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-muted)' }}>
        <p>Loading application session...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="navbar flex-between">
        <div className="nav-logo">
          <Sparkles size={24} style={{ color: 'var(--primary)' }} />
          <span>ResuVerse</span>
        </div>
        
        {activeUser && (
          <div className="nav-user">
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
              Logged in as <strong style={{ color: 'var(--text-main)' }}>{activeUser.name}</strong>
            </span>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem' }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Database connection failure notice */}
      {dbError && (
        <div style={{ padding: '0.75rem 2rem', background: 'rgba(239, 68, 68, 0.2)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
          <Info size={16} style={{ flexShrink: 0 }} />
          <span>{dbError}</span>
        </div>
      )}

      {/* Workspace Hub */}
      <main className="main-content">
        {activeUser ? (
          <Dashboard 
            user={activeUser}
            resumes={resumes}
            activeResumeId={activeResumeId}
            resumeData={resumeData}
            onUpdateResume={handleUpdateResume}
            onSwitchResume={handleSwitchResume}
            onCreateResume={handleCreateResume}
            onDeleteResume={handleDeleteResume}
          />
        ) : (
          <Auth onAuthSuccess={handleAuthSuccess} />
        )}
      </main>
    </div>
  );
}
