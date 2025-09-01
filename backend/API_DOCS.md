# Luxe Fragrances - API Documentation

Complete API reference for developers, integrators, and third-party applications.

## 🔑 **Authentication & Security**

### API Access
- **Base URL**: `https://yourdomain.com/api/v1`
- **Authentication**: Bearer token or API key
- **Rate Limiting**: 100 requests per minute
- **HTTPS**: Required for all requests

### Authentication Methods

#### 1. **Bearer Token**
```http
Authorization: Bearer <your_access_token>
```

#### 2. **API Key**
```http
X-API-Key: <your_api_key>
```

#### 3. **Session Cookie**
```http
Cookie: session=<session_token>
```

### Rate Limiting
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📦 **Product API**

### Get All Products
```http
GET /api/products
```

#### Query Parameters
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20, max: 100)
- `category` (string): Filter by category
- `search` (string): Search query
- `min_price` (number): Minimum price filter
- `max_price` (number): Maximum price filter
- `sort` (string): Sort order (price_asc, price_desc, rating, newest)

#### Response
```json
{
    "success": true,
    "data": {
        "products": [
            {
                "id": 1,
                "name": "Woody Elegance",
                "price": 89.99,
                "original_price": 99.99,
                "discount": 10,
                "image": "https://yourdomain.com/images/woody-elegance.jpg",
                "description": "A sophisticated blend of sandalwood, cedar, and amber notes",
                "category": "woody",
                "fragrance_type": "Eau de Parfum",
                "volume": "100ml",
                "concentration": "15-20%",
                "rating": 4.8,
                "reviews_count": 124,
                "in_stock": true,
                "stock_quantity": 50,
                "tags": ["woody", "masculine", "evening"],
                "notes": {
                    "top": ["Bergamot", "Lemon"],
                    "middle": ["Cedar", "Sandalwood"],
                    "base": ["Amber", "Musk"]
                },
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 100,
            "items_per_page": 20
        }
    }
}
```

### Get Single Product
```http
GET /api/products/{product_id}
```

#### Response
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Woody Elegance",
        "price": 89.99,
        "original_price": 99.99,
        "discount": 10,
        "images": [
            "https://yourdomain.com/images/woody-elegance-1.jpg",
            "https://yourdomain.com/images/woody-elegance-2.jpg"
        ],
        "description": "A sophisticated blend of sandalwood, cedar, and amber notes",
        "long_description": "Woody Elegance is a luxurious fragrance that captures the essence of ancient forests...",
        "category": "woody",
        "fragrance_type": "Eau de Parfum",
        "volume": "100ml",
        "concentration": "15-20%",
        "rating": 4.8,
        "reviews_count": 124,
        "in_stock": true,
        "stock_quantity": 50,
        "tags": ["woody", "masculine", "evening"],
        "notes": {
            "top": ["Bergamot", "Lemon"],
            "middle": ["Cedar", "Sandalwood"],
            "base": ["Amber", "Musk"]
        },
        "specifications": {
            "longevity": "8-12 hours",
            "sillage": "Moderate",
            "season": ["Fall", "Winter"],
            "occasion": ["Evening", "Formal"],
            "gender": "Unisex"
        },
        "related_products": [2, 3, 4],
        "variants": [
            {
                "id": 1,
                "volume": "50ml",
                "price": 59.99,
                "in_stock": true
            },
            {
                "id": 2,
                "volume": "100ml",
                "price": 89.99,
                "in_stock": true
            }
        ],
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }
}
```

### Search Products
```http
GET /api/products/search
```

#### Query Parameters
- `q` (string, required): Search query
- `page` (integer): Page number
- `limit` (integer): Items per page
- `category` (string): Filter by category
- `price_range` (string): Price range (e.g., "0-50", "50-100")

#### Response
```json
{
    "success": true,
    "data": {
        "query": "woody",
        "products": [...],
        "pagination": {...},
        "facets": {
            "categories": [
                {"name": "woody", "count": 25},
                {"name": "oriental", "count": 15}
            ],
            "price_ranges": [
                {"range": "0-50", "count": 10},
                {"range": "50-100", "count": 20}
            ]
        }
    }
}
```

### Get Product Categories
```http
GET /api/categories
```

#### Response
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "woody",
            "display_name": "Woody",
            "description": "Rich, warm scents with wood and amber notes",
            "image": "https://yourdomain.com/images/categories/woody.jpg",
            "product_count": 25,
            "subcategories": [
                {"id": 1, "name": "sandalwood", "product_count": 8},
                {"id": 2, "name": "cedar", "product_count": 12}
            ]
        }
    ]
}
```

## 🛒 **Cart API**

### Get Cart
```http
GET /api/cart
```

