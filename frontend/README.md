# Luxe Fragrances Frontend

A modern, responsive e-commerce frontend for the Luxe Fragrances platform built with HTML5, CSS3, and JavaScript.

## 🚀 Features

- **Responsive Design** - Works on all devices
- **Progressive Web App (PWA)** - Offline support and app-like experience
- **Luxury Design** - Premium black, gold, and white color scheme
- **Product Catalog** - Dynamic product display with filtering
- **Shopping Cart** - Persistent cart with localStorage
- **Wishlist** - Save favorite products
- **User Authentication** - Login/register functionality
- **Checkout Process** - Multi-step checkout with form validation
- **Admin Panel** - Product and order management
- **AliExpress Integration** - Dynamic product sourcing
- **SEO Optimized** - Meta tags, structured data, sitemap
- **Performance Optimized** - Lazy loading, compression, caching

## 📁 Project Structure

```
frontend/
├── css/                 # Stylesheets
│   ├── styles.css       # Global styles
│   ├── admin.css        # Admin panel styles
│   ├── products.css     # Products page styles
│   └── checkout.css     # Checkout page styles
├── js/                  # JavaScript files
│   ├── script.js        # Main application logic
│   ├── auth.js          # Authentication handling
│   ├── products.js      # Products page functionality
│   ├── checkout.js      # Checkout process
│   ├── aliexpress.js    # AliExpress API integration
│   └── admin.js         # Admin panel functionality
├── assets/              # Static assets
│   ├── images/          # Product images
│   ├── favicon.ico      # Site favicon
│   └── *.png            # Icon files
├── index.html           # Homepage
├── products.html        # Products page
├── checkout.html        # Checkout page
├── login.html           # Login page
├── account.html         # User account page
├── admin.html           # Admin panel
├── manifest.json        # PWA manifest
├── sw.js               # Service worker
├── robots.txt          # SEO robots file
└── sitemap.xml         # SEO sitemap
```

## 🛠️ Setup & Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Development Server

For better development experience, use a proper development server:

```bash
# Install live-server globally
npm install -g live-server

# Start development server
live-server --port=8000 --open=/index.html
```

## 🎨 Design System

### Color Palette
- **Primary Black**: `#000000` - Main backgrounds
- **Gold**: `#D4AF37` - Accents and highlights
- **White**: `#FFFFFF` - Text and light backgrounds
- **Charcoal Gray**: `#2E2E2E` - Secondary elements

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Display Font**: Playfair Display (for headings)
- **Fallback**: System fonts

### Components
- **Buttons**: Rounded corners, hover effects
- **Cards**: Subtle shadows, gold borders
- **Forms**: Clean inputs with validation
- **Navigation**: Sticky header with smooth transitions

## 📱 Progressive Web App Features

### Service Worker
- **Caching Strategy**: Cache-first for static assets
- **Offline Support**: Basic offline functionality
- **Background Sync**: Queue actions when offline

### Web App Manifest
- **App Name**: Luxe Fragrances
- **Icons**: Multiple sizes for different devices
- **Theme**: Dark theme with gold accents
- **Display**: Standalone app experience

## 🔧 Configuration

### AliExpress Integration
Update the API configuration in `js/aliexpress.js`:

```javascript
const API_KEY = 'your-rapidapi-key';
const API_HOST = 'aliexpress-data.p.rapidapi.com';
const STORE_ID = '1103441068';
```

### PWA Configuration
Modify `manifest.json` for app customization:

```json
{
  "name": "Luxe Fragrances",
  "short_name": "Luxe",
  "theme_color": "#D4AF37",
  "background_color": "#000000"
}
```

## 📊 Performance Optimization

### Loading Optimization
- **Lazy Loading**: Images load as they enter viewport
- **Critical CSS**: Inline critical styles
- **Deferred JavaScript**: Non-critical scripts load after page
- **Image Optimization**: WebP format with fallbacks

### Caching Strategy
- **Static Assets**: Cache for 1 year
- **API Responses**: Cache for 1 hour
- **HTML Pages**: Cache for 1 day
- **Service Worker**: Version-based cache invalidation

## 🔒 Security Features

- **Content Security Policy**: Restricts resource loading
- **HTTPS Only**: Secure connections required
- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based requests

## 🧪 Testing

### Browser Testing
- **Chrome**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version
- **Edge**: Latest version
- **Mobile**: iOS Safari, Chrome Mobile

### Responsive Testing
- **Desktop**: 1920px, 1366px, 1024px
- **Tablet**: 768px, 1024px
- **Mobile**: 375px, 414px, 768px

### Performance Testing
- **Lighthouse**: 90+ scores
- **PageSpeed Insights**: Optimized loading
- **WebPageTest**: Performance metrics

## 📈 SEO Features

### Meta Tags
- **Title**: Optimized for each page
- **Description**: Unique descriptions
- **Keywords**: Relevant keywords
- **Open Graph**: Social media sharing
- **Twitter Cards**: Twitter sharing

### Structured Data
- **Product Schema**: Product information
- **Organization Schema**: Company details
- **Breadcrumb Schema**: Navigation structure
- **Review Schema**: Product reviews

### Technical SEO
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine directives
- **Canonical URLs**: Prevent duplicate content
- **Alt Tags**: Image accessibility

## 🚀 Deployment

### Static Hosting
Deploy to any static hosting service:

- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting
- **AWS S3**: Scalable hosting
- **Firebase Hosting**: Google's hosting

### Build Process
```bash
# Optimize images
npm run optimize-images

# Minify CSS and JS
npm run minify

# Generate sitemap
npm run generate-sitemap

# Build for production
npm run build
```

## 🔧 Customization

### Adding New Pages
1. Create HTML file in root directory
2. Add CSS file in `css/` directory
3. Add JavaScript file in `js/` directory
4. Update navigation links
5. Add to sitemap

### Styling Changes
1. Modify CSS variables in `css/styles.css`
2. Update color scheme in component files
3. Test across all breakpoints
4. Update manifest.json if needed

### Feature Additions
1. Create new JavaScript module
2. Add to appropriate HTML file
3. Update service worker if needed
4. Test functionality thoroughly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across browsers and devices
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔗 Related Projects

- [Backend API](../backend/) - Node.js/Express API
- [Mobile App](../mobile/) - React Native app
- [Admin Dashboard](../admin/) - Admin interface
