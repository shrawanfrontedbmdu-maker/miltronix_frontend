import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

// ---------------- BASE URL ----------------
const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://miltronix-backend-2.onrender.com";

// ---------------- AXIOS INSTANCE ----------------
const API: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ---------------- AUTH INTERCEPTOR ----------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- RESPONSE INTERCEPTOR ----------------


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      toast.error("Please login first");

      window.dispatchEvent(new Event("openLoginModal"));
    }

    return Promise.reject(error);
  }
);


// ---------------- ERROR HANDLER ----------------
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    throw new Error(message);
  } else if (error instanceof Error) {
    throw error;
  } else {
    throw new Error("Something went wrong");
  }
};

// ================== CART TYPES ==================
export type CartItemType = {
  productId: string;
  sku: string;
  quantity: number;
};

export type CartType = {
  items: Array<{
    product: any;
    variant: { sku: string; attributes?: Record<string, any> };
    quantity: number;
    priceSnapshot: number;
    title: string;
    category: string;
    images: string[];
  }>;
  subtotal: number;
};

// ================== WISHLIST TYPES ==================
export type WishlistItemType = {
  productId: string;
  variant?: { sku: string; attributes?: Record<string, any> };
  title?: string;
  images?: string[];
  category?: string;
  priceSnapshot: number;
};

export type WishlistType = {
  _id: string;
  user: string;
  items: Array<{
    _id: string;
    product: any;
    variant?: { sku: string; attributes?: Record<string, any> };
    title?: string;
    images?: string[];
    category?: string;
    priceSnapshot?: number;
  }>;
};

// ================== ADDRESS TYPE ==================
/**
 * Unified address type — backend schema se exactly match karta hai.
 * Saved addresses aur order shipping/billing dono ke liye yahi use karo.
 */
export type AddressType = {
  _id?: string;
  fullName: string;
  mobile?: string;
  houseFlatNo: string;
  buildingApartment?: string;
  streetLocality: string;
  landmark?: string;
  pinCode: string;       // capital C — backend schema se match
  city: string;
  state: string;
  country?: string;
  isDefault?: boolean;
};

// ================== ORDER TYPES ==================
export type OrderItemType = {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  mrp: number;
  unitPrice: number;
  taxAmount?: number;
  discountAmount?: number;
  lineTotal?: number;
};

