/**
 * User Model
 * Stores InsightHub user accounts.
 * Passwords are bcrypt hashed before save (12 rounds).
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
    },
    preferences: {
        newsTopics: { type: [String], default: ['technology', 'business'] },
        city: { type: String, default: 'London' },
        subreddit: { type: String, default: 'technology' },
        theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    },
    lastLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        plan: this.plan,
        preferences: this.preferences,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin,
    };
};

module.exports = mongoose.model('User', userSchema);