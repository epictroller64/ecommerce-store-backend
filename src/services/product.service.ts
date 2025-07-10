import { db } from '../db/connection';
import { products, categories, productVariants } from '../db/schema';
import { eq, desc, and, gte, inArray } from 'drizzle-orm';
import {
    createSuccessResponse,
    createErrorResponse,
    ProductsResponse,
    ProductWithPrice,
    ProductWithVariants,
    Variant,
    CategoryFrontend,
    ProductFilters,
    GetProductsRequest,
    ApiResponse
} from '../types';

export class ProductService {
    async getProducts(pagination?: GetProductsRequest['pagination'], filters?: ProductFilters): Promise<ApiResponse<ProductsResponse>> {
        try {
            let limit = 20;
            let offset = 0;

            if (pagination) {
                limit = pagination.max || 20;
                offset = (pagination.pageNum - 1) * limit;
            }

            // Build where conditions
            const whereConditions = [eq(products.isActive, true)];

            if (filters) {
                if (filters.categories && filters.categories.length > 0) {
                    whereConditions.push(inArray(products.categoryId, filters.categories));
                }

                if (filters.rating) {
                    whereConditions.push(gte(products.rating, filters.rating.toString()));
                }
            }

            // Get products with their variants
            const productsWithVariants = await db
                .select({
                    id: products.id,
                    name: products.name,
                    description: products.description,
                    categoryId: products.categoryId,
                    rating: products.rating,
                    reviewCount: products.reviewCount,
                    sharedImages: products.sharedImages,
                    createdAt: products.createdAt,
                    updatedAt: products.updatedAt,
                    variant: {
                        id: productVariants.id,
                        key: productVariants.key,
                        label: productVariants.label,
                        translationKey: productVariants.translationKey,
                        productId: productVariants.productId,
                        name: productVariants.name,
                        price: productVariants.price,
                        currency: productVariants.currency,
                        images: productVariants.images,
                        stock: productVariants.stock,
                    },
                })
                .from(products)
                .leftJoin(productVariants, eq(products.id, productVariants.productId))
                .where(and(...whereConditions))
                .orderBy(desc(products.createdAt))
                .limit(limit)
                .offset(offset);

            const productMap = new Map<string, ProductWithPrice>();

            for (const row of productsWithVariants) {
                if (!productMap.has(row.id)) {
                    const firstVariant = productsWithVariants.find(p => p.id === row.id);

                    productMap.set(row.id, {
                        id: row.id,
                        name: row.name,
                        description: row.description,
                        categoryId: row.categoryId,
                        rating: row.rating,
                        reviewCount: row.reviewCount,
                        sharedImages: row.sharedImages,
                        isActive: true,
                        createdAt: row.createdAt,
                        updatedAt: row.updatedAt,
                        price: firstVariant && firstVariant.variant ? Number(firstVariant.variant.price) : 0,
                        currency: firstVariant && firstVariant.variant ? firstVariant.variant.currency : 'USD',
                        inStock: firstVariant && firstVariant.variant ? firstVariant.variant.stock > 0 : false,
                        images: firstVariant?.variant?.images || [],
                    });
                }
            }

            const productsList = Array.from(productMap.values());

            const allCategories = await db
                .select({
                    id: categories.id,
                    name: categories.name,
                    description: categories.description,
                })
                .from(categories);

            const categoriesWithCount: CategoryFrontend[] = await Promise.all(
                allCategories.map(async (category) => {
                    const productCount = await db
                        .select({ count: products.id })
                        .from(products)
                        .where(eq(products.categoryId, category.id))
                        .then(result => result.length);

                    return {
                        id: category.id,
                        name: category.name,
                        description: category.description || undefined,
                        productCount,
                    };
                })
            );

            const response: ProductsResponse = {
                products: productsList,
                categories: categoriesWithCount,
            };

            return createSuccessResponse(response, 'Products retrieved successfully');
        } catch (error) {
            console.error('Get products error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch products');
        }
    }

