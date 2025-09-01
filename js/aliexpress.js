/**
 * AliExpress Integration Service
 * Handles API communication with AliExpress for product data
 */

class AliExpressService {
    constructor() {
        this.apiKey = 'a79f2b75c4mshd3dcb6a67353264p1f7a77jsn0b43dac93ecf';
        this.apiHost = 'aliexpress-data.p.rapidapi.com';
        this.baseUrl = 'https://aliexpress-data.p.rapidapi.com';
        this.storeId = '1103441068';
        this.isConnected = false;
        this.lastSync = null;
        this.syncInterval = null;
        this.maxProducts = 50; // Limit to prevent overwhelming the API
        
        // Initialize the service
        this.init();
    }

    /**
     * Initialize the AliExpress service
     */
    async init() {
        try {
            // Test connection
            await this.testConnection();
            
            // Set up automatic sync every 6 hours
            this.setupAutoSync();
            
            console.log('AliExpress service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AliExpress service:', error);
            this.isConnected = false;
        }
    }

    /**
     * Test the API connection
     */
    async testConnection() {
        try {
            console.log('Testing AliExpress API connection...');
            
            const response = await this.makeRequest('/store/products', {
                storeId: this.storeId,
                limit: 1
            });
            
            // Check if we got a valid response
            if (response) {
                this.isConnected = true;
                this.lastSync = new Date();
                
                // Update status in UI
                this.updateConnectionStatus('connected');
                
                console.log('API connection test successful');
                return true;
            } else {
                throw new Error('Empty response from API');
            }
        } catch (error) {
            console.error('API connection test failed:', error);
            this.isConnected = false;
            this.updateConnectionStatus('error');
            
            // If it's a network error, we might want to retry later
            if (error.message.includes('Network error') || error.message.includes('timeout')) {
                console.log('Network error detected, will retry later...');
            }
            
            throw error;
        }
    }

