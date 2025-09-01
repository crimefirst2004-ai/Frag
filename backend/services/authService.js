const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
    // Generate JWT token
    generateToken(user) {
        return jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
    }

    // Hash password
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    // Verify password
    async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Register user with email/password
    async register(userData) {
        const { email, password, firstName, lastName, phone } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        // Hash password
        const hashedPassword = await this.hashPassword(password);

        // Create user
        const user = new User({
            email,
            password: hashedPassword,
            profile: {
                firstName,
                lastName,
                phone
            }
        });

        await user.save();
        const token = this.generateToken(user);

        return { user, token };
    }

    // Login with email/password
    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isValidPassword = await this.verifyPassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = this.generateToken(user);
        return { user, token };
    }

    // Find or create user from OAuth profile
    async findOrCreateOAuthUser(profile, provider) {
        let user;

        if (provider === 'google') {
            user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    profile: {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName
                    }
                });
                await user.save();
            }
        } else if (provider === 'facebook') {
            user = await User.findOne({ facebookId: profile.id });
            if (!user) {
                user = new User({
                    facebookId: profile.id,
                    email: profile.emails[0].value,
                    profile: {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName
                    }
                });
                await user.save();
            }
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = this.generateToken(user);
        return { user, token };
    }

    // Get user by ID
    async getUserById(userId) {
        return await User.findById(userId).select('-password');
    }

    // Verify JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

module.exports = new AuthService();
