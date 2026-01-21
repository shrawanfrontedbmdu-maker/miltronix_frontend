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

// Optional: Google login redirect (if you want frontend to trigger)
export const loginWithGoogle = () => {
  window.location.href = `${BASE_URL}/auth/google-login`;
};
