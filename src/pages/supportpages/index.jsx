import React, { useState } from "react";

// --- Reusable Components ---
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";

import logoBanner from "../../assets/MILTRONIX-APP-DESIGN-3.png";
import { createServiceRequestApi } from "../../api/api"; 

// ─── Data ────────────────────────────────────────────────────────────────────

const faqs = [
  {
    category: "Orders & Shipping",
    icon: "📦",
    items: [
      {
        q: "How do I track my order?",
        a: 'Once your order is dispatched, you will receive a tracking link via email and SMS. You can also track your order from the "My Orders" section in your account dashboard.',
      },
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available at checkout for most pin codes. Remote areas may take up to 7 days.",
      },
      {
        q: "Can I change my delivery address after placing an order?",
        a: "You can change the delivery address within 2 hours of placing the order by contacting our support team. After dispatch, address changes are not possible.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! Orders above ₹999 qualify for free standard shipping. Express shipping charges apply regardless of order value.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: "🔄",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 10-day return window from the date of delivery for most products. Items must be unused, in original packaging, and accompanied by the original invoice.",
      },
      {
        q: "How do I initiate a return?",
        a: 'Go to "My Orders" → select the item → click "Request Return". Our team will schedule a pickup within 48 hours. Refunds are processed within 5–7 business days after pickup.',
      },
      {
        q: "Which products are non-returnable?",
        a: 'Consumables, software licenses, earphones (for hygiene reasons), and items marked "Non-Returnable" on the product page cannot be returned.',
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are credited back to the original payment method within 5–7 business days after we receive the returned item. UPI/wallet refunds may arrive sooner.",
      },
    ],
  },
  {
    category: "Product & Warranty",
    icon: "🛡️",
    items: [
      {
        q: "Are all Miltronix products covered by warranty?",
        a: "Yes. All products come with a minimum 1-year manufacturer warranty. Premium products carry up to 3 years. Warranty cards are included in the box.",
      },
      {
        q: "How do I claim warranty?",
        a: "You can claim warranty by visiting our nearest service center with the product, original invoice, and warranty card. Alternatively, raise a ticket on this page and we will arrange doorstep service for eligible products.",
      },
      {
        q: "Does the warranty cover accidental damage?",
        a: "Standard warranty covers manufacturing defects only. For accidental damage protection, consider purchasing our MiltronixCare extended plan available at checkout.",
      },
    ],
  },
  {
    category: "Payments & Offers",
    icon: "💳",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept UPI, Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking, EMI (No-Cost EMI on select cards), and Pay Later options like LazyPay and Simpl.",
      },
      {
        q: "Why was my payment declined?",
        a: "Payments can fail due to incorrect card details, insufficient funds, bank 2FA issues, or network errors. Please retry or use a different payment method. Your money is safe and will be refunded if debited.",
      },
      {
        q: "How do I apply a coupon code?",
        a: 'On the Cart or Checkout page, you will see a "Have a Coupon?" field. Enter your code and click Apply. Discounts are reflected instantly in the order summary.',
      },
    ],
  },
];

const supportChannels = [
  {
    icon: "💬",
    title: "Live Chat",
    desc: "Instant answers from our support agents",
    badge: "Online Now",
    badgeColor: "#22c55e",
    action: "Start Chat",
    available: "Mon–Sat, 9 AM – 9 PM",
  },
  {
    icon: "📞",
    title: "Call Us",
    desc: "Speak directly with a support specialist",
    badge: "Avg wait < 2 min",
    badgeColor: "#3b82f6",
    action: "1800-MILTRONIX",
    available: "Mon–Sat, 9 AM – 7 PM",
  },
  {
    icon: "✉️",
    title: "Email Support",
    desc: "Detailed help for complex queries",
    badge: "Replies in 4–6 hrs",
    badgeColor: "#f59e0b",
    action: "Send Email",
    available: "support@miltronix.com",
  },
  {
    icon: "🏪",
    title: "Service Centre",
    desc: "In-person repair & warranty support",
    badge: "200+ Centres",
    badgeColor: "#616D6B",
    action: "Find Nearest",
    available: "Mon–Sat, 10 AM – 6 PM",
  },
];

