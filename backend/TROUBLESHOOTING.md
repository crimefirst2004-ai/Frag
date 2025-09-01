# Luxe Fragrances - Troubleshooting Guide

Complete guide to resolve common issues and problems with the Luxe Fragrances platform.

## 🚨 **Critical Issues**

### Site Won't Load

#### **Problem**: Website shows blank page or error
**Symptoms**:
- White/blank page
- "This site can't be reached" error
- Connection timeout

**Solutions**:
1. **Check Internet Connection**
   ```bash
   # Test basic connectivity
   ping google.com
   
   # Test DNS resolution
   nslookup yourdomain.com
   ```

2. **Verify Server Status**
   - Check hosting provider status page
   - Contact hosting support
   - Verify domain DNS settings

3. **Clear Browser Cache**
   ```bash
   # Chrome/Edge
   Ctrl + Shift + Delete
   
   # Firefox
   Ctrl + Shift + Delete
   
   # Safari
   Cmd + Option + E
   ```

4. **Try Different Browser**
   - Test in Chrome, Firefox, Safari, Edge
   - Check if issue is browser-specific

#### **Problem**: 500 Internal Server Error
**Solutions**:
1. **Check Server Logs**
   ```bash
   # Apache
   tail -f /var/log/apache2/error.log
   
   # Nginx
   tail -f /var/log/nginx/error.log
   ```

2. **Verify File Permissions**
   ```bash
   # Set correct permissions
   chmod 644 *.html
   chmod 644 css/*.css
   chmod 644 js/*.js
   chmod 755 images/
   ```

3. **Check .htaccess File**
   ```apache
   # Ensure .htaccess is valid
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ index.html [QSA,L]
   ```

### Authentication Issues

#### **Problem**: Can't Login
**Symptoms**:
- "Invalid credentials" error
- Login button not responding
- Redirect loops

**Solutions**:
1. **Verify Credentials**
   - Check email spelling
   - Ensure password is correct
   - Try password reset

2. **Check Browser Console**
   ```javascript
   // Open DevTools (F12)
   // Look for JavaScript errors
   // Check Network tab for failed requests
   ```

3. **Clear Authentication Data**
   ```javascript
   // Clear localStorage
   localStorage.clear();
   
   // Clear sessionStorage
   sessionStorage.clear();
   
   // Clear cookies
   document.cookie.split(";").forEach(function(c) { 
       document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
   });
   ```

4. **Check Account Status**
   - Verify account is active
   - Check if account is locked
   - Contact support if suspended

#### **Problem**: Admin Panel Access Denied
**Solutions**:
1. **Verify Admin Role**
   ```javascript
   // Check user role in console
   console.log(window.authManager.currentUser);
   ```

2. **Check Role Assignment**
   - Ensure user has admin privileges
   - Verify role in user database
   - Contact system administrator

3. **Clear Role Cache**
   ```javascript
   // Force role refresh
   window.authManager.checkAuthState();
   ```

## 🔧 **Functional Issues**

### Product Display Problems

#### **Problem**: Products Not Showing
**Symptoms**:
- Empty product grid
- "No products found" message
- Loading spinner never stops

**Solutions**:
1. **Check Product Data**
   ```javascript
   // Verify products in localStorage
   console.log(localStorage.getItem('storeProducts'));
   
   // Check if products array is empty
   console.log(window.fragranceStore.products);
   ```

2. **Refresh Product Data**
   ```javascript
   // Force product refresh
   window.fragranceStore.refreshProducts();
   
   // Or manually reload
   location.reload();
   ```

3. **Check AliExpress Integration**
   ```javascript
   // Verify AliExpress service
   console.log(window.aliExpressService);
   
   // Check integration status
   window.fragranceStore.updateAliExpressStatus();
   ```

4. **Reset to Default Products**
   ```javascript
   // Clear stored products
   localStorage.removeItem('storeProducts');
   
   // Reload page to get defaults
   location.reload();
   ```

#### **Problem**: Product Images Not Loading
**Solutions**:
1. **Check Image URLs**
   ```javascript
   // Verify image sources
   document.querySelectorAll('img').forEach(img => {
       console.log(img.src, img.complete);
   });
   ```

