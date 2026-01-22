// src/api/api.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ---------------- BASE AXIOS ----------------
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- CATEGORIES ----------------
export const fetchCategories = async () => {
  const res = await API.get("/category");
  return res.data;
};

// ---------------- PRODUCTS ----------------
export const fetchProductsByCategory = async (categoryId: string) => {
  const res = await API.get(`/products?category=${categoryId}`);
  return res.data;
};

// ---------------- AUTH ----------------

// Signup → sends OTP
export const signup = async (data: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}) => {
  const res = await API.post("/auth/signup", data);
  return res.data;
};

// Verify OTP
export const verifyOtp = async (data: { mobile: string; otp: string }) => {
  const res = await API.post("/auth/verify-otp", data);
  return res.data;
};

// Resend OTP
export const resendOtp = async (data: { mobile: string }) => {
  const res = await API.post("/auth/resend-otp", data);
  return res.data;
};

// Login → only mobile + password
export const login = async (data: { mobile: string; password: string }) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// Optional: Google login redirect
export const loginWithGoogle = () => {
  window.location.href = `${BASE_URL}/auth/google-login`;
};

// ---------------- CART ----------------

// Add item to cart
export const addItemToCart = async (data: {
  productId: string;
  quantity: number;
  price: number;
}) => {
  const res = await API.post("/cart/items", data);
  return res.data;
};

// Get all cart items
export const getCartItems = async () => {
  const res = await API.get("/cart");
  return res.data;
};

// Update a specific cart item
export const updateCartItem = async (
  itemId: string,
  data: { quantity?: number; price?: number }
) => {
  const res = await API.put(`/cart/items/${itemId}`, data);
  return res.data;
};

// Merge cart (e.g., guest cart → user cart)
export const mergeCart = async (items: { productId: string; quantity: number }[]) => {
  const res = await API.post("/cart/merge", { items });
  return res.data;
};

// Remove item from cart
export const removeCartItem = async (itemId: string) => {
  const res = await API.delete(`/cart/items/${itemId}`);
  return res.data;
};
