import { z } from "zod"
import { completeCheckoutSchema, createOrderSchema, updateUserSettingsSchema } from "../schemas/zodSchemas"

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
}

export interface GetProductsRequest {
    pagination: Pagination
}

interface Pagination {
    max: number
    pageNum: number
}

export type CreateOrderRequest = z.infer<typeof createOrderSchema>
export type CompleteCheckoutRequest = z.infer<typeof completeCheckoutSchema>
export type UpdateUserSettingsRequest = z.infer<typeof updateUserSettingsSchema>