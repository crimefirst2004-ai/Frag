// AliExpress-style Store JavaScript
class LuxeFragrancesStore {
    constructor() {
        this.cart = [];
        this.wishlist = [];
        this.searchTerm = '';
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateCounts();
        this.setupCountdownTimer();
        this.setupHeroSlider();
    }

    // Load data from localStorage
    loadFromStorage() {
        try {
            const savedCart = localStorage.getItem('luxeCart');
            const savedWishlist = localStorage.getItem('luxeWishlist');
            
            if (savedCart) this.cart = JSON.parse(savedCart);
            if (savedWishlist) this.wishlist = JSON.parse(savedWishlist);
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    // Save data to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('luxeCart', JSON.stringify(this.cart));
            localStorage.setItem('luxeWishlist', JSON.stringify(this.wishlist));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.addToCart(productCard);
                }
            }

            // Wishlist buttons
            if (e.target.closest('.wishlist-btn')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.toggleWishlist(productCard);
                }
            }

            // Quick view buttons
            if (e.target.closest('.quick-view-btn')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.showQuickView(productCard);
                }
            }

            // Modal close
            if (e.target.classList.contains('modal-close') || 
                e.target.closest('.modal-close')) {
                this.closeModal();
            }

            // Modal backdrop click
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }

            // Hero CTA button
            if (e.target.classList.contains('hero-cta')) {
                this.scrollToProducts();
            }

            // View all links
            if (e.target.closest('.view-all')) {
                e.preventDefault();
                this.scrollToProducts();
            }
        });

        // Cart and wishlist icons
        const cartIcon = document.querySelector('.cart');
        const wishlistIcon = document.querySelector('.wishlist');
        
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.showCart());
        }
        
        if (wishlistIcon) {
            wishlistIcon.addEventListener('click', () => this.showWishlist());
        }

        // User account
        const userAccount = document.querySelector('.user-account');
        if (userAccount) {
            userAccount.addEventListener('click', () => this.showUserMenu());
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(e.target);
            });
        }

        // Search suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchSuggestions();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    // Handle search
    handleSearch(query) {
        this.searchTerm = query.trim();
        
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch();
        }, 300);
    }

    // Perform search
    performSearch() {
        if (!this.searchTerm) {
            this.hideSearchSuggestions();
            return;
        }

        // Simulate search suggestions
        const suggestions = this.getSearchSuggestions(this.searchTerm);
        this.showSearchSuggestions(suggestions);
    }

    // Get search suggestions
    getSearchSuggestions(query) {
        const allProducts = [
            'Floral Bliss Perfume',
            'Ocean Breeze Cologne',
            'Vanilla Dreams Perfume',
            'Rose Essence Perfume',
            'Woody Elegance Perfume',
            'Fresh Citrus Cologne',
            'Mystic Amber Perfume',
            'Golden Sands Cologne'
        ];

        return allProducts.filter(product => 
            product.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    // Show search suggestions
    showSearchSuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;

        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        suggestionsContainer.innerHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item">${suggestion}</div>`
        ).join('');
        
        suggestionsContainer.style.display = 'block';

        // Add click handlers to suggestions
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('search-input').value = item.textContent;
                this.hideSearchSuggestions();
                this.scrollToProducts();
            });
        });
    }

    // Hide search suggestions
    hideSearchSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    // Add to cart
    addToCart(productCard) {
        const product = this.extractProductData(productCard);
        
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            product.quantity = 1;
            this.cart.push(product);
        }

        this.saveToStorage();
        this.updateCounts();
        this.showToast('Product added to cart!', 'success');
        
        // Add animation to cart icon
        this.animateCartIcon();
    }

    // Toggle wishlist
    toggleWishlist(productCard) {
        const product = this.extractProductData(productCard);
        const wishlistBtn = productCard.querySelector('.wishlist-btn i');
        
        const existingIndex = this.wishlist.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            this.wishlist.splice(existingIndex, 1);
            wishlistBtn.className = 'far fa-heart';
            this.showToast('Removed from wishlist', 'info');
        } else {
            this.wishlist.push(product);
            wishlistBtn.className = 'fas fa-heart';
            this.showToast('Added to wishlist!', 'success');
        }

        this.saveToStorage();
        this.updateCounts();
    }

    // Extract product data from card
    extractProductData(productCard) {
        const title = productCard.querySelector('.product-title')?.textContent || 'Unknown Product';
        const price = productCard.querySelector('.current-price')?.textContent || '$0.00';
        const image = productCard.querySelector('.product-image img')?.src || '';
        const rating = productCard.querySelector('.rating-count')?.textContent || '(0)';
        
        return {
            id: this.generateId(),
            name: title,
            price: price,
            image: image,
            rating: rating
        };
    }

    // Generate unique ID
    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Show quick view modal
    showQuickView(productCard) {
        const product = this.extractProductData(productCard);
        const modal = document.getElementById('quick-view-modal');
        
        if (!modal) return;

        // Populate modal content
        modal.querySelector('#modal-product-image').src = product.image;
        modal.querySelector('#modal-product-name').textContent = product.name;
        modal.querySelector('#modal-product-price').innerHTML = `
            <span class="current-price">${product.price}</span>
        `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('quick-view-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Update cart and wishlist counts
    updateCounts() {
        const cartCount = document.querySelector('.cart-count');
        const wishlistCount = document.querySelector('.wishlist-count');
        
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
        
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
        }
    }

    // Setup countdown timer
    setupCountdownTimer() {
        const countdownElements = document.querySelectorAll('.time-unit');
        if (countdownElements.length === 0) return;

        let timeLeft = {
            hours: 2,
            minutes: 45,
            seconds: 30
        };

        const updateTimer = () => {
            if (timeLeft.seconds > 0) {
                timeLeft.seconds--;
            } else if (timeLeft.minutes > 0) {
                timeLeft.minutes--;
                timeLeft.seconds = 59;
            } else if (timeLeft.hours > 0) {
                timeLeft.hours--;
                timeLeft.minutes = 59;
                timeLeft.seconds = 59;
            }

            countdownElements[0].textContent = timeLeft.hours.toString().padStart(2, '0');
            countdownElements[1].textContent = timeLeft.minutes.toString().padStart(2, '0');
            countdownElements[2].textContent = timeLeft.seconds.toString().padStart(2, '0');

            if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
                // Reset timer or show expired message
                timeLeft = { hours: 2, minutes: 45, seconds: 30 };
            }
        };

        setInterval(updateTimer, 1000);
        updateTimer(); // Initial call
    }

    // Setup hero slider
    setupHeroSlider() {
        const dots = document.querySelectorAll('.dot');
        const slides = document.querySelectorAll('.hero-slide');
        
        if (dots.length === 0) return;

        let currentSlide = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        // Add click handlers to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-advance slides
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add styles
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#4CAF50' : '#FF4747',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Animate cart icon
    animateCartIcon() {
        const cartIcon = document.querySelector('.cart');
        if (!cartIcon) return;

        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }

    // Scroll to products section
    scrollToProducts() {
        const productsSection = document.querySelector('.flash-deals');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Show cart (placeholder)
    showCart() {
        this.showToast('Cart functionality coming soon!', 'info');
    }

    // Show wishlist (placeholder)
    showWishlist() {
        this.showToast('Wishlist functionality coming soon!', 'info');
    }

    // Show user menu (placeholder)
    showUserMenu() {
        this.showToast('User menu coming soon!', 'info');
    }

    // Handle newsletter signup
    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!email || !this.isValidEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.showToast('Thank you for subscribing!', 'success');
            form.reset();
        }, 1000);
    }

    // Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LuxeFragrancesStore();
});

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            img.src = 'https://via.placeholder.com/300x300/CCCCCC/999999?text=Image+Not+Found';
        });
    });
});

