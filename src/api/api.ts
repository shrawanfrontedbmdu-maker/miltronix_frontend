// src/api/api.ts
import axios, { AxiosInstance } from "axios";

// ---------------- BASE URL ----------------
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

// ---------------- AXIOS INSTANCE ----------------
const API: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- AUTHORIZATION INTERCEPTOR ----------------
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers!["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ---------------- ERROR HANDLER ----------------
const handleError = (err: any) => {
  if (err.response && err.response.data && err.response.data.message) {
    throw new Error(err.response.data.message);
  }
  throw new Error(err.message);
};

// ---------------- CATEGORIES ----------------
export const fetchCategories = async () => {
  try {
    const res = await API.get("/category");
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// ---------------- PRODUCTS ----------------
export const fetchProducts = async () => {
  try {
    const res = await API.get("/products");
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const fetchProductsByCategory = async (categoryId: string) => {
  try {
    const res = await API.get(`/products?category=${categoryId}`);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const fetchProductById = async (productId: string) => {
  try {
    const res = await API.get(`/products/${productId}`);
    return res.data;
  } catch (err) {
    handleError(err);
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
  } catch (err) {
    handleError(err);
  }
};

export const verifyOtp = async (data: { mobile: string; otp: string }) => {
  try {
    const res = await API.post("/auth/verify-otp", data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const resendOtp = async (data: { mobile: string }) => {
  try {
    const res = await API.post("/auth/resend-otp", data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const login = async (data: { mobile: string; password: string }) => {
  try {
    const res = await API.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const loginWithGoogle = () => {
  window.location.href = `${BASE_URL}/auth/google-login`;
};

export const logout = () => {
  localStorage.removeItem("token");
};

// ---------------- CART ----------------
export const addItemToCart = async (data: {
  productId: string;
  quantity: number;
  variant?: Record<string, any>;
}) => {
  try {
    const res = await API.post("/cart/add", data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getCartItems = async () => {
  try {
    const res = await API.get("/cart");
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateCartItem = async (
  itemId: string,
  data: { quantity: number }
) => {
  try {
    const res = await API.put(`/cart/update/${itemId}`, data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const removeCartItem = async (itemId: string) => {
  try {
    const res = await API.delete(`/cart/delete/${itemId}`);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const mergeCart = async (
  items: { productId: string; quantity: number; variant?: Record<string, any> }[]
) => {
  try {
    const res = await API.post("/cart/merge", { items });
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// ---------------- ORDERS ----------------
export const createOrder = async (data: {
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: string;
  paymentMethod: string;
  totalPrice: number;
}) => {
  try {
    const res = await API.post("/orders", data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getMyOrders = async () => {
  try {
    const res = await API.get("/orders/my-orders");
    return res.data;
  } catch (err) {
    handleError(err);
  }
};
