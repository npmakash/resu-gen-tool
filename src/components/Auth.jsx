import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldAlert, LogIn, UserPlus, Info, CheckCircle } from 'lucide-react';
import { authService } from '../lib/firebase';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('credentials'); // credentials, otp-verify, forgot-password, forgot-otp-verify
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP States
  const [otp, setOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || (!isLogin && !name) || (isLogin && !password)) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.sendOtpCode(email, name, password, isLogin);
      setSuccess(response.message);
      
      // Store simulated OTP to help user test easily
      if (response.simulatedOtp) {
        setSimulatedOtp(response.simulatedOtp);
      }
      
      setTimeout(() => {
        setStep('otp-verify');
        setSuccess('');
      }, 1200);

    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!otp) {
      setError('Please enter the 6-digit code.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.verifyOtpCode(email, otp);
      setSuccess('Verification successful!');
      
      // Save session
      localStorage.setItem('resume_system_active_user', JSON.stringify({
        email: response.user.email,
        name: response.user.name,
        id: response.user.id
      }));

      setTimeout(() => {
        onAuthSuccess(response.user);
      }, 1000);

    } catch (err) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendForgotPasswordOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Email address is required.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.sendPasswordResetOtp(email);
      setSuccess(response.message);
      
      if (response.simulatedOtp) {
        setSimulatedOtp(response.simulatedOtp);
      }
      
      setTimeout(() => {
        setStep('forgot-otp-verify');
        setSuccess('');
      }, 1200);

    } catch (err) {
      setError(err.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!otp || !newPassword) {
      setError('Please fill in all reset fields.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.confirmPasswordResetOtp(email, otp, newPassword);
      setSuccess(response.message);
      
      setTimeout(() => {
        setStep('credentials');
        setIsLogin(true);
        setPassword(newPassword);
        setOtp('');
        setSimulatedOtp('');
        setSuccess('');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        
        {/* Auth Header */}
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', marginBottom: '1rem' }}>
            {step.includes('forgot') ? <Mail size={32} /> : isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
          </div>
          <h2 className="auth-title">
            {step === 'credentials' && (isLogin ? 'Welcome Back' : 'Create Account')}
            {step === 'otp-verify' && 'Verify Email'}
            {step === 'forgot-password' && 'Forgot Password'}
            {step === 'forgot-otp-verify' && 'Reset Password'}
          </h2>
          <p style={{ fontSize: '0.875rem' }}>
            {step === 'credentials' && (isLogin ? 'Sign in to manage your resume portfolios' : 'Start optimization of your ATS and LaTeX CV')}
            {step === 'otp-verify' && `We've sent a 6-digit code to ${email}`}
            {step === 'forgot-password' && 'Recover access to your portfolio builder'}
            {step === 'forgot-otp-verify' && 'Verify verification code and enter new password'}
          </p>
        </div>

        {/* Alert Cards */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#a7f3d0', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* MOCK DEV HELPER (OTP DISPLAY) */}
        {simulatedOtp && (step === 'otp-verify' || step === 'forgot-otp-verify') && (
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', color: '#9eeaf9', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <Info size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.1rem' }}>Local Testing Companion</strong>
              The system generated a 6-digit OTP: <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', fontWeight: '800', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.4rem', borderRadius: '4px', color: '#ffffff' }}>{simulatedOtp}</span> (printed also in terminal logs).
            </div>
          </div>
        )}

        {/* 1. CREDENTIALS SCREEN */}
        {step === 'credentials' && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLogin && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="form-input"
                    style={{ paddingLeft: '2.75rem' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setStep('forgot-password'); setError(''); setSuccess(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.25rem', width: '100%', height: '2.75rem' }}>
              {loading ? 'Sending Verification...' : isLogin ? 'Send Login OTP' : 'Send Signup OTP'}
            </button>
          </form>
        )}

        {/* 2. OTP VERIFICATION SCREEN */}
        {step === 'otp-verify' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Verification Code (OTP)</label>
              <input
                type="text"
                maxLength="6"
                placeholder="123456"
                className="form-input"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '2.75rem' }}>
              {loading ? 'Verifying OTP...' : 'Verify & Log In'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('credentials'); setOtp(''); setSimulatedOtp(''); setError(''); }}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              Go Back
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD REQUEST SCREEN */}
        {step === 'forgot-password' && (
          <form onSubmit={handleSendForgotPasswordOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '2.75rem' }}>
              {loading ? 'Sending Code...' : 'Send Reset OTP'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('credentials'); setIsLogin(true); setError(''); setSuccess(''); }}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              Back to Login
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD RESET SCREEN */}
        {step === 'forgot-otp-verify' && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Verification Code (OTP)</label>
              <input
                type="text"
                maxLength="6"
                placeholder="123456"
                className="form-input"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '2.75rem' }}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('forgot-password'); setOtp(''); setSimulatedOtp(''); setError(''); }}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              Go Back
            </button>
          </form>
        )}

        {/* Footer Toggle */}
        {step === 'credentials' && (
          <div className="auth-toggle">
            <span style={{ color: 'var(--text-muted)' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