#### Response
```json
{
    "success": true,
    "data": {
        "items": [
            {
                "id": 1,
                "product_id": 1,
                "name": "Woody Elegance",
                "price": 89.99,
                "quantity": 2,
                "subtotal": 179.98,
                "image": "https://yourdomain.com/images/woody-elegance.jpg"
            }
        ],
        "summary": {
            "subtotal": 179.98,
            "tax": 14.40,
            "shipping": 0.00,
            "total": 194.38,
            "item_count": 2
        }
    }
}
```

### Add to Cart
```http
POST /api/cart/items
```

#### Request Body
```json
{
    "product_id": 1,
    "quantity": 2
}
```

#### Response
```json
{
    "success": true,
    "message": "Product added to cart",
    "data": {
        "cart_item": {...},
        "cart_summary": {...}
    }
}
```

### Update Cart Item
```http
PUT /api/cart/items/{item_id}
```

#### Request Body
```json
{
    "quantity": 3
}
```

### Remove from Cart
```http
DELETE /api/cart/items/{item_id}
```

### Clear Cart
```http
DELETE /api/cart
```

## 👤 **User API**

### User Registration
```http
POST /api/auth/register
```

#### Request Body
```json
{
    "email": "user@example.com",
    "password": "securepassword123",
    "confirm_password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
}
```

#### Response
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "created_at": "2024-01-01T00:00:00Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

### User Login
```http
POST /api/auth/login
```

#### Request Body
```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

#### Response
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {...},
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

### Get User Profile
```http
GET /api/user/profile
```

#### Response
```json
{
    "success": true,
    "data": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+1-555-123-4567",
        "date_of_birth": "1990-01-01",
        "gender": "male",
        "preferences": {
            "fragrance_types": ["woody", "oriental"],
            "newsletter": true,
            "marketing_emails": false
        },
        "addresses": [
            {
                "id": 1,
                "type": "shipping",
                "street": "123 Main St",
                "city": "New York",
                "state": "NY",
                "zip_code": "10001",
                "country": "US",
                "is_default": true
            }
        ],
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }
}
```

### Update User Profile
```http
PUT /api/user/profile
```

#### Request Body
```json
{
    "first_name": "John",
    "last_name": "Smith",
    "phone": "+1-555-123-4567"
}
```

### Change Password
```http
PUT /api/user/password
```

#### Request Body
```json
{
    "current_password": "oldpassword123",
    "new_password": "newpassword123",
    "confirm_password": "newpassword123"
}
```

## 📋 **Order API**

### Create Order
```http
POST /api/orders
```

#### Request Body
```json
{
    "shipping_address_id": 1,
    "billing_address_id": 1,
    "payment_method": "credit_card",
    "payment_token": "tok_123456789",
    "items": [
        {
            "product_id": 1,
            "quantity": 2
        }
    ],
    "notes": "Please gift wrap"
}
```

#### Response
```json
{
    "success": true,
    "message": "Order created successfully",
    "data": {
        "order": {
            "id": "ORD-2024-001",
            "status": "pending",
            "total": 194.38,
            "items": [...],
            "shipping_address": {...},
            "billing_address": {...},
            "created_at": "2024-01-01T00:00:00Z"
        }
    }
}
```

### Get User Orders
```http
GET /api/user/orders
```

#### Query Parameters
- `page` (integer): Page number
- `limit` (integer): Items per page
- `status` (string): Filter by status

#### Response
```json
{
    "success": true,
    "data": {
        "orders": [
            {
                "id": "ORD-2024-001",
                "status": "delivered",
                "total": 194.38,
                "item_count": 2,
                "created_at": "2024-01-01T00:00:00Z",
                "delivered_at": "2024-01-03T00:00:00Z"
            }
        ],
        "pagination": {...}
    }
}
```

### Get Order Details
```http
GET /api/user/orders/{order_id}
```

### Cancel Order
```http
POST /api/user/orders/{order_id}/cancel
```

## ❤️ **Wishlist API**

### Get User Wishlist
```http
GET /api/user/wishlist
```

### Add to Wishlist
```http
POST /api/user/wishlist
```

#### Request Body
```json
{
    "product_id": 1
}
```

### Remove from Wishlist
```http
DELETE /api/user/wishlist/{product_id}
```

## 🔌 **AliExpress Integration API**

### Get Integration Status
```http
GET /api/aliexpress/status
```

#### Response
```json
{
    "success": true,
    "data": {
        "connected": true,
        "api_key": "***",
        "last_update": "2024-01-01T12:00:00Z",
        "products_count": 150,
        "update_interval": 60,
        "demo_mode": false,
        "health": "healthy"
    }
}
```

### Sync Products
```http
POST /api/aliexpress/sync
```

#### Request Body
```json
{
    "force": true,
    "categories": ["perfume", "cologne"]
}
```

### Search AliExpress Products
```http
GET /api/aliexpress/search
```

#### Query Parameters
- `q` (string, required): Search query
- `category` (string): Product category
- `min_price` (number): Minimum price
- `max_price` (number): Maximum price
- `sort` (string): Sort order

### Get Trending Products
```http
GET /api/aliexpress/trending
```

#### Query Parameters
- `category` (string): Product category
- `limit` (integer): Number of products (default: 20)

## 📊 **Analytics API**

### Get Sales Analytics
```http
GET /api/analytics/sales
```

#### Query Parameters
- `period` (string): Time period (day, week, month, year)
- `start_date` (string): Start date (YYYY-MM-DD)
- `end_date` (string): End date (YYYY-MM-DD)

#### Response
```json
{
    "success": true,
    "data": {
        "total_revenue": 15420.50,
        "total_orders": 89,
        "average_order_value": 173.26,
        "top_products": [
            {
                "product_id": 1,
                "name": "Woody Elegance",
                "units_sold": 25,
                "revenue": 2249.75
            }
        ],
        "daily_data": [
            {
                "date": "2024-01-01",
                "revenue": 1250.00,
                "orders": 8
            }
        ]
    }
}
```

### Get Product Analytics
```http
GET /api/analytics/products
```

### Get Customer Analytics
```http
GET /api/analytics/customers
```

## 🔍 **Search API**

### Global Search
```http
GET /api/search
```

#### Query Parameters
- `q` (string, required): Search query
- `type` (string): Search type (products, categories, brands)
- `page` (integer): Page number
- `limit` (integer): Items per page

#### Response
```json
{
    "success": true,
    "data": {
        "query": "woody",
        "results": {
            "products": [...],
            "categories": [...],
            "brands": [...]
        },
        "suggestions": ["woody", "wood", "sandalwood"],
        "total_results": 45
    }
}
```

## 📱 **PWA API**

### Get App Manifest
```http
GET /api/pwa/manifest
```

### Get Service Worker
```http
GET /api/pwa/service-worker
```

### Get Offline Data
```http
GET /api/pwa/offline-data
```

## 🚨 **Error Handling**

### Error Response Format
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": {
            "email": ["Email is required"],
            "password": ["Password must be at least 8 characters"]
        }
    }
}
```

