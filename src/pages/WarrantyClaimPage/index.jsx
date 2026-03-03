import React, { useState } from "react";

// --- Reusable Components ---
import Header from '../../components/layout/Header';
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";

// ✅ Correct - import karo
import logoBanner from "../../assets/MILTRONIX-APP-DESIGN-3.png";

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  { number: "01", icon: "📋", title: "Fill the Form", desc: "Enter your product details, order ID, and describe the issue clearly." },
  { number: "02", icon: "✅", title: "Verification", desc: "Our team verifies your warranty status within 24 business hours." },
  { number: "03", icon: "🔧", title: "Repair / Replace", desc: "We schedule pickup or direct you to the nearest service centre." },
  { number: "04", icon: "📦", title: "Return Delivery", desc: "Repaired or replaced product delivered back to your doorstep." },
];

const coveredItems = [
  { icon: "⚡", label: "Manufacturing defects" },
  { icon: "🖥️", label: "Display / screen issues" },
  { icon: "🔋", label: "Battery malfunction" },
  { icon: "🔌", label: "Charging port failure" },
  { icon: "🎛️", label: "Button / switch faults" },
  { icon: "📡", label: "Connectivity issues" },
];

const notCoveredItems = [
  { icon: "💧", label: "Water / liquid damage" },
  { icon: "💥", label: "Physical / accidental damage" },
  { icon: "🔓", label: "Tampered / opened unit" },
  { icon: "🧹", label: "Normal wear & tear" },
  { icon: "⚠️", label: "Unauthorised repairs" },
  { icon: "🗓️", label: "Expired warranty period" },
];

const issueTypes = [
  "Display / Screen Issue",
  "Battery Not Charging",
  "Device Not Turning On",
  "Connectivity Problem (WiFi/Bluetooth)",
  "Audio Issue (Speaker/Mic)",
  "Physical Button / Port Fault",
  "Software / Firmware Issue",
  "Other",
];

// ─── Colors ──────────────────────────────────────────────────────────────────