2. **Test Image Accessibility**
   ```bash
   # Test if images are accessible
   curl -I https://via.placeholder.com/300x300
   ```

3. **Check Image Permissions**
   - Verify image files exist
   - Check file permissions
   - Ensure proper file paths

4. **Use Fallback Images**
   ```javascript
   // Add error handling for images
   img.onerror = function() {
       this.src = 'images/placeholder.jpg';
   };
   ```

### Search Functionality Issues

#### **Problem**: Search Not Working
**Symptoms**:
- Search input not responding
- No search results
- Search crashes page

**Solutions**:
1. **Check Search Input**
   ```javascript
   // Verify search input exists
   const searchInput = document.getElementById('search-input');
   console.log(searchInput);
   
   // Check event listeners
   searchInput.addEventListener('input', console.log);
   ```

2. **Test Search Function**
   ```javascript
   // Test search manually
   window.fragranceStore.searchTerm = 'test';
   window.fragranceStore.renderProducts();
   ```

3. **Check AliExpress Search**
   ```javascript
   // Test AliExpress search
   window.fragranceStore.searchAliExpressProducts('test');
   ```

4. **Verify Search Debouncing**
   ```javascript
   // Check if search timeout is working
   console.log(window.fragranceStore.searchTimeout);
   ```

### Cart Issues

#### **Problem**: Can't Add to Cart
**Symptoms**:
- Add to Cart button not working
- Products not appearing in cart
- Cart count not updating

**Solutions**:
1. **Check Cart Function**
   ```javascript
   // Test add to cart
   window.fragranceStore.addToCart(1);
   
   // Check cart contents
   console.log(window.fragranceStore.cart);
   ```

2. **Verify Product Availability**
   ```javascript
   // Check product stock
   const product = window.fragranceStore.products.find(p => p.id === 1);
   console.log(product.inStock, product.stockQuantity);
   ```

3. **Check Cart Storage**
   ```javascript
   // Verify cart in localStorage
   console.log(localStorage.getItem('storeCart'));
   
   // Check cart count
   console.log(document.querySelector('.cart-count').textContent);
   ```

4. **Reset Cart**
   ```javascript
   // Clear cart
   window.fragranceStore.clearCart();
   
   // Refresh display
   window.fragranceStore.updateCartCount();
   ```

#### **Problem**: Cart Items Disappearing
**Solutions**:
1. **Check Storage Limits**
   ```javascript
   // Check localStorage usage
   let total = 0;
   for (let key in localStorage) {
       total += localStorage[key].length;
   }
   console.log('Storage used:', total);
   ```

2. **Verify Cart Persistence**
   ```javascript
   // Check if cart saves properly
   window.fragranceStore.saveCartToStorage();
   console.log('Cart saved:', localStorage.getItem('storeCart'));
   ```

3. **Check Browser Privacy Settings**
   - Disable incognito/private browsing
   - Allow cookies and localStorage
   - Check browser extensions

## 🔌 **AliExpress Integration Issues**

### API Connection Problems

#### **Problem**: AliExpress API Not Working
**Symptoms**:
- "Demo Mode" status
- Products not updating
- API errors in console

**Solutions**:
1. **Verify API Key**
   ```javascript
   // Check API key
   console.log(localStorage.getItem('aliexpress_api_key'));
   
   // Test connection
   window.aliExpressService.testConnection();
   ```

2. **Check API Configuration**
   ```javascript
   // Verify service configuration
   console.log(window.aliExpressService.apiKey);
   console.log(window.aliExpressService.baseUrl);
   ```

3. **Test API Endpoints**
   ```javascript
   // Test basic API calls
   window.aliExpressService.getTrendingProducts();
   window.aliExpressService.getCategories();
   ```

4. **Check Network Issues**
   ```javascript
   // Test network connectivity
   fetch('https://api.aliexpress.com/v2/')
       .then(response => console.log('API accessible:', response.ok))
       .catch(error => console.error('API error:', error));
   ```

#### **Problem**: Products Not Syncing
**Solutions**:
1. **Check Sync Settings**
   ```javascript
   // Verify update interval
   console.log(localStorage.getItem('aliexpress_update_interval'));
   
   // Check last update
   console.log(localStorage.getItem('lastProductUpdate'));
   ```