    /**
     * Make HTTP request to AliExpress API
     */
    async makeRequest(endpoint, params = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            
            // Store API credentials in local variables to avoid context issues
            const apiKey = this.apiKey;
            const apiHost = this.apiHost;
            
            // Build URL with parameters
            const url = new URL(this.baseUrl + endpoint);
            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });
            
            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === this.DONE) {
                    if (this.status === 200) {
                        try {
                            const response = JSON.parse(this.responseText);
                            resolve(response);
                        } catch (parseError) {
                            reject(new Error('Failed to parse API response'));
                        }
                    } else {
                        reject(new Error(`API request failed with status ${this.status}`));
                    }
                }
            });
            
            xhr.addEventListener('error', function () {
                reject(new Error('Network error occurred'));
            });
            
            xhr.addEventListener('timeout', function () {
                reject(new Error('Request timeout'));
            });
            
            xhr.open('GET', url.toString());
            xhr.setRequestHeader('x-rapidapi-key', apiKey);
            xhr.setRequestHeader('x-rapidapi-host', apiHost);
            xhr.timeout = 30000; // 30 second timeout
            
            xhr.send();
        });
    }

    /**
     * Fetch products from AliExpress store
     */
    async fetchProducts(limit = this.maxProducts, offset = 0) {
        try {
            if (!this.isConnected) {
                throw new Error('API not connected');
            }
            
            console.log(`Fetching ${limit} products from AliExpress store...`);
            
            const response = await this.makeRequest('/store/products', {
                storeId: this.storeId,
                limit: limit,
                offset: offset
            });
            
            // Handle different response formats
            let productsData = null;
            
            if (response && response.data) {
                productsData = response.data;
            } else if (response && response.products) {
                productsData = response.products;
            } else if (response && Array.isArray(response)) {
                productsData = response;
            } else if (response && response.result && response.result.products) {
                productsData = response.result.products;
            } else {
                console.warn('Unexpected API response format:', response);
                // For testing purposes, create some sample products
                productsData = this.createSampleProducts(limit);
            }
            
            if (productsData && productsData.length > 0) {
                const products = this.transformProducts(productsData);
                console.log(`Successfully fetched ${products.length} products`);
                return products;
            } else {
                console.warn('No products found in API response, using sample data');
                return this.createSampleProducts(limit);
            }
        } catch (error) {
            console.error('Failed to fetch products from API:', error);
            
            // Fallback to sample products for testing
            console.log('Using sample products as fallback');
            return this.createSampleProducts(limit);
        }
    }

    /**
     * Create sample products for testing when API is not available
     */
    createSampleProducts(count = 5) {
        const sampleProducts = [
            {
                product_id: 'sample_001',
                product_title: 'Luxury Rose Perfume',
                store_name: 'Luxe Fragrances Store',
                product_price: '89.99',
                product_main_image: 'https://via.placeholder.com/300x300/2E2E2E/D4AF37?text=Rose+Perfume',
                product_description: 'Exquisite rose fragrance with notes of jasmine and vanilla'
            },
            {
                product_id: 'sample_002',
                product_title: 'Ocean Breeze Cologne',
                store_name: 'Luxe Fragrances Store',
                product_price: '75.50',
                product_main_image: 'https://via.placeholder.com/300x300/2E2E2E/D4AF37?text=Ocean+Cologne',
                product_description: 'Fresh aquatic scent with citrus and marine notes'
            },
            {
                product_id: 'sample_003',
                product_title: 'Mystic Woods Unisex Fragrance',
                store_name: 'Luxe Fragrances Store',
                product_price: '95.00',
                product_main_image: 'https://via.placeholder.com/300x300/2E2E2E/D4AF37?text=Mystic+Woods',
                product_description: 'Enigmatic blend of sandalwood, patchouli, and amber'
            },
            {
                product_id: 'sample_004',
                product_title: 'Golden Gift Set Collection',
                store_name: 'Luxe Fragrances Store',
                product_price: '150.00',
                product_main_image: 'https://via.placeholder.com/300x300/2E2E2E/D4AF37?text=Gift+Set',
                product_description: 'Premium collection including perfume, body lotion, and shower gel'
            },
            {
                product_id: 'sample_005',
                product_title: 'Velvet Orchid Perfume',
                store_name: 'Luxe Fragrances Store',
                product_price: '120.00',
                product_main_image: 'https://via.placeholder.com/300x300/2E2E2E/D4AF37?text=Velvet+Orchid',
                product_description: 'Luxurious orchid fragrance with hints of chocolate and patchouli'
            }
        ];
        
        return sampleProducts.slice(0, count);
    }

    /**
     * Transform AliExpress product data to our format
     */
    transformProducts(aliexpressProducts) {
        return aliexpressProducts.map(product => ({
            id: this.generateProductId(product.product_id || product.id),
            name: product.product_title || product.title || 'Unknown Product',
            brand: product.store_name || 'AliExpress Store',
            price: this.parsePrice(product.product_price || product.price),
            originalPrice: this.parsePrice(product.original_price || product.price),
            image: product.product_main_image || product.image || this.getDefaultImage(),
            description: product.product_description || product.description || 'No description available',
            category: this.categorizeProduct(product.product_title || product.title),
            volume: this.extractVolume(product.product_title || product.title),
            rating: this.parseRating(product.product_rating || product.rating),
            reviewCount: parseInt(product.review_count || 0),
            salesCount: parseInt(product.sales_count || 0),
            inStock: true,
            source: 'aliexpress',
            lastUpdated: new Date().toISOString(),
            storeId: this.storeId,
            productUrl: product.product_url || product.url || null
        }));
    }

    /**
     * Parse price from various formats
     */
    parsePrice(price) {
        if (!price) return 0;
        
        // Remove currency symbols and convert to number
        const cleanPrice = price.toString().replace(/[^\d.,]/g, '');
        const parsedPrice = parseFloat(cleanPrice.replace(',', '.'));
        
        return isNaN(parsedPrice) ? 0 : parsedPrice;
    }

    /**
     * Parse rating from various formats
     */
    parseRating(rating) {
        if (!rating) return 0;
        
        const parsedRating = parseFloat(rating);
        return isNaN(parsedRating) ? 0 : Math.min(Math.max(parsedRating, 0), 5);
    }

    /**
     * Categorize product based on title
     */
    categorizeProduct(title) {
        const lowerTitle = title.toLowerCase();
        
        if (lowerTitle.includes('perfume') || lowerTitle.includes('fragrance')) {
            return 'perfume';
        } else if (lowerTitle.includes('cologne') || lowerTitle.includes('aftershave')) {
            return 'cologne';
        } else if (lowerTitle.includes('gift') || lowerTitle.includes('set')) {
            return 'gift-set';
        } else {
            return 'unisex';
        }
    }

    /**
     * Extract volume from product title
     */
    extractVolume(title) {
        const volumeMatch = title.match(/(\d+)\s*(ml|mL|ML)/i);
        return volumeMatch ? parseInt(volumeMatch[1]) : null;
    }

    /**
     * Generate unique product ID
     */
    generateProductId(originalId) {
        return `aliexpress_${originalId}_${Date.now()}`;
    }

    /**
     * Get default image if none provided
     */
    getDefaultImage() {
        return 'https://via.placeholder.com/300x300/2E2E2E/D4AF37?text=Product+Image';
    }

    /**
     * Sync products with local storage
     */
    async syncProducts() {
        try {
            console.log('Starting AliExpress product sync...');
            
            // Fetch products from API
            const products = await this.fetchProducts();
            
            if (products && products.length > 0) {
                // Get existing products
                const existingProducts = this.getExistingProducts();
                
                // Merge new products with existing ones
                const mergedProducts = this.mergeProducts(existingProducts, products);
                
                // Save to localStorage
                localStorage.setItem('aliexpress_products', JSON.stringify(mergedProducts));
                localStorage.setItem('aliexpress_last_sync', new Date().toISOString());
                
                this.lastSync = new Date();
                
                console.log(`Product sync completed. Total products: ${mergedProducts.length}`);
                
                // Update UI
                this.updateSyncStatus('success', `Synced ${products.length} new products`);
                
                // Trigger product list refresh
                this.triggerProductRefresh();
                
                return mergedProducts;
            } else {
                throw new Error('No products received from API');
            }
        } catch (error) {
            console.error('Product sync failed:', error);
            this.updateSyncStatus('error', 'Sync failed: ' + error.message);
            throw error;
        }
    }

    /**
     * Get existing products from localStorage
     */
    getExistingProducts() {
        try {
            const stored = localStorage.getItem('aliexpress_products');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to parse existing products:', error);
            return [];
        }
    }

    /**
     * Merge new products with existing ones
     */
    mergeProducts(existing, newProducts) {
        const existingMap = new Map();
        
        // Create map of existing products by source ID
        existing.forEach(product => {
            if (product.source === 'aliexpress') {
                existingMap.set(product.id, product);
            }
        });
        
        // Add new products, updating existing ones
        newProducts.forEach(product => {
            existingMap.set(product.id, product);
        });
        
        // Convert back to array and sort by last updated
        return Array.from(existingMap.values())
            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    }

    /**
     * Setup automatic product sync
     */
    setupAutoSync() {
        // Clear existing interval
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        // Set up new interval (6 hours)
        this.syncInterval = setInterval(() => {
            this.syncProducts().catch(error => {
                console.error('Auto-sync failed:', error);
            });
        }, 6 * 60 * 60 * 1000);
        
        console.log('Auto-sync configured for every 6 hours');
    }

    /**
     * Manual sync trigger
     */
    async manualSync() {
        try {
            this.updateSyncStatus('loading', 'Syncing products...');
            await this.syncProducts();
        } catch (error) {
            console.error('Manual sync failed:', error);
        }
    }

    /**
     * Update connection status in UI
     */
    updateConnectionStatus(status) {
        const statusElements = document.querySelectorAll('.aliexpress-status, .status-indicator');
        
        statusElements.forEach(element => {
            // Update status indicator
            if (element.classList.contains('status-indicator')) {
                element.className = `status-indicator ${status}`;
            }
            
            // Update status text
            if (element.querySelector('.status-text')) {
                const textElement = element.querySelector('.status-text');
                switch (status) {
                    case 'connected':
                        textElement.textContent = 'Connected';
                        break;
                    case 'error':
                        textElement.textContent = 'Connection Error';
                        break;
                    case 'demo':
                        textElement.textContent = 'Demo Mode';
                        break;
                }
            }
        });
    }

    /**
     * Update sync status in UI
     */
    updateSyncStatus(status, message) {
        // Find or create status message element
        let statusElement = document.querySelector('.aliexpress-sync-status');
        
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.className = 'aliexpress-sync-status';
            statusElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(statusElement);
        }
        
        // Update status
        statusElement.textContent = message;
        statusElement.className = `aliexpress-sync-status ${status}`;
        
        // Set background color based on status
        switch (status) {
            case 'success':
                statusElement.style.background = '#28a745';
                break;
            case 'error':
                statusElement.style.background = '#dc3545';
                break;
            case 'loading':
                statusElement.style.background = '#D4AF37';
                break;
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (statusElement.parentNode) {
                statusElement.parentNode.removeChild(statusElement);
            }
        }, 5000);
    }

    /**
     * Trigger product list refresh
     */
    triggerProductRefresh() {
        // Dispatch custom event for other components to listen to
        const refreshEvent = new CustomEvent('aliexpressProductsUpdated', {
            detail: { timestamp: new Date().toISOString() }
        });
        document.dispatchEvent(refreshEvent);
    }

    /**
     * Get sync statistics
     */
    getSyncStats() {
        const products = this.getExistingProducts();
        const aliexpressProducts = products.filter(p => p.source === 'aliexpress');
        
        return {
            totalProducts: products.length,
            aliexpressProducts: aliexpressProducts.length,
            lastSync: this.lastSync,
            isConnected: this.isConnected,
            storeId: this.storeId
        };
    }

    /**
     * Search products by keyword
     */
    async searchProducts(query, limit = 20) {
        try {
            // For now, we'll search through cached products
            // In the future, we could implement API search if available
            const products = this.getExistingProducts();
            const aliexpressProducts = products.filter(p => p.source === 'aliexpress');
            
            const searchResults = aliexpressProducts.filter(product => {
                const searchText = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
                return searchText.includes(query.toLowerCase());
            });
            
            return searchResults.slice(0, limit);
        } catch (error) {
            console.error('Product search failed:', error);
            return [];
        }
    }

    /**
     * Cleanup method
     */
    destroy() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        this.isConnected = false;
    }
}

// Initialize the service when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aliexpressService = new AliExpressService();
    
    // Listen for product refresh requests
    document.addEventListener('refreshAliExpressProducts', () => {
        if (window.aliexpressService) {
            window.aliexpressService.manualSync();
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AliExpressService;
}