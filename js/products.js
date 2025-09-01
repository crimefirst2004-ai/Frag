/**
 * Products Page JavaScript
 * Handles product management, filtering, sorting, and wishlist functionality
 */

class ProductsPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentView = 'grid';
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.filters = {
            category: '',
            priceRange: '',
            search: ''
        };
        this.sortBy = 'name';
        
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.setupEventListeners();
            this.renderProducts();
            this.updateProductCount();
            this.updateCartCount(); // This will also update the checkout button
            this.checkAdminStatus();
        } catch (error) {
            console.error('Error initializing products page:', error);
            this.showErrorMessage('Failed to load products. Please try again.');
        }
    }

    async loadProducts() {
        try {
            // Try to load from localStorage first
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                this.products = JSON.parse(storedProducts);
            } else {
                // Load default products if none exist
                this.products = this.getDefaultProducts();
                this.saveProducts();
            }
            
            this.filteredProducts = [...this.products];
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = this.getDefaultProducts();
            this.filteredProducts = [...this.products];
        }
    }

    getDefaultProducts() {
        return [
            {
                id: '1',
                name: 'Woody Elegance',
                brand: 'Luxe Scents',
                price: 89.99,
                category: 'perfume',
                image: 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Woody+Elegance',
                description: 'A sophisticated blend of sandalwood, cedar, and vanilla notes.',
                rating: 4.5,
                volume: 50,
                stock: 15,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Ocean Breeze',
                brand: 'Marine Fragrances',
                price: 65.50,
                category: 'cologne',
                image: 'https://via.placeholder.com/300x300/4682B4/FFFFFF?text=Ocean+Breeze',
                description: 'Fresh aquatic notes with hints of citrus and sea salt.',
                rating: 4.2,
                volume: 75,
                stock: 22,
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Floral Paradise',
                brand: 'Garden Essence',
                price: 95.00,
                category: 'perfume',
                image: 'https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=Floral+Paradise',
                description: 'A romantic bouquet of rose, jasmine, and peony.',
                rating: 4.8,
                volume: 60,
                stock: 18,
                createdAt: new Date().toISOString()
            },
            {
                id: '4',
                name: 'Citrus Sunrise',
                brand: 'Fresh Scents',
                price: 45.99,
                category: 'unisex',
                image: 'https://via.placeholder.com/300x300/FFA500/FFFFFF?text=Citrus+Sunrise',
                description: 'Bright and energizing blend of lemon, orange, and bergamot.',
                rating: 4.0,
                volume: 100,
                stock: 30,
                createdAt: new Date().toISOString()
            },
            {
                id: '5',
                name: 'Mystic Night',
                brand: 'Dark Aromas',
                price: 120.00,
                category: 'perfume',
                image: 'https://via.placeholder.com/300x300/4B0082/FFFFFF?text=Mystic+Night',
                description: 'Deep and mysterious with notes of oud, patchouli, and amber.',
                rating: 4.6,
                volume: 50,
                stock: 12,
                createdAt: new Date().toISOString()
            }
        ];
    }

    saveProducts() {
        try {
            localStorage.setItem('products', JSON.stringify(this.products));
        } catch (error) {
            console.error('Error saving products:', error);
        }
    }

    setupEventListeners() {
        // Product management
        const addProductBtn = document.getElementById('add-product-btn');
        const addProductForm = document.getElementById('add-product-form');
        const cancelAddBtn = document.getElementById('cancel-add-btn');
        const productForm = document.getElementById('product-form');

        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => this.toggleAddProductForm());
        }

        if (cancelAddBtn) {
            cancelAddBtn.addEventListener('click', () => this.toggleAddProductForm());
        }

        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleAddProduct(e));
        }

        // Filters and sorting
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortBy = document.getElementById('sort-by');
        const searchInput = document.getElementById('search-input');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.filters.priceRange = e.target.value;
                this.applyFilters();
            });
        }

        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.trim();
                this.applyFilters();
            });
        }

        // View toggle
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleView(btn.dataset.view);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreProducts());
        }

        // Quick view modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-details')) {
                const productId = e.target.dataset.productId;
                this.showQuickView(productId);
            }
        });

        // Close modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
                this.closeQuickView();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeQuickView();
            }
        });
    }

    toggleAddProductForm() {
        const form = document.getElementById('add-product-form');
        const btn = document.getElementById('add-product-btn');
        
        if (form.style.display === 'none') {
            form.style.display = 'block';
            btn.innerHTML = '<i class="fas fa-minus" aria-hidden="true"></i> Hide Form';
            btn.setAttribute('aria-expanded', 'true');
        } else {
            form.style.display = 'none';
            btn.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i> Add Product';
            btn.setAttribute('aria-expanded', 'false');
        }
    }

    async handleAddProduct(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const productData = {
            id: this.generateId(),
            name: formData.get('name'),
            brand: formData.get('brand'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            image: formData.get('image'),
            volume: parseInt(formData.get('volume')) || null,
            description: formData.get('description') || '',
            rating: parseFloat(formData.get('rating')) || 5,
            stock: parseInt(formData.get('stock')) || 10,
            createdAt: new Date().toISOString()
        };

        try {
            this.products.unshift(productData);
            this.saveProducts();
            this.applyFilters();
            this.toggleAddProductForm();
            e.target.reset();
            this.showSuccessMessage('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            this.showErrorMessage('Failed to add product. Please try again.');
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    applyFilters() {
        let filtered = [...this.products];

        // Apply category filter
        if (this.filters.category) {
            filtered = filtered.filter(product => product.category === this.filters.category);
        }

        // Apply price filter
        if (this.filters.priceRange) {
            filtered = filtered.filter(product => {
                const [min, max] = this.filters.priceRange.split('-').map(Number);
                if (this.filters.priceRange === '200+') {
                    return product.price >= 200;
                }
                return product.price >= min && product.price <= max;
            });
        }

        // Apply search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
        this.updateProductCount();
    }

    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();
        productsToShow.forEach(product => {
            const productElement = this.createProductCard(product);
            fragment.appendChild(productElement);
        });

        productsGrid.innerHTML = '';
        productsGrid.appendChild(fragment);

        // Show/hide load more button
        const loadMoreContainer = document.querySelector('.load-more-container');
        if (loadMoreContainer) {
            if (endIndex < this.filteredProducts.length) {
                loadMoreContainer.style.display = 'block';
            } else {
                loadMoreContainer.style.display = 'none';
            }
        }
    }

    createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('role', 'gridcell');
        productCard.setAttribute('aria-label', `Product: ${product.name}`);

        const isInWishlist = this.isInWishlist(product.id);
        const wishlistIcon = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
        const wishlistClass = isInWishlist ? 'wishlist-btn in-wishlist' : 'wishlist-btn';

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.stock < 5 ? '<div class="product-badge">Low Stock</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="brand">${product.brand}</p>
                <div class="rating">
                    <div class="stars">
                        ${this.generateStars(product.rating)}
                    </div>
                    <span class="rating-text">${product.rating} (${Math.floor(Math.random() * 50) + 10} reviews)</span>
                </div>
                <p class="price">$${product.price.toFixed(2)}</p>
                ${product.description ? `<p class="description">${product.description}</p>` : ''}
                <div class="product-actions">
                    <button class="add-to-cart" type="button" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">
                        <i class="fas fa-shopping-cart" aria-hidden="true"></i> Add to Cart
                    </button>
                    <button class="${wishlistClass}" type="button" data-product-id="${product.id}" aria-label="Add ${product.name} to wishlist">
                        <i class="${wishlistIcon}" aria-hidden="true"></i>
                    </button>
                </div>
                <button class="view-details" type="button" data-product-id="${product.id}" aria-label="View details for ${product.name}">
                    View Details
                </button>
            </div>
        `;

        // Add event listeners for cart and wishlist
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        const wishlistBtn = productCard.querySelector('.wishlist-btn');

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addToCart(product.id));
        }

        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => this.toggleWishlist(product.id));
        }

        return productCard;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star" aria-hidden="true"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star" aria-hidden="true"></i>';
        }

        return stars;
    }

    toggleView(view) {
        this.currentView = view;
        const productsGrid = document.getElementById('products-grid');
        const viewBtns = document.querySelectorAll('.view-btn');

        // Update active button
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update grid class
        if (view === 'list') {
            productsGrid.classList.add('list-view');
        } else {
            productsGrid.classList.remove('list-view');
        }

        // Re-render products to apply new layout
        this.renderProducts();
    }

    loadMoreProducts() {
        this.currentPage++;
        this.renderProducts();
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('quick-view-modal');
        const modalImage = document.getElementById('modal-product-image');
        const modalName = document.getElementById('modal-product-name');
        const modalBrand = document.getElementById('modal-product-brand');
        const modalRating = document.getElementById('modal-product-rating');
        const modalPrice = document.getElementById('modal-product-price');
        const modalDescription = document.getElementById('modal-product-description');
        const modalAddToCart = document.getElementById('modal-add-to-cart');
        const modalWishlistBtn = document.getElementById('modal-wishlist-btn');

        if (modalImage) modalImage.src = product.image;
        if (modalImage) modalImage.alt = product.name;
        if (modalName) modalName.textContent = product.name;
        if (modalBrand) modalBrand.textContent = product.brand;
        if (modalRating) modalRating.innerHTML = this.generateStars(product.rating);
        if (modalPrice) modalPrice.textContent = `$${product.price.toFixed(2)}`;
        if (modalDescription) modalDescription.textContent = product.description || 'No description available.';

        if (modalAddToCart) {
            modalAddToCart.dataset.productId = product.id;
            modalAddToCart.addEventListener('click', () => this.addToCart(product.id));
        }

        if (modalWishlistBtn) {
            modalWishlistBtn.dataset.productId = product.id;
            modalWishlistBtn.addEventListener('click', () => this.toggleWishlist(product.id));
        }

        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    closeQuickView() {
        const modal = document.getElementById('quick-view-modal');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    addToCart(productId) {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.productId === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ productId, quantity: 1 });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartCount();
            this.showSuccessMessage('Product added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showErrorMessage('Failed to add product to cart.');
        }
    }

    toggleWishlist(productId) {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            const index = wishlist.indexOf(productId);
            
            if (index > -1) {
                wishlist.splice(index, 1);
                this.showSuccessMessage('Product removed from wishlist!');
            } else {
                wishlist.push(productId);
                this.showSuccessMessage('Product added to wishlist!');
            }
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            this.updateWishlistCount();
            this.renderProducts(); // Re-render to update wishlist button states
        } catch (error) {
            console.error('Error updating wishlist:', error);
            this.showErrorMessage('Failed to update wishlist.');
        }
    }

    isInWishlist(productId) {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            return wishlist.includes(productId);
        } catch (error) {
            return false;
        }
    }

    updateCartCount() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = totalItems;
            }

            // Add checkout button if cart has items
            this.updateCheckoutButton();
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }

    updateCheckoutButton() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingCheckoutBtn = document.querySelector('.checkout-btn');
        
        if (cart.length > 0 && !existingCheckoutBtn) {
            // Add checkout button after the load more button
            const loadMoreContainer = document.querySelector('.load-more-container');
            if (loadMoreContainer) {
                const checkoutBtn = document.createElement('div');
                checkoutBtn.className = 'checkout-section';
                checkoutBtn.innerHTML = `
                    <div class="checkout-actions">
                        <a href="checkout.html" class="btn btn-primary checkout-btn">
                            <i class="fas fa-shopping-cart"></i> Proceed to Checkout
                        </a>
                        <span class="cart-total">Total: $${this.calculateCartTotal().toFixed(2)}</span>
                    </div>
                `;
                loadMoreContainer.parentNode.insertBefore(checkoutBtn, loadMoreContainer.nextSibling);
            }
        } else if (cart.length === 0 && existingCheckoutBtn) {
            // Remove checkout button if cart is empty
            const checkoutSection = document.querySelector('.checkout-section');
            if (checkoutSection) {
                checkoutSection.remove();
            }
        } else if (existingCheckoutBtn) {
            // Update cart total
            const cartTotal = document.querySelector('.cart-total');
            if (cartTotal) {
                cartTotal.textContent = `Total: $${this.calculateCartTotal().toFixed(2)}`;
            }
        }
    }

    calculateCartTotal() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            let total = 0;
            
            cart.forEach(cartItem => {
                const product = this.products.find(p => p.id === cartItem.productId);
                if (product) {
                    total += product.price * cartItem.quantity;
                }
            });
            
            return total;
        } catch (error) {
            return 0;
        }
    }

    updateWishlistCount() {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            
            const wishlistCount = document.querySelector('.wishlist-count');
            if (wishlistCount) {
                wishlistCount.textContent = wishlist.length;
            }
        } catch (error) {
            console.error('Error updating wishlist count:', error);
        }
    }

    updateProductCount() {
        const countElement = document.getElementById('products-count');
        if (countElement) {
            countElement.textContent = this.filteredProducts.length;
        }
    }

    checkAdminStatus() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const productManagement = document.getElementById('product-management');
            
            if (currentUser && currentUser.role === 'admin' && productManagement) {
                productManagement.style.display = 'block';
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
        }
    }

    showSuccessMessage(message) {
        // Create a temporary success message
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

        // Remove after 3 seconds
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
        // Create a temporary error message
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

        // Remove after 5 seconds
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
`;
document.head.appendChild(style);

// Initialize the products page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productsPage = new ProductsPage();
});
