'use client';
// UI Version: 4.1 (Removed mobile hero image)

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function LoginContent() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect_to') || '/dashboard';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push(redirectTo);
    });
  }, [router, redirectTo]);

  const resetForm = () => {
    setName(''); setEmail(''); setPassword('');
    setMessage(''); setIsError(false);
  };

  const handleMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setIsError(true);
      setMessage('Please enter your email first');
      return;
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const body = tab === 'signup'
        ? { type: 'signup', name, email, password }
        : { type: 'password', email, password };

      const res = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setIsError(true);
        if (data.error === 'User already registered') {
          setMessage('This email is already registered. Please switch to the "Sign In" tab.');
        } else {
          setMessage(data.error || 'Something went wrong');
        }
        return;
      }

      // Set the session client-side with tokens from server
      if (data.accessToken && data.refreshToken) {
        await supabase.auth.setSession({
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
        });
      }

      router.push(redirectTo);
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        html, body { margin: 0; padding: 0; }

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .lp-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #f5f5f7;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .lp-container {
            background: url("/login-hero-laptop.png") no-repeat center center;
            background-size: cover;
          }
        }

        /* Card */
        .lp-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 30px 80px rgba(0,0,0,0.12);
          padding: 36px 36px 40px;
          box-sizing: border-box;
        }

        /* Logo / brand */
        .lp-brand {
          text-align: center;
          margin-bottom: 28px;
        }
        .lp-brand-logo {
          font-size: 22px;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.5px;
        }
        .lp-brand-logo span { color: #2563eb; }

        /* Tab switcher */
        .lp-tabs {
          display: flex;
          background: #f0f0f5;
          border-radius: 16px;
          padding: 4px;
          margin-bottom: 28px;
        }
        .lp-tab {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          background: transparent;
          color: #888;
        }
        .lp-tab.active {
          background: #fff;
          color: #111;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        /* Form heading */
        .lp-heading {
          font-size: 24px;
          font-weight: 800;
          color: #111;
          margin: 0 0 4px 0;
          letter-spacing: -0.5px;
        }
        .lp-subheading {
          font-size: 14px;
          color: #888;
          margin: 0 0 24px 0;
        }

        /* Inputs */
        .lp-field {
          margin-bottom: 14px;
        }
        .lp-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #555;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .lp-input-wrap {
          position: relative;
        }
        .lp-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          border: 1.5px solid #e8e8e8;
          background: #fafafa;
          color: #111;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .lp-input::placeholder { color: #bbb; }
        .lp-input:focus {
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .lp-eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #aaa;
          font-size: 17px;
          padding: 4px;
          line-height: 1;
        }

        /* Submit button */
        .lp-submit {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: none;
          background: #111;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          margin-top: 8px;
          font-family: inherit;
          letter-spacing: 0.2px;
        }
        .lp-submit:hover:not(:disabled) {
          background: #333;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        .lp-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* Message */
        .lp-msg {
          margin-top: 14px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }
        .lp-msg.err  { background: #fff0f0; color: #c00; }
        .lp-msg.ok   { background: #f0fff4; color: #007a3d; }
      `}} />

      <div className="lp-container">
        <div className="lp-card">

          {/* Brand */}
          <div className="lp-brand">
            <div className="lp-brand-logo">
              <Image 
                src="/uventerlogo.png" 
                alt="Uventer" 
                width={120} 
                height={40} 
                className="object-contain mx-auto"
                priority
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="lp-tabs">
            <button
              className={`lp-tab ${tab === 'signin' ? 'active' : ''}`}
              onClick={() => { setTab('signin'); resetForm(); }}
            >
              Sign In
            </button>
            <button
              className={`lp-tab ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => { setTab('signup'); resetForm(); }}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          {tab === 'signin' ? (
            <>
              <h1 className="lp-heading">Welcome back</h1>
              <p className="lp-subheading">Sign in to your Uventer account</p>
            </>
          ) : (
            <>
              <h1 className="lp-heading">Create account</h1>
              <p className="lp-subheading">Join Uventer and explore events</p>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <div className="lp-field">
                <label className="lp-label">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="lp-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoFocus={tab === 'signup'}
                />
              </div>
            )}

            <div className="lp-field">
              <label className="lp-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="lp-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus={tab === 'signin'}
              />
            </div>

            <div className="lp-field">
              <label className="lp-label">Password</label>
              <div className="lp-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={tab === 'signup' ? 'Minimum 6 characters' : 'Your password'}
                  className="lp-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={tab === 'signup' ? 6 : undefined}
                />
                <button
                  type="button"
                  className="lp-eye"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="lp-submit" disabled={loading}>
              {loading
                ? (tab === 'signup' ? 'Creating account…' : 'Signing in…')
                : (tab === 'signup' ? 'Create Account →' : 'Sign In →')
              }
            </button>

            {tab === 'signin' && redirectTo === '/admin' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
                  <span style={{ padding: '0 10px', fontSize: '12px', color: '#bbb', fontWeight: 600 }}>ADMIN PORTAL</span>
                  <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
                </div>
                
                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await fetch('/api/send-magic-link', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: 'digital@kitemediaconcept.com', redirectTo }),
                      });
                      const data = await res.json();
                      if (!res.ok || data.error) throw new Error(data.error);
                      setMessage('🛡️ Admin Magic Link sent to your inbox!');
                    } catch (err: any) {
                      setIsError(true);
                      setMessage(err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '2px solid #2563eb',
                    background: '#2563eb',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)',
                    marginBottom: '12px'
                  }}
                >
                  🛡️ Secure Admin Login
                </button>

                <button
                  type="button"
                  onClick={handleMagicLink}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '14px',
                    border: '1px solid #e8e8e8',
                    background: '#fff',
                    color: '#666',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ✉️ Standard Magic Link
                </button>
              </>
            )}

            {message && (
              <p className={`lp-msg ${isError ? 'err' : 'ok'}`}>{message}</p>
            )}
          </form>

        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f5f7'}}>
        <div style={{width:'36px',height:'36px',border:'3px solid #111',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
