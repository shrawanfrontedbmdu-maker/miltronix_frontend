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

/* ── Injected styles ── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

  .auth-modal {
    max-width: 560px !important;
    width: 560px !important;
  }

  .auth-modal .modal-content {
    border: none;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.18);
    font-family: 'DM Sans', sans-serif;
  }

  .auth-modal .modal-body {
    background: #fff;
    padding: 28px 40px !important;
  }

  /* Heading */
  .auth-modal .auth-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: #111;
    margin-bottom: 2px;
    text-align: center;
  }

  .auth-modal .auth-subtitle {
    font-size: 13px;
    color: #888;
    text-align: center;
    margin-bottom: 16px;
  }

  /* Input Group */
  .auth-modal .field-group {
    margin-bottom: 10px;
  }

  .auth-modal .field-group label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #444;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .auth-modal .field-group input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #e0e0e0;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #111;
    background: #fafafa;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .auth-modal .field-group input:focus {
    border-color: #111;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(17,17,17,0.06);
  }

  .auth-modal .field-group input::placeholder {
    color: #bbb;
  }

  /* Primary Button */
  .auth-modal .btn-primary-dark {
    width: 100%;
    padding: 11px;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    letter-spacing: 0.02em;
    margin-top: 4px;
  }

  .auth-modal .btn-primary-dark:hover:not(:disabled) {
    background: #222;
    transform: translateY(-1px);
  }

  .auth-modal .btn-primary-dark:disabled {
    background: #888;
    cursor: not-allowed;
  }

  /* Divider */
  .auth-modal .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 12px 0;
    color: #ccc;
    font-size: 12px;
  }

  .auth-modal .divider::before,
  .auth-modal .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #eee;
  }

  /* Google Button */
  .auth-modal .btn-google {
    width: 100%;
    padding: 10px;
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .auth-modal .btn-google:hover {
    border-color: #111;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  /* Footer link */
  .auth-modal .auth-footer {
    text-align: center;
    margin-top: 14px;
    font-size: 13px;
    color: #888;
  }

  .auth-modal .auth-link {
    color: #111;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
  }

  .auth-modal .auth-link:hover {
    color: #444;
  }

  /* Forgot password link */
  .auth-modal .forgot-link {
    text-align: right;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    margin-bottom: 14px;
    margin-top: -4px;
  }

  .auth-modal .forgot-link:hover { color: #111; }

  /* Policy text */
  .auth-modal .policy-text {
    font-size: 11px;
    color: #aaa;
    text-align: center;
    margin: 8px 0;
    line-height: 1.5;
  }

  .auth-modal .policy-text span { color: #555; font-weight: 500; }

  /* Two column grid for signup fields */
  .auth-modal .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 12px;
  }

  .auth-modal .field-grid .field-group {
    margin-bottom: 10px;
  }

  .auth-modal .field-grid .field-group.full {
    grid-column: 1 / -1;
  }

  /* OTP Boxes */
  .auth-modal .otp-wrap {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 24px;
  }

  .auth-modal .otp-box {
    width: 52px;
    height: 56px;
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    border: 1.5px solid #e0e0e0;
    border-radius: 10px;
    background: #fafafa;
    font-family: 'DM Sans', sans-serif;
    color: #111;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .auth-modal .otp-box:focus {
    border-color: #111;
    box-shadow: 0 0 0 3px rgba(17,17,17,0.07);
    background: #fff;
  }

  /* OTP Hint */
  .auth-modal .otp-hint {
    font-size: 13px;
    color: #aaa;
    text-align: center;
    margin-top: 12px;
  }

  .auth-modal .otp-hint span {
    color: #111;
    font-weight: 600;
    cursor: pointer;
  }

  /* Success check circle */
  .auth-modal .success-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  /* Profile Avatar */
  .auth-modal .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 30px;
    font-weight: 700;
    margin: 0 auto 12px;
    font-family: 'Playfair Display', serif;
  }

  /* Profile List */
  .auth-modal .profile-list {
    border: 1.5px solid #eee;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .auth-modal .profile-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: #fff;
    border: none;
    border-bottom: 1px solid #f0f0f0;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #222;
    cursor: pointer;
    transition: background 0.15s;
  }

  .auth-modal .profile-list-item:last-child { border-bottom: none; }
  .auth-modal .profile-list-item:hover { background: #f7f7f7; }

  /* Danger button */
  .auth-modal .btn-danger-outline {
    width: 100%;
    padding: 13px;
    background: transparent;
    border: 1.5px solid #e44;
    border-radius: 10px;
    color: #e44;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .auth-modal .btn-danger-outline:hover {
    background: #e44;
    color: #fff;
  }

  /* Back link */
  .auth-modal .back-link {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }
`;

/* ── OTP Input Boxes ── */
const OTPInputBoxes = ({ length = 4, value, onChange }) => {
  const [otpValues, setOtpValues] = useState(Array(length).fill(""));

  useEffect(() => {
    const arr = Array(length).fill("");
    value.split("").forEach((v, i) => { if (i < length) arr[i] = v; });
    setOtpValues(arr);
  }, [value, length]);

  const handleChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpValues];
    next[index] = val.slice(-1);
    setOtpValues(next);
    onChange(next.join(""));
    if (val && index < length - 1)
      document.getElementById(`otp-input-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0)
      document.getElementById(`otp-input-${index - 1}`)?.focus();
  };

  return (
    <div className="otp-wrap">
      {otpValues.map((val, idx) => (
        <input
          key={idx}
          id={`otp-input-${idx}`}
          type="text"
          value={val}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className="otp-box"
          maxLength={1}
          inputMode="numeric"
        />
      ))}
    </div>
  );
};

