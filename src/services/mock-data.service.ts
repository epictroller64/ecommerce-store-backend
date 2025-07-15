import { db } from '../db/connection';
import { categories, products, productVariants } from '../db/schema';
import { createSuccessResponse, createErrorResponse, ApiResponse } from '../types';

export class MockDataService {
    private categoryNames = [
        'Electronics', 'Clothing', 'Home & Garden', 'Sports & Outdoors', 'Books & Media',
        'Beauty & Health', 'Toys & Games', 'Automotive', 'Food & Beverages', 'Jewelry & Watches',
        'Pet Supplies', 'Office Supplies', 'Baby & Kids', 'Tools & Hardware', 'Art & Crafts',
        'Music & Instruments', 'Travel & Luggage', 'Fitness & Wellness', 'Garden & Outdoor',
        'Kitchen & Dining', 'Furniture', 'Lighting', 'Bath & Bedding', 'Storage & Organization',
        'Smart Home', 'Gaming', 'Photography', 'DIY & Home Improvement', 'Party Supplies',
        'Vintage & Collectibles', 'Sustainable Living'
    ];

    private productNames = [
        // Electronics
        'Wireless Bluetooth Headphones', 'Smartphone Case', 'USB-C Charging Cable', 'Wireless Mouse',
        'Bluetooth Speaker', 'Laptop Stand', 'Phone Mount', 'Power Bank', 'Wireless Earbuds',
        'Tablet Screen Protector', 'Gaming Keyboard', 'Webcam', 'Microphone', 'Monitor Stand',
        'Cable Organizer', 'Phone Grip', 'Wireless Charger', 'Laptop Cooling Pad', 'HDMI Cable',
        'USB Hub', 'Keyboard Wrist Rest',

        // Clothing
        'Cotton T-Shirt', 'Denim Jeans', 'Hooded Sweatshirt', 'Running Shoes', 'Winter Jacket',
        'Summer Dress', 'Polo Shirt', 'Athletic Shorts', 'Formal Shirt', 'Casual Blazer',
        'Sneakers', 'Sweater', 'Tank Top', 'Leggings', 'Cardigan', 'Pants', 'Skirt',
        'Blouse', 'Suit Jacket', 'Dress Shoes', 'Sandals',

        // Home & Garden
        'Coffee Maker', 'Throw Pillow', 'Wall Clock', 'Desk Lamp', 'Plant Pot',
        'Kitchen Towels', 'Bath Mat', 'Picture Frame', 'Candle Holder', 'Vase',
        'Mirror', 'Rug', 'Curtains', 'Bedding Set', 'Kitchen Utensils',
        'Garden Tools', 'Outdoor Chair', 'Bird Feeder', 'Plant Stand', 'Watering Can',

        // Sports & Outdoors
        'Yoga Mat', 'Dumbbells', 'Resistance Bands', 'Water Bottle', 'Gym Bag',
        'Running Watch', 'Tennis Racket', 'Basketball', 'Soccer Ball', 'Bike Helmet',
        'Camping Tent', 'Sleeping Bag', 'Hiking Boots', 'Fishing Rod', 'Swimming Goggles',
        'Treadmill', 'Exercise Bike', 'Punching Bag', 'Boxing Gloves', 'Jump Rope',

        // Books & Media
        'Novel', 'Cookbook', 'Self-Help Book', 'Children\'s Book', 'Magazine',
        'DVD Set', 'Vinyl Record', 'Audiobook', 'E-reader', 'Bookmark',
        'Notebook', 'Pen Set', 'Desk Organizer', 'Calendar', 'Planner',
        'Art Book', 'Travel Guide', 'Biography', 'Poetry Collection', 'Reference Book'
    ];

