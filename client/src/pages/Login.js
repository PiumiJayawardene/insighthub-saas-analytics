import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Icons = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="url(#logoGrad)" />
      <path
        d="M7 14h5m0 0V9m0 5v5m4-9v4m0 0h5m-5 0v4"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  ),

  Mail: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M1 3.5A1.5 1.5 0 012.5 2h10A1.5 1.5 0 0114 3.5v8a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 011 11.5v-8zm1.5-.5a.5.5 0 00-.5.5v.325L7.5 8.15l5.5-4.325V3.5a.5.5 0 00-.5-.5h-10zm11 1.675L9.373 8.68l4.127 3.245V4.675zm-.28 7.825L8.47 9.402 7.5 10.15l-.97-.748L1.78 12.5h10.44zM2 11.925L6.127 8.68 2 4.675v7.25z"
        fill="currentColor"
      />
    </svg>
  ),

  Lock: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M5 4.5a2.5 2.5 0 015 0V6h1.5A1.5 1.5 0 0113 7.5v5A1.5 1.5 0 0111.5 14h-8A1.5 1.5 0 012 12.5v-5A1.5 1.5 0 013.5 6H5V4.5zm1 0V6h3V4.5a1.5 1.5 0 00-3 0zm-2.5 3a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h8a.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5h-8zm4.5 2a.5.5 0 011 0v1.5a.5.5 0 01-1 0V9.5z"
        fill="currentColor"
      />
    </svg>
  ),

  Eye: ({ open }) =>
    open ? (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M7.5 11C4.47 11 1.93 9.07 1.05 7.5 1.93 5.93 4.47 4 7.5 4s5.57 1.93 6.45 3.5C13.07 9.07 10.53 11 7.5 11zm0-8C4.1 3 1.15 5.24.06 7.27a.5.5 0 000 .46C1.15 9.76 4.1 12 7.5 12s6.35-2.24 7.44-4.27a.5.5 0 000-.46C13.85 5.24 10.9 3 7.5 3zm0 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M13.354 1.354a.5.5 0 10-.708-.708L10.32 2.973A7.38 7.38 0 007.5 2.5C4.1 2.5 1.15 4.74.06 6.77a.5.5 0 000 .46c.57 1.05 1.48 2.03 2.63 2.8L1.146 11.57a.5.5 0 00.708.708l1.85-1.85A7.38 7.38 0 007.5 11c3.4 0 6.35-2.24 7.44-4.27a.5.5 0 000-.46c-.57-1.05-1.48-2.03-2.63-2.8l1.044-1.11z"
          fill="currentColor"
        />
      </svg>
    ),

  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Spinner: () => (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  Trend: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 11l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 4h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Community: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5.5 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM10.5 8a2 2 0 100-4 2 2 0 000 4zM1.8 14c.5-2.4 1.9-4 3.7-4s3.2 1.6 3.7 4M8.9 13.2c.4-1.7 1.4-2.8 2.7-2.8 1.4 0 2.5 1.2 2.8 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),

  Video: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 6l3 2-3 2V6z" fill="currentColor" />
    </svg>
  ),

  Shield: () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5l5 2v3.8c0 3.1-2 5.8-5 7.2-3-1.4-5-4.1-5-7.2V3.5l5-2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const FeatureItem = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 text-sm text-slate-400">
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cyan-300">
      <Icon />
    </span>
    {label}
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute right-[-8%] top-[25%] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative hidden w-[45%] flex-col justify-between border-r border-white/[0.08] bg-slate-950/70 p-12 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-3">
          <Icons.Logo />
          <span className="text-lg font-semibold tracking-tight text-white">InsightHub</span>
        </div>

        <div className="space-y-8">
          <div>
            <div className="mb-4 w-fit rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
              Content Research Platform
            </div>

            <h1 className="mb-4 bg-gradient-to-r from-white via-indigo-100 to-cyan-200 bg-clip-text text-4xl font-semibold leading-tight text-transparent">
              Research trends,
              <br />
              understand audiences,
              <br />
              plan better content.
            </h1>

            <p className="max-w-sm text-base leading-relaxed text-slate-400">
              Bring news trends, community questions, YouTube topics, saved research, and content planning into one focused workspace.
            </p>
          </div>

          <div className="space-y-3">
            <FeatureItem icon={Icons.Trend} label="Track current news and industry trends" />
            <FeatureItem icon={Icons.Community} label="Understand audience questions from online communities" />
            <FeatureItem icon={Icons.Video} label="Discover YouTube content topics across niches" />
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl shadow-black/20">
            <p className="mb-3 text-sm italic leading-relaxed text-slate-300">
              “InsightHub helps turn scattered research into clear content ideas for social media, newsletters, and campaigns.”
            </p>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-500 text-xs font-semibold text-white">
                IH
              </div>

              <div>
                <p className="text-xs font-medium text-slate-200">Content Research Workspace</p>
                <p className="text-xs text-slate-500">Built for marketers, analysts, and creators</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600">© 2026 InsightHub. All rights reserved.</p>
      </div>

      <div className="relative flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Icons.Logo />
            <span className="text-lg font-semibold text-white">InsightHub</span>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="mb-8">
              <h2 className="mb-1.5 text-xl font-semibold text-white">Welcome back</h2>
              <p className="text-sm text-slate-400">Sign in to your InsightHub account</p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="mt-0.5 flex-shrink-0">
                  <path
                    d="M7.5 1a6.5 6.5 0 100 13A6.5 6.5 0 007.5 1zm0 5.5a.5.5 0 01.5.5v3a.5.5 0 01-1 0V7a.5.5 0 01.5-.5zm0-2a.75.75 0 110 1.5.75.75 0 010-1.5z"
                    fill="currentColor"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Email address
                </label>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Icons.Mail />
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-600/80 bg-slate-800 px-4 py-3 pl-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition hover:border-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Password
                  </label>

                  <span className="cursor-pointer text-xs text-indigo-400 transition-colors hover:text-indigo-300">
                    Forgot password?
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Icons.Lock />
                  </span>

                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-600/80 bg-slate-800 px-4 py-3 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition hover:border-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  >
                    <Icons.Eye open={showPass} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-cyan-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Icons.Spinner />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <Icons.ArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-xs text-slate-600">or</span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                Create one free
              </Link>
            </p>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-600">
            <Icons.Shield />
            Secured with bcrypt encryption and JWT authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;