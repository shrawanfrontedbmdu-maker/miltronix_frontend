import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import googleIcon from "../../assets/Google-Logo-Icon-PNG-Photo.png";
import {
  signup,
  verifyOtp,
  login,
  resendOtp,
  loginWithGoogle,
} from "../../api/api";

function AuthModals({ modalToShow, setModalToShow }) {
  // ---------------- COMMON ----------------
  const resetState = () => {
    setOtpSent(false);
    setOtp("");
    setSignupData({ fullName: "", email: "", mobile: "", password: "" });
    setLoginData({ mobile: "", password: "" });
  };

  const handleClose = () => {
    setModalToShow(null);
    resetState();
  };

  const switchToLogin = () => {
    resetState();
    setModalToShow("login");
  };

  const switchToSignup = () => {
    resetState();
    setModalToShow("signup");
  };

  // ---------------- SIGNUP ----------------
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignupChange = (e) =>
    setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(signupData);
      setOtpSent(true);
      alert("OTP sent to your mobile");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp({ mobile: signupData.mobile, otp });
      alert("OTP verified! Please login");
      setModalToShow("login");
      resetState();
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ mobile: signupData.mobile });
      alert("OTP resent successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Resend OTP failed");
    }
  };

  // ---------------- LOGIN ----------------
  const [loginData, setLoginData] = useState({
    mobile: "",
    password: "",
  });

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(loginData);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
      alert("Login successful");
      handleClose();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const googleBtnStyle = {
    padding: "14px 0",
    fontSize: "16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  };

  // ---------------- UI ----------------
  return (
    <>
      {/* ================= SIGNUP MODAL ================= */}
      <Modal show={modalToShow === "signup"} onHide={handleClose} centered>
        <Modal.Body className="p-4 p-md-5">
          <h2 className="fw-bold text-center mb-3">Create Account</h2>

          {!otpSent ? (
            <form onSubmit={handleSignupSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={signupData.fullName}
                onChange={handleSignupChange}
                className="form-control mb-3"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                value={signupData.email}
                onChange={handleSignupChange}
                className="form-control mb-3"
              />

              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={signupData.mobile}
                onChange={handleSignupChange}
                className="form-control mb-3"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
                className="form-control mb-3"
                required
              />

              <button
                type="button"
                className="btn btn-outline-dark w-100 mb-3"
                style={googleBtnStyle}
                onClick={loginWithGoogle}
              >
                <img src={googleIcon} alt="Google" width={28} height={28} />
                Continue with Google
              </button>

              <button
                className="btn btn-dark w-100 py-2"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Sign Up"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control mb-3"
                inputMode="numeric"
                maxLength={4}
                required
              />

              <button
                className="btn btn-dark w-100 py-2 mb-2"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            </form>
          )}

          {!otpSent && (
            <p className="text-center mt-4 mb-0">
              Already have an account?{" "}
              <span
                className="fw-semibold text-decoration-underline cursor-pointer"
                onClick={switchToLogin}
              >
                Login
              </span>
            </p>
          )}
        </Modal.Body>
      </Modal>

      {/* ================= LOGIN MODAL ================= */}
      <Modal show={modalToShow === "login"} onHide={handleClose} centered>
        <Modal.Body className="p-4 p-md-5">
          <h2 className="fw-bold text-center mb-3">Welcome Back</h2>

          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={loginData.mobile}
              onChange={handleLoginChange}
              className="form-control mb-3"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="form-control mb-4"
              required
            />

            <button
              type="button"
              className="btn btn-outline-dark w-100 mb-3"
              style={googleBtnStyle}
              onClick={loginWithGoogle}
            >
              <img src={googleIcon} alt="Google" width={28} height={28} />
              Continue with Google
            </button>

            <button
              className="btn btn-dark w-100 py-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Don’t have an account?{" "}
            <span
              className="fw-semibold text-decoration-underline cursor-pointer"
              onClick={switchToSignup}
            >
              Sign Up
            </span>
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AuthModals;
