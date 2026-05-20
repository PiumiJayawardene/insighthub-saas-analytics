/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import {
  LayoutDashboard,
  TrendingUp,
  MessageCircle,
  Bookmark,
  CalendarDays,
  LogOut,
  Search,
  PlayCircle,
  Download,
  RefreshCw,
  Plus,
  X,
  FileText,
  ExternalLink,
  CheckCircle,
  Loader2,
  Sparkles,
  Target,
  Database,
  Lightbulb,
  BarChart2,
} from 'lucide-react';

import { useAuth, api } from '../context/AuthContext';
import { exportToCsv } from '../utils/exportCsv';

const Logo = ({ size = 36 }) => (
  <div
    style={{ width: size, height: size }}
    className="flex flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25"
  >
    <Sparkles size={size * 0.5} className="text-white" />
  </div>
);

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-800/80 ${className}`} />
);

const LoadingBlock = ({ height = 'h-24' }) => (
  <div className="space-y-3">
    <Skeleton className={height} />
    <Skeleton className="h-16" />
    <Skeleton className="h-16" />
  </div>
);

const EmptyState = ({ icon: Icon = FileText, message, hint }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/40 px-6 py-10 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500">
      <Icon size={22} />
    </div>
    <p className="text-sm font-medium text-slate-400">{message}</p>
    {hint && <p className="text-xs text-slate-600">{hint}</p>}
  </div>
);

const DataStatus = ({ fromCache }) => (
  <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-600">
    <span className={`h-1.5 w-1.5 rounded-full ${fromCache ? 'bg-emerald-400' : 'bg-blue-400'}`} />
    <span>{fromCache ? 'Served from cache' : 'Fresh data'}</span>
  </div>
);

const Section = ({ children, sectionRef }) => (
  <section ref={sectionRef} className="scroll-mt-24">
    {children}
  </section>
);

const Panel = ({
  title,
  subtitle,
  icon: PanelIcon,
  action,
  children,
  className = '',
  accent = 'indigo',
}) => {
  const accentMap = {
    indigo: 'from-indigo-500/80 to-cyan-500/80',
    cyan: 'from-cyan-500/80 to-blue-500/80',
    amber: 'from-amber-400/80 to-orange-500/80',
    rose: 'from-rose-500/80 to-pink-500/80',
    emerald: 'from-emerald-400/80 to-teal-500/80',
  };

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/70 shadow-xl shadow-slate-950/40 backdrop-blur-sm ${className}`}>
      <div className={`h-px bg-gradient-to-r ${accentMap[accent] || accentMap.indigo}`} />

      <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          {PanelIcon && (
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400">
              <PanelIcon size={14} />
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>}
          </div>
        </div>

        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
};

const Btn = {
  Primary: ({ children, onClick, disabled, className = '', type = 'button', loading = false }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-cyan-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  ),

  Secondary: ({ children, onClick, disabled, className = '' }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  ),

  Save: ({ saved, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
        saved
          ? 'cursor-default border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          : 'border border-indigo-400/25 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
      }`}
    >
      {saved ? <CheckCircle size={12} /> : <Bookmark size={12} />}
      {saved ? 'Saved' : 'Save'}
    </button>
  ),

  Remove: ({ onClick }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
    >
      <X size={12} />
      Remove
    </button>
  ),

  Pill: ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/30'
          : 'border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  ),
};

const FieldLabel = ({ children }) => (
  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
    {children}
  </label>
);

const Select = ({ value, onChange, children, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`rounded-xl border border-slate-600/80 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 outline-none transition hover:border-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 ${className}`}
  >
    {children}
  </select>
);

const Input = ({ value, onChange, onKeyDown, placeholder, className = '' }) => (
  <input
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    className={`rounded-xl border border-slate-600/80 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition hover:border-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 ${className}`}
  />
);

const Textarea = ({ value, onChange, placeholder }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="mt-4 min-h-24 w-full rounded-xl border border-slate-600/80 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition hover:border-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
  />
);

const KPICard = ({ title, value, subtitle, icon: Icon, gradient }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40 transition hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-xl">
    <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${gradient}`} />
    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.03] blur-xl transition group-hover:bg-white/[0.05]" />

    <div className="relative flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          {title}
        </p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
      </div>

      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400">
        <Icon size={15} />
      </div>
    </div>
  </div>
);

