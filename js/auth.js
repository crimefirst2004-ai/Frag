// Authentication and User Management System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.baseURL = 'http://localhost:5000/api'; // Backend API URL
        this.init();
    }

    init() {
        this.loadToken();
        this.setupAuthListeners();
        this.setupFormListeners();
        this.checkAuthState();
        this.checkOAuthCallback();
    }

    setupFormListeners() {
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(registerForm);
                const userData = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    password: formData.get('password'),
                    confirmPassword: formData.get('confirmPassword'),
                    terms: formData.get('terms'),
                    newsletter: formData.get('newsletter')
                };
                if (userData.password !== userData.confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                if (!userData.terms) {
                    alert('You must agree to the Terms of Service and Privacy Policy');
                    return;
                }
                try {
                    await this.registerWithAPI(userData);
                    alert('Registration successful! Redirecting to account page...');
                    window.location.href = 'account.html';
                } catch (error) {
                    alert('Registration failed: ' + error.message);
                }
            });
        }

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(loginForm);
                const email = formData.get('email');
                const password = formData.get('password');
                try {
                    await this.loginWithAPI(email, password);
                    alert('Login successful! Redirecting to account page...');
                    window.location.href = 'account.html';
                } catch (error) {
                    alert('Login failed: ' + error.message);
                }
            });
        }
    }

    // Load token from localStorage
    loadToken() {
        try {
            this.token = localStorage.getItem('authToken');
            if (this.token) {
                this.loadCurrentUser();
            }
        } catch (error) {
            console.error('Error loading token:', error);
            this.logout();
        }
    }

    // Save token to localStorage
    saveToken(token) {
        try {
            this.token = token;
            if (token) {
                localStorage.setItem('authToken', token);
            } else {
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error('Error saving token:', error);
        }
    }

    // Load current user from API
    async loadCurrentUser() {
        if (!this.token) return;

        try {
            const response = await fetch(`${this.baseURL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.updateUI();
            } else {
                // Token invalid, logout
                this.logout();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.logout();
        }
    }

    // Check OAuth callback on page load
    checkOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (token) {
            this.saveToken(token);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Redirect to account page
            window.location.href = 'account.html';
        } else if (error) {
            console.error('OAuth error:', error);
            alert('Authentication failed. Please try again.');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Register new user
    register(email, password, userData = {}) {
        throw new Error('Use registerWithAPI method instead');
    }

    // Login user
    login(email, password) {
        throw new Error('Use loginWithAPI method instead');
    }

    // Login user via API
    async loginWithAPI(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            this.saveToken(data.token);
            this.currentUser = data.user;
            this.updateUI();
            return data.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Register user via API
    async registerWithAPI(userData) {
        try {
            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            this.saveToken(data.token);
            this.currentUser = data.user;
            this.updateUI();
            return data.user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.token = null;
        this.saveToken(null);
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    }

    // Get all users from storage
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem('users') || '[]');
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) return;

        try {
            const users = this.getUsers();
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...updates };
                localStorage.setItem('users', JSON.stringify(users));
                
                // Update current user
                this.currentUser = { ...this.currentUser, ...updates };
                this.saveCurrentUser();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    // Add address to user
    addAddress(address) {
        if (!this.currentUser) return;

        const newAddress = {
            id: this.generateId(),
            ...address,
            createdAt: new Date().toISOString()
        };

        this.currentUser.addresses.push(newAddress);
        this.updateProfile({ addresses: this.currentUser.addresses });
        return newAddress;
    }

    // Remove address from user
    removeAddress(addressId) {
        if (!this.currentUser) return;

        this.currentUser.addresses = this.currentUser.addresses.filter(addr => addr.id !== addressId);
        this.updateProfile({ addresses: this.currentUser.addresses });
    }

    // Add order to user
    addOrder(order) {
        if (!this.currentUser) return;

        const newOrder = {
            id: this.generateId(),
            ...order,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        this.currentUser.orders.push(newOrder);
        this.updateProfile({ orders: this.currentUser.orders });
        return newOrder;
    }

    // Update order status
    updateOrderStatus(orderId, status) {
        if (!this.currentUser) return;

        const orderIndex = this.currentUser.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            this.currentUser.orders[orderIndex].status = status;
            this.currentUser.orders[orderIndex].updatedAt = new Date().toISOString();
            this.updateProfile({ orders: this.currentUser.orders });
        }
    }

    // Add product to wishlist
    addToWishlist(productId) {
        if (!this.currentUser) return;

        if (!this.currentUser.wishlist.includes(productId)) {
            this.currentUser.wishlist.push(productId);
            this.updateProfile({ wishlist: this.currentUser.wishlist });
        }
    }

    // Remove product from wishlist
    removeFromWishlist(productId) {
        if (!this.currentUser) return;

        this.currentUser.wishlist = this.currentUser.wishlist.filter(id => id !== productId);
        this.updateProfile({ wishlist: this.currentUser.wishlist });
    }

    // Check if product is in wishlist
    isInWishlist(productId) {
        return this.currentUser && this.currentUser.wishlist.includes(productId);
    }

    // Update UI based on authentication state
    updateUI() {
        const userInfo = document.querySelector('.user-info');
        const guestLinks = document.querySelector('.guest-links');
        const authState = this.isAuthenticated() ? 'authenticated' : 'unauthenticated';

        // Update data attributes
        if (userInfo) userInfo.setAttribute('data-auth-state', authState);
        if (guestLinks) guestLinks.setAttribute('data-auth-state', authState);

        if (this.isAuthenticated()) {
            this.showUserInfo();
            this.hideGuestLinks();
        } else {
            this.hideUserInfo();
            this.showGuestLinks();
        }
    }

    // Show user information
    showUserInfo() {
        const userInfo = document.querySelector('.user-info');
        if (userInfo && this.currentUser) {
            userInfo.style.display = 'block';
            userInfo.innerHTML = `
                <div class="user-menu">
                    <button class="user-menu-btn" aria-label="User menu">
                        <i class="fas fa-user"></i>
                        <span>${this.currentUser.profile.firstName || 'User'}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="user-dropdown">
                        <a href="account.html" aria-label="Go to account page">
                            <i class="fas fa-user-circle"></i> My Account
                        </a>
                        ${this.isAdmin() ? '<a href="admin.html" aria-label="Go to admin panel"><i class="fas fa-cog"></i> Admin Panel</a>' : ''}
                        <button type="button" onclick="authManager.logout()" aria-label="Logout">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Hide user information
    hideUserInfo() {
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.style.display = 'none';
        }
    }

    // Show guest links
    showGuestLinks() {
        const guestLinks = document.querySelector('.guest-links');
        if (guestLinks) {
            guestLinks.style.display = 'flex';
        }
    }

    // Hide guest links
    hideGuestLinks() {
        const guestLinks = document.querySelector('.guest-links');
        if (guestLinks) {
            guestLinks.style.display = 'none';
        }
    }

    // Setup authentication event listeners
    setupAuthListeners() {
        // User menu toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.user-menu-btn')) {
                const dropdown = e.target.closest('.user-menu').querySelector('.user-dropdown');
                dropdown.classList.toggle('show');
            } else if (!e.target.closest('.user-menu')) {
                // Close dropdown when clicking outside
                document.querySelectorAll('.user-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });

        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.user-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });
    }

    // Check authentication state on page load
    checkAuthState() {
        // Redirect if user is not authenticated and trying to access protected pages
        const protectedPages = ['account.html', 'admin.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            if (!this.isAuthenticated()) {
                window.location.href = 'login.html';
                return;
            }
            
            // Check admin access for admin page
            if (currentPage === 'admin.html' && !this.isAdmin()) {
                window.location.href = 'index.html';
                return;
            }
        }

        // Redirect if user is authenticated and trying to access login page
        if (currentPage === 'login.html' && this.isAuthenticated()) {
            window.location.href = 'account.html';
        }
    }

    // Validation methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password && password.length >= 8;
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Simple password hashing (for demo purposes - use proper hashing in production)
    hashPassword(password) {
        // This is a simple hash for demonstration
        // In production, use proper password hashing libraries
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Get user's full name
    getFullName() {
        if (!this.currentUser) return '';
        const { firstName, lastName } = this.currentUser.profile;
        return `${firstName || ''} ${lastName || ''}`.trim() || 'User';
    }

    // Get user's email
    getEmail() {
        return this.currentUser ? this.currentUser.email : '';
    }

    // Get user's orders
    getOrders() {
        return this.currentUser ? this.currentUser.orders : [];
    }

    // Get user's addresses
    getAddresses() {
        return this.currentUser ? this.currentUser.addresses : [];
    }

    // Get user's wishlist
    getWishlist() {
        return this.currentUser ? this.currentUser.wishlist : [];
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
