import { db } from '../src/db/connection';
import { categories, products, productVariants, paymentMethods, deliveryMethods, siteConfig, heroImages } from '../src/db/schema';

// script for setting up database with sample data
async function setupDatabase() {
    try {
        console.log('🚀 Setting up database with sample data...');

        // Insert sample categories
        const sampleCategories = await db
            .insert(categories)
            .values([
                {
                    name: 'Electronics',
                    description: 'Electronic devices and gadgets',
                    slug: 'electronics',
                },
                {
                    name: 'Clothing',
                    description: 'Fashion and apparel',
                    slug: 'clothing',
                },
                {
                    name: 'Books',
                    description: 'Books and literature',
                    slug: 'books',
                },
            ])
            .returning();

        console.log('✅ Categories created:', sampleCategories.length);

        // Insert sample products
        const sampleProducts = await db
            .insert(products)
            .values([
                {
                    name: 'Smartphone',
                    description: 'Latest smartphone with advanced features',
                    categoryId: sampleCategories[0].id,
                    rating: '4.5',
                    reviewCount: 120,
                    sharedImages: false,
                },
                {
                    name: 'Laptop',
                    description: 'High-performance laptop for work and gaming',
                    categoryId: sampleCategories[0].id,
                    rating: '4.8',
                    reviewCount: 85,
                    sharedImages: false,
                },
                {
                    name: 'T-Shirt',
                    description: 'Comfortable cotton t-shirt',
                    categoryId: sampleCategories[1].id,
                    rating: '4.2',
                    reviewCount: 200,
                    sharedImages: true,
                },
                {
                    name: 'Programming Book',
                    description: 'Learn TypeScript and modern web development',
                    categoryId: sampleCategories[2].id,
                    rating: '4.7',
                    reviewCount: 45,
                    sharedImages: false,
                },
            ])
            .returning();

        console.log('✅ Products created:', sampleProducts.length);

        // Insert sample product variants
        const sampleVariants = await db
            .insert(productVariants)
            .values([
                // Smartphone variants
                {
                    productId: sampleProducts[0].id,
                    key: 'color',
                    label: 'Black',
                    translationKey: 'black',
                    name: 'Smartphone - Black',
                    price: '599.99',
                    currency: 'USD',
                    images: ['smartphone-black1.jpg', 'smartphone-black2.jpg'],
                    stock: 50,
                },
                {
                    productId: sampleProducts[0].id,
                    key: 'color',
                    label: 'White',
                    translationKey: 'white',
                    name: 'Smartphone - White',
                    price: '599.99',
                    currency: 'USD',
                    images: ['smartphone-white1.jpg', 'smartphone-white2.jpg'],
                    stock: 30,
                },
                // Laptop variants
                {
                    productId: sampleProducts[1].id,
                    key: 'storage',
                    label: '256GB',
                    translationKey: '256gb',
                    name: 'Laptop - 256GB',
                    price: '1299.99',
                    currency: 'USD',
                    images: ['laptop-256gb1.jpg'],
                    stock: 25,
                },
                {
                    productId: sampleProducts[1].id,
                    key: 'storage',
                    label: '512GB',
                    translationKey: '512gb',
                    name: 'Laptop - 512GB',
                    price: '1499.99',
                    currency: 'USD',
                    images: ['laptop-512gb1.jpg'],
                    stock: 15,
                },
                // T-Shirt variants
                {
                    productId: sampleProducts[2].id,
                    key: 'size',
                    label: 'Small',
                    translationKey: 'small',
                    name: 'T-Shirt - Small',
                    price: '19.99',
                    currency: 'USD',
                    images: ['tshirt-small1.jpg'],
                    stock: 100,
                },
                {
                    productId: sampleProducts[2].id,
                    key: 'size',
                    label: 'Medium',
                    translationKey: 'medium',
                    name: 'T-Shirt - Medium',
                    price: '19.99',
                    currency: 'USD',
                    images: ['tshirt-medium1.jpg'],
                    stock: 150,
                },
                {
                    productId: sampleProducts[2].id,
                    key: 'size',
                    label: 'Large',
                    translationKey: 'large',
                    name: 'T-Shirt - Large',
                    price: '19.99',
                    currency: 'USD',
                    images: ['tshirt-large1.jpg'],
                    stock: 80,
                },
                // Book variants
                {
                    productId: sampleProducts[3].id,
                    key: 'format',
                    label: 'Paperback',
                    translationKey: 'paperback',
                    name: 'Programming Book - Paperback',
                    price: '39.99',
                    currency: 'USD',
                    images: ['book-paperback1.jpg'],
                    stock: 30,
                },
                {
                    productId: sampleProducts[3].id,
                    key: 'format',
                    label: 'Hardcover',
                    translationKey: 'hardcover',
                    name: 'Programming Book - Hardcover',
                    price: '59.99',
                    currency: 'USD',
                    images: ['book-hardcover1.jpg'],
                    stock: 20,
                },
            ])
            .returning();

        console.log('✅ Product variants created:', sampleVariants.length);

        // Insert sample payment methods
        const samplePaymentMethods = await db
            .insert(paymentMethods)
            .values([
                {
                    name: 'Credit Card',
                    description: 'Pay with your credit or debit card',
                    icon: 'credit-card',
                    type: 'card',
                    isAvailable: true,
                    processingFee: '2.99',
                    processingTime: 'Instant',
                },
                {
                    name: 'PayPal',
                    description: 'Pay with your PayPal account',
                    icon: 'paypal',
                    type: 'digital_wallet',
                    isAvailable: true,
                    processingFee: '0.00',
                    processingTime: 'Instant',
                },
                {
                    name: 'Bank Transfer',
                    description: 'Direct bank transfer',
                    icon: 'bank',
                    type: 'bank_transfer',
                    isAvailable: true,
                    processingFee: '0.00',
                    processingTime: '2-3 business days',
                },
            ])
            .returning();

        console.log('✅ Payment methods created:', samplePaymentMethods.length);

        // Insert sample delivery methods
        const sampleDeliveryMethods = await db
            .insert(deliveryMethods)
            .values([
                {
                    name: 'Standard Shipping',
                    description: '5-7 business days',
                    icon: 'truck',
                    type: 'standard',
                    price: '5.99',
                    currency: 'USD',
                    estimatedDays: '5-7 business days',
                    isAvailable: true,
                    trackingAvailable: true,
                },
                {
                    name: 'Express Shipping',
                    description: '2-3 business days',
                    icon: 'rocket',
                    type: 'express',
                    price: '12.99',
                    currency: 'USD',
                    estimatedDays: '2-3 business days',
                    isAvailable: true,
                    trackingAvailable: true,
                },
                {
                    name: 'Same Day Delivery',
                    description: 'Same day delivery for local orders',
                    icon: 'clock',
                    type: 'same_day',
                    price: '24.99',
                    currency: 'USD',
                    estimatedDays: 'Same day',
                    isAvailable: true,
                    trackingAvailable: true,
                },
            ])
            .returning();

        console.log('✅ Delivery methods created:', sampleDeliveryMethods.length);

        // Insert sample site configuration
        const sampleSiteConfig = await db
            .insert(siteConfig)
            .values([
                {
                    key: 'site_info',
                    value: {
                        name: 'E-commerce Store',
                        description: 'Your one-stop shop for everything you need',
                        logoSrc: '/logo.png',
                        version: '1.0.0',
                        features: ['Fast Delivery', 'Secure Payments', '24/7 Support'],
                        contactInfo: {
                            email: 'support@example.com',
                            phone: '+1-555-0123',
                            address: '123 Main St, City, Country',
                        },
                    },
                },
                {
                    key: 'theme',
                    value: {
                        primaryColor: '#3B82F6',
                        secondaryColor: '#1F2937',
                        accentColor: '#F59E0B',
                    },
                },
            ])
            .returning();

        console.log('✅ Site configuration created:', sampleSiteConfig.length);

        // Insert sample hero images
        const sampleHeroImages = await db
            .insert(heroImages)
            .values([
                {
                    imageUrl: '/hero1.jpg',
                    order: 1,
                    isActive: true,
                },
                {
                    imageUrl: '/hero2.jpg',
                    order: 2,
                    isActive: true,
                },
                {
                    imageUrl: '/hero3.jpg',
                    order: 3,
                    isActive: true,
                },
            ])
            .returning();

        console.log('✅ Hero images created:', sampleHeroImages.length);

        console.log('🎉 Database setup completed successfully!');
        console.log('📊 Summary:');
        console.log(`   - Categories: ${sampleCategories.length}`);
        console.log(`   - Products: ${sampleProducts.length}`);
        console.log(`   - Product Variants: ${sampleVariants.length}`);
        console.log(`   - Payment Methods: ${samplePaymentMethods.length}`);
        console.log(`   - Delivery Methods: ${sampleDeliveryMethods.length}`);
        console.log(`   - Site Config: ${sampleSiteConfig.length}`);
        console.log(`   - Hero Images: ${sampleHeroImages.length}`);

        return true;
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        return false;
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase()
        .then((success) => {
            if (success) {
                console.log('✨ Setup completed!');
                process.exit(0);
            } else {
                console.log('💥 Setup failed!');
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error('💥 Setup error:', error);
            process.exit(1);
        });
}

export { setupDatabase }; 