export type OrderType = {
  _id: string;
  orderNumber: string;
  user: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  items: OrderItemType[];
  shippingAddress: AddressType;
  billingAddress: AddressType;
  coupon?: string;
  couponCode?: string;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  couponDiscount: number;   // fixed: discountAmount → couponDiscount
  totalAmount: number;
  currency: string;
  payment: {
    method: string;
    status: "Pending" | "Paid" | "Failed" | "Refunded";
    transactionId?: string;
    provider?: string;
    paidAt?: string;
  };
  fulfillment: {
    orderStatus:
      | "Draft"
      | "Pending"
      | "Processing"
      | "Packaging"
      | "Shipped"
      | "Delivered"
      | "Cancelled"
      | "Completed";
    shipments?: any[];
    statusHistory?: { status: string; timestamp: string; note?: string }[];
  };
  priority: "Low" | "Normal" | "High" | "Urgent";
  notes?: string;
  trackingnumber?: string;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderPayloadType = {
  user: string;
  shippingAddressId?: string;
  shippingAddress?: AddressType;
  billingAddressId?: string;
  billingAddress?: AddressType;
  couponCode?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  transactionId?: string;
  shippingCost?: number;
  taxRate?: number;
  currency?: string;
  orderStatus?: string;
  priority?: string;
  notes?: string;
};

// ================== CATEGORIES ==================
export const fetchCategories = async () => {
  try {
    const res = await API.get("/category");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchCategoryById = async (categoryId: string) => {
  try {
    const res = await API.get(`/category/${categoryId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ================== PRODUCTS ==================
export const fetchProducts = async (params?: {
  category?: string;
  categoryKey?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "latest" | "price_low" | "price_high";
  page?: number;
  limit?: number;
  isRecommended?: boolean;
  isFeatured?: boolean;
  status?: string;
}) => {
  try {
    const query = new URLSearchParams();
    if (params?.category)    query.append("category", params.category);
    if (params?.categoryKey) query.append("categoryKey", params.categoryKey);
    if (params?.search)      query.append("search", params.search);
    if (params?.minPrice !== undefined) query.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.append("maxPrice", params.maxPrice.toString());
    if (params?.sort)        query.append("sort", params.sort);
    if (params?.page)        query.append("page", params.page.toString());
    if (params?.limit)       query.append("limit", params.limit.toString());
    if (params?.isRecommended !== undefined) query.append("isRecommended", params.isRecommended.toString());
    if (params?.isFeatured !== undefined)    query.append("isFeatured", params.isFeatured.toString());
    if (params?.status)      query.append("status", params.status);

    const res = await API.get(`/products?${query.toString()}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchProductById = async (productId: string) => {
  try {
    const res = await API.get(`/products/${productId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchProductBySlug = async (slug: string) => {
  try {
    const res = await API.get(`/products/slug/${slug}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchRecommendedProducts = async (limit: number = 10) => {
  try {
    const res = await API.get(`/products?isRecommended=true&limit=${limit}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchFeaturedProducts = async (limit: number = 10) => {
  try {
    const res = await API.get(`/products?isFeatured=true&limit=${limit}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ================== AUTH ==================
export const signup = async (data: {
  fullName: string;
  email?: string;
  mobile: string;
  password: string;
}) => {
  try {
    const res = await API.post("/auth/signup", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const login = async (data: { mobile: string; password: string }) => {
  try {
    const res = await API.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const logout = () => localStorage.removeItem("token");

export const verifyOtp = async (data: { mobile: string; otp: string }) => {
  try {
    const res = await API.post("/auth/verify-otp", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const resendOtp = async (data: { mobile: string }) => {
  try {
    const res = await API.post("/auth/resend-otp", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const forgotPassword = async (data: { mobile: string }) => {
  try {
    const res = await API.post("/auth/forgot-password", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyResetOtp = async (data: { mobile: string; otp: string }) => {
  try {
    const res = await API.post("/auth/verify-reset-otp", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async (data: {
  mobile: string;
  newPassword: string;
}) => {
  try {
    const res = await API.post("/auth/reset-password", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const googleLoginApi = async (data: { idToken: string }) => {
  try {
    const res = await API.post("/auth/google-login", data);
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const loginWithGoogle = () => {
  window.location.href = `${BASE_URL}/auth/google-login`;
};

// ================== CART ==================
export const addItemToCart = async (data: CartItemType): Promise<any> => {
  if (!data?.productId || !data?.sku || !data?.quantity)
    throw new Error("productId, sku and quantity are required");
  try {
    const res = await API.post("/cart/add", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getCartItems = async (): Promise<CartType> => {
  try {
    const res = await API.get("/cart");
    return res.data || { items: [], subtotal: 0 };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const removeCartItem = async (data: {
  productId: string;
  sku?: string;
}): Promise<any> => {
  if (!data?.productId) throw new Error("productId is required");
  try {
    const res = await API.post("/cart/remove", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const clearCart = async (): Promise<any> => {
  try {
    const res = await API.post("/cart/clear");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

/** Cart mein total kitne items hain */
export const getCartCount = async (): Promise<number> => {
  try {
    const cart = await getCartItems();
    return (cart?.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// ================== WISHLIST ==================
export const addItemToWishlist = async (data: WishlistItemType) => {
  if (!data?.productId || !data?.priceSnapshot)
    throw new Error("productId and priceSnapshot are required");
  try {
    const res = await API.post("/wishlist/items", data);
    return res.data as { success: boolean; wishlist: WishlistType; message: string };
  } catch (error) {
    handleError(error);
  }
};

export const getUserWishlist = async (userId: string) => {
  if (!userId) throw new Error("userId is required");
  try {
    const res = await API.get(`/wishlist/user/${userId}`);
    return res.data as { success: boolean; wishlist: WishlistType };
  } catch (error) {
    handleError(error);
  }
};

export const removeWishlistItem = async (userId: string, itemId: string) => {
  if (!userId || !itemId) throw new Error("userId and itemId are required");
  try {
    const res = await API.delete(`/wishlist/items/${userId}/${itemId}`);
    return res.data as { success: boolean; wishlist?: WishlistType; message: string };
  } catch (error) {
    handleError(error);
  }
};

export const clearUserWishlist = async (userId: string) => {
  if (!userId) throw new Error("userId is required");
  try {
    const res = await API.delete(`/wishlist/clear/${userId}`);
    return res.data as { success: boolean; message: string };
  } catch (error) {
    handleError(error);
  }
};

// ================== CHECKOUT ==================
export const getCheckoutDetailsApi = async (couponCode?: string) => {
  try {
    const res = await API.post("/checkout/checkout-details", {
      couponCode: couponCode || "",
    });
    return res.data as {
      success: boolean;
      items: any[];
      itemCount: number;
      totalQuantity: number;
      pricing: {
        subtotal: number;
        totalCutPrice: number;
        totalDiscount: number;
        couponDiscount: number;
        finalAmount: number;
      };
      coupon?: { couponId: string; code: string; appliedDiscount: number };
      couponError?: string | null;
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// ================== ADDRESS APIs ==================
export const addAddressApi = async (data: AddressType) => {
  try {
    const res = await API.post("/addresses", data);
    return res.data as AddressType;
  } catch (error) {
    handleError(error);
  }
};

export const getAddressesApi = async () => {
  try {
    const res = await API.get("/addresses");
    return res.data as AddressType[];
  } catch (error) {
    handleError(error);
  }
};

export const updateAddressApi = async (id: string, data: AddressType) => {
  if (!id) throw new Error("Address id is required");
  try {
    const res = await API.put(`/addresses/${id}`, data);
    return res.data as AddressType;
  } catch (error) {
    handleError(error);
  }
};

export const deleteAddressApi = async (id: string) => {
  if (!id) throw new Error("Address id is required");
  try {
    const res = await API.delete(`/addresses/${id}`);
    return res.data as { message: string };
  } catch (error) {
    handleError(error);
  }
};

// ================== ORDER APIs — User (My Orders) ==================

/** Naya order create karo cart se */
export const createOrderApi = async (data: CreateOrderPayloadType) => {
  try {
    const res = await API.post("/orders", data);
    return res.data as { message: string; data: OrderType };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/** User ke saare orders — My Orders page ke liye */
export const getOrdersByUserApi = async (userId: string) => {
  if (!userId) throw new Error("userId is required");
  try {
    const res = await API.get(`/orders/user/${userId}`);
    return res.data as { success: boolean; count: number; data: OrderType[] };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/** Ek order ka detail */
export const getOrderByIdApi = async (orderId: string) => {
  if (!orderId) throw new Error("orderId is required");
  try {
    const res = await API.get(`/orders/detail/${orderId}`);
    return res.data as { success: boolean; data: OrderType };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const cancelOrderApi = async (
  orderId: string,
  userId: string,
  reason?: string
) => {
  if (!orderId || !userId) throw new Error("orderId and userId are required");
  try {
    const res = await API.patch(`/orders/cancel/${orderId}`, { userId, reason });
    return res.data as { success: boolean; message: string; data: OrderType };
  } catch (error) {
    handleError(error);
    throw error;
  }
};


// ---------------- EXPORT ----------------
export default API;