// Add intersection observer for animations
document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe product cards and category cards
        document.querySelectorAll('.product-card, .category-card').forEach(el => {
            observer.observe(el);
        });
    }
});

// Account page tab functionality
document.addEventListener('DOMContentLoaded', () => {
    const accountTabs = document.querySelectorAll('.account-tab');
    const accountContents = document.querySelectorAll('.account-content');
    
    if (accountTabs.length > 0) {
        accountTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                accountTabs.forEach(t => t.classList.remove('active'));
                accountContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
        
        // Handle anchor links to specific tabs
        const hash = window.location.hash;
        if (hash) {
            const targetTab = document.querySelector(`[data-tab="${hash.substring(1)}"]`);
            if (targetTab) {
                targetTab.click();
            }
        }
    }
});

// Login form functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            const rememberMe = loginForm.querySelector('input[type="checkbox"]').checked;
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate login process
            const loginBtn = loginForm.querySelector('.login-btn');
            const originalText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            loginBtn.disabled = true;
            
            setTimeout(() => {
                // Simulate successful login
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                window.location.href = 'account.html';
            }, 2000);
        });
    }
});

// Checkout form functionality
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.querySelector('.checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            const requiredFields = checkoutForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Simulate checkout process
            const checkoutBtn = checkoutForm.querySelector('.checkout-btn');
            const originalText = checkoutBtn.innerHTML;
            checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            checkoutBtn.disabled = true;
            
            setTimeout(() => {
                alert('Order placed successfully! You will receive a confirmation email shortly.');
                window.location.href = 'account.html#orders';
            }, 3000);
        });
    }
});

