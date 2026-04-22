'use client';
// UI Version: 2.1 (Black button, No lines, Desktop Footer, Laptop BG)

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
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Desktop specific background */
        @media (min-width: 768px) {
          .lp-container {
            background: url("/login-hero-laptop.png") no-repeat center center;
            background-size: cover;
          }
        }

        /* Login Card Area */
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

        .lp-top-btn button {
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
        }

        @media (min-width: 768px) {
          .lp-top-btn button {
            width: 100%;
            max-width: none;
          }
        }

        .lp-top-btn button:hover {
          transform: translateY(-2px);
          background: #333 !important;
        }

        .lp-email-input {
          width: 85%;
          max-width: 340px;
          padding: 18px 28px;
          border-radius: 50px;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(0,0,0,0.05);
          color: #000;
          font-size: 16px;
          outline: none;
          margin-bottom: 15px;
        }

        @media (min-width: 768px) {
          .lp-email-input {
            width: 100%;
            max-width: none;
          }
        }

        .lp-email-input::placeholder { color: rgba(0,0,0,0.4); }

        .lp-login-text {
          color: rgba(0,0,0,0.5);
          font-size: 14px;
          margin-top: 20px;
          cursor: pointer;
          font-weight: 500;
        }

        .lp-login-text:hover { color: #000; }

        .lp-divider {
          display: flex;
          align-items: center;
          width: 85%;
          max-width: 340px;
          margin: 30px 0;
        }

        @media (min-width: 768px) {
          .lp-divider {
            width: 100%;
            max-width: none;
          }
        }

        .lp-divider::before,
        .lp-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #eee;
        }

        .lp-divider span {
          padding: 0 20px;
          color: #bbb;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .lp-message {
          color: #000;
          font-size: 14px;
          margin-top: 12px;
          text-align: center;
          padding: 0 20px;
        }

        /* Social Login */
        .lp-social {
          display: flex;
          justify-content: center;
          gap: 25px;
          z-index: 10;
        }

        .lp-icon {
          width: 60px;
          height: 60px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          cursor: pointer;
          font-weight: bold;
          border: 1px solid #f2f2f2;
          transition: 0.2s;
        }

        .lp-icon:hover { transform: scale(1.05); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .lp-icon.google { color: #DB4437; }
        .lp-icon.facebook { color: #4267B2; }

        /* Bottom Hero Image (Mobile) */
        .lp-hero {
          position: absolute;
          bottom: 0;
          width: 100%;
          z-index: 5;
        }

        @media (min-width: 768px) {
          .lp-hero { display: none; }
        }

        .lp-hero img {
          width: 100%;
          object-fit: cover;
          display: block;
        }

        /* Desktop Footer */
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

        @media (min-width: 768px) {
          .lp-footer { display: block; }
        }

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
      `}} />

      {/* LOGIN UI */}
      <div className="lp-container">

        {/* Top button / email form area */}
        <div className="lp-top-btn">
          {!showEmailInput ? (
            <>
              <button onClick={() => setShowEmailInput(true)}>
                Create new account →
              </button>
              <p className="lp-login-text" onClick={() => setShowEmailInput(true)}>
                I already have an account
              </p>

              <div className="lp-divider">
                <span>OR</span>
              </div>

              <div className="lp-social">
                <div className="lp-icon apple">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                  </svg>
                </div>
                <div className="lp-icon google">G</div>
                <div className="lp-icon facebook">f</div>
              </div>
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

        {/* Bottom hero image (visible on mobile only) */}
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
        <div style={{width:'40px', height:'40px', border:'3px solid #ff7a2f', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
