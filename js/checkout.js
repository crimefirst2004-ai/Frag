/**
 * Checkout Page JavaScript
 * Handles checkout process, form validation, and order processing
 */

class CheckoutPage {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.cart = [];
        this.products = [];
        this.shippingInfo = {};
        this.paymentInfo = {};
        
        this.init();
    }

    async init() {
        try {
            await this.loadCart();
            await this.loadProducts();
            this.setupEventListeners();
            this.renderCartItems();
            this.updateOrderSummary();
            this.updateCounts();
        } catch (error) {
            console.error('Error initializing checkout page:', error);
            this.showErrorMessage('Failed to load checkout information. Please try again.');
        }
    }

    async loadCart() {
        try {
            const cartData = localStorage.getItem('cart');
            if (cartData) {
                this.cart = JSON.parse(cartData);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.cart = [];
        }
    }

    async loadProducts() {
        try {
            const productsData = localStorage.getItem('products');
            if (productsData) {
                this.products = JSON.parse(productsData);
            } else {
                // Load default products if none exist
                this.products = this.getDefaultProducts();
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = this.getDefaultProducts();
        }
    }

    getDefaultProducts() {
        return [
            {
                id: '1',
                name: 'Woody Elegance',
                brand: 'Luxe Scents',
                price: 89.99,
                image: 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Woody+Elegance'
            },
            {
                id: '2',
                name: 'Ocean Breeze',
                brand: 'Marine Fragrances',
                price: 65.50,
                image: 'https://via.placeholder.com/300x300/4682B4/FFFFFF?text=Ocean+Breeze'
            },
            {
                id: '3',
                name: 'Floral Paradise',
                brand: 'Garden Essence',
                price: 95.00,
                image: 'https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=Floral+Paradise'
            }
        ];
    }

    setupEventListeners() {
        // User menu toggle
        const userMenuBtn = document.querySelector('.user-menu-btn');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', () => {
                userDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }

        // Form validation
        this.setupFormValidation();
    }

    setupFormValidation() {
        // Shipping form validation
        const shippingForm = document.getElementById('shipping-form');
        if (shippingForm) {
            shippingForm.addEventListener('input', (e) => {
                this.validateField(e.target);
            });
        }

        // Payment form validation
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('input', (e) => {
                this.validateField(e.target);
            });

            // Card number formatting
            const cardNumberInput = document.getElementById('card-number');
            if (cardNumberInput) {
                cardNumberInput.addEventListener('input', (e) => {
                    this.formatCardNumber(e.target);
                });
            }

            // Expiry date formatting
            const expiryInput = document.getElementById('expiry');
            if (expiryInput) {
                expiryInput.addEventListener('input', (e) => {
                    this.formatExpiryDate(e.target);
                });
            }

            // CVV validation
            const cvvInput = document.getElementById('cvv');
            if (cvvInput) {
                cvvInput.addEventListener('input', (e) => {
                    this.validateCVV(e.target);
                });
            }
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        this.removeFieldError(field);

        // Validation rules
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'phone':
                if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            case 'address':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Address must be at least 10 characters long';
                }
                break;
            case 'city':
            case 'state':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Must be at least 2 characters long';
                }
                break;
            case 'zip':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'ZIP code must be at least 3 characters long';
                }
                break;
            case 'cardNumber':
                if (value.replace(/\s/g, '').length < 13) {
                    isValid = false;
                    errorMessage = 'Card number must be at least 13 digits';
                }
                break;
            case 'expiry':
                if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please use MM/YY format';
                }
                break;
            case 'cvv':
                if (!/^\d{3,4}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'CVV must be 3-4 digits';
                }
                break;
            case 'cardName':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Name must be at least 3 characters long';
                }
                break;
        }

        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.removeFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: block;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }

    removeFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '');
        value = value.replace(/\D/g, '');
        
        // Add spaces every 4 digits
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        
        input.value = value;
    }

    formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        input.value = value;
    }

    validateCVV(input) {
        input.value = input.value.replace(/\D/g, '');
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty.</p>
                    <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }

        const cartItemsHTML = this.cart.map(cartItem => {
            const product = this.products.find(p => p.id === cartItem.productId);
            if (!product) return '';

            return `
                <div class="cart-item" data-product-id="${cartItem.productId}">
                    <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${product.name}</div>
                        <div class="cart-item-brand">${product.brand}</div>
                        <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button type="button" class="quantity-btn" onclick="checkoutPage.updateQuantity('${cartItem.productId}', -1)" aria-label="Decrease quantity">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${cartItem.quantity}</span>
                        <button type="button" class="quantity-btn" onclick="checkoutPage.updateQuantity('${cartItem.productId}', 1)" aria-label="Increase quantity">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        cartItemsContainer.innerHTML = cartItemsHTML;
    }

    updateQuantity(productId, change) {
        const cartItem = this.cart.find(item => item.productId === productId);
        if (!cartItem) return;

        const newQuantity = cartItem.quantity + change;
        
        if (newQuantity <= 0) {
            // Remove item from cart
            this.cart = this.cart.filter(item => item.productId !== productId);
        } else {
            cartItem.quantity = newQuantity;
        }

        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(this.cart));
        
        // Re-render cart and update summary
        this.renderCartItems();
        this.updateOrderSummary();
        this.updateCounts();
    }

    updateOrderSummary() {
        const summaryItemsContainer = document.getElementById('summary-items');
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');

        if (!summaryItemsContainer) return;

        if (this.cart.length === 0) {
            summaryItemsContainer.innerHTML = '<p>No items in cart</p>';
            if (subtotalElement) subtotalElement.textContent = '$0.00';
            if (shippingElement) shippingElement.textContent = '$0.00';
            if (taxElement) taxElement.textContent = '$0.00';
            if (totalElement) totalElement.textContent = '$0.00';
            return;
        }

        // Calculate totals
        let subtotal = 0;
        const summaryItemsHTML = this.cart.map(cartItem => {
            const product = this.products.find(p => p.id === cartItem.productId);
            if (!product) return '';

            const itemTotal = product.price * cartItem.quantity;
            subtotal += itemTotal;

            return `
                <div class="summary-item">
                    <span class="summary-item-name">${product.name} x${cartItem.quantity}</span>
                    <span class="summary-item-price">$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        }).join('');

        summaryItemsContainer.innerHTML = summaryItemsHTML;

        // Calculate additional costs
        const shipping = subtotal > 100 ? 0 : 9.99;
        const tax = subtotal * 0.08; // 8% tax rate
        const total = subtotal + shipping + tax;

        // Update display
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    updateCounts() {
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        // Update wishlist count
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            try {
                const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                wishlistCount.textContent = wishlist.length;
            } catch (error) {
                wishlistCount.textContent = '0';
            }
        }
    }

    showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    showErrorMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'error-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    }
}