    async getBestSellingProducts(): Promise<ApiResponse<ProductWithPrice[]>> {
        try {
            // kind of simplified implementation
            const bestSellingProducts = await db
                .select({
                    id: products.id,
                    name: products.name,
                    description: products.description,
                    categoryId: products.categoryId,
                    rating: products.rating,
                    reviewCount: products.reviewCount,
                    sharedImages: products.sharedImages,
                    createdAt: products.createdAt,
                    updatedAt: products.updatedAt,
                    variant: {
                        id: productVariants.id,
                        key: productVariants.key,
                        label: productVariants.label,
                        translationKey: productVariants.translationKey,
                        productId: productVariants.productId,
                        name: productVariants.name,
                        price: productVariants.price,
                        currency: productVariants.currency,
                        images: productVariants.images,
                        stock: productVariants.stock,
                    },
                })
                .from(products)
                .leftJoin(productVariants, eq(products.id, productVariants.productId))
                .where(eq(products.isActive, true))
                .orderBy(desc(products.reviewCount))
                .limit(10);

            const productMap = new Map<string, ProductWithPrice>();

            for (const row of bestSellingProducts) {
                if (!productMap.has(row.id)) {
                    const firstVariant = bestSellingProducts.find(p => p.id === row.id);

                    productMap.set(row.id, {
                        id: row.id,
                        name: row.name,
                        description: row.description,
                        categoryId: row.categoryId,
                        rating: row.rating,
                        reviewCount: row.reviewCount,
                        sharedImages: row.sharedImages,
                        isActive: true,
                        createdAt: row.createdAt,
                        updatedAt: row.updatedAt,
                        price: firstVariant && firstVariant.variant ? Number(firstVariant.variant.price) : 0,
                        currency: firstVariant && firstVariant.variant ? firstVariant.variant.currency : 'USD',
                        inStock: firstVariant && firstVariant.variant ? firstVariant.variant.stock > 0 : false,
                        images: firstVariant?.variant?.images || [],
                    });
                }
            }

            const productsList = Array.from(productMap.values());

            return createSuccessResponse(productsList, 'Best selling products retrieved successfully');
        } catch (error) {
            console.error('Get best selling products error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch best selling products');
        }
    }

    async getProductById(productId: string): Promise<ApiResponse<ProductWithVariants>> {
        try {
            const product = await db
                .select()
                .from(products)
                .where(eq(products.id, productId))
                .limit(1);

            if (!product.length) {
                return createErrorResponse('PRODUCT_NOT_FOUND', 'Product not found');
            }

            const variants = await db
                .select()
                .from(productVariants)
                .where(eq(productVariants.productId, productId));

            const variantList: Variant[] = variants.map(variant => ({
                id: variant.id,
                key: variant.key,
                label: variant.label,
                translationKey: variant.translationKey,
                productId: variant.productId,
                name: variant.name,
                price: Number(variant.price),
                currency: variant.currency,
                images: variant.images || [],
            }));

            const productWithVariants: ProductWithVariants = {
                id: product[0].id,
                name: product[0].name,
                description: product[0].description,
                categoryId: product[0].categoryId,
                rating: product[0].rating,
                reviewCount: product[0].reviewCount,
                sharedImages: product[0].sharedImages,
                isActive: true,
                createdAt: product[0].createdAt,
                updatedAt: product[0].updatedAt,
                variants: variantList,
            };

            return createSuccessResponse(productWithVariants, 'Product retrieved successfully');
        } catch (error) {
            console.error('Get product error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch product');
        }
    }

    async getProductVariant(variantId: string): Promise<ApiResponse<any>> {
        try {
            const variant = await db
                .select()
                .from(productVariants)
                .where(eq(productVariants.id, variantId))
                .limit(1);

            if (!variant.length) {
                return createErrorResponse('VARIANT_NOT_FOUND', 'Product variant not found');
            }

            return createSuccessResponse(variant[0], 'Product variant retrieved successfully');
        } catch (error) {
            console.error('Get product variant error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch product variant');
        }
    }
} 