### Common Error Codes
- `AUTHENTICATION_FAILED`: Invalid credentials
- `AUTHORIZATION_FAILED`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid input data
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_SERVER_ERROR`: Server error

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## 📝 **Request Examples**

### cURL Examples

#### Get Products
```bash
curl -X GET "https://yourdomain.com/api/products?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Add to Cart
```bash
curl -X POST "https://yourdomain.com/api/cart/items" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'
```

#### Create Order
```bash
curl -X POST "https://yourdomain.com/api/orders" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address_id": 1,
    "billing_address_id": 1,
    "payment_method": "credit_card",
    "payment_token": "tok_123456789",
    "items": [{"product_id": 1, "quantity": 2}]
  }'
```

### JavaScript Examples

#### Fetch Products
```javascript
const response = await fetch('https://yourdomain.com/api/products', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

const data = await response.json();
```

#### Add to Cart
```javascript
const response = await fetch('https://yourdomain.com/api/cart/items', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        product_id: 1,
        quantity: 2
    })
});
```

## 🔧 **SDK & Libraries**

### JavaScript SDK
```javascript
import { LuxeFragrancesAPI } from '@luxefragrances/sdk';

const api = new LuxeFragrancesAPI({
    baseURL: 'https://yourdomain.com/api/v1',
    token: 'your_token'
});

// Get products
const products = await api.products.getAll();

// Add to cart
await api.cart.addItem(1, 2);

// Create order
const order = await api.orders.create(orderData);
```

### Python SDK
```python
from luxefragrances import LuxeFragrancesAPI

api = LuxeFragrancesAPI(
    base_url='https://yourdomain.com/api/v1',
    token='your_token'
)

# Get products
products = api.products.get_all()

# Add to cart
api.cart.add_item(product_id=1, quantity=2)
```

## 📚 **Additional Resources**

### Documentation
- **Interactive API Docs**: https://yourdomain.com/api/docs
- **Postman Collection**: Available for download
- **OpenAPI Spec**: https://yourdomain.com/api/openapi.json

### Support
- **Developer Forum**: https://community.yourdomain.com
- **Email Support**: api-support@yourdomain.com
- **Documentation Issues**: GitHub repository

### Rate Limits & Quotas
- **Free Tier**: 100 requests/hour
- **Basic Tier**: 1,000 requests/hour
- **Premium Tier**: 10,000 requests/hour
- **Enterprise**: Custom limits

---

**API Version**: v1  
**Last Updated**: January 2024  
**Support**: api-support@yourdomain.com
