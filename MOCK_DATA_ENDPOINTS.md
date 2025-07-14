# Mock Data Generation Endpoints

This document describes the mock data generation endpoints that can be used to populate the database with realistic test data for products and categories.

## Endpoints

### 1. Generate All Mock Data
**POST** `/mock-data/generate-all`

Generates both categories and products in one request.

**Request Body:**
```json
{
  "categoryCount": 10,
  "productCount": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully generated 10 categories and 50 products",
  "data": {
    "categories": [...],
    "products": [...],
    "categoryCount": 10,
    "productCount": 50
  }
}
```

### 2. Generate Categories Only
**POST** `/mock-data/generate-categories`

Generates only categories.

**Request Body:**
```json
{
  "count": 15
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully generated 15 categories",
  "data": {
    "categories": [...],
    "count": 15
  }
}
```

### 3. Generate Products Only
**POST** `/mock-data/generate-products`

Generates products. If no categories exist, it will return an error.

**Request Body:**
```json
{
  "count": 100,
  "categoryIds": ["uuid1", "uuid2"] // Optional: specific category IDs to use
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully generated 100 products with variants",
  "data": {
    "products": [...],
    "count": 100
  }
}
```

### 4. Clear All Mock Data
**DELETE** `/mock-data/clear-all`

Removes all generated categories, products, and their variants.

**Response:**
```json
{
  "success": true,
  "message": "Successfully cleared all mock data",
  "data": {
    "message": "All mock data cleared successfully"
  }
}
```

## Data Generation Details

### Categories
- **Names**: 30 predefined category names including Electronics, Clothing, Home & Garden, Sports & Outdoors, etc.
- **Slugs**: Auto-generated from category names (e.g., "Electronics" → "electronics-1")
- **Descriptions**: Auto-generated descriptive text for each category

### Products
- **Names**: 100+ predefined product names across different categories
- **Descriptions**: 20 different realistic product descriptions
- **Ratings**: Random rating between 3.0-5.0
- **Review Count**: Random count between 10-1010
- **Active Status**: 90% chance of being active
- **Shared Images**: 50% chance of having shared images

### Product Variants
- **Count**: 1-3 variants per product
- **Colors**: Red, Blue, Green, Yellow, Black, White, Gray, Purple, Orange, Pink
- **Sizes**: Small, Medium, Large, X-Large, XX-Large
- **Prices**: Random price between $10-$210
- **Stock**: Random stock between 1-100
- **Images**: Random images from Picsum Photos
- **Active Status**: 90% chance of being active

## Usage Examples

### Quick Start (Generate Everything)
```bash
curl -X POST http://localhost:8080/mock-data/generate-all \
  -H "Content-Type: application/json" \
  -d '{"categoryCount": 10, "productCount": 50}'
```

### Generate Categories First, Then Products
```bash
# Generate categories
curl -X POST http://localhost:8080/mock-data/generate-categories \
  -H "Content-Type: application/json" \
  -d '{"count": 15}'

# Generate products
curl -X POST http://localhost:8080/mock-data/generate-products \
  -H "Content-Type: application/json" \
  -d '{"count": 100}'
```

### Clear All Data
```bash
curl -X DELETE http://localhost:8080/mock-data/clear-all
```

## Validation Rules

- **Category Count**: Must be between 1-100
- **Product Count**: Must be between 1-500
- **Products without Categories**: Will return an error if no categories exist

## Notes

- All generated data is realistic and suitable for testing e-commerce applications
- Product variants include realistic pricing and stock levels
- Categories are distributed across various e-commerce domains
- Images are randomly generated using Picsum Photos service
- All timestamps are automatically set to current time 