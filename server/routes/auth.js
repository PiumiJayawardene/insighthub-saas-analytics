/**
 * Auth Routes
 * POST /api/auth/register  — Create new account
 * POST /api/auth/login     — Login and receive JWT
 * GET  /api/auth/me        — Get current user (protected)
 * PUT  /api/auth/preferences — Update user preferences (protected)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const generateToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', authLimiter, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Name, email, and password are all required.',
            });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({
                error: 'An account with this email already exists.',
            });
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: user.toSafeObject(),
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ error: messages.join('. ') });
        }
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required.',
            });
        }

        const user = await User
            .findOne({ email: email.toLowerCase() })
            .select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                error: 'Incorrect email or password.',
            });
        }

        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: user.toSafeObject(),
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

router.get('/me', protect, async (req, res) => {
    res.json({
        success: true,
        user: req.user.toSafeObject(),
    });
});

router.put('/preferences', protect, async (req, res) => {
    try {
        const { newsTopics, city, subreddit, theme } = req.body;
        const updates = {};

        if (newsTopics) updates['preferences.newsTopics'] = newsTopics;
        if (city) updates['preferences.city'] = city;
        if (subreddit) updates['preferences.subreddit'] = subreddit;
        if (theme) updates['preferences.theme'] = theme;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            user: user.toSafeObject(),
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to update preferences.' });
    }
});

module.exports = router;