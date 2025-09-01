# Luxe Fragrances - Setup & Installation Guide

Complete setup instructions for developers, administrators, and deployment teams.

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 16+ (for development tools)
- **Modern Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Local Server**: For development and testing
- **Git**: For version control (optional)

### 1. Download & Extract
```bash
# Option 1: Direct download
wget https://github.com/your-username/luxe-fragrances/archive/main.zip
unzip main.zip
cd luxe-fragrances-main

# Option 2: Git clone
git clone https://github.com/your-username/luxe-fragrances.git
cd luxe-fragrances
```

### 2. File Structure Verification
Ensure your project contains:
```
luxe-fragrances/
├── index.html              # Main store page
├── login.html              # Authentication page
├── admin.html              # Admin dashboard
├── account.html            # User account management
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── robots.txt              # Search engine guidance
├── sitemap.xml             # XML sitemap
├── css/
│   ├── styles.css          # Main styles
│   └── admin.css           # Admin panel styles
├── js/
│   ├── auth.js             # Authentication system
│   ├── script.js           # Main store functionality
│   ├── aliexpress.js       # AliExpress integration
│   └── admin.js            # Admin panel functionality
├── images/                  # Product images (create this)
├── docs/                   # Documentation (this folder)
└── README.md               # Project overview
```

### 3. Local Development Setup

#### Option A: Simple HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (install http-server globally)
npm install -g http-server
http-server -p 8000

# PHP
php -S localhost:8000
```

#### Option B: Live Server (VS Code Extension)
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### 4. Access Your Site
- **Local Development**: `http://localhost:8000`
- **Production**: `https://yourdomain.com`

## 🔧 Configuration

### Environment Setup

#### 1. AliExpress API Configuration
```javascript
// In js/aliexpress.js, update these values:
const config = {
    apiKey: 'your_api_key_here',
    baseUrl: 'https://api.aliexpress.com/v2/',
    updateInterval: 60, // minutes
    demoMode: false
};
```

#### 2. Site Configuration
```javascript
// In js/script.js, update store settings:
const storeConfig = {
    storeName: 'Luxe Fragrances',
    storeUrl: 'https://yourdomain.com',
    contactEmail: 'info@yourdomain.com',
    contactPhone: '+1-555-123-4567'
};
```

#### 3. PWA Configuration
```json
// In manifest.json, update:
{
    "name": "Your Store Name",
    "short_name": "Your Store",
    "description": "Your store description",
    "start_url": "https://yourdomain.com/",
    "scope": "https://yourdomain.com/"
}
```

### Database Setup

#### Local Storage (Default)
- **No setup required** - uses browser localStorage
- **Data persistence**: Survives browser restarts
- **Limitations**: 5-10MB per domain

#### External Database (Optional)
```javascript
// Configure in js/auth.js for user management
const dbConfig = {
    type: 'mysql', // or 'postgresql', 'mongodb'
    host: 'localhost',
    port: 3306,
    database: 'luxe_fragrances',
    username: 'db_user',
    password: 'db_password'
};
```

## 🌐 Production Deployment

### 1. Domain & SSL Setup
```bash
# Purchase domain and SSL certificate
# Configure DNS records:
# A Record: @ -> Your Server IP
# CNAME: www -> @
# A Record: api -> Your API Server IP
```

### 2. Server Requirements
- **Web Server**: Nginx or Apache
- **SSL Certificate**: Let's Encrypt (free) or paid
- **HTTPS**: Required for PWA functionality
- **PHP**: 7.4+ (if using PHP features)

### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/luxe-fragrances;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # PWA support
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Service worker
    location = /sw.js {
        add_header Cache-Control "no-cache";
    }
    
    # HTML files
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### 4. Apache Configuration
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    Redirect permanent / https://yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    DocumentRoot /var/www/luxe-fragrances
    
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    
    # PWA caching
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>
    
    <FilesMatch "\.html$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
    </FilesMatch>
