import { db } from '../db/connection';
import { categories, products } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createSuccessResponse, createErrorResponse, CategoryFrontend, ApiResponse } from '../types';

export class CategoryService {
    async getAllCategories(): Promise<ApiResponse<CategoryFrontend[]>> {
        try {
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

            return createSuccessResponse(categoriesWithCount, 'Categories retrieved successfully');
        } catch (error) {
            console.error('Get categories error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch categories');
        }
    }

    // get category by id
    async getCategoryById(categoryId: string): Promise<ApiResponse<CategoryFrontend>> {
        try {
            const category = await db
                .select()
                .from(categories)
                .where(eq(categories.id, categoryId))
                .limit(1);

            if (!category.length) {
                return createErrorResponse('CATEGORY_NOT_FOUND', 'Category not found');
            }

            const productCount = await db
                .select({ count: products.id })
                .from(products)
                .where(eq(products.categoryId, categoryId))
                .then(result => result.length);

            const categoryFrontend: CategoryFrontend = {
                id: category[0].id,
                name: category[0].name,
                description: category[0].description || undefined,
                productCount,
            };

            return createSuccessResponse(categoryFrontend, 'Category retrieved successfully');
        } catch (error) {
            console.error('Get category by ID error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch category');
        }
    }
} 