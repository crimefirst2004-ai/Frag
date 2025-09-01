const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profile: {
        firstName: String,
        lastName: String,
        phone: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
