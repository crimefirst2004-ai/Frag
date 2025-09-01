/**
 * Wishlist Management JavaScript
 * Handles wishlist functionality including adding, removing, and managing saved items
 */

class WishlistManager {
    constructor() {
        this.wishlist = [];
        this.init();
    }

    init() {
        this.loadWishlist();
        this.setupEventListeners();
        this.updateUI();
    }

    loadWishlist() {
        // Load wishlist from localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            this.wishlist = JSON.parse(savedWishlist);
        }
    }

    setupEventListeners() {
        // Add all to cart button
        const addAllBtn = document.getElementById('add-all-to-cart');
        if (addAllBtn) {
            addAllBtn.addEventListener('click', () => this.addAllToCart());
        }

        // Clear wishlist button
        const clearBtn = document.getElementById('clear-wishlist');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearWishlist());
        }

        // Share wishlist button
        const shareBtn = document.getElementById('share-wishlist');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareWishlist());
        }

        // Delegate event listeners for dynamic content
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-wishlist-btn')) {
                this.removeFromWishlist(e.target.dataset.productId);
            }
            if (e.target.classList.contains('add-to-cart-btn')) {
                this.addToCart(e.target.dataset.productId);
            }
        });
    }

    updateUI() {
        this.displayWishlist();
        this.updateSummary();
    }

    displayWishlist() {
        const container = document.getElementById('wishlist-items');
        if (!container) return;

        if (this.wishlist.length === 0) {
            container.innerHTML = `
                <div class="empty-wishlist">
                    <i class="fas fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Start adding your favorite fragrances to your wishlist</p>
                    <a href="products.html" class="cta-button">Browse Products</a>
                </div>
            `;
            return;
        }

        const wishlistHTML = this.wishlist.map(item => this.createWishlistItemHTML(item)).join('');
        container.innerHTML = wishlistHTML;
    }

    createWishlistItemHTML(item) {
        return `
            <div class="wishlist-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-description">${item.description}</p>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <div class="item-actions">
                        <button class="add-to-cart-btn" data-product-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="remove-wishlist-btn" data-product-id="${item.id}">
                            <i class="fas fa-trash"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    updateSummary() {
        const countElement = document.getElementById('wishlist-count');
        const totalElement = document.getElementById('wishlist-total');
        const addAllBtn = document.getElementById('add-all-to-cart');

        if (countElement) {
            countElement.textContent = this.wishlist.length;
        }

        if (totalElement) {
            const total = this.wishlist.reduce((sum, item) => sum + item.price, 0);
            totalElement.textContent = `$${total.toFixed(2)}`;
        }

        if (addAllBtn) {
            addAllBtn.disabled = this.wishlist.length === 0;
        }
    }

    addToWishlist(product) {
        // Check if product is already in wishlist
        const existingIndex = this.wishlist.findIndex(item => item.id === product.id);
        
        if (existingIndex === -1) {
            this.wishlist.push(product);
            this.saveWishlist();
            this.updateUI();
            this.showMessage('Product added to wishlist!', 'success');
        } else {
            this.showMessage('Product is already in your wishlist!', 'info');
        }
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        this.saveWishlist();
        this.updateUI();
        this.showMessage('Product removed from wishlist!', 'success');
    }

    addToCart(productId) {
        // Get product from wishlist
        const product = this.wishlist.find(item => item.id === productId);
        if (!product) return;

        // Add to cart (this would integrate with cart system)
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showMessage('Product added to cart!', 'success');
    }

    addAllToCart() {
        if (this.wishlist.length === 0) return;

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        this.wishlist.forEach(product => {
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showMessage('All items added to cart!', 'success');
    }

    clearWishlist() {
        if (this.wishlist.length === 0) return;

        if (confirm('Are you sure you want to clear your wishlist?')) {
            this.wishlist = [];
            this.saveWishlist();
            this.updateUI();
            this.showMessage('Wishlist cleared!', 'success');
        }
    }

    shareWishlist() {
        if (this.wishlist.length === 0) {
            this.showMessage('Your wishlist is empty!', 'error');
            return;
        }

        // Create shareable link or text
        const wishlistText = this.wishlist.map(item => `${item.name} - $${item.price}`).join('\n');
        const shareText = `Check out my wishlist from Luxe Fragrances:\n${wishlistText}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Luxe Fragrances Wishlist',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showMessage('Wishlist copied to clipboard!', 'success');
            });
        }
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
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

// Initialize wishlist manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WishlistManager();
});
