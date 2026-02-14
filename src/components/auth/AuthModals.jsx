import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import googleIcon from "../../assets/Google-Logo-Icon-PNG-Photo.png";
import {
  signup,
  verifyOtp,
  login,
  resendOtp,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
} from "../../api/api";

function AuthModals({ modalToShow, setModalToShow }) {
  // ---------------- COMMON ----------------
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const resetState = () => {
    setOtpSent(false);
    setOtp("");
    setSignupData({ fullName: "", email: "", mobile: "", password: "" });
    setLoginData({ mobile: "", password: "" });
    setForgotPasswordData({ mobile: "" });
    setResetPasswordData({ otp: "", newPassword: "", confirmPassword: "" });
    setForgotOtpSent(false);
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

  const switchToForgotPassword = () => {
    resetState();
    setModalToShow("forgot");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setModalToShow(null);
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
        setUser(res.user);
      }
      alert("Login successful");
      handleClose();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FORGOT PASSWORD ----------------
  const [forgotPasswordData, setForgotPasswordData] = useState({ mobile: "" });
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ mobile: forgotPasswordData.mobile });
      setForgotOtpSent(true);
      alert("OTP sent to your mobile");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({
        mobile: forgotPasswordData.mobile,
        otp: resetPasswordData.otp,
        newPassword: resetPasswordData.newPassword,
      });
      alert("Password reset successful! Please login");
      setModalToShow("login");
      resetState();
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
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

  // OTP Input Boxes Component
  const OTPInputBoxes = ({ length = 4, value, onChange }) => {
    const [otpValues, setOtpValues] = useState(Array(length).fill(""));

    useEffect(() => {
      const valueArray = value.split("");
      const newOtpValues = Array(length).fill("");
      valueArray.forEach((val, idx) => {
        if (idx < length) newOtpValues[idx] = val;
      });
      setOtpValues(newOtpValues);
    }, [value, length]);

    const handleChange = (index, val) => {
      if (!/^\d*$/.test(val)) return;

      const newOtpValues = [...otpValues];
      newOtpValues[index] = val.slice(-1);
      setOtpValues(newOtpValues);
      onChange(newOtpValues.join(""));

      // Auto-focus next input
      if (val && index < length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    };

    const handleKeyDown = (index, e) => {
      if (e.key === "Backspace" && !otpValues[index] && index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    };

    return (
      <div className="d-flex gap-2 justify-content-center mb-3">
        {otpValues.map((val, idx) => (
          <input
            key={idx}
            id={`otp-input-${idx}`}
            type="text"
            value={val}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="form-control text-center"
            style={{
              width: "50px",
              height: "50px",
              fontSize: "24px",
              fontWeight: "600",
            }}
            maxLength={1}
            inputMode="numeric"
          />
        ))}
      </div>
    );
  };

  // ---------------- UI ----------------
  return (
    <>

    
      {/* ================= SIGNUP MODAL ================= */}
      <Modal show={modalToShow === "signup"} onHide={handleClose} centered>
        <Modal.Body className="p-4 p-md-5">
          <h2 className="fw-bold text-center mb-1">Sign up</h2>
          <p className="text-center text-muted mb-4">
            Join now & unlock exclusive deals or offers!
          </p>

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
                placeholder="Your email id"
                value={signupData.email}
                onChange={handleSignupChange}
                className="form-control mb-3"
              />

              <input
                type="text"
                name="mobile"
                placeholder="Your mobile number"
                value={signupData.mobile}
                onChange={handleSignupChange}
                className="form-control mb-3"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={signupData.password}
                onChange={handleSignupChange}
                className="form-control mb-3"
                required
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="form-control mb-3"
                required
              />

              <p className="text-center small text-muted mb-3">
                By continuing, I agree to the{" "}
                <span className="text-dark">Terms of Use & Privacy Policy</span>
              </p>

              <button
                type="submit"
                className="btn btn-dark w-100 py-2 mb-3"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Continue"}
              </button>

              <div className="text-center text-muted mb-3">or login with</div>

              <button
                type="button"
                className="btn btn-outline-dark w-100 mb-3"
                style={googleBtnStyle}
                onClick={loginWithGoogle}
              >
                <img src={googleIcon} alt="Google" width={28} height={28} />
                Google
              </button>
            </form>
          ) : (
            <div>
              <h3 className="text-center mb-1">OTP Verification</h3>
              <p className="text-center text-muted mb-4">
                Enter the code sent to +91{signupData.mobile}
              </p>

              <form onSubmit={handleOtpSubmit}>
                <OTPInputBoxes value={otp} onChange={setOtp} />

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-2 mb-2"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Continue"}
                </button>

                <button
                  type="button"
                  className="btn btn-link w-100"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>

                <p className="text-center small text-muted mt-3">
                  Didn't receive the OTP?{" "}
                  <span
                    className="text-dark fw-semibold cursor-pointer"
                    onClick={handleResendOtp}
                  >
                    Retry by 00:55
                  </span>
                </p>
              </form>
            </div>
          )}

          {!otpSent && (
            <p className="text-center mt-4 mb-0">
              Have an account?{" "}
              <span
                className="fw-semibold text-decoration-underline cursor-pointer"
                onClick={switchToLogin}
              >
                Log In
              </span>
            </p>
          )}
        </Modal.Body>
      </Modal>

      {/* ================= LOGIN MODAL ================= */}
      <Modal show={modalToShow === "login"} onHide={handleClose} centered>
        <Modal.Body className="p-4 p-md-5">
          <h2 className="fw-bold text-center mb-1">Welcome</h2>
          <p className="text-center text-muted mb-4">
            Login for a seamless experience
          </p>

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
              className="form-control mb-2"
              required
            />

            <p
              className="text-end small cursor-pointer mb-4"
              onClick={switchToForgotPassword}
            >
              Forgot Password?
            </p>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 mb-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-muted mb-3">or login with</div>

            <button
              type="button"
              className="btn btn-outline-dark w-100 mb-3"
              style={googleBtnStyle}
              onClick={loginWithGoogle}
            >
              <img src={googleIcon} alt="Google" width={28} height={28} />
              Google
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Don't have an account?{" "}
            <span
              className="fw-semibold text-decoration-underline cursor-pointer"
              onClick={switchToSignup}
            >
              Sign up
            </span>
          </p>
        </Modal.Body>
      </Modal>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      <Modal show={modalToShow === "forgot"} onHide={handleClose} centered>
        <Modal.Body className="p-4 p-md-5">
          {!forgotOtpSent ? (
            <>
              <h2 className="fw-bold text-center mb-1">Forgot password</h2>
              <p className="text-center text-muted mb-4">
                We'll send you reset instructions
              </p>

              <form onSubmit={handleForgotPasswordSubmit}>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={forgotPasswordData.mobile}
                  onChange={(e) =>
                    setForgotPasswordData({ mobile: e.target.value })
                  }
                  className="form-control mb-3"
                  required
                />

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-2"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>

                <p className="text-center small text-muted mt-3">
                  We'll send OTP code on your mobile number to reset your
                  password
                </p>
              </form>

              <p className="text-center mt-4 mb-0">
                <span
                  className="fw-semibold text-decoration-underline cursor-pointer"
                  onClick={switchToLogin}
                >
                  Back to Login
                </span>
              </p>
            </>
          ) : (
            <>
              <h2 className="fw-bold text-center mb-1">Set New Password</h2>
              <p className="text-center text-muted mb-4">
                Your new password should be different from previously used
                password
              </p>

              <form onSubmit={handleResetPasswordSubmit}>
                <OTPInputBoxes
                  length={6}
                  value={resetPasswordData.otp}
                  onChange={(val) =>
                    setResetPasswordData({ ...resetPasswordData, otp: val })
                  }
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) =>
                    setResetPasswordData({
                      ...resetPasswordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="form-control mb-3"
                  required
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) =>
                    setResetPasswordData({
                      ...resetPasswordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="form-control mb-3"
                  required
                />

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-2"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <p className="text-center small text-muted mt-3">
                  Didn't receive OTP?{" "}
                  <span
                    className="text-dark fw-semibold cursor-pointer"
                    onClick={() =>
                      handleForgotPasswordSubmit({ preventDefault: () => {} })
                    }
                  >
                    Back to 00:55
                  </span>
                </p>
              </form>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* ================= PASSWORD RESET SUCCESS MODAL ================= */}
      <Modal
        show={modalToShow === "resetSuccess"}
        onHide={handleClose}
        centered
      >
        <Modal.Body className="p-4 p-md-5 text-center">
          <div
            className="mx-auto mb-3"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#28a745",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="30" height="30" fill="white" viewBox="0 0 16 16">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
          </div>

          <h2 className="fw-bold mb-1">Password Reset Successful</h2>
          <p className="text-muted mb-4">
            Your password has been updated successfully
          </p>

          <button className="btn btn-dark w-100 py-2" onClick={switchToLogin}>
            Login Now
          </button>
        </Modal.Body>
      </Modal>

      {/* ================= PROFILE MODAL ================= */}
      <Modal show={modalToShow === "profile"} onHide={handleClose} centered>
        <Modal.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <div
              className="mx-auto mb-3"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "32px",
                fontWeight: "600",
              }}
            >
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
            <h3 className="fw-bold mb-0">{user?.fullName || "User"}</h3>
            <p className="text-muted">{user?.email || user?.mobile}</p>
          </div>

          <div className="list-group list-group-flush mb-3">
            <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <span>Edit Profile</span>
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
            <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <span>My Orders</span>
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
            <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <span>Saved Addresses</span>
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
            <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <span>Settings</span>
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
          </div>

          <button
            className="btn btn-outline-danger w-100 py-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AuthModals;