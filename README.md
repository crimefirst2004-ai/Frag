# Luxe Fragrances E-Commerce Platform

A complete luxury fragrance e-commerce platform with modern frontend and robust backend API.

## 🏗️ Project Structure

```
luxe-fragrances/
├── frontend/           # Frontend application (HTML/CSS/JS)
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   ├── assets/        # Images and static files
│   ├── *.html         # HTML pages
│   ├── manifest.json  # PWA manifest
│   ├── sw.js          # Service worker
│   └── README.md      # Frontend documentation
├── backend/           # Backend API (Node.js/Express)
│   ├── api/           # API routes and controllers
│   ├── config/        # Configuration files
│   ├── models/        # Database models
│   ├── services/      # External service integrations
│   ├── utils/         # Utility functions
│   ├── server.js      # Main server file
│   ├── package.json   # Backend dependencies
│   └── README.md      # Backend documentation
└── README.md          # This file
```

## 🚀 Quick Start

### Frontend (Static Site)
```bash
# Navigate to frontend directory
cd frontend

# Start a local server (choose one)
python -m http.server 8000
# OR
npx http-server -p 8000
# OR
php -S localhost:8000

# Open in browser
http://localhost:8000
```

### Backend (API Server)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# API will be available at
http://localhost:5000
```

## ✨ Features

### Frontend Features
- **Responsive Design** - Works on all devices
- **Progressive Web App (PWA)** - Offline support
- **Luxury Design** - Black, gold, and white theme
- **Product Catalog** - Dynamic product display
- **Shopping Cart** - Persistent cart functionality
- **Wishlist** - Save favorite products
- **User Authentication** - Login/register system
- **Checkout Process** - Multi-step checkout
- **Admin Panel** - Product management
- **AliExpress Integration** - Dynamic product sourcing
- **SEO Optimized** - Meta tags, structured data
- **Performance Optimized** - Lazy loading, caching

### Backend Features
- **RESTful API** - Express.js server
- **MongoDB Database** - Mongoose ODM
- **JWT Authentication** - Secure user sessions
- **AliExpress Integration** - Product sourcing API
- **Stripe Payments** - Payment processing
- **File Upload** - Image upload functionality
- **Email Notifications** - Order confirmations
- **Rate Limiting** - API protection
- **Security Middleware** - Helmet, CORS, validation
- **Error Handling** - Comprehensive error management

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **JavaScript (ES6+)** - Modern JavaScript features
- **Progressive Web App** - Service worker, manifest
- **LocalStorage** - Client-side data persistence

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling
- **JWT** - JSON Web Tokens
- **Stripe** - Payment processing
- **Multer** - File upload handling
- **Nodemailer** - Email sending
- **Helmet** - Security middleware

## 📱 Progressive Web App

The frontend is a full PWA with:
- **Service Worker** - Offline functionality
- **Web App Manifest** - App-like experience
- **Push Notifications** - User engagement
- **Background Sync** - Offline data sync
- **Install Prompt** - Add to home screen

## 🔒 Security Features

- **HTTPS Only** - Secure connections
- **Content Security Policy** - XSS protection
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Data sanitization
- **JWT Tokens** - Secure authentication
- **CORS Configuration** - Cross-origin protection

## 📊 Performance Optimization

### Frontend
- **Lazy Loading** - Images load on demand
- **Critical CSS** - Inline critical styles
- **Deferred JavaScript** - Non-blocking scripts
- **Image Optimization** - WebP with fallbacks
- **Service Worker Caching** - Offline support

### Backend
- **Compression** - Gzip response compression
- **Caching** - Redis caching layer
- **Database Indexing** - Optimized queries
- **Connection Pooling** - Database efficiency
- **Load Balancing** - Horizontal scaling ready

## 🎨 Design System

### Color Palette
- **Primary Black**: `#000000` - Main backgrounds
- **Gold**: `#D4AF37` - Accents and highlights
- **White**: `#FFFFFF` - Text and light backgrounds
- **Charcoal Gray**: `#2E2E2E` - Secondary elements

### Typography
- **Primary**: Inter (Google Fonts)
- **Display**: Playfair Display (headings)
- **Fallback**: System fonts

## 📈 SEO & Analytics

### SEO Features
- **Meta Tags** - Optimized for search engines
- **Structured Data** - Schema.org markup
- **Sitemap** - XML sitemap generation
- **Robots.txt** - Search engine directives
- **Canonical URLs** - Duplicate content prevention

### Analytics Ready
- **Google Analytics** - Traffic tracking
- **Conversion Tracking** - E-commerce events
- **Performance Monitoring** - Core Web Vitals
- **Error Tracking** - Sentry integration

## 🚀 Deployment

### Frontend Deployment
Deploy to any static hosting service:
- **Netlify** - Drag and drop
- **Vercel** - Git-based deployment
- **GitHub Pages** - Free hosting
- **AWS S3** - Scalable hosting

### Backend Deployment
Deploy to cloud platforms:
- **Heroku** - Easy deployment
- **AWS EC2** - Scalable infrastructure
- **Google Cloud** - Managed services
- **DigitalOcean** - VPS hosting

## 🧪 Testing

### Frontend Testing
- **Browser Testing** - Cross-browser compatibility
- **Responsive Testing** - Mobile/tablet/desktop
- **Performance Testing** - Lighthouse audits
- **Accessibility Testing** - WCAG compliance

### Backend Testing
- **Unit Tests** - Jest testing framework
- **Integration Tests** - API endpoint testing
- **Load Testing** - Performance under stress
- **Security Testing** - Vulnerability scanning

## 📚 Documentation

- **[Frontend Documentation](frontend/README.md)** - Complete frontend guide
- **[Backend Documentation](backend/README.md)** - API documentation
- **[API Reference](backend/docs/api.md)** - Endpoint documentation
- **[Deployment Guide](docs/deployment.md)** - Deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in each folder
- Contact the development team

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **API Documentation**: [Coming Soon]
- **Admin Panel**: [Coming Soon]
- **Mobile App**: [Coming Soon]

---

**Built with ❤️ by the Luxe Fragrances Team**
