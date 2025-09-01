/**
 * Shopping Cart Management JavaScript
 * Handles cart functionality including adding, removing, and managing cart items
 */

class CartManager {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateUI();
    }

    loadCart() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    setupEventListeners() {
        // Proceed to checkout button
        const checkoutBtn = document.getElementById('proceed-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        // Clear cart button
        const clearBtn = document.getElementById('clear-cart');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCart());
        }

        // Save cart button
        const saveBtn = document.getElementById('save-cart');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCartForLater());
        }

        // Apply promo code button
        const promoBtn = document.getElementById('apply-promo');
        if (promoBtn) {
            promoBtn.addEventListener('click', () => this.applyPromoCode());
        }

        // Delegate event listeners for dynamic content
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-cart-btn')) {
                this.removeFromCart(e.target.dataset.productId);
            }
            if (e.target.classList.contains('quantity-btn')) {
                const productId = e.target.dataset.productId;
                const action = e.target.dataset.action;
                this.updateQuantity(productId, action);
            }
        });
    }

    updateUI() {
        this.displayCart();
        this.updateSummary();
        this.updateCartCount();
    }

    displayCart() {
        const container = document.getElementById('cart-items');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Start shopping to add items to your cart</p>
                    <a href="products.html" class="cta-button">Continue Shopping</a>
                </div>
            `;
            return;
        }

        const cartHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
        container.innerHTML = cartHTML;
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-description">${item.description}</p>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <div class="item-quantity">
                        <button class="quantity-btn" data-product-id="${item.id}" data-action="decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" data-product-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="item-actions">
                        <button class="remove-cart-btn" data-product-id="${item.id}">
                            <i class="fas fa-trash"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    updateSummary() {
        const subtotalElement = document.getElementById('cart-subtotal');
        const shippingElement = document.getElementById('cart-shipping');
        const taxElement = document.getElementById('cart-tax');
        const totalElement = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('proceed-checkout');

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 50 ? 0 : 5.99; // Free shipping over $50
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ ...product, quantity });
        }
        
        this.saveCart();
        this.updateUI();
        this.showMessage('Product added to cart!', 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateUI();
        this.showMessage('Product removed from cart!', 'success');
    }

    updateQuantity(productId, action) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            item.quantity = Math.max(1, item.quantity - 1);
        }

        this.saveCart();
        this.updateUI();
    }

    clearCart() {
        if (this.cart.length === 0) return;

        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.updateUI();
            this.showMessage('Cart cleared!', 'success');
        }
    }

    saveCartForLater() {
        if (this.cart.length === 0) {
            this.showMessage('Your cart is empty!', 'error');
            return;
        }

        // Move items to wishlist
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        this.cart.forEach(item => {
            const existingWishlistItem = wishlist.find(wishlistItem => wishlistItem.id === item.id);
            if (!existingWishlistItem) {
                wishlist.push({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image
                });
            }
        });
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        this.showMessage('Items saved to wishlist!', 'success');
    }

    applyPromoCode() {
        const promoInput = document.getElementById('promo-code');
        const promoCode = promoInput.value.trim().toUpperCase();
        
        if (!promoCode) {
            this.showMessage('Please enter a promo code!', 'error');
            return;
        }

        // Example promo codes
        const promoCodes = {
            'WELCOME10': 0.10,
            'SAVE20': 0.20,
            'FREESHIP': 'freeship'
        };

        if (promoCodes[promoCode]) {
            this.showMessage('Promo code applied successfully!', 'success');
            promoInput.value = '';
            // In a real app, you would apply the discount to the cart
        } else {
            this.showMessage('Invalid promo code!', 'error');
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showMessage('Your cart is empty!', 'error');
            return;
        }

        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
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

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartManager();
});
