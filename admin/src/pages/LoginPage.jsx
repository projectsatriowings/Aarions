import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight, Lock, Mail, Leaf } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    if (res && res.success) {
      navigate("/");
    } else {
      setError((res && res.message) || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', sans-serif;
          background: #1a0e08;
        }

        /* ── LEFT PANEL ── */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1a0e08 0%, #2b170c 50%, #1a0e08 100%);
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(139, 30, 26, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 80%, rgba(200, 135, 15, 0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .login-left::after {
          content: '';
          position: absolute;
          top: -200px; right: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(139, 30, 26, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulseGlow 6s ease-in-out infinite alternate;
        }

        @keyframes pulseGlow {
          from { transform: scale(1); opacity: 0.6; }
          to   { transform: scale(1.2); opacity: 1; }
        }

        /* floating grid lines */
        .grid-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.04;
          background-image:
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .left-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .left-logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #8B1E1A, #C8870F);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(139, 30, 26, 0.22);
        }

        .left-logo-text {
          font-size: 18px;
          font-weight: 700;
          color: #fff8ec;
          letter-spacing: -0.3px;
        }

        .left-logo-text span { color: #8B1E1A; }

        .left-hero {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 0;
        }

        .left-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(232, 163, 23, 0.15);
          border: 1px solid rgba(232, 163, 23, 0.3);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 600;
          color: #FFAE42;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          width: fit-content;
          margin-bottom: 24px;
        }

        .left-h1 {
          font-size: clamp(32px, 3.5vw, 46px);
          font-weight: 800;
          color: #fff8ec;
          line-height: 1.15;
          letter-spacing: -1px;
          margin-bottom: 18px;
        }

        .left-h1 span {
          background: linear-gradient(90deg, #FFC533, #FF8E25);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .left-desc {
          font-size: 15px;
          color: rgba(255, 248, 236, 0.9);
          line-height: 1.7;
          max-width: 340px;
          margin-bottom: 40px;
        }

        .left-stats {
          display: flex;
          gap: 32px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-size: 22px;
          font-weight: 700;
          color: #fff8ec;
          letter-spacing: -0.5px;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255, 248, 236, 0.75);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.07);
          align-self: stretch;
        }

        .left-footer {
          position: relative;
          z-index: 2;
          font-size: 12px;
          color: rgba(255, 248, 236, 0.65);
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          width: 480px;
          min-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 48px;
          background: #fffdf8;
          border-left: 1px solid #e2d0bf;
          position: relative;
        }

        .login-right::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(180deg, #8B1E1A 0%, #C8870F 50%, transparent 100%);
          opacity: .55;
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 360px;
        }

        /* Card header */
        .card-icon-wrap {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, rgba(139, 30, 26, 0.15), rgba(200, 135, 15, 0.1));
          border: 1px solid rgba(139, 30, 26, 0.25);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 0 30px rgba(139, 30, 26, 0.12);
        }

        .card-title {
          font-size: 26px;
          font-weight: 800;
          color: #2d1f17;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }

        .card-subtitle {
          font-size: 13px;
          color: #644c3c;
          margin-bottom: 36px;
          line-height: 1.5;
        }

        /* Error */
        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(239,68,68,0.05);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #ef4444;
          animation: shakeIn 0.35s ease;
        }

        @keyframes shakeIn {
          0%   { transform: translateX(-6px); opacity: 0; }
          40%  { transform: translateX(4px); }
          70%  { transform: translateX(-2px); }
          100% { transform: translateX(0); opacity: 1; }
        }

        /* Form field */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #432e22;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .field-wrap {
          position: relative;
          display: flex;
          align-items: center;
          background: #fff;
          border: 1.5px solid #e2d0bf;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .field-wrap.focused {
          border-color: #8B1E1A;
          background: #fff;
          box-shadow: 0 0 0 3.5px rgba(139, 30, 26, 0.13);
        }

        .field-icon {
          padding: 0 14px;
          color: #cbb49e;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .field-wrap.focused .field-icon { color: #8B1E1A; }

        .field-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 14px 14px 14px 0;
          font-size: 14px;
          color: #2d1f17;
          font-family: 'Inter', sans-serif;
        }

        .field-input::placeholder { color: #cbb49e; }

        .eye-btn {
          padding: 0 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: #c0a690;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .eye-btn:hover { color: #8B1E1A; }

        /* Divider */
        .field-divider {
          height: 1px;
          background: #eeddc8;
          margin: 8px 0 24px;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #8B1E1A 0%, #C8870F 100%);
          border: none;
          border-radius: 12px;
          padding: 15px 24px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(139, 30, 26, 0.22);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #A72824 0%, #E8A317 100%);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(139, 30, 26, 0.38); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .submit-btn span, .submit-btn svg { position: relative; z-index: 1; }

        /* Bottom note */
        .secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 20px;
          font-size: 12px;
          color: #644c3c;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .login-left { display: none; }
          .login-right {
            width: 100%;
            min-width: unset;
            border-left: none;
            padding: 40px 24px;
          }
        }

        /* Animated background dots */
        .bg-dots {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-dots span {
          position: absolute;
          border-radius: 50%;
          background: rgba(139,30,26,0.08);
          animation: floatDot linear infinite;
        }

        @keyframes floatDot {
          from { transform: translateY(100vh) scale(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.5; }
          to   { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
      `}</style>

      <div className="login-root">
        {/* ── LEFT PANEL ── */}
        <div className="login-left">
          <div className="grid-lines" />



          {/* Hero content */}
          <div className="left-hero">
            <div className="left-tag">
              <ShieldCheck size={11} />
              Admin Control Center
            </div>
            <h1 className="left-h1">
              Manage your<br />
              <span>organic empire</span><br />
              with confidence.
            </h1>
            <p className="left-desc">
              A unified hub to oversee products, orders, customers, and analytics — all from one powerful dashboard.
            </p>

            <div className="left-stats">
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Organic</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">256-bit</span>
                <span className="stat-label">Encrypted</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="left-footer">
            © 2026 Aarions Organic Products. All rights reserved.
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="login-right">
          <div className="login-card">
            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <img
                src="/logo.png?v=3"
                alt="Aarions Logo"
                style={{ height: "64px", width: "auto", objectFit: "contain" }}
              />
            </div>

            <h2 className="card-title">Welcome back</h2>
            <p className="card-subtitle">
              Sign in to your admin account to continue managing your store.
            </p>

            {/* Error message */}
            {error && (
              <div className="error-box" role="alert">
                <Lock size={14} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="field-group">
                <label className="field-label" htmlFor="admin-email">
                  <Mail size={10} />
                  Email Address
                </label>
                <div className={`field-wrap${emailFocused ? " focused" : ""}`}>
                  <span className="field-icon">
                    <Mail size={15} />
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    className="field-input"
                    placeholder="admin@aarions.com"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label" htmlFor="admin-password">
                  <Lock size={10} />
                  Security Password
                </label>
                <div className={`field-wrap${passwordFocused ? " focused" : ""}`}>
                  <span className="field-icon">
                    <Lock size={15} />
                  </span>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    className="field-input"
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="field-divider" />

              {/* Submit */}
              <button
                id="admin-login-btn"
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Access Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="secure-note">
              <Lock size={11} />
              Secured with JWT &amp; AES-256 encryption
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