    private productDescriptions = [
        'High-quality product designed for everyday use. Features premium materials and excellent craftsmanship.',
        'Innovative design that combines style and functionality. Perfect for modern lifestyles.',
        'Durable construction ensures long-lasting performance. Built to withstand daily wear and tear.',
        'Elegant design with attention to detail. Adds sophistication to any space.',
        'Versatile product that adapts to various needs. Great value for money.',
        'Premium quality with advanced features. Designed for comfort and convenience.',
        'Stylish and practical solution for your needs. Easy to use and maintain.',
        'Professional-grade product suitable for both personal and commercial use.',
        'Eco-friendly materials with sustainable manufacturing. Good for the environment.',
        'Compact design that saves space while maintaining functionality. Perfect for small spaces.',
        'Advanced technology with user-friendly interface. Cutting-edge features for modern users.',
        'Classic design with contemporary updates. Timeless appeal with modern functionality.',
        'Lightweight and portable design. Easy to carry and store.',
        'Multi-functional product that serves multiple purposes. Maximizes utility.',
        'Customizable options to suit individual preferences. Personalize to your needs.',
        'Weather-resistant construction for outdoor use. Built to last in various conditions.',
        'Ergonomic design for comfort during extended use. Reduces strain and fatigue.',
        'Quick and easy setup process. Ready to use in minutes.',
        'Energy-efficient design that saves money. Environmentally conscious choice.',
        'Family-friendly product suitable for all ages. Safe and reliable for everyone.'
    ];

