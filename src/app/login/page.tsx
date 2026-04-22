'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
        },
      });

      if (error) throw error;
      setMessage('Check your email for the login link!');
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <style dangerouslySetInnerHTML={{__html: `
        .login-page-container {
          background: #f5f5f5;
          min-height: 100vh;
          font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .login-page-container .hero {
          height: 70vh;
          background: url("/hero-mobile.png") no-repeat center/cover;
          position: relative;
        }

        .login-page-container .overlay {
          height: 100%;
          width: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }

        .login-page-container .content h1 {
          color: #fff;
          font-size: 26px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0;
        }

        .login-page-container .subtext {
          color: #ddd;
          margin-top: 6px;
          font-size: 12px;
          line-height: 1.4;
          max-width: 280px;
        }

        .login-page-container .login-card {
          background: #fff;
          margin-top: -40px;
          border-radius: 25px 25px 0 0;
          padding: 25px 20px;
          text-align: center;
          box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
          flex-grow: 1;
        }

        .login-page-container .primary-btn {
          width: 100%;
          padding: 16px;
          background: #e07b39;
          color: #fff;
          border: none;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }

        .login-page-container .login-text {
          margin: 15px 0;
          color: #777;
          font-size: 14px;
          cursor: pointer;
        }

        .login-page-container .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 15px 0;
        }

        .login-page-container .divider::before,
        .login-page-container .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #ddd;
        }

        .login-page-container .divider span {
          margin: 0 10px;
          color: #999;
          font-size: 12px;
        }

        .login-page-container .social-login {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .login-page-container .icon-btn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: 1px solid #eee;
          background: #fff;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-page-container .email-input {
          width: 100%;
          padding: 16px;
          margin-bottom: 15px;
          border-radius: 30px;
          border: 1px solid #eee;
          font-size: 16px;
          outline: none;
        }
      `}} />

      {/* HERO SECTION */}
      <div className="hero md:hidden">
        <div className="overlay">
          <div className="content">
            <h1>Discover & Create Events Around You</h1>
            <p className="subtext">
              Join our platform to explore events happening in your area or create your own and share them with the community.
            </p>
          </div>
        </div>
      </div>

      {/* LOGIN / BUTTON CARD */}
      <div className="login-card md:hidden">
        {!showEmailInput ? (
          <>
            <button className="primary-btn" onClick={() => setShowEmailInput(true)}>
              Create new account →
            </button>
            <p className="login-text" onClick={() => setShowEmailInput(true)}>
              I already have an account
            </p>
          </>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter your email"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Login Link →'}
            </button>
            {message && <p style={{marginTop: '10px', color: '#e07b39', fontSize: '14px'}}>{message}</p>}
            <p className="login-text" onClick={() => setShowEmailInput(false)}>
              Back
            </p>
          </form>
        )}

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button className="icon-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/>
              <path d="M10 2c1 .5 2 2 2 3"/>
            </svg>
          </button>
          <button className="icon-btn" style={{color: '#DB4437', fontWeight: 'bold'}}>G</button>
          <button className="icon-btn" style={{color: '#4267B2', fontWeight: 'bold'}}>f</button>
        </div>
      </div>

      {/* Desktop fallback */}
      <div className="hidden md:flex flex-col items-center justify-center min-h-screen p-12 text-center bg-white">
        <h2 className="text-2xl font-bold mb-4">Mobile Experience Only</h2>
        <p className="text-gray-500">Please access this page from a mobile device.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-8 px-6 py-3 bg-[#e07b39] text-white rounded-full font-bold"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e07b39]"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
