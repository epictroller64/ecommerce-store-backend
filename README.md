# E-commerce Store Backend

A modern TypeScript backend for an e-commerce store built with Express.js, Drizzle ORM, and PostgreSQL. This backend is designed to work seamlessly with the frontend LocalApi interface.

## 🚀 Features

- **TypeScript** - Full type safety and modern JavaScript features
- **Express.js** - Fast, unopinionated web framework
- **Drizzle ORM** - Type-safe SQL ORM with excellent TypeScript support
- **PostgreSQL** - Robust, open-source database
- **JWT Authentication** - Secure user authentication with JWT tokens
- **Product Variants** - Support for product variants (color, size, etc.)
- **Order Management** - Complete order lifecycle management
- **Payment & Delivery** - Configurable payment and delivery methods
- **Site Configuration** - Dynamic site configuration and hero images
- **RESTful API** - Clean, consistent API design matching frontend interface
- **Error Handling** - Comprehensive error handling and logging
- **Security** - Helmet.js for security headers
- **CORS** - Cross-origin resource sharing support

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-store-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db
   PORT=8080
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm test` - Test database connection
- `npm run setup` - Add sample data to database
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio for database management
- `npm run db:push` - Push schema changes to database

## 🗄️ Database Schema

The application includes the following tables:

- **users** - User accounts and authentication
- **categories** - Product categories
- **products** - Product information
- **product_variants** - Product variants (color, size, etc.)
- **orders** - Customer orders
- **order_items** - Individual items in orders
- **payment_methods** - Available payment methods
- **delivery_methods** - Available delivery methods
- **site_config** - Site configuration settings
- **hero_images** - Hero banner images

## 🔌 API Endpoints

All endpoints match the frontend LocalApi interface:

### Authentication
- `POST /register-user` - Register new user
- `POST /login-user` - Login user

### User Management
- `GET /get-user` - Get user information (authenticated)
- `POST /update-user-settings` - Update user settings (authenticated)

### Products
- `GET /get-products` - Get all products with variants
- `GET /get-best-selling-products` - Get best selling products
- `GET /get-product` - Get product by ID with all variants

### Categories
- `GET /get-categories` - Get all categories with product counts

### Orders
- `POST /create-order` - Create new order (authenticated)
- `GET /get-orders` - Get user orders (authenticated)
- `GET /get-order` - Get specific order (authenticated)
- `POST /cancel-order` - Cancel order (authenticated)
- `POST /complete-checkout` - Complete checkout process (authenticated)

### Payment & Delivery
- `GET /get-payment-methods` - Get available payment methods
- `GET /get-delivery-methods` - Get available delivery methods

### Site Configuration
- `GET /get-site-info` - Get site information
- `GET /get-hero-images` - Get hero banner images
- `GET /get-config` - Get site configuration

### Health Check
- `GET /health` - Server health status

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {...},
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "message": "Detailed error message",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔧 Development

### Project Structure
```
src/
├── db/
│   ├── connection.ts    # Database connection with Drizzle
│   └── schema.ts        # Database schema with all tables
├── middleware/
│   ├── errorHandler.ts  # Error handling middleware
│   └── auth.ts          # JWT authentication middleware
├── routes/
│   ├── auth.ts          # Authentication routes
│   ├── users.ts         # User management routes
│   ├── products-new.ts  # Product routes with variants
│   ├── categories-new.ts # Category routes
│   ├── orders.ts        # Order management routes
│   ├── payment-methods.ts # Payment method routes
│   ├── delivery-methods.ts # Delivery method routes
│   └── site.ts          # Site configuration routes
├── types/
│   └── index.ts         # TypeScript type definitions
└── index.ts             # Main application file
```

### Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Database Migrations

When you modify the schema:

1. Update the schema in `src/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review the generated migration in `drizzle/`
4. Run migration: `npm run db:migrate`

### Sample Data

Run the setup script to populate the database with sample data:

```bash
npm run setup
```

This will create:
- Sample categories (Electronics, Clothing, Books)
- Sample products with variants
- Payment methods (Credit Card, PayPal, Bank Transfer)
- Delivery methods (Standard, Express, Same Day)
- Site configuration and hero images

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Set production environment variables
3. Start the server:
   ```bash
   npm start
   ```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Helmet.js security headers
- CORS configuration
- Input validation
- SQL injection protection via Drizzle ORM

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

## 🔗 Frontend Integration

This backend is designed to work with the frontend LocalApi interface. All endpoints match the expected request/response formats from the frontend interface files in the `EXAMPLE/` folder. 