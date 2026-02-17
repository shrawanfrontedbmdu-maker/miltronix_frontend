import axios, { AxiosInstance, AxiosError } from "axios";

// ---------------- BASE URL ----------------
const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  "https://miltronix-backend-2.onrender.com";

// ---------------- AXIOS INSTANCE ----------------
const API: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30 seconds timeout
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
      window.location.href = "/login";
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

// ---------------- TYPES ----------------
export type CartItemType = {
  productId: string;
  sku: string;
  quantity: number;
};

export type CartType = {
  items: Array<{
    product: any; // can define ProductType if you want
    variant: { sku: string; attributes?: Record<string, any> };
    quantity: number;
    priceSnapshot: number;
    title: string;
    category: string;
    images: string[];
  }>;
  subtotal: number;
};

// ================== WISHLIST ==================
export type WishlistItemType = {
  productId: string;
  variant?: { sku: string; attributes?: Record<string, any> };
  title?: string;
  images?: string[];
  category?: string;
  priceSnapshot?: number;
};

export type WishlistType = {
  items: Array<{
    _id: string;
    product: any; // can define ProductType if you want
    variant?: { sku: string; attributes?: Record<string, any> };
    title?: string;
    images?: string[];
    category?: string;
    priceSnapshot?: number;
  }>;
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
    if (params?.category) query.append("category", params.category);
    if (params?.categoryKey) query.append("categoryKey", params.categoryKey);
    if (params?.search) query.append("search", params.search);
    if (params?.minPrice !== undefined)
      query.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice !== undefined)
      query.append("maxPrice", params.maxPrice.toString());
    if (params?.sort) query.append("sort", params.sort);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.isRecommended !== undefined)
      query.append("isRecommended", params.isRecommended.toString());
    if (params?.isFeatured !== undefined)
      query.append("isFeatured", params.isFeatured.toString());
    if (params?.status) query.append("status", params.status);

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

// ---------------- AUTH ----------------
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

export const resetPassword = async (data: { mobile: string; newPassword: string }) => {
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
    throw error; // satisfy TS
  }
};

export const getCartItems = async (): Promise<{ items: CartItemType[]; subtotal: number }> => {
  try {
    const res = await API.get("/cart");
    return res.data || { items: [] as CartItemType[], subtotal: 0 };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const removeCartItem = async (data: { productId: string; sku?: string }): Promise<any> => {
  if (!data?.productId) throw new Error("productId is required");

  try {
    const res = await API.post("/cart/remove", data);
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const clearCart = async (): Promise<any> => {
  try {
    const res = await API.post("/cart/remove");
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Update cart item quantity explicitly
 * This sets the exact quantity instead of incrementing
 */
export const updateCartItemQuantity = async (data: CartItemType): Promise<any> => {
  if (!data?.productId || !data?.sku || !data?.quantity)
    throw new Error("productId, sku and quantity are required");

  try {
    const res = await API.post("/cart/add", data);
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Get total count of items in cart
 */
export const getCartCount = async (): Promise<number> => {
  try {
    const cart = await getCartItems();
    const items: CartItemType[] = cart?.items || [];
    return items.reduce((sum: number, item: CartItemType) => sum + item.quantity, 0);
  } catch (error) {
    handleError(error);
    throw error;
  }
};


// ---------------- ADD ITEM ----------------
export const addItemToWishlist = async (data: WishlistItemType) => {
  if (!data?.productId || !data.priceSnapshot)
    throw new Error("productId and priceSnapshot are required");

  try {
    const res = await API.post("/wishlist/items", data);
    return res.data as { success: boolean; wishlist: WishlistType; message: string };
  } catch (error) {
    handleError(error);
  }
};

// ---------------- GET USER WISHLIST ----------------
export const getUserWishlist = async (userId: string) => {
  if (!userId) throw new Error("userId is required");

  try {
    const res = await API.get(`/wishlist/user/${userId}`);
    return res.data as { success: boolean; wishlist: WishlistType };
  } catch (error) {
    handleError(error);
  }
};

// ---------------- REMOVE SINGLE ITEM ----------------
export const removeWishlistItem = async (userId: string, itemId: string) => {
  if (!userId || !itemId) throw new Error("userId and itemId are required");

  try {
    const res = await API.delete(`/wishlist/items/${userId}/${itemId}`);
    return res.data as { success: boolean; wishlist?: WishlistType; message: string };
  } catch (error) {
    handleError(error);
  }
};

// ---------------- CLEAR USER WISHLIST ----------------
export const clearUserWishlist = async (userId: string) => {
  if (!userId) throw new Error("userId is required");

  try {
    const res = await API.delete(`/wishlist/clear/${userId}`);
    return res.data as { success: boolean; message: string };
  } catch (error) {
    handleError(error);
  }
};

// (Other sections like Orders, Addresses, Reviews, Coupons, Notifications, Search, Support, Newsletter, Analytics…)
// Apply same pattern: type the `data` parameter, `catch(error)` → `handleError(error)`

// ---------------- EXPORT ----------------
export default API;
