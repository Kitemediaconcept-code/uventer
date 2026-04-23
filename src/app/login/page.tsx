'use client';
// UI Version: 3.0 (Email + Password login, server-side auth)

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const [mode, setMode] = useState<'options' | 'password' | 'magic'>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect_to') || '/';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(redirectTo);
      }
    };
    checkUser();
  }, [router, redirectTo]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      const res = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type: 'password' }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setIsError(true);
        throw new Error(data.error || `Error ${res.status}`);
      }
      // Set session in supabase client using tokens from server
      await supabase.auth.setSession({
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
      });
      router.push(redirectTo);
    } catch (error: any) {
      setIsError(true);
      setMessage(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      const res = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setIsError(true);
        throw new Error(data.error || `Error ${res.status}`);
      }
      setMessage('✉️ Check your email for the login link!');
    } catch (error: any) {
      setIsError(true);
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        html, body { margin: 0; padding: 0; }

        .lp-container {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #fff;
          overflow: hidden;
          font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @media (min-width: 768px) {
          .lp-container {
            background: url("/login-hero-laptop.png") no-repeat center center;
            background-size: cover;
          }
        }

        .lp-top-btn {
          position: relative;
          margin-top: 60px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          gap: 0;
        }

        @media (min-width: 768px) {
          .lp-top-btn {
            margin-top: 15vh;
            background: rgba(255, 255, 255, 0.4);
            padding: 50px 40px;
            border-radius: 50px;
            width: auto;
            min-width: 440px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.1);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        }

        .lp-btn-primary {
          background: #000 !important;
          border: none;
          padding: 18px 40px;
          border-radius: 50px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: 0.3s;
          width: 85%;
          max-width: 340px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        @media (min-width: 768px) {
          .lp-btn-primary { width: 100%; max-width: none; }
        }

        .lp-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #333 !important;
        }

        .lp-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lp-btn-secondary {
          background: transparent !important;
          border: 1.5px solid rgba(0,0,0,0.15);
          padding: 16px 40px;
          border-radius: 50px;
          color: #333;
          font-size: 15px;
          cursor: pointer;
          transition: 0.3s;
          width: 85%;
          max-width: 340px;
          font-weight: 500;
          margin-top: 12px;
        }

        @media (min-width: 768px) {
          .lp-btn-secondary { width: 100%; max-width: none; }
        }

        .lp-btn-secondary:hover {
          background: rgba(0,0,0,0.04) !important;
          border-color: rgba(0,0,0,0.3);
        }

        .lp-input-wrap {
          position: relative;
          width: 85%;
          max-width: 340px;
          margin-bottom: 14px;
        }

        @media (min-width: 768px) {
          .lp-input-wrap { width: 100%; max-width: none; }
        }

        .lp-email-input {
          width: 100%;
          padding: 18px 28px;
          border-radius: 50px;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(0,0,0,0.05);
          color: #000;
          font-size: 16px;
          outline: none;
          box-sizing: border-box;
        }

        .lp-email-input::placeholder { color: rgba(0,0,0,0.4); }

        .lp-email-input:focus {
          border-color: rgba(0,0,0,0.25);
          background: rgba(0,0,0,0.03);
        }

        .lp-eye-btn {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(0,0,0,0.4);
          font-size: 18px;
          padding: 4px;
        }

        .lp-login-text {
          color: rgba(0,0,0,0.5);
          font-size: 14px;
          margin-top: 16px;
          cursor: pointer;
          font-weight: 500;
        }
        .lp-login-text:hover { color: #000; }

        .lp-divider {
          display: flex;
          align-items: center;
          width: 85%;
          max-width: 340px;
          margin: 24px 0;
        }

        @media (min-width: 768px) {
          .lp-divider { width: 100%; max-width: none; }
        }

        .lp-divider::before, .lp-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #eee;
        }

        .lp-divider span {
          padding: 0 16px;
          color: #bbb;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .lp-message {
          font-size: 14px;
          margin-top: 14px;
          text-align: center;
          padding: 10px 20px;
          border-radius: 12px;
          width: 85%;
          max-width: 340px;
          box-sizing: border-box;
        }

        .lp-message.error {
          color: #c00;
          background: rgba(200,0,0,0.06);
        }

        .lp-message.success {
          color: #007a3d;
          background: rgba(0,122,61,0.06);
        }

        @media (min-width: 768px) {
          .lp-message { width: 100%; max-width: none; }
        }

        .lp-hero {
          position: absolute;
          bottom: 0;
          width: 100%;
          z-index: 5;
        }

        @media (min-width: 768px) { .lp-hero { display: none; } }

        .lp-hero img { width: 100%; object-fit: cover; display: block; }

        .lp-footer {
          display: none;
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          padding: 20px 40px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        @media (min-width: 768px) { .lp-footer { display: block; } }

        .lp-footer p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          margin: 0 0 8px 0;
        }

        .lp-footer-links {
          display: flex;
          justify-content: center;
          gap: 30px;
        }

        .lp-footer-links span {
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
        }

        .lp-footer-links span:hover { color: #fff; }

        .lp-title {
          font-size: 22px;
          font-weight: 700;
          color: #111;
          margin: 0 0 6px 0;
          text-align: center;
        }

        .lp-subtitle {
          font-size: 14px;
          color: rgba(0,0,0,0.45);
          margin: 0 0 28px 0;
          text-align: center;
        }
      `}} />

      <div className="lp-container">
        <div className="lp-top-btn">

          {/* --- DEFAULT OPTIONS VIEW --- */}
          {mode === 'options' && (
            <>
              <p className="lp-title">Welcome Back</p>
              <p className="lp-subtitle">Sign in to your Uventer account</p>
              <button className="lp-btn-primary" onClick={() => { setMode('password'); setMessage(''); }}>
                Sign in with Password →
              </button>
              <div className="lp-divider"><span>OR</span></div>
              <button className="lp-btn-secondary" onClick={() => { setMode('magic'); setMessage(''); }}>
                ✉️ Send Magic Link
              </button>
            </>
          )}

          {/* --- PASSWORD LOGIN VIEW --- */}
          {mode === 'password' && (
            <>
              <p className="lp-title">Sign In</p>
              <p className="lp-subtitle">Enter your email and password</p>
              <form onSubmit={handlePasswordLogin} style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
                <div className="lp-input-wrap">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="lp-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="lp-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="lp-email-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="lp-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <button type="submit" className="lp-btn-primary" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In →'}
                </button>
                {message && <p className={`lp-message ${isError ? 'error' : 'success'}`}>{message}</p>}
              </form>
              <div className="lp-divider"><span>OR</span></div>
              <button className="lp-btn-secondary" onClick={() => { setMode('magic'); setEmail(''); setMessage(''); }}>
                ✉️ Use Magic Link instead
              </button>
              <p className="lp-login-text" onClick={() => { setMode('options'); setMessage(''); }}>← Back</p>
            </>
          )}

          {/* --- MAGIC LINK VIEW --- */}
          {mode === 'magic' && (
            <>
              <p className="lp-title">Magic Link</p>
              <p className="lp-subtitle">We'll email you a sign-in link</p>
              <form onSubmit={handleMagicLink} style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
                <div className="lp-input-wrap">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="lp-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <button type="submit" className="lp-btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Login Link →'}
                </button>
                {message && <p className={`lp-message ${isError ? 'error' : 'success'}`}>{message}</p>}
              </form>
              <div className="lp-divider"><span>OR</span></div>
              <button className="lp-btn-secondary" onClick={() => { setMode('password'); setEmail(''); setMessage(''); }}>
                🔒 Sign in with Password instead
              </button>
              <p className="lp-login-text" onClick={() => { setMode('options'); setMessage(''); }}>← Back</p>
            </>
          )}

        </div>

        {/* Bottom hero image (mobile only) */}
        <div className="lp-hero">
          <img src="/hero-mobile.png" alt="Community" />
        </div>

        {/* Desktop Footer */}
        <div className="lp-footer">
          <p>© 2026 Uventer. Empowering your next unforgettable moment.</p>
          <div className="lp-footer-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Help Center</span>
            <span>Contact Us</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff'}}>
        <div style={{width:'40px', height:'40px', border:'3px solid #000', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
