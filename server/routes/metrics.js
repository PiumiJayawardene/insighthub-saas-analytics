/**
 * Metrics Routes
 * GET /api/metrics/cache-stats — Cache performance statistics
 */

const express = require('express');
const { protect } = require('../middleware/auth');
const CacheEntry = require('../models/CacheEntry');

const router = express.Router();

router.get('/cache-stats', protect, async (req, res) => {
    try {
        const stats = await CacheEntry.aggregate([
            {
                $group: {
                    _id: '$dataType',
                    count: { $sum: 1 },
                    totalHits: { $sum: '$hitCount' },
                    avgHits: { $avg: '$hitCount' },
                },
            },
        ]);

        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch cache stats.' });
    }
});

module.exports = router;