const quickLinks = [
  { icon: "📦", label: "Track My Order" },
  { icon: "🔄", label: "Return / Exchange" },
  { icon: "🛡️", label: "Warranty Claim" },
  { icon: "🧾", label: "Download Invoice" },
  { icon: "💳", label: "Payment Issue" },
  { icon: "⚙️", label: "Product Setup Help" },
];

// Category → backend service type mapping
const CATEGORY_TYPE_MAP = {
  "Order & Shipping": "relocation",
  "Returns & Refunds": "repair",
  "Product & Warranty": "warranty",
  "Payment Issue": "demo",
  "Account Help": "demo",
  Other: "repair",
};

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// ─── Styles ──────────────────────────────────────────────────────────────────

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

const s = {
  page: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    backgroundColor: C.bg,
    color: C.text,
    minHeight: "100vh",
  },

  hero: {
    background: `linear-gradient(140deg, ${C.darker} 0%, ${C.primary} 55%, #7a8a88 100%)`,
    padding: "90px 0 70px",
    position: "relative",
    overflow: "hidden",
  },
  heroGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: "50px 50px",
  },
  heroDots: {
    position: "absolute",
    right: "10%",
    top: "20%",
    width: "220px",
    height: "220px",
    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)`,
    backgroundSize: "22px 22px",
    borderRadius: "50%",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: C.white,
    borderRadius: "999px",
    padding: "5px 16px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "20px",
  },
  heroTitle: {
    fontSize: "clamp(44px, 8vw, 88px)",
    fontWeight: "300",
    color: C.white,
    lineHeight: "0.9",
    letterSpacing: "-4px",
    marginBottom: "20px",
  },
  heroSub: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.7)",
    maxWidth: "460px",
    lineHeight: "1.7",
    marginBottom: "36px",
  },

  searchWrap: {
    display: "flex",
    alignItems: "center",
    background: C.white,
    borderRadius: "14px",
    padding: "6px 6px 6px 20px",
    maxWidth: "560px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "15px",
    background: "transparent",
    color: C.text,
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },
  searchBtn: {
    background: C.primary,
    color: C.white,
    border: "none",
    borderRadius: "10px",
    padding: "10px 22px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },

  quickSection: { background: C.dark, padding: "32px 0" },
  quickChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: C.white,
    borderRadius: "999px",
    padding: "10px 20px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  },

  channelSection: { background: C.bg, padding: "80px 0 60px" },
  channelCard: {
    background: C.card,
    borderRadius: "18px",
    padding: "32px 28px",
    border: "1px solid rgba(97,109,107,0.15)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  channelIcon: {
    fontSize: "32px",
    width: "62px",
    height: "62px",
    background: C.primary,
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "18px",
  },
  channelTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: C.dark,
    marginBottom: "6px",
  },
  channelDesc: {
    fontSize: "14px",
    color: C.muted,
    marginBottom: "16px",
    flex: 1,
  },
  channelBtn: {
    background: C.primary,
    color: C.white,
    border: "none",
    borderRadius: "10px",
    padding: "11px 0",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    width: "100%",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    transition: "background 0.2s ease",
  },

  sectionLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: C.primary,
    marginBottom: "10px",
  },
  sectionTitle: {
    fontSize: "clamp(36px, 5vw, 60px)",
    fontWeight: "300",
    color: C.dark,
    letterSpacing: "-3px",
    lineHeight: "0.92",
    marginBottom: "16px",
  },

  faqSection: { background: C.bgDark, padding: "80px 0" },
  faqCatBtn: (active) => ({
    padding: "9px 22px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
    border: `2px solid ${active ? C.primary : "rgba(97,109,107,0.3)"}`,
    background: active ? C.primary : "transparent",
    color: active ? C.white : C.dark,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Bricolage Grotesque', sans-serif",
  }),
  faqItem: {
    background: C.card,
    borderRadius: "14px",
    marginBottom: "12px",
    border: "1px solid rgba(97,109,107,0.12)",
    overflow: "hidden",
  },
  faqQ: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    color: C.dark,
  },
  faqA: {
    padding: "0 24px 18px",
    fontSize: "14px",
    color: C.muted,
    lineHeight: "1.75",
  },

  contactSection: { background: C.bg, padding: "80px 0" },
  formCard: {
    background: C.card,
    borderRadius: "20px",
    padding: "48px 40px",
    border: "1px solid rgba(97,109,107,0.15)",
  },
  formLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: C.muted,
    marginBottom: "6px",
    display: "block",
  },
  formInput: {
    width: "100%",
    border: "none",
    borderBottom: `1.5px solid rgba(97,109,107,0.3)`,
    background: "transparent",
    padding: "12px 0",
    fontSize: "14px",
    color: C.text,
    outline: "none",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    borderRadius: "0",
    marginBottom: "28px",
    display: "block",
  },
  formSelect: {
    width: "100%",
    border: "none",
    borderBottom: `1.5px solid rgba(97,109,107,0.3)`,
    background: "transparent",
    padding: "12px 0",
    fontSize: "14px",
    color: C.text,
    outline: "none",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    marginBottom: "28px",
    display: "block",
    cursor: "pointer",
    appearance: "none",
  },
  formTextarea: {
    width: "100%",
    border: "1.5px solid rgba(97,109,107,0.3)",
    background: "transparent",
    padding: "14px 16px",
    fontSize: "14px",
    color: C.text,
    outline: "none",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    borderRadius: "10px",
    resize: "vertical",
    minHeight: "110px",
    display: "block",
    marginBottom: "28px",
  },
  sectionDivider: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: C.primary,
    borderBottom: `1px solid rgba(97,109,107,0.2)`,
    paddingBottom: "8px",
    marginBottom: "24px",
    marginTop: "8px",
  },
  submitBtn: {
    background: C.primary,
    color: C.white,
    border: "none",
    borderRadius: "12px",
    padding: "14px 40px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    transition: "background 0.2s ease",
  },

  bottomBanner: { background: C.darker, padding: "60px 0" },
};

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FaqAccordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={s.faqItem}>
          <div style={s.faqQ} onClick={() => setOpen(open === i ? null : i)}>
            <span>{item.q}</span>
            <span
              style={{
                fontSize: "20px",
                color: C.primary,
                lineHeight: 1,
                marginLeft: "16px",
                flexShrink: 0,
              }}
            >
              {open === i ? "−" : "+"}
            </span>
          </div>
          {open === i && <div style={s.faqA}>{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Contact / Support Ticket Form ───────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({
    productname: "",
    category: "",
    phone: "",
    message: "",
    // address
    street: "",
    city: "",
    state: "",
    pincode: "",
    // payment
    paymentMethod: "cash",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [ticketId] = useState(
    "MLX-" + (Math.floor(Math.random() * 90000) + 10000),
  );

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.productname.trim()) return "Product / subject is required.";
    if (!form.category) return "Please select an issue category.";
    if (!form.message.trim()) return "Please describe your issue.";
    if (form.message.trim().length < 10)
      return "Description must be at least 10 characters.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!/^\+?[0-9]{10,15}$/.test(form.phone.trim()))
      return "Invalid phone number (10–15 digits).";
    if (!form.street.trim()) return "Street address is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.state) return "Please select a state.";
    if (!/^\d{6}$/.test(form.pincode.trim()))
      return "Pincode must be exactly 6 digits.";
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createServiceRequestApi({
        productname: form.productname.trim(),
        type: CATEGORY_TYPE_MAP[form.category] || "repair",
        description: `Category: ${form.category}. ${form.message.trim()}`,
        phone: form.phone.trim(),
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state,
          pincode: form.pincode.trim(),
        },
        paymentdetails: {
          method: form.paymentMethod,
          amount: 0,
          status: "pending",
        },
      });

      setSent(true);
    } catch (e) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent)
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
        <h3
          style={{
            color: C.dark,
            fontWeight: "700",
            fontSize: "24px",
            letterSpacing: "-1px",
          }}
        >
          Ticket Submitted!
        </h3>
        <p style={{ color: C.muted, fontSize: "15px", marginTop: "8px" }}>
          We've received your request and will get back to you within 4–6 hours.
        </p>
        <p
          style={{
            color: C.primary,
            fontWeight: "700",
            fontSize: "13px",
            marginTop: "12px",
          }}
        >
          Ticket #{ticketId}
        </p>
      </div>
    );

  return (
    <div style={s.formCard}>
      <div className="row g-3">
        {/* ── ISSUE DETAILS ── */}
        <div className="col-12">
          <div style={s.sectionDivider}>🎫 Issue Details</div>
        </div>

        <div className="col-md-6">
          <label style={s.formLabel}>Product / Subject *</label>
          <input
            name="productname"
            value={form.productname}
            onChange={handle}
            placeholder="e.g. Miltronix 55' QLED TV"
            style={s.formInput}
          />
        </div>

        <div className="col-md-6">
          <label style={s.formLabel}>Issue Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handle}
            style={s.formSelect}
          >
            <option value="">Select a category</option>
            <option>Order & Shipping</option>
            <option>Returns & Refunds</option>
            <option>Product & Warranty</option>
            <option>Payment Issue</option>
            <option>Account Help</option>
            <option>Other</option>
          </select>
        </div>

        <div className="col-12">
          <label style={s.formLabel}>
            Describe Your Issue * (min. 10 characters)
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handle}
            placeholder="Please describe your issue in detail..."
            style={s.formTextarea}
          />
        </div>

        {/* ── CONTACT ── */}
        <div className="col-12">
          <div style={s.sectionDivider}>📞 Contact Details</div>
        </div>

        <div className="col-md-6">
          <label style={s.formLabel}>Phone Number *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handle}
            placeholder="+91 XXXXX XXXXX"
            style={s.formInput}
          />
        </div>

        {/* ── ADDRESS ── */}
        <div className="col-12">
          <div style={s.sectionDivider}>🏠 Address</div>
        </div>

        <div className="col-12">
          <label style={s.formLabel}>Street *</label>
          <input
            name="street"
            value={form.street}
            onChange={handle}
            placeholder="House No., Street, Locality"
            style={s.formInput}
          />
        </div>

        <div className="col-md-4">
          <label style={s.formLabel}>City *</label>
          <input
            name="city"
            value={form.city}
            onChange={handle}
            placeholder="e.g. Mumbai"
            style={s.formInput}
          />
        </div>

        <div className="col-md-4">
          <label style={s.formLabel}>State *</label>
          <select
            name="state"
            value={form.state}
            onChange={handle}
            style={s.formSelect}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label style={s.formLabel}>Pincode * (6 digits)</label>
          <input
            name="pincode"
            value={form.pincode}
            onChange={handle}
            placeholder="e.g. 400001"
            maxLength={6}
            style={s.formInput}
          />
        </div>

        {/* ── PAYMENT ── */}
        <div className="col-12">
          <div style={s.sectionDivider}>💳 Payment Preference</div>
        </div>

        <div className="col-md-6">
          <label style={s.formLabel}>Payment Method *</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handle}
            style={s.formSelect}
          >
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="col-12">
            <div
              style={{
                color: "#991b1b",
                fontSize: "13px",
                background: "rgba(239,68,68,0.08)",
                padding: "10px 14px",
                borderRadius: "8px",
              }}
            >
              ⚠️ {error}
            </div>
          </div>
        )}

        {/* ── SUBMIT ── */}
        <div className="col-12" style={{ marginTop: "8px" }}>
          <button
            style={{
              ...s.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={submit}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = C.darker;
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = C.primary;
            }}
          >
            {loading ? "Submitting..." : "Submit Ticket →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const [faqCat, setFaqCat] = useState(0);
  const [searchVal, setSearchVal] = useState("");

  return (
    <div style={s.page}>
      <div className="fixed-top">
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
          <a href="/">
            <img
              src={logoBanner}
              alt="Miltronix Logo"
              className="img-fluid miltronix-logo"
            />
          </a>
        </section>
      </div>

      <main className="main-content-padding">
        {/* Breadcrumb */}
        <section style={{ backgroundColor: "#bebfbe", padding: "20px 0" }}>
          <div className="container">
            <p
              style={{
                fontSize: "14px",
                color: "#6c6c6c",
                marginBottom: "4px",
              }}
              className="hv"
            >
              Home Page &nbsp;›&nbsp;{" "}
              <strong style={{ color: "#4a5856" }}>Support</strong>
            </p>
          </div>
        </section>

        {/* ── HERO ── */}
        <section style={s.hero}>
          <div style={s.heroGrid} />
          <div style={s.heroDots} />
          <div className="container position-relative">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div style={s.badge}>
                  <span>●</span> Support Centre
                </div>
                <h1 style={s.heroTitle}>
                  <span style={{ display: "block" }}>How can we</span>
                  <span
                    style={{
                      display: "block",
                      fontStyle: "italic",
                      fontWeight: "400",
                    }}
                  >
                    help you?
                  </span>
                </h1>
                <p style={s.heroSub}>
                  Search our knowledge base, raise a ticket, or connect with a
                  support agent — we're here 6 days a week.
                </p>
                <div style={s.searchWrap}>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "8px",
                      opacity: 0.5,
                    }}
                  >
                    🔍
                  </span>
                  <input
                    style={s.searchInput}
                    placeholder="Search for help (e.g. 'track order', 'return policy')..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                  />
                  <button style={s.searchBtn}>Search</button>
                </div>
              </div>
              <div className="col-lg-4 d-none d-lg-block">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    paddingLeft: "40px",
                  }}
                >
                  {[
                    { n: "< 2 min", l: "Avg Chat Response" },
                    { n: "98%", l: "Customer Satisfaction" },
                    { n: "200+", l: "Service Centres" },
                  ].map((item) => (
                    <div
                      key={item.l}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "14px",
                        padding: "18px 24px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: "800",
                          color: C.white,
                          letterSpacing: "-1.5px",
                          lineHeight: 1,
                        }}
                      >
                        {item.n}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.6)",
                          marginTop: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        {item.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICK LINKS ── */}
        <section style={s.quickSection}>
          <div className="container">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginRight: "8px",
                }}
              >
                Quick:
              </span>
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  style={s.quickChip}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {link.icon} {link.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── SUPPORT CHANNELS ── */}
        <section style={s.channelSection}>
          <div className="container">
            <div className="text-center mb-5">
              <p style={s.sectionLabel}>Get In Touch</p>
              <h2 style={s.sectionTitle}>
                Choose how to{" "}
                <span style={{ fontStyle: "italic" }}>reach us</span>
              </h2>
              <p
                style={{
                  color: C.muted,
                  fontSize: "15px",
                  maxWidth: "440px",
                  margin: "0 auto",
                }}
              >
                Multiple channels, one goal — resolving your issue as fast as
                possible.
              </p>
            </div>
            <div className="row g-4">
              {supportChannels.map((ch) => (
                <div className="col-6 col-lg-3" key={ch.title}>
                  <div
                    style={s.channelCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 40px rgba(97,109,107,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={s.channelIcon}>{ch.icon}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "6px",
                      }}
                    >
                      <div style={s.channelTitle}>{ch.title}</div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          background: ch.badgeColor,
                          color: "#fff",
                          borderRadius: "999px",
                          padding: "2px 10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ch.badge}
                      </span>
                    </div>
                    <p style={s.channelDesc}>{ch.desc}</p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: C.muted,
                        marginBottom: "16px",
                      }}
                    >
                      🕐 {ch.available}
                    </p>
                    <button
                      style={s.channelBtn}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = C.darker)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = C.primary)
                      }
                    >
                      {ch.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={s.faqSection}>
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-3 mb-4 mb-lg-0">
                <div style={{ position: "sticky", top: "100px" }}>
                  <p style={s.sectionLabel}>Knowledge Base</p>
                  <h2
                    style={{
                      ...s.sectionTitle,
                      fontSize: "clamp(30px, 4vw, 48px)",
                    }}
                  >
                    Frequently
                    <br />
                    <span style={{ fontStyle: "italic" }}>Asked</span>
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginTop: "24px",
                    }}
                  >
                    {faqs.map((cat, i) => (
                      <button
                        key={cat.category}
                        style={s.faqCatBtn(faqCat === i)}
                        onClick={() => setFaqCat(i)}
                      >
                        {cat.icon} {cat.category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-lg-9">
                <div
                  style={{
                    background: "rgba(97,109,107,0.07)",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{faqs[faqCat].icon}</span>
                  <span
                    style={{
                      fontWeight: "700",
                      color: C.dark,
                      fontSize: "16px",
                    }}
                  >
                    {faqs[faqCat].category}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "12px",
                      color: C.muted,
                    }}
                  >
                    {faqs[faqCat].items.length} articles
                  </span>
                </div>
                <FaqAccordion items={faqs[faqCat].items} />
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT / TICKET FORM ── */}
        <section style={s.contactSection}>
          <div className="container">
            <div className="row align-items-start mb-5">
              <div className="col-lg-4">
                <div style={{ position: "sticky", top: "120px" }}>
                  <p style={s.sectionLabel}>Still Need Help?</p>
                  <h2 style={s.sectionTitle}>
                    Raise a <span style={{ fontStyle: "italic" }}>Support</span>
                    <br />
                    Ticket
                  </h2>
                  <p
                    style={{
                      color: C.muted,
                      fontSize: "15px",
                      lineHeight: "1.7",
                      maxWidth: "380px",
                      marginBottom: "28px",
                    }}
                  >
                    Fill in the form and our team will respond within 4–6 hours
                    during business hours. For urgent issues, use Live Chat.
                  </p>
                  {[
                    { icon: "⏱️", text: "Response within 4–6 hours" },
                    { icon: "🔒", text: "Your data is safe & encrypted" },
                    { icon: "🎟️", text: "Dedicated ticket tracking number" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          background: C.primary,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: C.text,
                          fontWeight: "500",
                        }}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-8 mt-4 mt-lg-0">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── BOTTOM BANNER ── */}
        <section style={s.bottomBanner}>
          <div className="container text-center">
            <p style={{ ...s.sectionLabel, color: "rgba(255,255,255,0.4)" }}>
              Miltronix Support
            </p>
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 54px)",
                fontWeight: "300",
                color: C.white,
                letterSpacing: "-2.5px",
                marginBottom: "10px",
              }}
            >
              We're with you, <em>always</em>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "15px",
                marginBottom: "32px",
              }}
            >
              1800-MILTRONIX &nbsp;·&nbsp; support@miltronix.com &nbsp;·&nbsp;
              Mon–Sat 9 AM–9 PM
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                style={{
                  ...s.searchBtn,
                  borderRadius: "12px",
                  padding: "12px 32px",
                  background: C.white,
                  color: C.dark,
                }}
              >
                💬 Start Live Chat
              </button>
              <button
                style={{
                  ...s.searchBtn,
                  borderRadius: "12px",
                  padding: "12px 32px",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                📦 Track My Order
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
