/**
 * Admin Panel JavaScript
 * Handles admin panel functionality and AliExpress integration
 */

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.products = [];
        this.orders = [];
        this.analytics = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupAliExpressIntegration();
        this.showSection('dashboard');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // Product form
        const productForm = document.getElementById('product-form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProduct();
            });
        }

        // AliExpress refresh button
        const refreshBtn = document.getElementById('refresh-aliexpress');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAliExpressProducts();
            });
        }
    }

    setupAliExpressIntegration() {
        // Check if AliExpress service is available
        if (window.aliexpressService) {
            this.updateAliExpressStatus();
            
            // Listen for status updates
            setInterval(() => {
                this.updateAliExpressStatus();
            }, 30000); // Update every 30 seconds
        }
    }

    updateAliExpressStatus() {
        if (!window.aliexpressService) return;

        const stats = window.aliexpressService.getSyncStats();
        const statusElement = document.querySelector('.aliexpress-status');
        
        if (statusElement) {
            // Update status indicator
            const indicator = statusElement.querySelector('.status-indicator');
            if (indicator) {
                indicator.className = `status-indicator ${stats.isConnected ? 'connected' : 'error'}`;
            }
            
            // Update status text
            const textElement = statusElement.querySelector('.status-text');
            if (textElement) {
                textElement.textContent = stats.isConnected ? 'Connected' : 'Connection Error';
            }
            
            // Update product count
            const countElement = statusElement.querySelector('.product-count');
            if (countElement) {
                countElement.textContent = `${stats.aliexpressProducts} products`;
            }
            
            // Update last sync time
            const syncElement = statusElement.querySelector('.last-sync');
            if (syncElement && stats.lastSync) {
                const syncDate = new Date(stats.lastSync);
                syncElement.textContent = `Last sync: ${syncDate.toLocaleString()}`;
            }
        }
    }

    async refreshAliExpressProducts() {
        try {
            const refreshBtn = document.getElementById('refresh-aliexpress');
            if (refreshBtn) {
                refreshBtn.disabled = true;
                refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
            }
            
            // Trigger AliExpress sync
            if (window.aliexpressService) {
                await window.aliexpressService.manualSync();
                
                // Update dashboard data
                this.loadDashboardData();
                
                // Show success message
                this.showMessage('AliExpress products refreshed successfully!', 'success');
            } else {
                throw new Error('AliExpress service not available');
            }
        } catch (error) {
            console.error('Failed to refresh AliExpress products:', error);
            this.showMessage('Failed to refresh products: ' + error.message, 'error');
        } finally {
            const refreshBtn = document.getElementById('refresh-aliexpress');
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Products';
            }
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        // Add active class to nav link
        const activeLink = document.querySelector(`[href="#${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        this.currentSection = sectionName;
        
        // Load section-specific data
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    async loadDashboardData() {
        try {
            // Load products count
            const products = this.getProducts();
            const aliexpressProducts = products.filter(p => p.source === 'aliexpress');
            
            // Update dashboard stats
            this.updateDashboardStats({
                totalProducts: products.length,
                aliexpressProducts: aliexpressProducts.length,
                totalOrders: this.getOrders().length,
                totalRevenue: this.calculateTotalRevenue()
            });
            
            // Load recent products
            this.loadRecentProducts(products.slice(0, 5));
            
            // Load recent orders
            this.loadRecentOrders(this.getOrders().slice(0, 5));
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    updateDashboardStats(stats) {
        // Update stat cards
        const statElements = {
            'total-products': stats.totalProducts,
            'aliexpress-products': stats.aliexpressProducts,
            'total-orders': stats.totalOrders,
            'total-revenue': `$${stats.totalRevenue.toFixed(2)}`
        };
        
        Object.keys(statElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = statElements[id];
            }
        });
    }

    loadRecentProducts(products) {
        const container = document.getElementById('recent-products');
        if (!container) return;
        
        container.innerHTML = products.length > 0 ? '' : '<p>No products available</p>';
        
        products.forEach(product => {
            const productElement = this.createProductElement(product);
            container.appendChild(productElement);
        });
    }

    loadRecentOrders(orders) {
        const container = document.getElementById('recent-orders');
        if (!container) return;
        
        container.innerHTML = orders.length > 0 ? '' : '<p>No orders available</p>';
        
        orders.forEach(order => {
            const orderElement = this.createOrderElement(order);
            container.appendChild(orderElement);
        });
    }

    createProductElement(product) {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.innerHTML = `
            <div class="item-info">
                <h4>${product.name}</h4>
                <p>${product.brand} • $${product.price}</p>
                <span class="badge ${product.source === 'aliexpress' ? 'aliexpress' : 'local'}">${product.source}</span>
            </div>
        `;
        return div;
    }

    createOrderElement(order) {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.innerHTML = `
            <div class="item-info">
                <h4>Order #${order.id}</h4>
                <p>${order.customerName} • $${order.total}</p>
                <span class="badge ${order.status}">${order.status}</span>
            </div>
        `;
        return div;
    }

    async loadProducts() {
        try {
            const products = this.getProducts();
            this.displayProducts(products);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    displayProducts(products) {
        const container = document.getElementById('products-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (products.length === 0) {
            container.innerHTML = '<p>No products available</p>';
            return;
        }
        
        products.forEach(product => {
            const productRow = this.createProductRow(product);
            container.appendChild(productRow);
        });
    }

    createProductRow(product) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                <div>
                    <strong>${product.name}</strong>
                    <br><small>${product.brand}</small>
                </div>
            </td>
            <td>$${product.price}</td>
            <td>${product.category}</td>
            <td>
                <span class="badge ${product.source === 'aliexpress' ? 'aliexpress' : 'local'}">
                    ${product.source}
                </span>
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="adminPanel.editProduct('${product.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="adminPanel.deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        return row;
    }

    async addProduct() {
        try {
            const form = document.getElementById('product-form');
            const formData = new FormData(form);
            
            const product = {
                id: this.generateId(),
                name: formData.get('name'),
                brand: formData.get('brand'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                image: formData.get('image'),
                volume: formData.get('volume') ? parseInt(formData.get('volume')) : null,
                description: formData.get('description'),
                inStock: true,
                source: 'local',
                createdAt: new Date().toISOString()
            };
            
            // Save product
            this.saveProduct(product);
            
            // Reset form
            form.reset();
            
            // Show success message
            this.showMessage('Product added successfully!', 'success');
            
            // Refresh products list
            this.loadProducts();
            
        } catch (error) {
            console.error('Failed to add product:', error);
            this.showMessage('Failed to add product: ' + error.message, 'error');
        }
    }

    editProduct(productId) {
        // Implementation for editing products
        console.log('Edit product:', productId);
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                this.removeProduct(productId);
                this.showMessage('Product deleted successfully!', 'success');
                this.loadProducts();
            } catch (error) {
                console.error('Failed to delete product:', error);
                this.showMessage('Failed to delete product: ' + error.message, 'error');
            }
        }
    }

    loadOrders() {
        // Implementation for loading orders
        console.log('Loading orders...');
    }

    loadAnalytics() {
        // Implementation for loading analytics
        console.log('Loading analytics...');
    }

    // Utility methods
    getProducts() {
        try {
            const stored = localStorage.getItem('products');
            const aliexpressStored = localStorage.getItem('aliexpress_products');
            
            let products = stored ? JSON.parse(stored) : [];
            const aliexpressProducts = aliexpressStored ? JSON.parse(aliexpressStored) : [];
            
            // Merge products, prioritizing AliExpress products
            const productMap = new Map();
            
            // Add local products first
            products.forEach(product => {
                productMap.set(product.id, product);
            });
            
            // Add/update AliExpress products
            aliexpressProducts.forEach(product => {
                productMap.set(product.id, product);
            });
            
            return Array.from(productMap.values());
        } catch (error) {
            console.error('Failed to get products:', error);
            return [];
        }
    }

    saveProduct(product) {
        try {
            const products = this.getProducts();
            const existingIndex = products.findIndex(p => p.id === product.id);
            
            if (existingIndex >= 0) {
                products[existingIndex] = product;
            } else {
                products.push(product);
            }
            
            localStorage.setItem('products', JSON.stringify(products));
        } catch (error) {
            console.error('Failed to save product:', error);
            throw error;
        }
    }

    removeProduct(productId) {
        try {
            const products = this.getProducts();
            const filteredProducts = products.filter(p => p.id !== productId);
            localStorage.setItem('products', JSON.stringify(filteredProducts));
        } catch (error) {
            console.error('Failed to remove product:', error);
            throw error;
        }
    }

    getOrders() {
        try {
            const stored = localStorage.getItem('orders');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to get orders:', error);
            return [];
        }
    }

    calculateTotalRevenue() {
        const orders = this.getOrders();
        return orders.reduce((total, order) => total + (order.total || 0), 0);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `admin-message ${type}`;
        messageElement.textContent = message;
        
        // Add to page
        document.body.appendChild(messageElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 5000);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Listen for AliExpress product updates
document.addEventListener('aliexpressProductsUpdated', (event) => {
    if (window.adminPanel) {
        window.adminPanel.loadDashboardData();
        if (window.adminPanel.currentSection === 'products') {
            window.adminPanel.loadProducts();
        }
    }
});