// Global functions for HTML onclick handlers
let checkoutPage;

function nextStep() {
    if (checkoutPage.currentStep < checkoutPage.totalSteps) {
        if (checkoutPage.validateCurrentStep()) {
            checkoutPage.currentStep++;
            checkoutPage.showStep(checkoutPage.currentStep);
        }
    }
}

function previousStep() {
    if (checkoutPage.currentStep > 1) {
        checkoutPage.currentStep--;
        checkoutPage.showStep(checkoutPage.currentStep);
    }
}

function processPayment() {
    if (checkoutPage.validateCurrentStep()) {
        // Simulate payment processing
        checkoutPage.showSuccessMessage('Payment processed successfully!');
        
        // Move to confirmation step
        checkoutPage.currentStep = 4;
        checkoutPage.showStep(4);
        
        // Generate order details
        checkoutPage.generateOrderConfirmation();
        
        // Clear cart
        localStorage.removeItem('cart');
        checkoutPage.cart = [];
        checkoutPage.updateCounts();
    }
}

// Add step navigation methods to CheckoutPage class
CheckoutPage.prototype.showStep = function(stepNumber) {
    // Hide all steps
    for (let i = 1; i <= this.totalSteps; i++) {
        const step = document.getElementById(`step-${i}`);
        if (step) {
            step.classList.remove('active');
        }
    }

    // Show current step
    const currentStepElement = document.getElementById(`step-${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    // Update progress indicators
    this.updateProgressSteps(stepNumber);
};

CheckoutPage.prototype.updateProgressSteps = function(currentStep) {
    const steps = document.querySelectorAll('.progress-steps .step');
    steps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
};

CheckoutPage.prototype.validateCurrentStep = function() {
    switch (this.currentStep) {
        case 1:
            // Cart review - always valid
            return true;
        case 2:
            // Shipping form validation
            return this.validateShippingForm();
        case 3:
            // Payment form validation
            return this.validatePaymentForm();
        default:
            return true;
    }
};

CheckoutPage.prototype.validateShippingForm = function() {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip', 'country'];
    let isValid = true;

    requiredFields.forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field && !this.validateField(field)) {
            isValid = false;
        }
    });

    if (!isValid) {
        this.showErrorMessage('Please fill in all required fields correctly.');
    }

    return isValid;
};

CheckoutPage.prototype.validatePaymentForm = function() {
    const requiredFields = ['cardNumber', 'expiry', 'cvv', 'cardName'];
    let isValid = true;

    requiredFields.forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field && !this.validateField(field)) {
            isValid = false;
        }
    });

    if (!isValid) {
        this.showErrorMessage('Please fill in all payment fields correctly.');
    }

    return isValid;
};

CheckoutPage.prototype.generateOrderConfirmation = function() {
    const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase();
    const orderDate = new Date().toLocaleDateString();
    const orderTotal = document.getElementById('total')?.textContent || '$0.00';

    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('order-date').textContent = orderDate;
    document.getElementById('order-total').textContent = orderTotal;
};

// Initialize checkout page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkoutPage = new CheckoutPage();
});

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .field-error {
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .form-group input.error {
        border-color: #dc3545;
        box-shadow: 0 0 10px rgba(220, 53, 69, 0.2);
    }
    
    .empty-cart {
        text-align: center;
        padding: 2rem;
        color: var(--color-white);
    }
    
    .empty-cart p {
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);