const C = {
  bg: "#D5D4D3",
  bgDark: "#bebfbe",
  card: "rgba(255,255,255,0.32)",
  primary: "#616D6B",
  dark: "#4a5856",
  darker: "#3a4644",
  text: "#2a2a2a",
  muted: "#6c757d",
  white: "#ffffff",
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
  page: { fontFamily: "'Bricolage Grotesque', sans-serif", backgroundColor: C.bg, color: C.text },

  hero: {
    background: `linear-gradient(145deg, ${C.darker} 0%, ${C.primary} 55%, #7a8a88 100%)`,
    padding: "80px 0 60px",
    position: "relative",
    overflow: "hidden",
  },
  heroGrid: {
    position: "absolute", inset: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: "50px 50px",
  },
  heroCircle: {
    position: "absolute", right: "-60px", top: "-60px",
    width: "360px", height: "360px",
    border: "55px solid rgba(255,255,255,0.04)", borderRadius: "50%",
  },
  heroCircle2: {
    position: "absolute", left: "10%", bottom: "-100px",
    width: "240px", height: "240px",
    border: "35px solid rgba(255,255,255,0.03)", borderRadius: "50%",
  },
  badge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
    color: C.white, borderRadius: "999px", padding: "5px 18px",
    fontSize: "11px", fontWeight: "700", letterSpacing: "2px",
    textTransform: "uppercase", marginBottom: "18px",
  },
  heroTitle: {
    fontSize: "clamp(44px, 8vw, 88px)", fontWeight: "300", color: C.white,
    lineHeight: "0.9", letterSpacing: "-4px", marginBottom: "18px",
  },
  heroSub: {
    fontSize: "15px", color: "rgba(255,255,255,0.7)",
    maxWidth: "440px", lineHeight: "1.7", marginBottom: "28px",
  },

  sectionLabel: { fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: C.primary, marginBottom: "10px" },
  sectionTitle: { fontSize: "clamp(34px, 5vw, 58px)", fontWeight: "300", color: C.dark, letterSpacing: "-3px", lineHeight: "0.92", marginBottom: "14px" },

  // Steps
  stepsSection: { background: C.bgDark, padding: "80px 0" },
  stepCard: {
    background: C.card, borderRadius: "18px", padding: "36px 28px",
    border: "1px solid rgba(97,109,107,0.13)", height: "100%",
    position: "relative", overflow: "hidden",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },
  stepNum: {
    fontSize: "72px", fontWeight: "800",
    color: "rgba(97,109,107,0.08)", position: "absolute",
    top: "10px", right: "20px", lineHeight: 1, letterSpacing: "-3px",
  },
  stepIcon: {
    width: "54px", height: "54px", background: C.primary,
    borderRadius: "14px", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "24px", marginBottom: "18px",
  },
  stepTitle: { fontSize: "18px", fontWeight: "700", color: C.dark, marginBottom: "8px" },
  stepDesc: { fontSize: "13px", color: C.muted, lineHeight: "1.7" },

  // Coverage
  coverSection: { background: C.bg, padding: "80px 0" },
  coverCard: (green) => ({
    background: C.card, borderRadius: "18px", padding: "36px 32px",
    border: `1px solid ${green ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"}`,
    height: "100%",
  }),
  coverTitle: (green) => ({
    fontSize: "20px", fontWeight: "700",
    color: green ? "#166534" : "#991b1b",
    marginBottom: "20px",
    display: "flex", alignItems: "center", gap: "10px",
  }),
  coverItem: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px 0", borderBottom: "1px solid rgba(97,109,107,0.1)",
    fontSize: "14px", color: C.text,
  },

  // Form
  formSection: { background: C.bgDark, padding: "80px 0" },
  formCard: {
    background: C.card, borderRadius: "20px", padding: "48px 40px",
    border: "1px solid rgba(97,109,107,0.15)",
  },
  formLabel: { fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: C.muted, marginBottom: "6px", display: "block" },
  formInput: {
    width: "100%", border: "none", borderBottom: "1.5px solid rgba(97,109,107,0.25)",
    background: "transparent", padding: "11px 0", fontSize: "14px", color: C.text,
    outline: "none", fontFamily: "'Bricolage Grotesque', sans-serif",
    display: "block", marginBottom: "28px",
  },
  formSelect: {
    width: "100%", border: "none", borderBottom: "1.5px solid rgba(97,109,107,0.25)",
    background: "transparent", padding: "11px 0", fontSize: "14px", color: C.text,
    outline: "none", fontFamily: "'Bricolage Grotesque', sans-serif",
    display: "block", marginBottom: "28px", cursor: "pointer", appearance: "none",
  },
  formTextarea: {
    width: "100%", border: "1.5px solid rgba(97,109,107,0.25)",
    background: "transparent", padding: "14px 16px", fontSize: "14px", color: C.text,
    outline: "none", fontFamily: "'Bricolage Grotesque', sans-serif",
    borderRadius: "10px", resize: "vertical", minHeight: "110px",
    display: "block", marginBottom: "28px",
  },
  submitBtn: {
    background: C.primary, color: C.white, border: "none",
    borderRadius: "12px", padding: "14px 44px", fontWeight: "700",
    fontSize: "15px", cursor: "pointer",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    transition: "background 0.2s ease",
  },

  // Check status
  statusSection: { background: C.bg, padding: "60px 0" },
  statusCard: {
    background: C.card, borderRadius: "18px", padding: "40px",
    border: "1px solid rgba(97,109,107,0.14)", maxWidth: "640px", margin: "0 auto",
  },

  // Bottom strip
  strip: { background: C.darker, padding: "56px 0" },
};

// ─── Claim Form ───────────────────────────────────────────────────────────────

