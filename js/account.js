/**
 * Account Management JavaScript
 * Handles user account functionality including profile updates, order history, and settings
 */

class AccountManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateUI();
    }

    async loadUserData() {
        // Load user data from API using token
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
            } else {
                // Token invalid, redirect to login
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        }
    }

    setupEventListeners() {
        // Profile form submission
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Password form submission
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => this.handlePasswordUpdate(e));
        }

        // Tab navigation
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e));
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Order details buttons
        const orderDetailBtns = document.querySelectorAll('.order-detail-btn');
        orderDetailBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.showOrderDetails(e));
        });
    }

    updateUI() {
        if (!this.currentUser) return;

        // Update profile information
        this.updateProfileDisplay();
        
        // Load orders
        this.loadOrders();
        
        // Load wishlist
        this.loadWishlist();
    }

    updateProfileDisplay() {
        const nameField = document.getElementById('user-name');
        const emailField = document.getElementById('user-email');
        const phoneField = document.getElementById('user-phone');

        if (nameField) nameField.value = this.currentUser.name || '';
        if (emailField) emailField.value = this.currentUser.email || '';
        if (phoneField) phoneField.value = this.currentUser.phone || '';

        // Update display name
        const displayName = document.querySelector('.user-name');
        if (displayName) {
            displayName.textContent = this.currentUser.name || 'User';
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const updates = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address')
        };

        try {
            // Update user data
            this.currentUser = { ...this.currentUser, ...updates };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            this.showMessage('Profile updated successfully!', 'success');
            this.updateProfileDisplay();
        } catch (error) {
            this.showMessage('Failed to update profile. Please try again.', 'error');
        }
    }

    async handlePasswordUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword !== confirmPassword) {
            this.showMessage('New passwords do not match.', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showMessage('Password must be at least 6 characters long.', 'error');
            return;
        }

        try {
            // In a real app, you would validate current password and update on server
            this.showMessage('Password updated successfully!', 'success');
            e.target.reset();
        } catch (error) {
            this.showMessage('Failed to update password. Please try again.', 'error');
        }
    }

    switchTab(e) {
        const targetTab = e.target.getAttribute('data-tab');
        
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        e.target.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    }

    loadOrders() {
        const ordersContainer = document.getElementById('orders-list');
        if (!ordersContainer) return;

        // Load orders from localStorage or API
        const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p class="no-orders">No orders found.</p>';
            return;
        }

        const ordersHTML = orders.map(order => this.createOrderHTML(order)).join('');
        ordersContainer.innerHTML = ordersHTML;
    }

    createOrderHTML(order) {
        return `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Order #${order.id}</h4>
                        <p class="order-date">${new Date(order.date).toLocaleDateString()}</p>
                        <p class="order-status ${order.status.toLowerCase()}">${order.status}</p>
                    </div>
                    <div class="order-total">
                        <span class="total-amount">$${order.total.toFixed(2)}</span>
                        <button class="order-detail-btn" data-order-id="${order.id}">View Details</button>
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-product">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="product-info">
                                <h5>${item.name}</h5>
                                <p>Qty: ${item.quantity}</p>
                                <p class="product-price">$${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    loadWishlist() {
        const wishlistContainer = document.getElementById('wishlist-items');
        if (!wishlistContainer) return;

        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<p class="no-wishlist">Your wishlist is empty.</p>';
            return;
        }

        const wishlistHTML = wishlist.map(item => this.createWishlistItemHTML(item)).join('');
        wishlistContainer.innerHTML = wishlistHTML;
    }

    createWishlistItemHTML(item) {
        return `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h5>${item.name}</h5>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-actions">
                    <button class="add-to-cart-btn" data-product-id="${item.id}">Add to Cart</button>
                    <button class="remove-wishlist-btn" data-product-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    showOrderDetails(e) {
        const orderId = e.target.getAttribute('data-order-id');
        // Implement order details modal or navigation
        console.log('Show order details for:', orderId);
    }

    logout() {
        // Clear user data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        
        // Redirect to login
        window.location.href = 'login.html';
    }

    showMessage(message, type = 'info') {
        // Create and show message notification
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize account manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AccountManager();
});