// Product page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Filter functionality
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            // Simulate filtering
            console.log('Filter changed:', select.value);
        });
    });
    
    // View toggle functionality
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.querySelector('.products-grid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.getAttribute('data-view') === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });
    
    // Load more functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;
            
            setTimeout(() => {
                // Simulate loading more products
                loadMoreBtn.innerHTML = 'Load More Products';
                loadMoreBtn.disabled = false;
                alert('More products loaded!');
            }, 2000);
        });
    }
});

// Newsletter signup functionality
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            if (!email) {
                alert('Please enter your email address');
                return;
            }
            
            // Simulate newsletter signup
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});

// Password Reset Modal Functions
function openPasswordResetModal() {
    const modal = document.getElementById('password-reset-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closePasswordResetModal() {
    const modal = document.getElementById('password-reset-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset form
        const form = document.getElementById('password-reset-form');
        if (form) form.reset();
        // Hide any messages
        const message = document.getElementById('reset-message');
        if (message) message.style.display = 'none';
    }
}

function handlePasswordReset(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('#reset-email').value;
    const messageDiv = document.getElementById('reset-message');
    const submitBtn = form.querySelector('.btn-primary');
    
    if (!email) {
        showMessage(messageDiv, 'Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage(messageDiv, 'Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showMessage(messageDiv, 'Password reset link has been sent to your email address. Please check your inbox.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
            closePasswordResetModal();
        }, 3000);
    }, 2000);
}

// Track Order Modal Functions
function openTrackOrderModal() {
    const modal = document.getElementById('track-order-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeTrackOrderModal() {
    const modal = document.getElementById('track-order-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset form and hide results
        const form = document.getElementById('track-order-form');
        if (form) form.reset();
        const results = document.getElementById('tracking-results');
        if (results) results.style.display = 'none';
        const message = document.getElementById('tracking-message');
        if (message) message.style.display = 'none';
    }
}

function handleTrackOrder(event) {
    event.preventDefault();
    
    const form = event.target;
    const orderNumber = form.querySelector('#order-number').value;
    const email = form.querySelector('#track-email').value;
    const messageDiv = document.getElementById('tracking-message');
    const resultsDiv = document.getElementById('tracking-results');
    const submitBtn = form.querySelector('.btn-primary');
    
    if (!orderNumber || !email) {
        showMessage(messageDiv, 'Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage(messageDiv, 'Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Tracking...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Hide any previous messages
        messageDiv.style.display = 'none';
        
        // Show tracking results
        if (resultsDiv) {
            // Update order number in results
            const displayOrderNumber = document.getElementById('display-order-number');
            if (displayOrderNumber) {
                displayOrderNumber.textContent = orderNumber;
            }
            resultsDiv.style.display = 'block';
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Help Modal Functions
function openHelpModal() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeHelpModal() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Utility Functions
function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = `message message-${type}`;
    element.style.display = 'block';
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Close modals when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    // Close modals when clicking on backdrop
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
});
