import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const pwScore = pwd => {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd))  s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};
const STRENGTH = [
  { label:"Very Weak", color:"#ef4444" },
  { label:"Weak",   color:"#ef4444" },
  { label:"Fair",   color:"#f59e0b" },
  { label:"Good",   color:"#3b82f6" },
  { label:"Strong", color:"#22c55e" },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, user } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [showPw,  setShowPw]  = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const score = pwScore(form.password);

  useEffect(() => { if (user) navigate("/", { replace: true }); }, [user]);

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
            const result = await loginWithGoogle(tokenResponse.access_token, true);
            if (result.success) {
              setSuccess(true);
              setLoading(false);
              setTimeout(() => navigate("/", { replace: true }), 900);
            } else {
              setErrors({ form: result.message });
              if (result.email) {
                setForm(p => ({ ...p, email: result.email }));
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const v1 = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Enter your full name";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phone && !/^\+?[0-9]{10,14}$/.test(form.phone.replace(/\s/g,""))) e.phone = "Enter a valid phone number";
    return e;
  };

  const v2 = () => {
    const e = {};
    if (!form.password || form.password.length < 6) e.password = "At least 6 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const nextStep = (ev) => {
    ev.preventDefault();
    const e = v1(); if (Object.keys(e).length) { setErrors(e); return; }
    setStep(2);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = v2(); if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const result = await signup(form.name, form.email, form.password, form.phone);
    if (result.success) {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } else {
      setErrors({ form: result.message });
      setLoading(false);
    }
  };

  const perks = [
    "Free delivery on first order",
    "Exclusive member discounts",
    "Early access to new arrivals",
    "Reward points on every order",
  ];

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
        <img
          className="auth-hero-img"
          src="/auth-spices-dark.jpg"
          alt="Authentic Indian spices"
        />
        <div className="auth-hero-grad" />

        <div className="auth-hero-badge">
          <img src="https://aarions.in/img/honey/logo.jpg" alt="Aarions" />
          <span className="auth-hero-badge-name">AARIONS</span>
        </div>

        <div className="auth-hero-body">
          <h2 className="auth-hero-headline">
            Join the Pure<br />
            <em>Food Family</em>
          </h2>
          <p className="auth-hero-sub">
            Become a member and enjoy exclusive access to premium artisanal
            products, special deals, and a healthier lifestyle.
          </p>

          {/* perks list */}
          <div style={{ display:"flex", flexDirection:"column", gap:".6rem" }}>
            {perks.map((p, i) => (
              <div key={i}
                style={{ display:"flex", alignItems:"center", gap:".625rem",
                  animation:`authFadeUp .45s ease ${i*0.1}s both` }}>
                <div style={{
                  width:20, height:20, borderRadius:"50%",
                  background:"rgba(232,163,23,.15)",
                  border:"1px solid rgba(232,163,23,.35)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  flexShrink:0,
                }}>
                  <Check size={11} color="#e8a317"/>
                </div>
                <span style={{ fontSize:".83rem", color:"rgba(255,248,236,.78)" }}>{p}</span>
              </div>
            ))}
          </div>

          <p className="auth-hero-quote">"Nature's finest, crafted with tradition &amp; science."</p>
        </div>
      </div>

      {/* ───────── RIGHT FORM ───────── */}
      <div className="auth-panel">
        <Link to="/" className="auth-back">
          <ArrowLeft size={14}/> Back to store
        </Link>

        <div className="auth-inner">
          {success ? (
            <div className="auth-success">
              <svg viewBox="0 0 52 52" className="auth-success-svg">
                <circle cx="26" cy="26" r="25" className="auth-circ"/>
                <path d="M14 27l8 8 16-16" className="auth-tick"/>
              </svg>
              <h2>Account Created!</h2>
              <p>Welcome to the Aarions family 🎉</p>
            </div>
          ) : (
            <>
              <div className="auth-logo-ring">
                <img src="https://aarions.in/img/honey/logo.jpg" alt="Aarions"/>
              </div>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Join Aarions — pure, natural, trusted</p>

              {errors.form && (
                <div className="p-3 mb-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {errors.form}
                </div>
              )}

              {step === 1 && (
                <>
                  {/* Google */}
                  <button type="button" onClick={handleGoogleLogin} className="auth-google" id="signup-google-btn" disabled={loading}>
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="auth-or">or sign up with email</div>
                </>
              )}

              {/* Step indicator */}
              <div className="auth-steps">
                <div className={`auth-sdot${step >= 1 ? " auth-sdot--on" : ""}`}>1</div>
                <div className={`auth-sline${step >= 2 ? " auth-sline--on" : ""}`}/>
                <div className={`auth-sdot${step >= 2 ? " auth-sdot--on" : ""}`}>2</div>
              </div>

              {step === 1 ? (
                <form onSubmit={nextStep} noValidate className="auth-form">
                  <div className="auth-field">
                    <label htmlFor="su-name" className="auth-label">Full Name</label>
                    <input id="su-name" type="text" name="name" value={form.name}
                      onChange={handleChange} placeholder="Your full name"
                      className={`auth-inp${errors.name ? " auth-inp--err" : ""}`}
                      autoComplete="name"/>
                    {errors.name && <span className="auth-err">{errors.name}</span>}
                  </div>

                  <div className="auth-field">
                    <label htmlFor="su-email" className="auth-label">Email Address</label>
                    <input id="su-email" type="email" name="email" value={form.email}
                      onChange={handleChange} placeholder="you@example.com"
                      className={`auth-inp${errors.email ? " auth-inp--err" : ""}`}
                      autoComplete="email"/>
                    {errors.email && <span className="auth-err">{errors.email}</span>}
                  </div>

                  <div className="auth-field">
                    <label htmlFor="su-phone" className="auth-label">
                      Phone <span className="auth-label-opt">(optional)</span>
                    </label>
                    <input id="su-phone" type="tel" name="phone" value={form.phone}
                      onChange={handleChange} placeholder="+91 98432 70810"
                      className={`auth-inp${errors.phone ? " auth-inp--err" : ""}`}
                      autoComplete="tel"/>
                    {errors.phone && <span className="auth-err">{errors.phone}</span>}
                  </div>

                  <button type="submit" id="signup-next-btn" className="auth-btn">
                    Continue <ArrowRight size={16}/>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="auth-form">
                  {errors.form && (
                    <div className="p-3 mb-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      {errors.form}
                    </div>
                  )}
                  {/* Password */}
                  <div className="auth-field">
                    <label htmlFor="su-pw" className="auth-label">Password</label>
                    <div className={`auth-pw${errors.password ? " auth-inp--err" : ""}`}>
                      <input id="su-pw" type={showPw ? "text" : "password"} name="password"
                        value={form.password} onChange={handleChange}
                        placeholder="Create a strong password"
                        className="auth-pw-inp" autoComplete="new-password"/>
                      <button type="button" onClick={() => setShowPw(v=>!v)} className="auth-eye" aria-label="Toggle">
                        {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    </div>
                    {errors.password && <span className="auth-err">{errors.password}</span>}
                    {form.password && (
                      <div className="auth-strength">
                        <div className="auth-sbars">
                          {[1,2,3,4].map(n => (
                            <div key={n} className="auth-sbar"
                              style={{ background: n <= score ? STRENGTH[score].color : "#e5e7eb" }}/>
                          ))}
                        </div>
                        <span className="auth-slbl" style={{ color: STRENGTH[score].color }}>
                          {STRENGTH[score].label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm */}
                  <div className="auth-field">
                    <label htmlFor="su-cpw" className="auth-label">Confirm Password</label>
                    <div className={`auth-pw${errors.confirm ? " auth-inp--err" : ""}`}>
                      <input id="su-cpw" type={showCpw ? "text" : "password"} name="confirm"
                        value={form.confirm} onChange={handleChange}
                        placeholder="Repeat your password"
                        className="auth-pw-inp" autoComplete="new-password"/>
                      <button type="button" onClick={() => setShowCpw(v=>!v)} className="auth-eye" aria-label="Toggle">
                        {showCpw ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    </div>
                    {errors.confirm && <span className="auth-err">{errors.confirm}</span>}
                  </div>



                  <div className="auth-row">
                    <button type="button" onClick={() => setStep(1)} className="auth-back-btn" id="signup-back-btn">
                      ← Back
                    </button>
                    <button type="submit" disabled={loading} className="auth-btn auth-btn--flex" id="signup-submit-btn">
                      {loading ? <span className="auth-spin"/> : <>Create Account <ArrowRight size={16}/></>}
                    </button>
                  </div>
                </form>
              )}

              <p className="auth-switch">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