</VirtualHost>
```

## 🔐 Security Configuration

### 1. Content Security Policy
```html
<!-- Add to all HTML files -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; 
               font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; 
               img-src 'self' data: https:; 
               connect-src 'self' https://api.aliexpress.com;">
```

### 2. API Security
```javascript
// Rate limiting for AliExpress API
const rateLimit = {
    maxRequests: 100,
    timeWindow: 60000, // 1 minute
    retryDelay: 5000   // 5 seconds
};
```

### 3. User Authentication
```javascript
// Password requirements
const passwordPolicy = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
};
```

## 📱 PWA Configuration

### 1. Service Worker Registration
```javascript
// Ensure this is in your HTML files
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}
```

### 2. Manifest Validation
```bash
# Test your manifest.json
# Visit: https://manifest-validator.appspot.com/
# Or use Chrome DevTools > Application > Manifest
```

### 3. PWA Testing
```bash
# Lighthouse PWA audit
npm install -g lighthouse
lighthouse https://yourdomain.com --view

# Or use Chrome DevTools > Lighthouse
```

## 🧪 Testing & Quality Assurance

### 1. Browser Testing
```bash
# Test in multiple browsers
- Chrome (Desktop & Mobile)
- Firefox (Desktop & Mobile)
- Safari (Desktop & Mobile)
- Edge (Desktop & Mobile)
```

### 2. Performance Testing
```bash
# Core Web Vitals
lighthouse https://yourdomain.com --only-categories=performance

# WebPageTest
# Visit: https://www.webpagetest.org/
```

### 3. SEO Testing
```bash
# Google PageSpeed Insights
# Visit: https://pagespeed.web.dev/

# Mobile-Friendly Test
# Visit: https://search.google.com/test/mobile-friendly
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Service Worker Not Working
```bash
# Check browser console for errors
# Verify HTTPS in production
# Clear browser cache and cookies
# Check file paths in sw.js
```

#### 2. PWA Installation Fails
```bash
# Verify manifest.json syntax
# Check icon file paths
# Ensure HTTPS connection
# Test in supported browsers
```

#### 3. AliExpress API Errors
```bash
# Verify API key validity
# Check network connectivity
# Review API rate limits
# Test with demo mode first
```

#### 4. Performance Issues
```bash
# Optimize images
# Minify CSS/JS
# Enable gzip compression
# Use CDN for static assets
```

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug_mode', 'true');

// Check console for detailed logs
// Monitor network requests
// Verify localStorage data
```

## 📊 Monitoring & Analytics

### 1. Performance Monitoring
```javascript
// Core Web Vitals tracking
import('web-vitals').then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
});
```

### 2. Error Tracking
```javascript
// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to your error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Send to your error tracking service
});
```

### 3. User Analytics
```javascript
// Basic analytics setup
const analytics = {
    trackPageView: (page) => {
        console.log('Page view:', page);
        // Send to Google Analytics, etc.
    },
    trackEvent: (category, action, label) => {
        console.log('Event:', {category, action, label});
        // Send to your analytics service
    }
};
```

## 🔄 Updates & Maintenance

### 1. Regular Updates
```bash
# Check for updates monthly
# Update dependencies
# Review security patches
# Test functionality after updates
```

### 2. Backup Strategy
```bash
# Daily backups of user data
# Weekly backups of entire site
# Store backups securely
# Test restore procedures
```

### 3. Performance Monitoring
```bash
# Monitor Core Web Vitals
# Track user engagement
# Monitor server performance
# Optimize based on data
```

## 📞 Support & Resources

### Getting Help
- **Documentation**: Check this guide and README.md
- **Issues**: Create GitHub issue for bugs
- **Questions**: Use GitHub discussions
- **Security**: Report security issues privately

### Additional Resources
- **AliExpress API**: [Developer Portal](https://developers.aliexpress.com/)
- **PWA Documentation**: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- **Performance**: [Web.dev](https://web.dev/performance/)
- **SEO**: [Google Search Console](https://search.google.com/search-console)

---

**Need Help?** Create an issue on GitHub or contact the development team.

*Last updated: January 2024*
