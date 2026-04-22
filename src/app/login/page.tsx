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
        options: { emailRedirectTo: `${window.location.origin}${redirectTo}` },
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
        }

        /* Top Button */
        .lp-top-btn {
          position: absolute;
          top: 60px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          gap: 0;
        }

        .lp-top-btn button {
          background: linear-gradient(135deg, #ff7a2f, #ff9a4d);
          border: none;
          padding: 16px 40px;
          border-radius: 50px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(255, 122, 47, 0.4);
          transition: 0.3s;
          width: 80%;
          max-width: 320px;
        }

        .lp-top-btn button:hover {
          transform: translateY(-2px);
        }

        .lp-email-input {
          width: 80%;
          max-width: 320px;
          padding: 16px 24px;
          border-radius: 50px;
          border: 1px solid rgba(0,0,0,0.12);
          background: rgba(0,0,0,0.04);
          color: #111;
          font-size: 15px;
          outline: none;
          margin-bottom: 12px;
        }

        .lp-email-input::placeholder { color: rgba(0,0,0,0.35); }

        .lp-login-text {
          color: rgba(0,0,0,0.45);
          font-size: 13px;
          margin-top: 14px;
          cursor: pointer;
          text-decoration: underline;
        }

        .lp-message {
          color: #ff7a2f;
          font-size: 13px;
          margin-top: 10px;
          text-align: center;
          padding: 0 20px;
        }

        /* Social Login */
        .lp-social {
          position: absolute;
          top: 190px;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 20px;
          z-index: 10;
        }

        .lp-icon {
          width: 55px;
          height: 55px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          cursor: pointer;
          font-weight: bold;
        }

        .lp-icon.google { color: #DB4437; }
        .lp-icon.facebook { color: #4267B2; }

        /* Network Background Lines */
        .lp-network span {
          position: absolute;
          width: 120px;
          height: 3px;
          background: rgba(0,0,0,0.08);
          border-radius: 2px;
          z-index: 1;
        }
        .lp-network span:nth-child(1) { top: 280px; left: 10%; transform: rotate(45deg); }
        .lp-network span:nth-child(2) { top: 280px; right: 10%; transform: rotate(-45deg); }
        .lp-network span:nth-child(3) { top: 350px; left: 22%; transform: rotate(-25deg); }
        .lp-network span:nth-child(4) { top: 350px; right: 22%; transform: rotate(25deg); }

        /* Bottom Hero Image */
        .lp-hero {
          position: absolute;
          bottom: 0;
          width: 100%;
          z-index: 5;
        }

        .lp-hero img {
          width: 100%;
          object-fit: cover;
          display: block;
        }

        /* Desktop fallback */
        .lp-desktop {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #fff;
          text-align: center;
          padding: 48px;
        }

        @media (min-width: 768px) {
          .lp-container { display: none; }
          .lp-desktop { display: flex; }
        }
      `}} />

      {/* MOBILE LOGIN UI */}
      <div className="lp-container">

        {/* Top button / email form */}
        <div className="lp-top-btn">
          {!showEmailInput ? (
            <>
              <button onClick={() => setShowEmailInput(true)}>
                Create new account →
              </button>
              <p className="lp-login-text" onClick={() => setShowEmailInput(true)}>
                I already have an account
              </p>
            </>
          ) : (
            <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
              <input
                type="email"
                placeholder="Enter your email"
                className="lp-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Login Link →'}
              </button>
              {message && <p className="lp-message">{message}</p>}
              <p className="lp-login-text" onClick={() => setShowEmailInput(false)}>← Back</p>
            </form>
          )}
        </div>

        {/* Social Icons */}
        <div className="lp-social">
          <div className="lp-icon apple">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
            </svg>
          </div>
          <div className="lp-icon google">G</div>
          <div className="lp-icon facebook">f</div>
        </div>

        {/* Network decorative lines */}
        <div className="lp-network">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Bottom hero image */}
        <div className="lp-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero-mobile.png" alt="Community" />
        </div>

      </div>

      {/* DESKTOP FALLBACK */}
      <div className="lp-desktop">
        <h2 style={{fontSize:'24px', fontWeight:'bold', marginBottom:'12px'}}>Mobile Experience Only</h2>
        <p style={{color:'#666', marginBottom:'32px'}}>Please access this page from a mobile device.</p>
        <button
          onClick={() => router.push('/')}
          style={{padding:'14px 32px', background:'#ff7a2f', color:'#fff', border:'none', borderRadius:'50px', fontSize:'15px', fontWeight:'600', cursor:'pointer'}}
        >
          Go Back Home
        </button>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff'}}>
        <div style={{width:'40px', height:'40px', border:'3px solid #ff7a2f', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
