const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const authService = require('../../services/authService');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const result = await authService.findOrCreateOAuthUser(profile, 'google');
        done(null, result);
    } catch (error) {
        done(error, null);
    }
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const result = await authService.findOrCreateOAuthUser(profile, 'facebook');
        done(null, result);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await authService.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// Register with email/password
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    body('phone').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, firstName, lastName, phone } = req.body;
        const result = await authService.register({
            email,
            password,
            firstName,
            lastName,
            phone
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: result.user._id,
                email: result.user.email,
                profile: result.user.profile,
                role: result.user.role
            },
            token: result.token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login with email/password
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const result = await authService.login(email, password);

        res.json({
            message: 'Login successful',
            user: {
                id: result.user._id,
                email: result.user.email,
                profile: result.user.profile,
                role: result.user.role
            },
            token: result.token
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Send token to frontend
        const token = req.user.token;
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?token=${token}`);
    }
);

// Facebook OAuth
router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

// Facebook OAuth callback
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        // Send token to frontend
        const token = req.user.token;
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?token=${token}`);
    }
);

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                profile: user.profile,
                role: user.role,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    // For stateless JWT, logout is handled on frontend by removing token
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
