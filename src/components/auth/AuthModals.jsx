import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import googleIcon from "../../assets/Google-Logo-Icon-PNG-Photo.png";
import { signup, verifyOtp, login, resendOtp } from "../../api/api";

function AuthModals({ modalToShow, setModalToShow }) {
  const handleClose = () => setModalToShow(null);

  const switchToLogin = () => setModalToShow("login");
  const switchToSignup = () => setModalToShow("signup");

  // ---------------- SIGNUP ----------------
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSignupChange = (e) =>
    setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(signupData);
      setOtpSent(true);
      alert("OTP sent to your mobile");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({ mobile: signupData.mobile, otp });
      alert("OTP verified! You can now login");
      setOtpSent(false);
      handleClose();
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
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
  const [loginData, setLoginData] = useState({ mobile: "", password: "" });

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(loginData);
      if (res.token) localStorage.setItem("token", res.token);
      alert(res.message || "Login successful");
      handleClose();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLoginClick = () => {
    window.location.href = "http://localhost:3000/api/auth/google-login";
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

  return (
    <>
      {/* ================= SIGNUP MODAL ================= */}
      <Modal show={modalToShow === "signup"} onHide={handleClose} centered>
        <Modal.Body className="p-4 p-md-5">
          <h2 className="fw-bold text-center mb-2">Create Account</h2>

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
                placeholder="Email"
                value={signupData.email}
                onChange={handleSignupChange}
                className="form-control mb-3"
                required
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
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
                onClick={handleGoogleLoginClick}
              >
                <img
                  src={googleIcon}
                  alt="Google"
                  style={{ width: 28, height: 28 }}
                />
                Continue with Google
              </button>

              <button className="btn btn-dark w-100 py-2">Sign Up</button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control mb-3"
                required
              />
              <button className="btn btn-dark w-100 py-2 mb-2">Verify OTP</button>
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
          <h2 className="fw-bold text-center mb-2">Welcome Back</h2>

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
              onClick={handleGoogleLoginClick}
            >
              <img
                src={googleIcon}
                alt="Google"
                style={{ width: 28, height: 28 }}
              />
              Continue with Google
            </button>

            <button className="btn btn-dark w-100 py-2">Login</button>
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