/* ── Field Component ── */
const Field = ({ label, ...props }) => (
  <div className="field-group">
    {label && <label>{label}</label>}
    <input {...props} />
  </div>
);

/* ── Main Component ── */
function AuthModals({ modalToShow, setModalToShow }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
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

  const handleClose = () => { setModalToShow(null); resetState(); };
  const switchToLogin = () => { resetState(); setModalToShow("login"); };
  const switchToSignup = () => { resetState(); setModalToShow("signup"); };
  const switchToForgotPassword = () => { resetState(); setModalToShow("forgot"); };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setModalToShow(null);
  };

  // SIGNUP
  const [signupData, setSignupData] = useState({ fullName: "", email: "", mobile: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(signupData);
      setOtpSent(true);
      alert("OTP sent to your mobile");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
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
    } finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ mobile: signupData.mobile });
      alert("OTP resent successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Resend OTP failed");
    }
  };

  // LOGIN
  const [loginData, setLoginData] = useState({ mobile: "", password: "" });
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

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
    } finally { setLoading(false); }
  };

  // FORGOT PASSWORD
  const [forgotPasswordData, setForgotPasswordData] = useState({ mobile: "" });
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({ otp: "", newPassword: "", confirmPassword: "" });

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ mobile: forgotPasswordData.mobile });
      setForgotOtpSent(true);
      alert("OTP sent to your mobile");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
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
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>

      {/* ===== SIGNUP MODAL ===== */}
      <Modal show={modalToShow === "signup"} onHide={handleClose} centered dialogClassName="auth-modal">
        <Modal.Body>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join now & unlock exclusive deals and offers!</p>

          {!otpSent ? (
            <form onSubmit={handleSignupSubmit}>
              <div className="field-grid">
                <Field label="Full Name" type="text" name="fullName" placeholder="Enter your full name" value={signupData.fullName} onChange={handleSignupChange} required />
                <Field label="Mobile Number" type="text" name="mobile" placeholder="+91 00000 00000" value={signupData.mobile} onChange={handleSignupChange} required />
                <Field label="Email Address" type="email" name="email" placeholder="you@example.com" value={signupData.email} onChange={handleSignupChange} />
                <div className="field-group" />
                <Field label="Password" type="password" name="password" placeholder="Create a strong password" value={signupData.password} onChange={handleSignupChange} required />
                <Field label="Confirm Password" type="password" placeholder="Re-enter your password" required />
              </div>

              <p className="policy-text">
                By continuing, I agree to the <span>Terms of Use &amp; Privacy Policy</span>
              </p>

              <button type="submit" className="btn-primary-dark" disabled={loading}>
                {loading ? "Please wait…" : "Create Account"}
              </button>

              <div className="divider">or continue with</div>

              <button type="button" className="btn-google" onClick={loginWithGoogle}>
                <img src={googleIcon} alt="Google" width={22} height={22} />
                Continue with Google
              </button>
            </form>
          ) : (
            <>
              <h2 className="auth-title" style={{ fontSize: 22 }}>OTP Verification</h2>
              <p className="auth-subtitle">Code sent to +91 {signupData.mobile}</p>
              <form onSubmit={handleOtpSubmit}>
                <OTPInputBoxes value={otp} onChange={setOtp} />
                <button type="submit" className="btn-primary-dark" disabled={loading}>
                  {loading ? "Verifying…" : "Verify OTP"}
                </button>
                <p className="otp-hint">
                  Didn't receive it? <span onClick={handleResendOtp}>Resend OTP</span>
                </p>
              </form>
            </>
          )}

          {!otpSent && (
            <p className="auth-footer">
              Already have an account? <span className="auth-link" onClick={switchToLogin}>Log In</span>
            </p>
          )}
        </Modal.Body>
      </Modal>

      {/* ===== LOGIN MODAL ===== */}
      <Modal show={modalToShow === "login"} onHide={handleClose} centered dialogClassName="auth-modal">
        <Modal.Body>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login for a seamless experience</p>

          <form onSubmit={handleLoginSubmit}>
            <Field label="Mobile Number" type="text" name="mobile" placeholder="+91 00000 00000" value={loginData.mobile} onChange={handleLoginChange} required />
            <Field label="Password" type="password" name="password" placeholder="Enter your password" value={loginData.password} onChange={handleLoginChange} required />

            <p className="forgot-link" onClick={switchToForgotPassword}>Forgot Password?</p>

            <button type="submit" className="btn-primary-dark" disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </button>

            <div className="divider">or continue with</div>

            <button type="button" className="btn-google" onClick={loginWithGoogle}>
              <img src={googleIcon} alt="Google" width={22} height={22} />
              Continue with Google
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <span className="auth-link" onClick={switchToSignup}>Sign Up</span>
          </p>
        </Modal.Body>
      </Modal>

      {/* ===== FORGOT PASSWORD MODAL ===== */}
      <Modal show={modalToShow === "forgot"} onHide={handleClose} centered dialogClassName="auth-modal">
        <Modal.Body>
          {!forgotOtpSent ? (
            <>
              <h2 className="auth-title">Forgot Password?</h2>
              <p className="auth-subtitle">We'll send OTP reset instructions to your mobile</p>
              <form onSubmit={handleForgotPasswordSubmit}>
                <Field label="Mobile Number" type="text" placeholder="+91 00000 00000" value={forgotPasswordData.mobile} onChange={(e) => setForgotPasswordData({ mobile: e.target.value })} required />
                <button type="submit" className="btn-primary-dark" disabled={loading}>
                  {loading ? "Sending…" : "Send OTP"}
                </button>
              </form>
              <p className="back-link">
                <span className="auth-link" onClick={switchToLogin}>← Back to Login</span>
              </p>
            </>
          ) : (
            <>
              <h2 className="auth-title">Set New Password</h2>
              <p className="auth-subtitle">Enter the OTP sent to your mobile and choose a new password</p>
              <form onSubmit={handleResetPasswordSubmit}>
                <OTPInputBoxes length={6} value={resetPasswordData.otp}
                  onChange={(val) => setResetPasswordData({ ...resetPasswordData, otp: val })} />
                <Field label="New Password" type="password" placeholder="Enter new password" value={resetPasswordData.newPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })} required />
                <Field label="Confirm New Password" type="password" placeholder="Re-enter new password" value={resetPasswordData.confirmPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })} required />
                <button type="submit" className="btn-primary-dark" disabled={loading}>
                  {loading ? "Resetting…" : "Reset Password"}
                </button>
                <p className="otp-hint">
                  Didn't receive OTP?{" "}
                  <span onClick={() => handleForgotPasswordSubmit({ preventDefault: () => {} })}>Resend</span>
                </p>
              </form>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* ===== RESET SUCCESS MODAL ===== */}
      <Modal show={modalToShow === "resetSuccess"} onHide={handleClose} centered dialogClassName="auth-modal">
        <Modal.Body style={{ textAlign: "center" }}>
          <div className="success-circle">
            <svg width="28" height="28" fill="white" viewBox="0 0 16 16">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
          </div>
          <h2 className="auth-title">Password Reset!</h2>
          <p className="auth-subtitle" style={{ marginBottom: 28 }}>Your password has been updated successfully.</p>
          <button className="btn-primary-dark" onClick={switchToLogin}>Login Now</button>
        </Modal.Body>
      </Modal>

      {/* ===== PROFILE MODAL ===== */}
      <Modal show={modalToShow === "profile"} onHide={handleClose} centered dialogClassName="auth-modal">
        <Modal.Body>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div className="avatar">{user?.fullName?.charAt(0).toUpperCase() || "U"}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 2 }}>{user?.fullName || "User"}</h3>
            <p style={{ color: "#888", fontSize: 14 }}>{user?.email || user?.mobile}</p>
          </div>

          <div className="profile-list">
            {["Edit Profile", "My Orders", "Saved Addresses", "Settings"].map((item) => (
              <button key={item} className="profile-list-item">
                <span>{item}</span>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            ))}
          </div>

          <button className="btn-danger-outline" onClick={handleLogout}>Logout</button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AuthModals;