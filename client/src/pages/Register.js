import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Icons = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="url(#logoGradR)" />
      <path
        d="M7 14h5m0 0V9m0 5v5m4-9v4m0 0h5m-5 0v4"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="logoGradR" x1="0" y1="0" x2="28" y2="28">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  ),

  Check: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M2.5 6.5L5 9l5.5-5.5"
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
      <path
        d="M2 11l4-4 3 3 5-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 4h4v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Community: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M5.5 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM10.5 8a2 2 0 100-4 2 2 0 000 4zM1.8 14c.5-2.4 1.9-4 3.7-4s3.2 1.6 3.7 4M8.9 13.2c.4-1.7 1.4-2.8 2.7-2.8 1.4 0 2.5 1.2 2.8 3"
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

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const levels = [
    { label: '', color: '' },
    { label: 'Weak', color: 'bg-rose-500' },
    { label: 'Fair', color: 'bg-amber-500' },
    { label: 'Good', color: 'bg-indigo-400' },
    { label: 'Strong', color: 'bg-emerald-500' },
  ];

  return { score, ...levels[score] };
};

const FeatureItem = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 text-sm text-slate-400">
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cyan-300">
      <Icon />
    </span>
    {label}
  </div>
);

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);

  const perks = [
    'Find current news and industry trends',
    'Understand audience questions from online communities',
    'Discover YouTube content topics across niches',
    'Save research and turn it into content ideas',
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute right-[-8%] top-[25%] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Icons.Logo />
            <span className="text-lg font-semibold text-white">InsightHub</span>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="mb-8">
              <h2 className="mb-1.5 text-xl font-semibold text-white">
                Create your account
              </h2>
              <p className="text-sm text-slate-400">
                Start building your content research workspace.
              </p>
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
                  Full name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-600/80 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition hover:border-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  placeholder="Jane Smith"
                  required
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-600/80 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition hover:border-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-600/80 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition hover:border-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  placeholder="8+ characters"
                  required
                  autoComplete="new-password"
                />

                {form.password && (
                  <div className="mt-3">
                    <div className="mb-1.5 flex gap-1">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            item <= strength.score ? strength.color : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-slate-500">
                      Password strength:{' '}
                      <span
                        className={`font-medium ${
                          strength.score <= 1
                            ? 'text-rose-400'
                            : strength.score === 2
                            ? 'text-amber-400'
                            : strength.score === 3
                            ? 'text-indigo-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {strength.label}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs leading-relaxed text-slate-500">
                By creating an account, you agree to our{' '}
                <span className="cursor-pointer text-indigo-400 hover:text-indigo-300">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="cursor-pointer text-indigo-400 hover:text-indigo-300">
                  Privacy Policy
                </span>
                .
              </p>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-cyan-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Icons.Spinner />
                    Creating account...
                  </>
                ) : (
                  'Create free account'
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-xs text-slate-600">or</span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-600">
            <Icons.Shield />
            Secured with bcrypt encryption and JWT authentication
          </p>
        </div>
      </div>

      <div className="relative hidden w-[45%] flex-col justify-between border-l border-white/[0.08] bg-slate-950/70 p-12 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-3">
          <Icons.Logo />
          <span className="text-lg font-semibold tracking-tight text-white">InsightHub</span>
        </div>

        <div className="space-y-8">
          <div>
            <div className="mb-4 w-fit rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
              Free to start
            </div>

            <h1 className="mb-4 bg-gradient-to-r from-white via-indigo-100 to-cyan-200 bg-clip-text text-4xl font-semibold leading-tight text-transparent">
              Turn research
              <br />
              into useful
              <br />
              content ideas.
            </h1>

            <p className="max-w-sm text-base leading-relaxed text-slate-400">
              InsightHub helps marketers, analysts, and creators collect useful signals from news, Reddit, and YouTube in one focused workspace.
            </p>
          </div>

          <div className="space-y-3">
            {perks.map((perk) => (
              <FeatureItem
                key={perk}
                icon={perk.includes('YouTube') ? Icons.Video : perk.includes('audience') ? Icons.Community : Icons.Trend}
                label={perk}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-center">
              <p className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-2xl font-semibold text-transparent">
                3
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Research sources
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-center">
              <p className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-2xl font-semibold text-transparent">
                CSV
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Export support
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600">© 2026 InsightHub. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Register;