    private colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Gray', 'Purple', 'Orange', 'Pink'];
    private sizes = ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];
    private materials = ['Cotton', 'Polyester', 'Leather', 'Plastic', 'Metal', 'Wood', 'Glass', 'Ceramic'];

    private imageNames = [
        // Original images
        'fd8a8819-1ed3-4046-add1-90c412e4c10b.jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_0.jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_1.jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_2.jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_3.jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_0 (1).jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_1 (1).jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_1 (2).jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_1 (3).jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_2 (1).jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_2 (2).jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_2 (3).jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_3 (1).jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_3 (2).jpg',
        'Leonardo_Lightning_XL_laptop_product_preview_image_with_whitel_3 (3).jpg',

        // New smartphone images
        'Leonardo_Phoenix_10_Highly_realistic_smartphone_product_previe_0.jpg',
        'Leonardo_Phoenix_10_Highly_realistic_smartphone_product_previe_1.jpg',
        'Leonardo_Phoenix_10_Highly_realistic_smartphone_product_previe_2.jpg',
        'Leonardo_Phoenix_10_Highly_realistic_smartphone_product_previe_3.jpg',

        // New monitor images
        'Leonardo_Phoenix_10_A_sleek_and_modern_monitor_product_preview_0.jpg',
        'Leonardo_Phoenix_10_A_sleek_and_modern_monitor_product_preview_1.jpg',
        'Leonardo_Phoenix_10_A_sleek_and_modern_monitor_product_preview_2.jpg',
        'Leonardo_Phoenix_10_A_sleek_and_modern_monitor_product_preview_3.jpg',

        // New detailed laptop images
        'Leonardo_Phoenix_10_Highly_detailed_laptop_product_preview_ima_0.jpg',
        'Leonardo_Phoenix_10_Highly_detailed_laptop_product_preview_ima_1.jpg',
        'Leonardo_Phoenix_10_Highly_detailed_laptop_product_preview_ima_2.jpg',
        'Leonardo_Phoenix_10_Highly_detailed_laptop_product_preview_ima_3.jpg'
    ];

    private getRandomImageName(): string {
        return this.imageNames[Math.floor(Math.random() * this.imageNames.length)];
    }

    private getRandomImageNames(count: number): string[] {
        const shuffled = [...this.imageNames].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    async generateCategories(count: number): Promise<ApiResponse<any>> {
        try {
            const generatedCategories = [];

            for (let i = 0; i < count; i++) {
                const name = this.categoryNames[i % this.categoryNames.length];
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const description = `Explore our collection of ${name.toLowerCase()} products. Find the best quality items at competitive prices.`;

                const category = await db.insert(categories).values({
                    name,
                    description,
                    slug: `${slug}-${i + 1}`
                }).returning();

                generatedCategories.push(category[0]);
            }

            return createSuccessResponse({
                categories: generatedCategories,
                count: generatedCategories.length
            }, `Successfully generated ${count} categories`);
        } catch (error) {
            console.error('Generate categories error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to generate categories');
        }
    }

    async generateProducts(count: number, categoryIds?: string[]): Promise<ApiResponse<any>> {
        try {
            // Get available category IDs if not provided
            let availableCategoryIds = categoryIds;
            if (!availableCategoryIds || availableCategoryIds.length === 0) {
                const existingCategories = await db.select({ id: categories.id }).from(categories);
                availableCategoryIds = existingCategories.map(cat => cat.id);
            }

            if (availableCategoryIds.length === 0) {
                return createErrorResponse('VALIDATION_ERROR', 'No categories available. Please generate categories first.');
            }

            const generatedProducts = [];

            for (let i = 0; i < count; i++) {
                const name = this.productNames[i % this.productNames.length];
                const description = this.productDescriptions[i % this.productDescriptions.length];
                const categoryId = availableCategoryIds[i % availableCategoryIds.length];
                const rating = Math.random() * 2 + 3; // Random rating between 3-5
                const reviewCount = Math.floor(Math.random() * 1000) + 10; // Random review count 10-1010

                const product = await db.insert(products).values({
                    name: `${name} ${i + 1}`,
                    description,
                    categoryId,
                    rating: rating.toFixed(2),
                    reviewCount,
                    sharedImages: Math.random() > 0.5,
                    isActive: Math.random() > 0.1 // 90% chance of being active
                }).returning();

                // Generate variants for each product
                const variants = await this.generateProductVariants(product[0].id);
                generatedProducts.push({
                    ...product[0],
                    variants
                });
            }

            return createSuccessResponse({
                products: generatedProducts,
                count: generatedProducts.length
            }, `Successfully generated ${count} products with variants`);
        } catch (error) {
            console.error('Generate products error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to generate products');
        }
    }

    private async generateProductVariants(productId: string) {
        const variants = [];
        const variantCount = Math.floor(Math.random() * 3) + 1; // 1-3 variants per product

        for (let i = 0; i < variantCount; i++) {
            const color = this.colors[i % this.colors.length];
            const size = this.sizes[i % this.sizes.length];
            const material = this.materials[i % this.materials.length];

            const basePrice = Math.random() * 200 + 10; // Random price between $10-$210
            const price = Math.round(basePrice * 100) / 100; // Round to 2 decimal places
            const stock = Math.floor(Math.random() * 100) + 1; // Random stock 1-100

            const variant = await db.insert(productVariants).values({
                productId,
                key: 'color-size',
                label: `${color} ${size}`,
                translationKey: `${color.toLowerCase()}-${size.toLowerCase()}`,
                name: `${color} ${size} Variant`,
                price: price.toString(),
                currency: 'USD',
                images: this.getRandomImageNames(2).map(img => `/static/images/${img}`),
                stock,
                isActive: Math.random() > 0.1
            }).returning();

            variants.push(variant[0]);
        }

        return variants;
    }

    async generateAll(categoryCount: number, productCount: number): Promise<ApiResponse<any>> {
        try {
            // First generate categories
            const categoriesResult = await this.generateCategories(categoryCount);
            if (!categoriesResult.success) {
                return categoriesResult;
            }

            // Get the generated category IDs
            const generatedCategories = await db.select({ id: categories.id }).from(categories);
            const categoryIds = generatedCategories.map(cat => cat.id);

            // Then generate products
            const productsResult = await this.generateProducts(productCount, categoryIds);
            if (!productsResult.success) {
                return productsResult;
            }

            return createSuccessResponse({
                categories: categoriesResult.data?.categories || [],
                products: productsResult.data?.products || [],
                categoryCount: categoriesResult.data?.count || 0,
                productCount: productsResult.data?.count || 0
            }, `Successfully generated ${categoryCount} categories and ${productCount} products`);
        } catch (error) {
            console.error('Generate all mock data error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to generate mock data');
        }
    }

    async clearAll(): Promise<ApiResponse<any>> {
        try {
            // Delete in order to respect foreign key constraints
            await db.delete(productVariants);
            await db.delete(products);
            await db.delete(categories);

            return createSuccessResponse({
                message: 'All mock data cleared successfully'
            }, 'Successfully cleared all mock data');
        } catch (error) {
            console.error('Clear all mock data error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to clear mock data');
        }
    }
} 