import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useAuth, api } from '../context/AuthContext';
import {
    trackDataFetched,
    trackWidgetRefreshed,
    trackFilterChanged,
    trackNewsArticleClicked,
    trackFeatureUsed,
} from '../analytics/ga4';

const KPICard = ({ title, value, subtitle, icon, accent }) => (
    <div className={`bg-white rounded-xl border ${accent || 'border-gray-200'} p-4 shadow-sm`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            <span className="text-xl">{icon}</span>
        </div>
    </div>
);

const NewsWidget = ({ userPrefs }) => {
    const defaultTopic = userPrefs?.newsTopics?.[0] || 'technology';
    const [topic, setTopic] = useState(defaultTopic);

    const topics = ['technology', 'business', 'science', 'health', 'sports'];

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['news', topic],
        queryFn: async () => {
            const res = await api.get(`/data/news?topic=${topic}&pageSize=8`);
            trackDataFetched('news', res.data.fromCache);
            return res.data;
        },
    });

    const handleTopicChange = (e) => {
        setTopic(e.target.value);
        trackFilterChanged('news_topic', e.target.value);
        trackFeatureUsed('news_filter');
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">📰 Latest News</h3>
                <div className="flex items-center gap-2">
                    <select
                        value={topic}
                        onChange={handleTopicChange}
                        className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 focus:outline-none"
                    >
                        {topics.map(t => (
                            <option key={t} value={t}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => { refetch(); trackWidgetRefreshed('news'); }}
                        className="text-xs px-2 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50"
                    >
                        ↻
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>
            )}

            {error && (
                <p className="text-xs text-red-500 text-center py-4">
                    Failed to load news. Please refresh.
                </p>
            )}

            {data?.data?.articles && (
                <div className="space-y-3">
                    {data.data.articles.slice(0, 6).map((article, i) => (
                        <a
                            key={i}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackNewsArticleClicked(
                                article.title,
                                article.source?.name
                            )}
                            className="block group"
                        >
                            <p className="text-xs font-medium text-gray-800 group-hover:text-blue-600 leading-snug line-clamp-2">
                                {article.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {article.source?.name} ·{' '}
                                {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                                    day: 'numeric', month: 'short'
                                })}
                            </p>
                        </a>
                    ))}
                </div>
            )}

            {data?.fromCache && (
                <p className="text-xs text-gray-300 mt-3 text-right">From cache</p>
            )}
        </div>
    );
};

const RedditWidget = ({ userPrefs }) => {
    const defaultSub = userPrefs?.subreddit || 'technology';
    const [sub, setSub] = useState(defaultSub);

    const subs = ['technology', 'programming', 'datascience', 'webdev', 'business'];

    const { data, isLoading } = useQuery({
        queryKey: ['reddit', sub],
        queryFn: async () => {
            const res = await api.get(`/data/reddit?subreddit=${sub}&limit=8`);
            trackDataFetched('reddit', res.data.fromCache);
            return res.data;
        },
    });

    const chartData = data?.data?.posts?.slice(0, 6).map(post => ({
        name: post.title.substring(0, 18) + '…',
        score: post.score,
        comments: post.numComments,
    })) || [];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">🔥 Reddit Trending</h3>
                <select
                    value={sub}
                    onChange={e => {
                        setSub(e.target.value);
                        trackFilterChanged('reddit_subreddit', e.target.value);
                    }}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 focus:outline-none"
                >
                    {subs.map(s => (
                        <option key={s} value={s}>r/{s}</option>
                    ))}
                </select>
            </div>

            {isLoading && (
                <div className="h-48 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 30, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" interval={0} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip
                            contentStyle={{ fontSize: '11px' }}
                            formatter={(value, name) => [
                                value.toLocaleString(),
                                name === 'score' ? 'Upvotes' : 'Comments'
                            ]}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                        <Bar dataKey="score" fill="#3b82f6" radius={[2,2,0,0]} name="Upvotes" />
                        <Bar dataKey="comments" fill="#93c5fd" radius={[2,2,0,0]} name="Comments" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

const WeatherWidget = ({ userPrefs }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['weather', userPrefs?.city],
        queryFn: async () => {
            const city = userPrefs?.city || 'London';
            const res = await api.get(`/data/weather?city=${city}`);
            trackDataFetched('weather', res.data.fromCache);
            return res.data;
        },
    });

    const weather = data?.data;

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 text-white shadow-sm">
            <h3 className="font-semibold text-sm mb-3 text-blue-100">🌤 Current Weather</h3>

            {isLoading && (
                <div className="h-16 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {error && <p className="text-xs text-blue-200">Weather unavailable</p>}

            {weather && (
                <div>
                    <div className="flex items-end gap-2 mb-1">
                        <span className="text-4xl font-light">{Math.round(weather.main?.temp)}°C</span>
                    </div>
                    <p className="text-sm capitalize text-blue-100">
                        {weather.weather?.[0]?.description}
                    </p>
                    <p className="text-xs text-blue-200 mt-1">
                        {weather.name}, {weather.sys?.country}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-blue-100">
                        <span>💧 {weather.main?.humidity}% humidity</span>
                        <span>💨 {Math.round(weather.wind?.speed)} m/s wind</span>
                        <span>🌡 Feels {Math.round(weather.main?.feels_like)}°C</span>
                        <span>👁 {(weather.visibility / 1000).toFixed(1)}km vis</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const Dashboard = () => {
    const { user, logout } = useAuth();

    const { data: summary } = useQuery({
        queryKey: ['summary'],
        queryFn: () => api.get('/data/summary').then(r => r.data),
    });

    const kpis = [
        {
            title: 'Data Sources',
            value: '3',
            subtitle: 'News · Reddit · Weather',
            icon: '🔗',
        },
        {
            title: 'Cached Entries',
            value: summary?.data?.cachedEntries ?? '—',
            subtitle: 'MongoDB TTL cache',
            icon: '⚡',
        },
        {
            title: 'Your Plan',
            value: user?.plan?.toUpperCase() || 'FREE',
            subtitle: 'Upgrade for more sources',
            icon: '💎',
        },
        {
            title: 'Member Since',
            value: user ? new Date(user.createdAt).toLocaleDateString(
                'en-GB', { month: 'short', year: 'numeric' }
            ) : '—',
            subtitle: 'Welcome aboard!',
            icon: '📅',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">IH</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">InsightHub</span>
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                        {user?.plan?.toUpperCase()}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
                    <button
                        onClick={logout}
                        className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="mb-6">
                    <h1 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        Real-time insights aggregated from across the web
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {kpis.map(kpi => <KPICard key={kpi.title} {...kpi} />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <NewsWidget userPrefs={user?.preferences} />
                    </div>

                    <div>
                        <WeatherWidget userPrefs={user?.preferences} />
                    </div>

                    <div className="lg:col-span-3">
                        <RedditWidget userPrefs={user?.preferences} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;