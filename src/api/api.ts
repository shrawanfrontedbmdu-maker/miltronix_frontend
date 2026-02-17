import axios, { AxiosInstance, AxiosError } from "axios";

// ---------------- BASE URL ----------------
const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  "https://miltronix-backend-1.onrender.com/api";

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
    // Handle 401 unauthorized - auto logout
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ---------------- ERROR HANDLER ----------------
const handleError = (error: AxiosError<any>): never => {
  const message =
    error.response?.data?.message ||
    error.message ||
    "Something went wrong";
  throw new Error(message);
};

// ================== CATEGORIES ==================
export const fetchCategories = async () => {
  try {
    const res = await API.get("/category");
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const fetchCategoryById = async (categoryId: string) => {
  try {
    const res = await API.get(`/category/${categoryId}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
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
    if (params?.minPrice !== undefined) query.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.append("maxPrice", params.maxPrice.toString());
    if (params?.sort) query.append("sort", params.sort);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.isRecommended !== undefined) query.append("isRecommended", params.isRecommended.toString());
    if (params?.isFeatured !== undefined) query.append("isFeatured", params.isFeatured.toString());
    if (params?.status) query.append("status", params.status);

    const res = await API.get(`/products?${query.toString()}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const fetchProductById = async (productId: string) => {
  try {
    const res = await API.get(`/products/${productId}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const fetchProductBySlug = async (slug: string) => {
  try {
    const res = await API.get(`/products/slug/${slug}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const fetchRecommendedProducts = async (limit: number = 10) => {
  try {
    const res = await API.get(`/products?isRecommended=true&limit=${limit}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const fetchFeaturedProducts = async (limit: number = 10) => {
  try {
    const res = await API.get(`/products?isFeatured=true&limit=${limit}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
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
    handleError(error as AxiosError);
  }
};

export const login = async (data: { mobile: string; password: string }) => {
  try {
    const res = await API.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const verifyOtp = async (data: { mobile: string; otp: string }) => {
  try {
    const res = await API.post("/auth/verify-otp", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const resendOtp = async (data: { mobile: string }) => {
  try {
    const res = await API.post("/auth/resend-otp", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const forgotPassword = async (data: { mobile: string }) => {
  try {
    const res = await API.post("/auth/forgot-password", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const verifyResetOtp = async (data: { mobile: string; otp: string }) => {
  try {
    const res = await API.post("/auth/verify-reset-otp", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const resetPassword = async (data: { mobile: string; newPassword: string }) => {
  try {
    const res = await API.post("/auth/reset-password", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const googleLoginApi = async (data: { idToken: string }) => {
  try {
    const res = await API.post("/auth/google-login", data);
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const loginWithGoogle = () => {
  window.location.href = `${BASE_URL}/auth/google-login`;
};

// ================== CART ==================
export const addItemToCart = async (data: {
  productId: string;
  quantity: number;
  variantSku?: string;
}) => {
  try {
    const res = await API.post("/cart/add", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getCartItems = async () => {
  try {
    const res = await API.get("/cart");
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const updateCartItem = async (
  itemId: string,
  data: { quantity: number }
) => {
  try {
    const res = await API.put(`/cart/update/${itemId}`, data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const removeCartItem = async (itemId: string) => {
  try {
    const res = await API.delete(`/cart/delete/${itemId}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const clearCart = async () => {
  try {
    const res = await API.delete("/cart/clear");
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getCartCount = async () => {
  try {
    const res = await API.get("/cart/count");
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// ================== WISHLIST ==================
export const addToWishlist = async (productId: string) => {
  try {
    const res = await API.post("/wishlist/add", { productId });
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getWishlist = async () => {
  try {
    const res = await API.get("/wishlist");
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const removeFromWishlist = async (productId: string) => {
  try {
    const res = await API.delete(`/wishlist/remove/${productId}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const clearWishlist = async () => {
  try {
    const res = await API.delete("/wishlist/clear");
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// ================== ORDERS ==================
export const createOrder = async (data: {
  items: {
    productId: string;
    variantSku?: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    fullName: string;
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: string;
  totalPrice: number;
  discount?: number;
  shippingCharge?: number;
  couponCode?: string;
}) => {
  try {
    const res = await API.post("/orders", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getMyOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.status) query.append("status", params.status);

    const res = await API.get(`/orders/my-orders?${query.toString()}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const res = await API.get(`/orders/${orderId}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const cancelOrder = async (orderId: string, reason?: string) => {
  try {
    const res = await API.put(`/orders/${orderId}/cancel`, { reason });
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const trackOrder = async (orderId: string) => {
  try {
    const res = await API.get(`/orders/${orderId}/track`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// ================== ADDRESSES ==================
export const addAddress = async (data: {
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}) => {
  try {
    const res = await API.post("/addresses", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getAddresses = async () => {
  try {
    const res = await API.get("/addresses");
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const updateAddress = async (addressId: string, data: {
  fullName?: string;
  mobile?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  isDefault?: boolean;
}) => {
  try {
    const res = await API.put(`/addresses/${addressId}`, data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const deleteAddress = async (addressId: string) => {
  try {
    const res = await API.delete(`/addresses/${addressId}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const setDefaultAddress = async (addressId: string) => {
  try {
    const res = await API.put(`/addresses/${addressId}/set-default`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// ================== REVIEWS ==================
export const addReview = async (data: {
  productId: string;
  rating: number;
  comment: string;
}) => {
  try {
    const res = await API.post("/reviews", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getProductReviews = async (
  productId: string,
  params?: { page?: number; limit?: number }
) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    const res = await API.get(`/reviews/product/${productId}?${query.toString()}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const updateReview = async (
  reviewId: string,
  data: { rating?: number; comment?: string }
) => {
  try {
    const res = await API.put(`/reviews/${reviewId}`, data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const res = await API.delete(`/reviews/${reviewId}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// ================== COUPONS ==================
export const validateCoupon = async (code: string, cartTotal: number) => {
  try {
    const res = await API.post("/coupons/validate", { code, cartTotal });
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getAvailableCoupons = async () => {
  try {
    const res = await API.get("/coupons/available");
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// ================== NOTIFICATIONS ==================
export const getNotifications = async (params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.isRead !== undefined) query.append("isRead", params.isRead.toString());

    const res = await API.get(`/notifications?${query.toString()}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const res = await API.put(`/notifications/${notificationId}/read`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const res = await API.put("/notifications/read-all");
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const res = await API.delete(`/notifications/${notificationId}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// ================== SEARCH & FILTERS ==================
export const searchProducts = async (query: string, filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  rating?: number;
}) => {
  try {
    const params = new URLSearchParams({ search: query });
    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.brand) params.append("brand", filters.brand);
    if (filters?.rating) params.append("rating", filters.rating.toString());

    const res = await API.get(`/products/search?${params.toString()}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getSearchSuggestions = async (query: string) => {
  try {
    const res = await API.get(`/products/suggestions?q=${query}`);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// ================== CONTACT / SUPPORT ==================
export const sendContactMessage = async (data: {
  name: string;
  email: string;
  mobile?: string;
  subject: string;
  message: string;
}) => {
  try {
    const res = await API.post("/contact", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const createSupportTicket = async (data: {
  orderId?: string;
  subject: string;
  message: string;
  priority?: "low" | "medium" | "high";
}) => {
  try {
    const res = await API.post("/support/tickets", data);
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getMySupportTickets = async () => {
  try {
    const res = await API.get("/support/tickets/my-tickets");
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// ================== NEWSLETTER ==================
export const subscribeNewsletter = async (email: string) => {
  try {
    const res = await API.post("/newsletter/subscribe", { email });
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const unsubscribeNewsletter = async (email: string) => {
  try {
    const res = await API.post("/newsletter/unsubscribe", { email });
    return res.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// ================== ANALYTICS / TRACKING ==================
export const trackProductView = async (productId: string) => {
  try {
    const res = await API.post("/analytics/product-view", { productId });
    return res.data;
  } catch (error) {
    // Silent fail for analytics
    console.error("Analytics error:", error);
  }
};

export const trackSearchQuery = async (query: string) => {
  try {
    const res = await API.post("/analytics/search", { query });
    return res.data;
  } catch (error) {
    // Silent fail for analytics
    console.error("Analytics error:", error);
  }
};

// Export API instance for custom requests
export default API;