const useSavedResearch = (userId) => {
  const storageKey = `insighthub_saved_research_${userId || 'guest'}`;
  const [savedResearch, setSavedResearch] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        setSavedResearch(JSON.parse(stored));
      } catch {
        setSavedResearch([]);
      }
    }
  }, [storageKey]);

  const persist = (items) => {
    setSavedResearch(items);
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const saveItem = (item) => {
    const exists = savedResearch.some((saved) => saved.id === item.id);
    if (exists) return;

    const next = [
      {
        ...item,
        savedAt: new Date().toISOString(),
        note: '',
      },
      ...savedResearch,
    ];

    persist(next);
  };

  const removeItem = (id) => {
    persist(savedResearch.filter((item) => item.id !== id));
  };

  const updateNote = (id, note) => {
    persist(savedResearch.map((item) => (item.id === id ? { ...item, note } : item)));
  };

  const isSaved = (id) => savedResearch.some((item) => item.id === id);

  return {
    savedResearch,
    saveItem,
    removeItem,
    updateNote,
    isSaved,
  };
};

const KeywordWatchlistSection = ({ keywords, setKeywords }) => {
  const [keywordInput, setKeywordInput] = useState('');

  const addKeyword = () => {
    const cleaned = keywordInput.trim();

    if (!cleaned) return;
    if (keywords.includes(cleaned)) return;

    const next = [cleaned, ...keywords];

    setKeywords(next);
    localStorage.setItem('insighthub_keywords', JSON.stringify(next));
    setKeywordInput('');
  };

  const removeKeyword = (keyword) => {
    const next = keywords.filter((item) => item !== keyword);

    setKeywords(next);
    localStorage.setItem('insighthub_keywords', JSON.stringify(next));
  };

  return (
    <Panel
      title="Keyword Watchlist"
      subtitle="Track custom topics that matter to your business or content niche."
      icon={Search}
      accent="indigo"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addKeyword();
          }}
          placeholder="Example: skincare trends, AI tools, e-commerce trust"
          className="flex-1"
        />

        <Btn.Primary onClick={addKeyword}>
          <Plus size={15} />
          Add keyword
        </Btn.Primary>
      </div>

      {keywords.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={Search}
            message="No keywords yet."
            hint="Add topics you want to monitor for content research."
          />
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300"
            >
              {keyword}

              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="rounded-full text-indigo-300 transition hover:text-rose-300"
                title="Remove keyword"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </Panel>
  );
};

