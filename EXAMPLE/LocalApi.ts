import { ApiResponse, AuthResponse, CompleteCheckoutResponse, ProductsResponse } from "../interface/ApiResponse"
import { Category } from "../interface/Category"
import { Order } from "../interface/Order"
import { ProductWithVariants } from "../interface/Products"
import { CompleteCheckoutRequest, CreateOrderRequest, LoginRequest, RegisterRequest, UpdateUserSettingsRequest } from "../interface/Request"
import { SiteConfig } from "../interface/SiteConfig"
import { SiteInfo } from "../interface/SiteInfo"
import { User } from "../interface/User"
import { PaymentMethodResponse } from "../interface/PaymentMethod"
import { DeliveryMethodResponse } from "../interface/DeliveryMethod"
import { Path, TestApi } from "./TestApi"
import { getAuthToken } from "./utils"

// All endpoints will be proxied by Next API as I dont want to expose the backend to the client

const API_PATH = "http://localhost:8080"
const TEST = true

export const LocalApi = {
    registerUser: (request: RegisterRequest) => post<AuthResponse>("register-user", request),
    loginUser: (request: LoginRequest) => post<AuthResponse>("login-user", request),
    getProducts: () => get<ProductsResponse>("get-products"),
    getSiteInfo: () => get<SiteInfo>("get-site-info"),
    getCategories: () => get<Category[]>("get-categories"),
    getHeroImages: () => get<string[]>("get-hero-images"),
    getConfig: () => get<SiteConfig>("get-config"),
    getBestSellingProducts: () => get<ProductsResponse>("get-best-selling-products"),
    getProduct: (id: string) => get<ProductWithVariants>("get-product", { id }),
    getUser: (token: string) => get<User>("get-user", { token }),
    createOrder: (request: CreateOrderRequest) => post<Order>("create-order", request),
    cancelOrder: (orderId: string) => post<Order>("cancel-order", { orderId }),
    getOrders: () => get<Order[]>("get-orders"), //Get orders for the authed user
    getOrder: (orderId: string) => get<Order>("get-order", { orderId }),
    getPaymentMethods: () => get<PaymentMethodResponse>("get-payment-methods"),
    getDeliveryMethods: () => get<DeliveryMethodResponse>("get-delivery-methods"),
    completeCheckout: (request: CompleteCheckoutRequest) => post<CompleteCheckoutResponse>("complete-checkout", request),
    updateUserSettings: (request: UpdateUserSettingsRequest) => post<User>("update-user-settings", request),
}

async function post<T, Req = unknown>(path: string, body: Req | FormData) {
    try {
        // Auto auth user otherwise backend will throw 401 anyways
        const authToken = await getAuthToken(); // Try getting auth token. This API is meant to be used from server side only, therefore we can capture the HTTP only cookie here
        if (TEST) {
            const result = await TestApi[path as Path]()
            return result as ApiResponse<T>
        } else {
            let fetchOptions: RequestInit;
            if (body instanceof FormData) {
                fetchOptions = {
                    method: "POST",
                    body: body
                };
            } else {
                // Pass auth token if provided, used to auth next backend with backend server
                fetchOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(authToken && { "Authorization": `Bearer ${authToken}` })
                    },
                    body: JSON.stringify(body)
                };
            }
            const result = await fetch(`${API_PATH}/${path}`, fetchOptions);
            return await result.json() as Promise<ApiResponse<T>>;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function get<T>(path: string, urlParams?: Record<string, string>) {
    try {
        const authToken = await getAuthToken(); // Try getting auth token. This API is meant to be used from server side only, therefore we can capture the HTTP only cookie here
        if (TEST) {
            const result = await TestApi[path as Path]()
            return result as ApiResponse<T>
        } else {
            const params = urlParams
                ? "?" + new URLSearchParams(urlParams).toString()
                : "";
            const result = await fetch(`${API_PATH}/${path}${params}`, {
                headers: {
                    ...(authToken && { "Authorization": `Bearer ${authToken}` })
                }
            });
            return await result.json() as ApiResponse<T>;
        }
    } catch (e) {
        console.log(e)
        throw e
    }
}
