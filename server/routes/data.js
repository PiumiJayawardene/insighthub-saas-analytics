/**
 * Data Routes — External API Proxy
 * All external API calls are proxied through here so:
 *   1. API keys are never exposed to the frontend
 *   2. Responses are cached in MongoDB
 *   3. Rate limiting is applied server-side
 *
 * GET /api/data/news?topic=technology&pageSize=8
 * GET /api/data/weather?city=London
 * GET /api/data/reddit?subreddit=technology&limit=10
 * GET /api/data/summary
 */

const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const CacheEntry = require('../models/CacheEntry');

const router = express.Router();

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: 'Too many requests. Please slow down.' },
});

router.get('/news', protect, apiLimiter, async (req, res) => {
    try {
        const topic = req.query.topic || 'technology';
        const pageSize = req.query.pageSize || 8;
        const cacheKey = `news:${topic}:${pageSize}`;

        const result = await CacheEntry.getOrFetch(
            cacheKey,
            'news',
            async () => {
                const response = await axios.get(
                    'https://newsapi.org/v2/top-headlines',
                    {
                        params: {
                            q: topic,
                            pageSize: parseInt(pageSize),
                            language: 'en',
                            apiKey: process.env.NEWS_API_KEY,
                        },
                        timeout: 10000,
                    }
                );
                return response.data;
            },
            30
        );

        res.json({ success: true, topic, ...result });

    } catch (err) {
        if (err.response?.status === 426) {
            return res.status(426).json({
                error: 'NewsAPI requires HTTPS in production. Using cached data only.',
            });
        }
        if (err.response?.status === 429) {
            return res.status(429).json({
                error: 'NewsAPI rate limit reached. Try again in 1 hour.',
            });
        }
        console.error('News fetch error:', err.message);
        res.status(500).json({ error: 'Failed to fetch news data.' });
    }
});

router.get('/weather', protect, apiLimiter, async (req, res) => {
    try {
        const city = req.query.city || req.user.preferences?.city || 'London';
        const cacheKey = `weather:${city.toLowerCase()}`;

        const result = await CacheEntry.getOrFetch(
            cacheKey,
            'weather',
            async () => {
                const response = await axios.get(
                    'https://api.openweathermap.org/data/2.5/weather',
                    {
                        params: {
                            q: city,
                            appid: process.env.OPENWEATHER_API_KEY,
                            units: 'metric',
                        },
                        timeout: 8000,
                    }
                );
                return response.data;
            },
            15
        );

        res.json({ success: true, city, ...result });

    } catch (err) {
        if (err.response?.status === 404) {
            return res.status(404).json({
                error: `City "${req.query.city}" not found. Try a different city name.`,
            });
        }
        console.error('Weather fetch error:', err.message);
        res.status(500).json({ error: 'Failed to fetch weather data.' });
    }
});

router.get('/reddit', protect, apiLimiter, async (req, res) => {
    try {
        const subreddit = req.query.subreddit ||
            req.user.preferences?.subreddit ||
            'technology';

        const limit = Math.min(parseInt(req.query.limit) || 10, 25);
        const cacheKey = `reddit:${subreddit}:${limit}`;

        const result = await CacheEntry.getOrFetch(
            cacheKey,
            'reddit',
            async () => {
                const response = await axios.get(
                    `https://www.reddit.com/r/${subreddit}/hot.json`,
                    {
                        params: { limit },
                        headers: { 'User-Agent': 'InsightHub/1.0 (portfolio project)' },
                        timeout: 10000,
                    }
                );

                const posts = response.data.data.children.map(({ data: p }) => ({
                    id: p.id,
                    title: p.title,
                    score: p.score,
                    url: p.url,
                    permalink: `https://reddit.com${p.permalink}`,
                    numComments: p.num_comments,
                    subreddit: p.subreddit,
                    author: p.author,
                    createdAt: new Date(p.created_utc * 1000).toISOString(),
                }));

                return { posts, subreddit, count: posts.length };
            },
            20
        );

        res.json({ success: true, ...result });

    } catch (err) {
        if (err.response?.status === 403) {
            return res.status(403).json({
                error: `r/${req.query.subreddit} is private or restricted.`,
            });
        }
        if (err.response?.status === 404) {
            return res.status(404).json({
                error: `r/${req.query.subreddit} does not exist.`,
            });
        }
        console.error('Reddit fetch error:', err.message);
        res.status(500).json({ error: 'Failed to fetch Reddit data.' });
    }
});

router.get('/summary', protect, async (req, res) => {
    try {
        const [totalCache, recentFetches] = await Promise.all([
            CacheEntry.countDocuments(),
            CacheEntry.find()
                .sort({ fetchedAt: -1 })
                .limit(5)
                .select('dataType fetchedAt hitCount cacheKey -_id'),
        ]);

        res.json({
            success: true,
            data: {
                cachedEntries: totalCache,
                recentFetches,
                serverTime: new Date().toISOString(),
                userPrefs: req.user.preferences,
            },
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch summary.' });
    }
});

module.exports = router;