2. **Force Manual Sync**
   ```javascript
   // Trigger manual sync
   window.fragranceStore.updateProductsFromAliExpress();
   
   // Or use admin panel
   document.querySelector('.refresh-btn').click();
   ```

3. **Check Sync Logs**
   ```javascript
   // Enable debug mode
   localStorage.setItem('debug_mode', 'true');
   
   // Check console for sync logs
   ```

4. **Reset Integration**
   ```javascript
   // Clear AliExpress data
   localStorage.removeItem('aliexpress_api_key');
   localStorage.removeItem('lastProductUpdate');
   
   // Reload page
   location.reload();
   ```

## 📱 **PWA Issues**

### Service Worker Problems

#### **Problem**: Service Worker Not Working
**Symptoms**:
- No offline functionality
- App not installable
- Cache not working

**Solutions**:
1. **Check Service Worker Registration**
   ```javascript
   // Verify service worker
   if ('serviceWorker' in navigator) {
       navigator.serviceWorker.getRegistrations()
           .then(registrations => console.log('SWs:', registrations));
   }
   ```

2. **Check HTTPS Requirement**
   ```javascript
   // Verify HTTPS
   console.log('HTTPS:', location.protocol === 'https:');
   
   // Check if localhost (allowed for development)
   console.log('Localhost:', location.hostname === 'localhost');
   ```

3. **Test Service Worker**
   ```javascript
   // Check service worker status
   navigator.serviceWorker.ready
       .then(registration => console.log('SW ready:', registration));
   ```

4. **Clear Service Worker**
   ```javascript
   // Unregister service worker
   navigator.serviceWorker.getRegistrations()
       .then(registrations => {
           registrations.forEach(registration => registration.unregister());
       });
   ```

#### **Problem**: PWA Installation Fails
**Solutions**:
1. **Verify Manifest**
   ```javascript
   // Check manifest
   fetch('/manifest.json')
       .then(response => response.json())
       .then(manifest => console.log('Manifest:', manifest));
   ```

2. **Check Icons**
   ```javascript
   // Verify icon files exist
   const manifest = JSON.parse(document.querySelector('link[rel="manifest"]').href);
   manifest.icons.forEach(icon => {
       fetch(icon.src).then(response => 
           console.log('Icon accessible:', icon.src, response.ok)
       );
   });
   ```

3. **Test PWA Criteria**
   ```javascript
   // Check PWA requirements
   console.log('HTTPS:', location.protocol === 'https:');
   console.log('Manifest:', !!document.querySelector('link[rel="manifest"]'));
   console.log('Service Worker:', 'serviceWorker' in navigator);
   ```

## 🎨 **UI/UX Issues**

### Styling Problems

#### **Problem**: CSS Not Loading
**Symptoms**:
- Unstyled page
- Missing colors and layout
- Broken design

**Solutions**:
1. **Check CSS Files**
   ```javascript
   // Verify CSS loading
   const stylesheets = document.styleSheets;
   Array.from(stylesheets).forEach(sheet => {
       console.log('CSS:', sheet.href, sheet.disabled);
   });
   ```

2. **Check File Paths**
   ```javascript
   // Verify CSS file exists
   fetch('/css/styles.css')
       .then(response => console.log('CSS accessible:', response.ok))
       .catch(error => console.error('CSS error:', error));
   ```

3. **Check CSS Syntax**
   ```css
   /* Validate CSS syntax */
   /* Use online CSS validator */
   /* Check for syntax errors */
   ```

4. **Force CSS Reload**
   ```javascript
   // Reload CSS files
   document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
       link.href = link.href + '?v=' + Date.now();
   });
   ```

