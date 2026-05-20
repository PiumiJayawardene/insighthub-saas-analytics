/**
 * CacheEntry Model
 * Caches API responses in MongoDB to reduce external API calls.
 */

const mongoose = require('mongoose');

const cacheEntrySchema = new mongoose.Schema({
    cacheKey: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    dataType: {
        type: String,
        enum: ['news', 'reddit', 'summary'],
        required: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    fetchedAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 },
    },
    hitCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

cacheEntrySchema.statics.getOrFetch = async function(
    cacheKey,
    dataType,
    fetchFn,
    ttlMinutes = 30
) {
    const cached = await this.findOne({
        cacheKey,
        expiresAt: { $gt: new Date() },
    });

    if (cached) {
        this.updateOne({ cacheKey }, { $inc: { hitCount: 1 } }).exec();
        return { data: cached.data, fromCache: true, hitCount: cached.hitCount };
    }

    const freshData = await fetchFn();

    await this.findOneAndUpdate(
        { cacheKey },
        {
            cacheKey,
            dataType,
            data: freshData,
            fetchedAt: new Date(),
            expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000),
            hitCount: 0,
        },
        { upsert: true, new: true }
    );

    return { data: freshData, fromCache: false, hitCount: 0 };
};

module.exports = mongoose.model('CacheEntry', cacheEntrySchema);