const TrendFinderSection = ({ userPrefs, saveItem, isSaved }) => {
  const defaultTopic = userPrefs?.newsTopics?.[0] || 'technology';
  const [topic, setTopic] = useState(defaultTopic);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    setTopic(userPrefs?.newsTopics?.[0] || 'technology');
  }, [userPrefs]);

  const topics = ['technology', 'business', 'science', 'health', 'sports'];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['news', topic],
    queryFn: async () => {
      const res = await api.get(`/data/news?topic=${topic}&pageSize=20`);
      return res.data;
    },
  });

  const articles = useMemo(() => {
  return data?.data?.articles || [];
}, [data]);
  const visibleArticles = articles.slice(0, visibleCount);

  const sourceChartData = useMemo(() => {
    const counts = {};

    articles.forEach((article) => {
      const source = article.source?.name || 'Unknown';
      counts[source] = (counts[source] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [articles]);

  const dailyChartData = useMemo(() => {
    const counts = {};

    articles.forEach((article) => {
      if (!article.publishedAt) return;

      const day = new Date(article.publishedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });

      counts[day] = (counts[day] || 0) + 1;
    });

    return Object.entries(counts).map(([day, count]) => ({
      day,
      articles: count,
    }));
  }, [articles]);

  const pieColors = ['#6366f1', '#22d3ee', '#a855f7', '#f59e0b', '#10b981', '#f43f5e'];

  return (
    <Panel
      title="Trend Finder"
      subtitle="Discover current articles and understand which sources are covering your selected topic."
      icon={TrendingUp}
      accent="cyan"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setVisibleCount(10);
            }}
          >
            {topics.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </Select>

          <Btn.Secondary onClick={() => refetch()}>
            <RefreshCw size={13} />
            Refresh
          </Btn.Secondary>
        </div>
      }
    >
      <div className="mb-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Selected topic</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Articles can be saved for content planning.
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Articles found</p>
          <p className="mt-2 text-2xl font-semibold text-white">{articles.length}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Showing {visibleArticles.length} articles in the list below.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Sources detected</p>
          <p className="mt-2 text-2xl font-semibold text-white">{sourceChartData.length}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Source variety shows how widely the topic is covered.
          </p>
        </div>
      </div>

      {isLoading && <LoadingBlock height="h-72" />}

      {error && (
        <EmptyState
          icon={TrendingUp}
          message="Trends could not be loaded."
          hint="Try refreshing this section."
        />
      )}

      {!isLoading && !error && articles.length === 0 && (
        <EmptyState icon={TrendingUp} message="No articles found for this topic." />
      )}

      {!isLoading && !error && articles.length > 0 && (
        <>
          <div className="mb-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.07] bg-slate-950/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Article volume by date</p>
                  <p className="text-xs text-slate-500">Shows when articles were published.</p>
                </div>
                <BarChart2 size={18} className="text-slate-500" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.14)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(34, 211, 238, 0.08)' }}
                      contentStyle={{
                        background: '#020617',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '14px',
                        color: '#e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="articles" fill="#22d3ee" radius={[8, 8, 0, 0]} name="Articles" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-slate-950/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Top news sources</p>
                  <p className="text-xs text-slate-500">Shows which sources appear most often.</p>
                </div>
                <Database size={18} className="text-slate-500" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceChartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={85}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {sourceChartData.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#020617',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '14px',
                        color: '#e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Suggested articles for content research</p>
              <p className="mt-1 text-xs text-slate-500">
                Save useful articles and use them later in the Content Planner.
              </p>
            </div>

            <Select value={visibleCount} onChange={(e) => setVisibleCount(Number(e.target.value))}>
              <option value={6}>Show 6 articles</option>
              <option value={10}>Show 10 articles</option>
              <option value={15}>Show 15 articles</option>
              <option value={20}>Show 20 articles</option>
            </Select>
          </div>

          <div className="grid gap-3">
            {visibleArticles.map((article, index) => {
              const id = `news-${article.url || article.title || index}`;

              return (
                <div
                  key={id}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:border-indigo-400/30 hover:bg-white/[0.05]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <p className="line-clamp-2 text-sm font-medium leading-6 text-slate-100 group-hover:text-indigo-200">
                          {article.title || 'Untitled article'}
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          {article.source?.name || 'Unknown source'}
                          {article.publishedAt && (
                            <>
                              <span>·</span>
                              <span>
                                {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </>
                          )}
                          <ExternalLink size={11} />
                        </p>
                      </a>

                      {article.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                          {article.description}
                        </p>
                      )}
                    </div>

                    <Btn.Save
                      saved={isSaved(id)}
                      disabled={isSaved(id)}
                      onClick={() =>
                        saveItem({
                          id,
                          type: 'Trend',
                          title: article.title || 'Untitled article',
                          source: article.source?.name || 'Unknown source',
                          url: article.url,
                          context: topic,
                        })
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {data && <DataStatus fromCache={data.fromCache} />}
    </Panel>
  );
};

const AudienceQuestionsSection = ({ userPrefs, saveItem, isSaved }) => {
  const defaultSubreddit = userPrefs?.subreddit || 'technology';
  const [subreddit, setSubreddit] = useState(defaultSubreddit);

  useEffect(() => {
    setSubreddit(userPrefs?.subreddit || 'technology');
  }, [userPrefs]);

  const subreddits = ['technology', 'programming', 'datascience', 'webdev', 'business'];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reddit', subreddit],
    queryFn: async () => {
      const res = await api.get(`/data/reddit?subreddit=${subreddit}&limit=8`);
      return res.data;
    },
  });

  const posts = useMemo(() => {
  return data?.data?.posts || [];
}, [data]);

  const chartData = useMemo(
    () =>
      posts.slice(0, 6).map((post) => ({
        name: post.title.length > 24 ? `${post.title.substring(0, 24)}…` : post.title,
        score: post.score,
        comments: post.numComments,
      })),
    [posts]
  );

  return (
    <Panel
      title="Audience Questions"
      subtitle="Understand what people are asking, discussing, and reacting to in online communities."
      icon={MessageCircle}
      accent="indigo"
      action={
        <div className="flex items-center gap-2">
          <Select value={subreddit} onChange={(e) => setSubreddit(e.target.value)}>
            {subreddits.map((item) => (
              <option key={item} value={item}>
                r/{item}
              </option>
            ))}
          </Select>

          <Btn.Secondary onClick={() => refetch()}>
            <RefreshCw size={13} />
            Refresh
          </Btn.Secondary>
        </div>
      }
    >
      {isLoading && <LoadingBlock height="h-72" />}

      {error && (
        <EmptyState
          icon={MessageCircle}
          message="Audience discussions could not be loaded."
          hint="Try another community or refresh the section."
        />
      )}

      {!isLoading && !error && chartData.length > 0 && (
        <div className="h-80 rounded-2xl border border-white/[0.06] bg-slate-950/40 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 70, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.14)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                contentStyle={{
                  background: '#020617',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '14px',
                  color: '#e2e8f0',
                  fontSize: '12px',
                }}
                formatter={(value, name, props) => {
                  const dataKey = props?.dataKey;
                  if (dataKey === 'score') return [value.toLocaleString(), 'Upvotes'];
                  if (dataKey === 'comments') return [value.toLocaleString(), 'Comments'];
                  return [value.toLocaleString(), name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '14px' }} />
              <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} name="Upvotes" />
              <Bar dataKey="comments" fill="#22d3ee" radius={[8, 8, 0, 0]} name="Comments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {posts.slice(0, 6).map((post) => {
            const id = `reddit-${post.id}`;
            const redditUrl = post.permalink?.startsWith('http')
              ? post.permalink
              : `https://www.reddit.com${post.permalink}`;

            return (
              <div key={id} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                <a
                  href={redditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block text-sm font-medium leading-6 text-slate-100 hover:text-indigo-200"
                >
                  {post.title}
                </a>

                <p className="mt-2 text-xs text-slate-500">
                  {post.score.toLocaleString()} upvotes · {post.numComments.toLocaleString()} comments
                </p>

                <div className="mt-3">
                  <Btn.Save
                    saved={isSaved(id)}
                    disabled={isSaved(id)}
                    onClick={() =>
                      saveItem({
                        id,
                        type: 'Audience Question',
                        title: post.title,
                        source: `r/${subreddit}`,
                        url: redditUrl,
                        context: subreddit,
                      })
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <EmptyState icon={MessageCircle} message="No audience discussions found." />
      )}

      {data && <DataStatus fromCache={data.fromCache} />}
    </Panel>
  );
};

const YouTubeTrendsSection = ({ keywords, saveItem, isSaved, user }) => {
  const defaultNiches = [
    'digital marketing',
    'content ideas',
    'small business marketing',
    'social media strategy',
    'e-commerce marketing',
    'skincare trends',
    'fashion marketing',
    'fitness content',
    'restaurant marketing',
    'AI tools',
    'customer reviews',
    'branding tips',
  ];

  const userTopic = user?.preferences?.newsTopics?.[0] || 'technology';

  const keywordOptions = [...new Set([...keywords, userTopic, ...defaultNiches])].filter(Boolean);
  const [keyword, setKeyword] = useState(keywordOptions[0] || 'digital marketing');

  useEffect(() => {
    if (!keywordOptions.includes(keyword)) {
      setKeyword(keywordOptions[0] || 'digital marketing');
    }
  }, [keywords, userTopic, keyword, keywordOptions]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['youtube', keyword],
    queryFn: async () => {
      const res = await api.get(`/data/youtube?keyword=${encodeURIComponent(keyword)}&limit=6`);
      return res.data;
    },
    enabled: Boolean(keyword),
  });

  const videos = data?.data?.videos || data?.videos || [];

  return (
    <Panel
      title="YouTube Content Trends"
      subtitle="Explore video topics, formats, and content ideas across different niches."
      icon={PlayCircle}
      accent="rose"
      action={
        <Btn.Secondary onClick={() => refetch()}>
          <RefreshCw size={13} />
          Refresh
        </Btn.Secondary>
      }
    >
      <div className="mb-5 grid gap-3 md:grid-cols-2">
        <div>
          <FieldLabel>Select niche / keyword</FieldLabel>

          <Select value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full">
            {keywordOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Current search</p>
          <p className="mt-2 text-lg font-semibold text-white">{keyword}</p>
          <p className="mt-1 text-xs text-slate-500">
            Add your own keywords in Keyword Watchlist to see them here.
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {defaultNiches.slice(0, 8).map((niche) => (
          <Btn.Pill key={niche} active={keyword === niche} onClick={() => setKeyword(niche)}>
            {niche}
          </Btn.Pill>
        ))}
      </div>

      {isLoading && <LoadingBlock height="h-72" />}

      {error && (
        <EmptyState
          icon={PlayCircle}
          message="YouTube trends could not be loaded."
          hint="Check the YouTube API key and backend logs."
        />
      )}

      {!isLoading && !error && videos.length === 0 && (
        <EmptyState icon={PlayCircle} message="No YouTube videos found for this keyword." />
      )}

      {!isLoading && !error && videos.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {videos.map((video) => {
            const id = `youtube-${video.id}`;

            return (
              <div
                key={id}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-rose-400/30 hover:bg-white/[0.05]"
              >
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="mb-3 h-40 w-full rounded-xl object-cover"
                  />
                )}

                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-semibold leading-6 text-white hover:text-rose-200"
                >
                  {video.title}
                </a>

                <p className="mt-2 text-xs text-slate-500">
                  {video.channelTitle} · {Number(video.views || 0).toLocaleString()} views · {Number(video.likes || 0).toLocaleString()} likes
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-2 py-1 text-[11px] text-rose-200">
                    {keyword}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-400">
                    YouTube trend
                  </span>
                </div>

                <div className="mt-4">
                  <Btn.Save
                    saved={isSaved(id)}
                    disabled={isSaved(id)}
                    onClick={() =>
                      saveItem({
                        id,
                        type: 'YouTube Idea',
                        title: video.title,
                        source: video.channelTitle,
                        url: video.url,
                        context: keyword,
                      })
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
};

const SavedResearchSection = ({ savedResearch, removeItem, updateNote }) => (
  <Panel
    title="Saved Research"
    subtitle="Keep useful trends, audience questions, links, and your own notes in one place."
    icon={Bookmark}
    accent="amber"
  >
    {savedResearch.length === 0 ? (
      <EmptyState
        icon={Bookmark}
        message="No saved research yet."
        hint="Save useful items from Trend Finder, Audience Questions, or YouTube Trends."
      />
    ) : (
      <div className="grid gap-4">
        {savedResearch.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <span className="rounded-full border border-indigo-400/25 bg-indigo-500/10 px-2 py-1 text-[11px] font-medium text-indigo-300">
                  {item.type}
                </span>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-sm font-semibold leading-6 text-white hover:text-indigo-200"
                >
                  {item.title}
                </a>

                <p className="mt-1 text-xs text-slate-500">
                  {item.source} · Saved {new Date(item.savedAt).toLocaleDateString('en-GB')}
                </p>
              </div>

              <Btn.Remove onClick={() => removeItem(item.id)} />
            </div>

            <Textarea
              value={item.note || ''}
              onChange={(e) => updateNote(item.id, e.target.value)}
              placeholder="Write why this is useful, what customers are saying, or how it can become content..."
            />
          </div>
        ))}
      </div>
    )}
  </Panel>
);

const ContentPlannerSection = ({ savedResearch, user }) => {
  const topic = user?.preferences?.newsTopics?.[0] || 'technology';
  const subreddit = user?.preferences?.subreddit || 'technology';

  const ideas = savedResearch.slice(0, 6).map((item) => {
    if (item.type === 'Audience Question') {
      return {
        id: item.id,
        sourceTitle: item.title,
        insightType: item.type,
        contentIdea: `Turn this audience discussion from r/${subreddit} into a helpful answer-based post.`,
        channel: 'Instagram, TikTok, LinkedIn, or Community Post',
        format: 'FAQ post, poll, short video, or carousel',
        hook: '“People are asking this question. Here is a simple answer.”',
      };
    }

    if (item.type === 'YouTube Idea') {
      return {
        id: item.id,
        sourceTitle: item.title,
        insightType: item.type,
        contentIdea: 'Create a related short-form video, carousel, or post inspired by this YouTube topic.',
        channel: 'YouTube Shorts, TikTok, Instagram Reels, or LinkedIn',
        format: 'Short video, carousel, or reaction post',
        hook: '“This topic is already getting attention. Here is our take.”',
      };
    }

    return {
      id: item.id,
      sourceTitle: item.title,
      insightType: item.type,
      contentIdea: `Explain this ${topic} trend in simple language and connect it to a customer problem.`,
      channel: 'LinkedIn, Blog, or Email Newsletter',
      format: 'Insight post, carousel, or short article',
      hook: '“Here is what this trend means for customers and small businesses.”',
    };
  });

  return (
    <Panel
      title="Content Planner"
      subtitle="Turn saved research into practical content ideas for marketing, social media, and newsletters."
      icon={CalendarDays}
      accent="emerald"
    >
      {savedResearch.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          message="No content ideas yet."
          hint="Save at least one trend, audience question, or YouTube idea."
        />
      ) : (
        <div className="grid gap-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
              <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300">
                {idea.insightType} based idea
              </span>

              <p className="mt-3 text-sm font-semibold leading-6 text-white">
                {idea.contentIdea}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Based on: {idea.sourceTitle}
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Channel</p>
                  <p className="mt-2 text-sm text-slate-300">{idea.channel}</p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Format</p>
                  <p className="mt-2 text-sm text-slate-300">{idea.format}</p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Hook</p>
                  <p className="mt-2 text-sm text-slate-300">{idea.hook}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
};

const ExportSection = ({ savedResearch, user }) => {
  const exportResearch = () => {
    const rows = savedResearch.map((item) => ({
      type: item.type,
      title: item.title,
      source: item.source,
      context: item.context,
      note: item.note || '',
      url: item.url,
      savedAt: item.savedAt,
    }));

    exportToCsv('insighthub-saved-research.csv', rows);
  };

  const exportContentPlan = () => {
    const rows = savedResearch.map((item) => ({
      sourceType: item.type,
      sourceTitle: item.title,
      contentIdea:
        item.type === 'Audience Question'
          ? 'Create an answer-based post from this audience question.'
          : item.type === 'YouTube Idea'
          ? 'Create a related video, carousel, or short-form post inspired by this format.'
          : 'Create a simple educational post based on this trend.',
      suggestedChannel:
        item.type === 'YouTube Idea'
          ? 'YouTube Shorts / TikTok / Instagram Reels'
          : 'LinkedIn / Instagram / Blog / Newsletter',
      note: item.note || '',
      url: item.url,
    }));

    exportToCsv('insighthub-content-plan.csv', rows);
  };

  return (
    <Panel
      title="Export"
      subtitle="Download saved research or content plans as CSV files."
      icon={Download}
      accent="cyan"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={exportResearch}
          className="rounded-2xl border border-indigo-400/25 bg-indigo-500/10 p-5 text-left transition hover:bg-indigo-500/15"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-indigo-100">
            <Download size={16} />
            Export Saved Research
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Download saved trends, audience questions, YouTube ideas, notes, and links.
          </p>
        </button>

        <button
          onClick={exportContentPlan}
          className="rounded-2xl border border-cyan-400/25 bg-cyan-500/10 p-5 text-left transition hover:bg-cyan-500/15"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
            <FileText size={16} />
            Export Content Plan
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Download a simple content plan generated from your saved research.
          </p>
        </button>
      </div>

      <p className="mt-5 text-xs text-slate-600">
        Logged in as {user?.email}. Export files are generated locally in your browser.
      </p>
    </Panel>
  );
};

const Dashboard = () => {
  const { user, logout, updatePreferences } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const defaultKeywords = [
    'digital marketing',
    'content ideas',
    'small business marketing',
    'e-commerce marketing',
    'social media strategy',
    'skincare trends',
  ];

  const [keywords, setKeywords] = useState(() => {
    const stored = localStorage.getItem('insighthub_keywords');

    if (!stored) return defaultKeywords;

    try {
      const parsed = JSON.parse(stored);
      return parsed.length > 0 ? parsed : defaultKeywords;
    } catch {
      return defaultKeywords;
    }
  });

  const dashboardRef = useRef(null);
const keywordsRef = useRef(null);
const trendsRef = useRef(null);
const audienceRef = useRef(null);
const youtubeRef = useRef(null);
const savedRef = useRef(null);
const plannerRef = useRef(null);
const exportRef = useRef(null);

const refs = useMemo(() => ({
  dashboard: dashboardRef,
  keywords: keywordsRef,
  trends: trendsRef,
  audience: audienceRef,
  youtube: youtubeRef,
  saved: savedRef,
  planner: plannerRef,
  export: exportRef,
}), []);

  const userId = user?.id || user?._id || user?.email;
  const { savedResearch, saveItem, removeItem, updateNote, isSaved } = useSavedResearch(userId);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'IH';

  const greeting =
    new Date().getHours() < 12
      ? 'morning'
      : new Date().getHours() < 18
      ? 'afternoon'
      : 'evening';

  const focusOptions = ['technology', 'business', 'science', 'health', 'sports'];

  const [currentFocus, setCurrentFocus] = useState(
    user?.preferences?.newsTopics?.[0] || 'technology'
  );

  const subreddit = user?.preferences?.subreddit || 'technology';

  useEffect(() => {
    setCurrentFocus(user?.preferences?.newsTopics?.[0] || 'technology');
  }, [user]);

  const handleFocusChange = async (nextFocus) => {
    setCurrentFocus(nextFocus);

    try {
      await updatePreferences({
        newsTopics: [nextFocus],
        subreddit,
      });
    } catch {
      console.error('Could not update current focus');
    }
  };

  useEffect(() => {
    const entries = Object.entries(refs);

    const observer = new IntersectionObserver(
      (items) => {
        items.forEach((item) => {
          if (item.isIntersecting) {
            const found = entries.find(([, ref]) => ref.current === item.target);
            if (found) setActiveNav(found[0]);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    entries.forEach(([, ref]) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [refs]);

  const scrollTo = (key) => {
    refs[key]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setActiveNav(key);
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', desc: 'Overview', icon: LayoutDashboard },
    { key: 'keywords', label: 'Keyword Watchlist', desc: 'Custom topics', icon: Search },
    { key: 'trends', label: 'Trend Finder', desc: 'Industry topics', icon: TrendingUp },
    { key: 'audience', label: 'Audience Questions', desc: 'Community discussions', icon: MessageCircle },
    { key: 'youtube', label: 'YouTube Trends', desc: 'Video content ideas', icon: PlayCircle },
    { key: 'saved', label: 'Saved Research', desc: 'Notes and links', icon: Bookmark },
    { key: 'planner', label: 'Content Planner', desc: 'Post ideas', icon: CalendarDays },
    { key: 'export', label: 'Export', desc: 'CSV downloads', icon: Download },
  ];

  const kpis = [
    {
      title: 'Research Sources',
      value: '3',
      subtitle: 'News, Reddit, and YouTube',
      icon: Database,
      gradient: 'from-indigo-400 to-cyan-400',
    },
    {
      title: 'Saved Research',
      value: savedResearch.length,
      subtitle: 'Items saved for content planning',
      icon: Bookmark,
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      title: 'Content Ideas',
      value: savedResearch.length,
      subtitle: 'Generated from saved research',
      icon: Lightbulb,
      gradient: 'from-fuchsia-400 to-indigo-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[30%] h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>

      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/[0.08] bg-slate-950/85 p-5 backdrop-blur-xl lg:block">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="font-semibold text-white">InsightHub</p>
              <p className="text-xs text-slate-500">Content Research Assistant</p>
            </div>
          </div>

          <nav className="mt-10 space-y-1.5">
            {navItems.map((item) => {
              const NavIcon = item.icon;
              const active = activeNav === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => scrollTo(item.key)}
                  className={`w-full rounded-xl px-3 py-3 text-left text-sm transition ${
                    active
                      ? 'bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-400/20'
                      : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        active ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/[0.04] text-slate-500'
                      }`}
                    >
                      <NavIcon size={15} />
                    </div>

                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-[11px] text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
            <p className="text-sm font-medium text-indigo-100">Why use this?</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Find trends, save useful research, and turn it into content ideas without checking many platforms separately.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-slate-950/80 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="lg:hidden">
                  <Logo />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">Content Research Dashboard</p>
                  <p className="text-xs text-slate-500">
                    Find trends, understand audience questions, and plan content faster.
                  </p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 transition hover:bg-white/[0.07]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-semibold text-white">
                    {initials}
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="text-xs font-medium text-white">{user?.name || 'User'}</p>
                    <p className="text-[11px] text-slate-500">{user?.plan?.toUpperCase() || 'FREE'} plan</p>
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950 shadow-2xl shadow-black/50">
                    <div className="border-b border-white/[0.08] px-4 py-3">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    </div>

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-rose-300 transition hover:bg-rose-500/10"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-8 overflow-x-hidden p-4 sm:p-6">
            <Section sectionRef={refs.dashboard}>
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-600/20 via-slate-900 to-cyan-500/10 p-6 shadow-xl shadow-slate-950/40">
                <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute -bottom-20 left-20 h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Logo size={48} />

                    <div>
                      <p className="text-base font-semibold text-white">
                        Good {greeting}, {user?.name?.split(' ')[0] || 'there'}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Use InsightHub to research trends, capture audience questions, and plan useful content.
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
                    CONTENT RESEARCH WORKSPACE
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                {kpis.map((kpi) => (
                  <KPICard key={kpi.title} {...kpi} />
                ))}

                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40 transition hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-xl">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-400 to-teal-500" />
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.03] blur-xl transition group-hover:bg-white/[0.05]" />

                  <div className="relative">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Current Focus
                      </p>

                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400">
                        <Target size={15} />
                      </div>
                    </div>

                    <Select
                      value={currentFocus}
                      onChange={(e) => handleFocusChange(e.target.value)}
                      className="w-full"
                    >
                      {focusOptions.map((item) => (
                        <option key={item} value={item}>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                      ))}
                    </Select>

                    <p className="mt-2 text-xs text-slate-500">
                      Used by Trend Finder, YouTube Trends, and Content Planner.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <Section sectionRef={refs.keywords}>
              <KeywordWatchlistSection keywords={keywords} setKeywords={setKeywords} />
            </Section>

            <Section sectionRef={refs.trends}>
              <TrendFinderSection
                userPrefs={{
                  ...user?.preferences,
                  newsTopics: [currentFocus],
                }}
                saveItem={saveItem}
                isSaved={isSaved}
              />
            </Section>

            <Section sectionRef={refs.audience}>
              <AudienceQuestionsSection
                userPrefs={user?.preferences}
                saveItem={saveItem}
                isSaved={isSaved}
              />
            </Section>

            <Section sectionRef={refs.youtube}>
              <YouTubeTrendsSection
                keywords={keywords}
                saveItem={saveItem}
                isSaved={isSaved}
                user={{
                  ...user,
                  preferences: {
                    ...user?.preferences,
                    newsTopics: [currentFocus],
                  },
                }}
              />
            </Section>

            <Section sectionRef={refs.saved}>
              <SavedResearchSection
                savedResearch={savedResearch}
                removeItem={removeItem}
                updateNote={updateNote}
              />
            </Section>

            <Section sectionRef={refs.planner}>
              <ContentPlannerSection
                savedResearch={savedResearch}
                user={{
                  ...user,
                  preferences: {
                    ...user?.preferences,
                    newsTopics: [currentFocus],
                  },
                }}
              />
            </Section>

            <Section sectionRef={refs.export}>
              <ExportSection savedResearch={savedResearch} user={user} />
            </Section>

            <footer className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] pt-5 text-xs text-slate-600 sm:flex-row">
              <div className="flex items-center gap-2">
                <Logo size={26} />
                <span>InsightHub · Content Research Assistant</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span>NewsAPI</span>
                <span>·</span>
                <span>Reddit</span>
                <span>·</span>
                <span>YouTube</span>
                <span>·</span>
                <span>Saved Research</span>
                <span>·</span>
                <span>Content Planning</span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;