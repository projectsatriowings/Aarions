import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, loginWithGoogle, user } = useAuth();

  const [form, setForm]           = useState({ email: "", password: "" });
  const [errors, setErrors]       = useState({});
  const [showPw,       setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);

  const from = location.state?.from?.pathname || "/";
  useEffect(() => { if (user) navigate(from, { replace: true }); }, [user]);

  const handleGoogleLogin = () => {
    if (!window.google) {
      setErrors({ form: "Google client is not loaded. Please refresh the page." });
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "your_google_client_id_here") {
      setErrors({ form: "Google Sign-In is not configured. Please define VITE_GOOGLE_CLIENT_ID." });
      return;
    }

    setLoading(true);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        prompt: "select_account",
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            const result = await loginWithGoogle(tokenResponse.access_token, false);
            if (result.success) {
              setSuccess(true);
              setLoading(false);
              setTimeout(() => navigate(from, { replace: true }), 900);
            } else {
              setErrors({ form: result.message });
              if (result.email) {
                setForm(p => ({ ...p, email: result.email, password: "" }));
              }
              setLoading(false);
            }
          } else {
            setErrors({ form: "Google authentication failed or was cancelled." });
            setLoading(false);
          }
        },
        error_callback: (err) => {
          setErrors({ form: err.message || "Google OAuth initialization error." });
          setLoading(false);
        }
      });

      client.requestAccessToken();
    } catch (err) {
      setErrors({ form: "Could not initialize Google authentication popup." });
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = await login(form.email, form.password);
    if (result.success) {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate(from, { replace: true }), 900);
    } else {
      setErrors({ form: result.message });
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="auth-root"
    >

      {/* ───────── LEFT HERO ───────── */}
      <div className="auth-hero">
        {/* Single, beautiful, relevant image */}
        <img
          className="auth-hero-img"
          src="/auth-honey.jpg"
          alt="Premium honey jar"
        />
        <div className="auth-hero-grad" />

        {/* Logo badge top-left */}
        <div className="auth-hero-badge">
          <img src="https://aarions.in/img/honey/logo.jpg" alt="Aarions" />
          <span className="auth-hero-badge-name">AARIONS</span>
        </div>

        {/* Bottom content */}
        <div className="auth-hero-body">
          <h2 className="auth-hero-headline">
            Nature's Finest,<br />
            <em>Delivered Pure</em>
          </h2>
          <p className="auth-hero-sub">
            Premium honey, traditional bilona ghee & authentic
            Indian spices — crafted with tradition, tested by science.
          </p>
          <div className="auth-hero-pills">
            {["🍯 Pure Honey", "🫙 Bilona Ghee", "🌿 Spices & Masalas", "✓ FSSAI Certified"].map(t => (
              <span key={t} className="auth-hero-pill"><span>{t.slice(0,2)}</span>{t.slice(2)}</span>
            ))}
          </div>
          <p className="auth-hero-quote">"Nature's finest, crafted with tradition &amp; science."</p>
        </div>
      </div>

      {/* ───────── RIGHT FORM ───────── */}
      <div className="auth-panel">
        <Link to="/" className="auth-back">
          <ArrowLeft size={14} /> Back to store
        </Link>

        <div className="auth-inner">
          {success ? (
            <div className="auth-success">
              <svg viewBox="0 0 52 52" className="auth-success-svg">
                <circle cx="26" cy="26" r="25" className="auth-circ" />
                <path d="M14 27l8 8 16-16" className="auth-tick" />
              </svg>
              <h2>Welcome back!</h2>
              <p>Redirecting you now…</p>
            </div>
          ) : (
            <>
              {/* Brand + heading */}
              <div className="auth-logo-ring">
                <img src="https://aarions.in/img/honey/logo.jpg" alt="Aarions" />
              </div>
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Sign in to your Aarions account</p>

              {/* Google */}
              <button type="button" onClick={handleGoogleLogin} className="auth-google" id="login-google-btn" disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </button>

              <div className="auth-or">or sign in with email</div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="auth-form">
                {errors.form && (
                  <div className="p-3 mb-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {errors.form}
                  </div>
                )}
                {/* Email */}
                <div className="auth-field">
                  <label htmlFor="login-email" className="auth-label">Email address</label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`auth-inp${errors.email ? " auth-inp--err" : ""}`}
                    autoComplete="email"
                  />
                  {errors.email && <span className="auth-err">{errors.email}</span>}
                </div>

                {/* Password */}
                <div className="auth-field">
                  <div className="auth-label-row">
                    <label htmlFor="login-pw" className="auth-label">Password</label>
                  </div>
                  <div className={`auth-pw${errors.password ? " auth-inp--err" : ""}`}>
                    <input
                      id="login-pw"
                      type={showPw ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="auth-pw-inp"
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="auth-eye" aria-label="Toggle">
                      {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                  {errors.password && <span className="auth-err">{errors.password}</span>}
                </div>

                {/* Submit */}
                <button type="submit" id="login-submit-btn" disabled={loading} className="auth-btn">
                  {loading ? <span className="auth-spin"/> : <>Sign In <ArrowRight size={16}/></>}
                </button>
              </form>

              <p className="auth-switch">
                Don't have an account? <Link to="/signup">Create one free</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