function ClaimForm() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", orderId: "",
    productName: "", purchaseDate: "", issueType: "", description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [claimId] = useState("WC-" + Math.floor(Math.random() * 900000 + 100000));

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = () => {
    if (form.name && form.email && form.orderId && form.issueType) setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
      <h3 style={{ color: C.dark, fontWeight: "700", fontSize: "26px", letterSpacing: "-1px", marginBottom: "8px" }}>
        Claim Submitted!
      </h3>
      <p style={{ color: C.muted, fontSize: "15px", marginBottom: "16px" }}>
        Your warranty claim has been registered. Our team will contact you within 24 hours.
      </p>
      <div style={{ display: "inline-block", background: C.primary, color: C.white, borderRadius: "12px", padding: "14px 32px", fontWeight: "700", fontSize: "16px", letterSpacing: "1px" }}>
        Claim ID: {claimId}
      </div>
      <p style={{ color: C.muted, fontSize: "13px", marginTop: "14px" }}>
        Save this ID to track your claim status.
      </p>
    </div>
  );

  return (
    <div style={s.formCard}>
      <div className="row g-3">
        <div className="col-md-6">
          <label style={s.formLabel}>Full Name *</label>
          <input name="name" value={form.name} onChange={handle} placeholder="e.g. Rahul Sharma" style={s.formInput} />
        </div>
        <div className="col-md-6">
          <label style={s.formLabel}>Email Address *</label>
          <input name="email" value={form.email} onChange={handle} placeholder="you@email.com" style={s.formInput} />
        </div>
        <div className="col-md-6">
          <label style={s.formLabel}>Phone Number</label>
          <input name="phone" value={form.phone} onChange={handle} placeholder="+91 XXXXX XXXXX" style={s.formInput} />
        </div>
        <div className="col-md-6">
          <label style={s.formLabel}>Order ID *</label>
          <input name="orderId" value={form.orderId} onChange={handle} placeholder="MLX-XXXXXXXX" style={s.formInput} />
        </div>
        <div className="col-md-6">
          <label style={s.formLabel}>Product Name</label>
          <input name="productName" value={form.productName} onChange={handle} placeholder="e.g. Miltronix 55' QLED TV" style={s.formInput} />
        </div>
        <div className="col-md-6">
          <label style={s.formLabel}>Date of Purchase</label>
          <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handle}
            style={{ ...s.formInput, colorScheme: "light" }} />
        </div>
        <div className="col-12">
          <label style={s.formLabel}>Issue Type *</label>
          <select name="issueType" value={form.issueType} onChange={handle} style={s.formSelect}>
            <option value="">Select the issue</option>
            {issueTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label style={s.formLabel}>Describe the Issue</label>
          <textarea name="description" value={form.description} onChange={handle}
            placeholder="Please describe the problem in detail. When did it start? Any error messages?"
            style={s.formTextarea} />
        </div>

        {/* Upload hint */}
        <div className="col-12">
          <div style={{ background: "rgba(97,109,107,0.07)", borderRadius: "10px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "22px" }}>📎</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: C.dark }}>Attach Photos / Invoice (optional)</div>
              <div style={{ fontSize: "12px", color: C.muted }}>Upload images of the defect and your purchase invoice for faster processing.</div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <button
            style={s.submitBtn}
            onClick={submit}
            onMouseEnter={e => e.currentTarget.style.background = C.darker}
            onMouseLeave={e => e.currentTarget.style.background = C.primary}
          >
            Submit Warranty Claim →
          </button>
          <p style={{ fontSize: "12px", color: C.muted, marginTop: "12px" }}>
            * Fields marked are required. Our team will verify your claim and contact you within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Check Status ─────────────────────────────────────────────────────────────

function CheckStatus() {
  const [claimId, setClaimId] = useState("");
  const [result, setResult] = useState(null);

  const check = () => {
    if (claimId.trim()) {
      setResult({
        id: claimId.trim(),
        status: "Under Review",
        step: 2,
        updated: "Today, 10:30 AM",
      });
    }
  };

  const statusSteps = ["Submitted", "Under Review", "In Repair", "Dispatched", "Resolved"];

  return (
    <div style={s.statusCard}>
      <p style={s.sectionLabel}>Track Your Claim</p>
      <h3 style={{ ...s.sectionTitle, fontSize: "clamp(26px, 4vw, 40px)", marginBottom: "20px" }}>
        Check <span style={{ fontStyle: "italic" }}>Claim Status</span>
      </h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <input
          placeholder="Enter Claim ID (e.g. WC-123456)"
          value={claimId}
          onChange={e => setClaimId(e.target.value)}
          style={{
            flex: 1, border: "1.5px solid rgba(97,109,107,0.25)", borderRadius: "10px",
            padding: "12px 16px", fontSize: "14px", background: "transparent",
            outline: "none", fontFamily: "'Bricolage Grotesque', sans-serif", color: C.text,
          }}
        />
        <button
          onClick={check}
          style={{
            background: C.primary, color: C.white, border: "none",
            borderRadius: "10px", padding: "12px 24px", fontWeight: "700",
            fontSize: "14px", cursor: "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          Track
        </button>
      </div>

      {result && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", color: C.muted }}>Claim ID: <strong style={{ color: C.dark }}>{result.id}</strong></div>
            <div style={{ fontSize: "12px", background: C.primary, color: C.white, borderRadius: "999px", padding: "3px 12px", fontWeight: "700" }}>
              {result.status}
            </div>
          </div>
          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
            {statusSteps.map((step, i) => (
              <React.Fragment key={step}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: i < statusSteps.length - 1 ? "none" : 1 }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: i <= result.step ? C.primary : "rgba(97,109,107,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: "700",
                    color: i <= result.step ? C.white : C.muted,
                  }}>
                    {i < result.step ? "✓" : i + 1}
                  </div>
                  <div style={{ fontSize: "10px", color: i <= result.step ? C.primary : C.muted, marginTop: "6px", textAlign: "center", fontWeight: "600", whiteSpace: "nowrap" }}>
                    {step}
                  </div>
                </div>
                {i < statusSteps.length - 1 && (
                  <div style={{ flex: 1, height: "2px", background: i < result.step ? C.primary : "rgba(97,109,107,0.15)", margin: "0 4px", marginBottom: "20px" }} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div style={{ marginTop: "16px", fontSize: "12px", color: C.muted, textAlign: "right" }}>
            Last updated: {result.updated}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WarrantyClaimPage() {
  return (
    <div style={s.page}>

      {/* Fixed Banner */}
      <div className="fixed-top">
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
         <a href="/">
  <img src={logoBanner} alt="Miltronix Logo" className="img-fluid miltronix-logo" />
</a>
        </section>
      </div>

      <main className="main-content-padding">

        {/* Breadcrumb */}
        <section style={{ backgroundColor: "#bebfbe", padding: "20px 0" }}>
          <div className="container">
            <p style={{ fontSize: "14px", color: "#6c6c6c", marginBottom: "4px" }} className="hv">
              Home Page &nbsp;›&nbsp; <strong style={{ color: "#4a5856" }}>Warranty Claim</strong>
            </p>
          </div>
        </section>

        {/* ── HERO ── */}
        <section style={s.hero}>
          <div style={s.heroGrid} />
          <div style={s.heroCircle} />
          <div style={s.heroCircle2} />
          <div className="container position-relative">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div style={s.badge}><span>🛡️</span> Warranty Claim</div>
                <h1 style={s.heroTitle}>
                  <span style={{ display: "block" }}>We've got</span>
                  <span style={{ display: "block", fontStyle: "italic", fontWeight: "400" }}>you covered</span>
                </h1>
                <p style={s.heroSub}>
                  All Miltronix products come with a manufacturer warranty. Raise your claim online in minutes — no service centre visit needed.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {["1-Year Standard Warranty", "3-Year on Premium Products", "Doorstep Pickup", "24hr Response"].map(tag => (
                    <div key={tag} style={{
                      background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)",
                      color: C.white, borderRadius: "999px", padding: "7px 16px", fontSize: "12px", fontWeight: "600",
                    }}>{tag}</div>
                  ))}
                </div>
              </div>

              {/* Right stat boxes */}
              <div className="col-lg-6 d-none d-lg-flex justify-content-end">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxWidth: "320px" }}>
                  {[
                    { n: "1–3 Yrs", l: "Warranty Period" },
                    { n: "24 hrs", l: "Claim Response" },
                    { n: "200+", l: "Service Centres" },
                    { n: "98%", l: "Claims Resolved" },
                  ].map(item => (
                    <div key={item.l} style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "14px", padding: "18px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: "24px", fontWeight: "800", color: C.white, letterSpacing: "-1px", lineHeight: 1 }}>{item.n}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginTop: "5px", textTransform: "uppercase", letterSpacing: "1px" }}>{item.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={s.stepsSection}>
          <div className="container">
            <div className="text-center mb-5">
              <p style={s.sectionLabel}>Simple Process</p>
              <h2 style={s.sectionTitle}>
                How it <span style={{ fontStyle: "italic" }}>works</span>
              </h2>
              <p style={{ color: C.muted, fontSize: "15px", maxWidth: "380px", margin: "0 auto" }}>
                Four easy steps from claim to resolution.
              </p>
            </div>
            <div className="row g-4">
              {steps.map((step, i) => (
                <div className="col-6 col-md-3" key={step.number}>
                  <div
                    style={s.stepCard}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(97,109,107,0.14)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={s.stepNum}>{step.number}</div>
                    <div style={s.stepIcon}>{step.icon}</div>
                    <div style={s.stepTitle}>{step.title}</div>
                    <div style={s.stepDesc}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT'S COVERED ── */}
        <section style={s.coverSection}>
          <div className="container">
            <div className="text-center mb-5">
              <p style={s.sectionLabel}>Warranty Coverage</p>
              <h2 style={s.sectionTitle}>
                What's <span style={{ fontStyle: "italic" }}>covered?</span>
              </h2>
            </div>
            <div className="row g-4">
              {/* Covered */}
              <div className="col-md-6">
                <div style={s.coverCard(true)}>
                  <div style={s.coverTitle(true)}>✅ Covered Under Warranty</div>
                  {coveredItems.map(item => (
                    <div key={item.label} style={s.coverItem}>
                      <span style={{ fontSize: "18px" }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Not Covered */}
              <div className="col-md-6">
                <div style={s.coverCard(false)}>
                  <div style={s.coverTitle(false)}>❌ Not Covered</div>
                  {notCoveredItems.map(item => (
                    <div key={item.label} style={s.coverItem}>
                      <span style={{ fontSize: "18px" }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MiltronixCare upsell */}
            <div style={{ marginTop: "32px", background: `linear-gradient(135deg, ${C.dark}, ${C.primary})`, borderRadius: "18px", padding: "32px 36px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>Upgrade Your Protection</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: C.white, marginBottom: "6px" }}>MiltronixCare — Extended Warranty</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>Get up to 3 years of coverage including accidental damage protection.</div>
              </div>
              <button style={{
                background: C.white, color: C.dark, border: "none",
                borderRadius: "12px", padding: "12px 28px", fontWeight: "700",
                fontSize: "14px", cursor: "pointer", flexShrink: 0,
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}>
                Learn More →
              </button>
            </div>
          </div>
        </section>

        {/* ── CLAIM FORM ── */}
        <section style={s.formSection}>
          <div className="container">
            <div className="row g-5 align-items-start">
              <div className="col-lg-4">
                <div style={{ position: "sticky", top: "120px" }}>
                  <p style={s.sectionLabel}>Submit a Claim</p>
                  <h2 style={s.sectionTitle}>
                    Raise your <span style={{ fontStyle: "italic" }}>claim</span>
                  </h2>
                  <p style={{ color: C.muted, fontSize: "14px", lineHeight: "1.7", marginBottom: "28px" }}>
                    Fill in the form with your order details and issue description. We'll get back to you within 24 hours.
                  </p>
                  {[
                    { icon: "🔒", text: "Secure & encrypted submission" },
                    { icon: "⏱️", text: "24-hour response guarantee" },
                    { icon: "🚪", text: "Doorstep pickup available" },
                    { icon: "🎟️", text: "Unique claim ID for tracking" },
                  ].map(item => (
                    <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <div style={{ width: "36px", height: "36px", background: C.primary, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <span style={{ fontSize: "14px", color: C.text, fontWeight: "500" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-8">
                <ClaimForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── CHECK STATUS ── */}
        <section style={s.statusSection}>
          <div className="container">
            <CheckStatus />
          </div>
        </section>

        {/* ── BOTTOM STRIP ── */}
        <section style={s.strip}>
          <div className="container text-center">
            <h2 style={{ fontSize: "clamp(28px, 5vw, 50px)", fontWeight: "300", color: C.white, letterSpacing: "-2.5px", marginBottom: "8px" }}>
              Need help with your <em>claim?</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "28px" }}>
              Our warranty team is available Mon–Sat · 9 AM – 7 PM
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button style={{ background: C.white, color: C.dark, border: "none", borderRadius: "999px", padding: "12px 32px", fontWeight: "700", fontSize: "14px", cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                💬 Live Chat
              </button>
              <button style={{ background: "rgba(255,255,255,0.1)", color: C.white, border: "1px solid rgba(255,255,255,0.25)", borderRadius: "999px", padding: "12px 32px", fontWeight: "700", fontSize: "14px", cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                📞 1800-MILTRONIX
              </button>
            </div>
          </div>
        </section>

        <SubscriptionSection />
      </main>

      <Footer />
    </div>
  );
}
