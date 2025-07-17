import { pgTable, serial, text, varchar, integer, decimal, timestamp, boolean, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    name: varchar('name', { length: 100 }),
    role: varchar('role', { length: 50 }).notNull().default('user'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastLoginAt: timestamp('last_login_at'),
});

// Categories table
export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Products table
export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    categoryId: uuid('category_id').references(() => categories.id),
    rating: decimal('rating', { precision: 3, scale: 2 }),
    reviewCount: integer('review_count').default(0),
    sharedImages: boolean('shared_images').default(false),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Product variants table
export const productVariants = pgTable('product_variants', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    key: varchar('key', { length: 50 }).notNull(), // color, size, etc
    label: varchar('label', { length: 100 }).notNull(), // Red, Small, etc
    translationKey: varchar('translation_key', { length: 100 }).notNull(), // red, small, etc
    name: varchar('name', { length: 255 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    images: jsonb('images').$type<string[]>(),
    stock: integer('stock').notNull().default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payment methods table
export const paymentMethods = pgTable('payment_methods', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    icon: varchar('icon', { length: 100 }),
    type: varchar('type', { length: 50 }).notNull(), // card, digital_wallet, bank_transfer, crypto
    isAvailable: boolean('is_available').default(true),
    processingFee: decimal('processing_fee', { precision: 10, scale: 2 }),
    processingTime: varchar('processing_time', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Delivery methods table
export const deliveryMethods = pgTable('delivery_methods', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    icon: varchar('icon', { length: 100 }),
    type: varchar('type', { length: 50 }).notNull(), // standard, express, same_day, pickup
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    estimatedDays: varchar('estimated_days', { length: 50 }).notNull(),
    isAvailable: boolean('is_available').default(true),
    trackingAvailable: boolean('tracking_available').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Orders table
export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    status: varchar('status', { length: 50 }).notNull().default('pending'),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
    deliveryMethodId: uuid('delivery_method_id').references(() => deliveryMethods.id),
    paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
    shippingAddress: jsonb('shipping_address').$type<{
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Order items table
export const orderItems = pgTable('order_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').references(() => orders.id).notNull(),
    variantId: uuid('variant_id').references(() => productVariants.id).notNull(),
    quantity: integer('quantity').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Site configuration table
export const siteConfig = pgTable('site_config', {
    id: uuid('id').primaryKey().defaultRandom(),
    key: varchar('key', { length: 100 }).notNull().unique(),
    value: jsonb('value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Hero images table
export const heroImages = pgTable('hero_images', {
    id: uuid('id').primaryKey().defaultRandom(),
    imageUrl: varchar('image_url', { length: 500 }).notNull(),
    order: integer('order').notNull().default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    orders: many(orders),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
    product: one(products, {
        fields: [productVariants.productId],
        references: [products.id],
    }),
    orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    deliveryMethod: one(deliveryMethods, {
        fields: [orders.deliveryMethodId],
        references: [deliveryMethods.id],
    }),
    paymentMethod: one(paymentMethods, {
        fields: [orders.paymentMethodId],
        references: [paymentMethods.id],
    }),
    orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    variant: one(productVariants, {
        fields: [orderItems.variantId],
        references: [productVariants.id],
    }),
}));


export const productRatings = pgTable('product_ratings', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const productRatingsRelations = relations(productRatings, ({ one }) => ({
    user: one(users, {
        fields: [productRatings.userId],
        references: [users.id],
    }),
}));