#### **Problem**: Responsive Design Issues
**Solutions**:
1. **Check Viewport Meta Tag**
   ```html
   <!-- Ensure viewport meta tag exists -->
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **Test Media Queries**
   ```javascript
   // Check current viewport
   console.log('Viewport:', window.innerWidth, 'x', window.innerHeight);
   
   // Test media query
   const mediaQuery = window.matchMedia('(max-width: 768px)');
   console.log('Mobile view:', mediaQuery.matches);
   ```

3. **Verify CSS Grid/Flexbox**
   ```javascript
   // Check CSS Grid support
   console.log('CSS Grid:', CSS.supports('display', 'grid'));
   
   // Check Flexbox support
   console.log('Flexbox:', CSS.supports('display', 'flex'));
   ```

## 🚀 **Performance Issues**

### Slow Loading

#### **Problem**: Page Loads Slowly
**Symptoms**:
- Long loading times
- Stuck on loading spinner
- Timeout errors

**Solutions**:
1. **Check Network Performance**
   ```javascript
   // Monitor page load performance
   window.addEventListener('load', () => {
       const perfData = performance.getEntriesByType('navigation')[0];
       console.log('Load time:', perfData.loadEventEnd - perfData.loadEventStart);
   });
   ```

2. **Optimize Images**
   ```javascript
   // Check image sizes
   document.querySelectorAll('img').forEach(img => {
       console.log('Image size:', img.naturalWidth, 'x', img.naturalHeight);
   });
   ```

3. **Enable Compression**
   ```apache
   # Apache .htaccess
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/html text/css text/javascript
   </IfModule>
   ```

4. **Use CDN**
   ```html
   <!-- Use CDN for external resources -->
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
   ```

### Memory Issues

#### **Problem**: High Memory Usage
**Solutions**:
1. **Check Memory Usage**
   ```javascript
   // Monitor memory usage
   if ('memory' in performance) {
       console.log('Memory:', performance.memory);
   }
   ```

2. **Optimize Event Listeners**
   ```javascript
   // Remove unused event listeners
   // Use event delegation
   // Clean up timers and intervals
   ```

3. **Limit DOM Manipulation**
   ```javascript
   // Use DocumentFragment for batch updates
   // Minimize reflows and repaints
   // Use efficient selectors
   ```

## 🔍 **Debugging Tools**

### Browser Developer Tools

#### **Console Commands**
```javascript
// Enable debug mode
localStorage.setItem('debug_mode', 'true');

// Check all stored data
console.log('localStorage:', localStorage);

// Monitor network requests
// Use Network tab in DevTools

// Check for JavaScript errors
// Use Console tab in DevTools

// Analyze performance
// Use Performance tab in DevTools
```

#### **Useful Console Functions**
```javascript
// Debug authentication
window.authManager.debug();

// Check store state
console.log('Store:', window.fragranceStore);

// Test AliExpress service
window.aliExpressService.debug();

// Monitor performance
performance.mark('debug-start');
// ... your code ...
performance.mark('debug-end');
performance.measure('debug', 'debug-start', 'debug-end');
```

### Performance Monitoring

#### **Core Web Vitals**
```javascript
// Monitor Core Web Vitals
import('web-vitals').then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
});
```

#### **Custom Performance Metrics**
```javascript
// Track custom metrics
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        console.log('Performance:', entry.name, entry.duration);
    });
});

observer.observe({ entryTypes: ['measure'] });
```

## 📞 **Getting Help**

### Before Contacting Support

1. **Check This Guide**
   - Review relevant troubleshooting section
   - Try suggested solutions
   - Document the issue

2. **Gather Information**
   ```javascript
   // Collect debug information
   const debugInfo = {
       userAgent: navigator.userAgent,
       url: location.href,
       timestamp: new Date().toISOString(),
       localStorage: Object.keys(localStorage),
       errors: window.errors || []
   };
   console.log('Debug Info:', debugInfo);
   ```

3. **Test in Different Environment**
   - Try different browser
   - Test on different device
   - Check network conditions

4. **Document Steps to Reproduce**
   - Write down exact steps
   - Note any error messages
   - Include screenshots if possible

### Contact Information

- **Technical Support**: tech-support@yourdomain.com
- **User Support**: user-support@yourdomain.com
- **Emergency Issues**: +1-555-123-4567
- **Documentation Issues**: GitHub repository

### What to Include in Support Request

1. **Issue Description**
   - What you're trying to do
   - What's happening instead
   - When the issue started

2. **Environment Details**
   - Browser and version
   - Operating system
   - Device type

3. **Steps to Reproduce**
   - Exact sequence of actions
   - Any error messages
   - Screenshots or videos

4. **Debug Information**
   - Console errors
   - Network request failures
   - Performance metrics

---

**Need More Help?** Contact our support team with the information above for faster resolution.

*Last updated: January 2024*
