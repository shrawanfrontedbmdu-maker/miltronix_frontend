import React, { useState } from "react";

// --- Reusable Components ---
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";

const logoBanner = "src/assets/MILTRONIX APP DESIGN 3.png";

// ─── Data ────────────────────────────────────────────────────────────────────

const infoCards = [
  {
    icon: "🏢",
    title: "Corporate Office",
    lines: ["Mitronix Electronics Pvt. Ltd.", "123 Business Park,", "New Delhi – 110001, India"],
  },
  {
    icon: "📞",
    title: "Phone & Email",
    lines: ["+91 98765 43210", "support@mitronix.com", "press@mitronix.com"],
  },
  {
    icon: "🕐",
    title: "Business Hours",
    lines: ["Mon – Fri: 9:30 AM – 6:30 PM", "Saturday: 10:00 AM – 4:00 PM", "Sunday: Closed"],
  },
  {
    icon: "🌐",
    title: "Follow Us",
    lines: ["Instagram: @miltronix", "Twitter: @miltronix", "LinkedIn: Miltronix HQ"],
  },
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
  page: { fontFamily: "'Bricolage Grotesque', sans-serif", backgroundColor: C.bg, color: C.text },

  // Hero
  hero: {
    background: `linear-gradient(140deg, ${C.darker} 0%, ${C.primary} 55%, #7a8a88 100%)`,
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
    width: "340px", height: "340px",
    border: "50px solid rgba(255,255,255,0.04)",
    borderRadius: "50%",
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
    maxWidth: "420px", lineHeight: "1.7",
  },

  // Info cards
  infoSection: { background: C.bg, padding: "70px 0 50px" },
  infoCard: {
    background: C.card, borderRadius: "18px", padding: "32px 28px",
    border: "1px solid rgba(97,109,107,0.14)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    height: "100%",
  },
  infoIcon: {
    width: "54px", height: "54px", background: C.primary,
    borderRadius: "14px", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "24px", marginBottom: "18px",
  },
  infoTitle: { fontSize: "16px", fontWeight: "700", color: C.dark, marginBottom: "12px" },
  infoLine: { fontSize: "14px", color: C.muted, lineHeight: "1.9" },

  // Form section
  formSection: { background: C.bgDark, padding: "80px 0" },
  sectionLabel: { fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: C.primary, marginBottom: "10px" },
  sectionTitle: { fontSize: "clamp(34px, 5vw, 58px)", fontWeight: "300", color: C.dark, letterSpacing: "-3px", lineHeight: "0.92", marginBottom: "14px" },

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
  formTextarea: {
    width: "100%", border: "1.5px solid rgba(97,109,107,0.25)",
    background: "transparent", padding: "14px 16px", fontSize: "14px", color: C.text,
    outline: "none", fontFamily: "'Bricolage Grotesque', sans-serif",
    borderRadius: "10px", resize: "vertical", minHeight: "120px",
    display: "block", marginBottom: "28px",
  },
  submitBtn: {
    background: C.primary, color: C.white, border: "none",
    borderRadius: "12px", padding: "14px 40px", fontWeight: "700",
    fontSize: "15px", cursor: "pointer",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    transition: "background 0.2s ease",
  },

  // Map placeholder
  mapBox: {
    background: `linear-gradient(135deg, ${C.darker}, ${C.primary})`,
    borderRadius: "18px", height: "100%", minHeight: "360px",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "40px", textAlign: "center",
    border: "1px solid rgba(97,109,107,0.2)",
    position: "relative", overflow: "hidden",
  },
  mapGrid: {
    position: "absolute", inset: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
    backgroundSize: "30px 30px",
  },

  // Bottom strip
  strip: { background: C.darker, padding: "52px 0" },
};

// ─── Contact Form Component ───────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = () => { if (form.name && form.email && form.message) setSent(true); };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      <div style={{ fontSize: "60px", marginBottom: "16px" }}>✅</div>
      <h3 style={{ color: C.dark, fontWeight: "700", fontSize: "24px", letterSpacing: "-1px" }}>Message Sent!</h3>
      <p style={{ color: C.muted, fontSize: "15px", marginTop: "8px" }}>
        Thank you for reaching out. We'll get back to you within 24 hours.
      </p>
    </div>
  );

  return (
    <div style={s.formCard}>
      <div className="row g-3">
        <div className="col-md-6">
          <label style={s.formLabel}>Your Name</label>
          <input name="name" value={form.name} onChange={handle} placeholder="e.g. Rahul Sharma" style={s.formInput} />
        </div>
        <div className="col-md-6">
          <label style={s.formLabel}>Email Address</label>
          <input name="email" value={form.email} onChange={handle} placeholder="you@email.com" style={s.formInput} />
        </div>
        <div className="col-12">
          <label style={s.formLabel}>Subject</label>
          <input name="subject" value={form.subject} onChange={handle} placeholder="What is this about?" style={s.formInput} />
        </div>
        <div className="col-12">
          <label style={s.formLabel}>Your Message</label>
          <textarea name="message" value={form.message} onChange={handle} placeholder="Tell us how we can help..." style={s.formTextarea} />
        </div>
        <div className="col-12">
          <button
            style={s.submitBtn}
            onClick={submit}
            onMouseEnter={e => e.currentTarget.style.background = C.darker}
            onMouseLeave={e => e.currentTarget.style.background = C.primary}
          >
            Send Message →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ContactUsPage = () => {
  return (
    <div style={s.page}>

      {/* Fixed Banner */}
      <div className="fixed-top">
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
          <img src={logoBanner} alt="Miltronix Logo" className="img-fluid miltronix-logo" />
        </section>
      </div>

      <main className="main-content-padding">

        {/* Breadcrumb */}
        <section style={{ backgroundColor: "#bebfbe", padding: "20px 0" }}>
          <div className="container">
            <p style={{ fontSize: "14px", color: "#6c6c6c", marginBottom: "4px" }} className="hv">
              Home Page &nbsp;›&nbsp; <strong style={{ color: "#4a5856" }}>Contact Us</strong>
            </p>
          </div>
        </section>

        {/* ── HERO ── */}
        <section style={s.hero}>
          <div style={s.heroGrid} />
          <div style={s.heroCircle} />
          <div className="container position-relative">
            <div className="col-lg-7">
              <div style={s.badge}><span>✉️</span> Contact Us</div>
              <h1 style={s.heroTitle}>
                <span style={{ display: "block" }}>Let's</span>
                <span style={{ display: "block", fontStyle: "italic", fontWeight: "400" }}>talk</span>
              </h1>
              <p style={s.heroSub}>
                Product inquiries, support, partnerships, or just a question — we're always happy to hear from you.
              </p>

              {/* Quick contact chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "28px" }}>
                {[
                  { icon: "📞", label: "+91 98765 43210" },
                  { icon: "✉️", label: "support@mitronix.com" },
                  { icon: "📍", label: "New Delhi, India" },
                ].map(chip => (
                  <div key={chip.label} style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)",
                    color: C.white, borderRadius: "999px", padding: "8px 18px", fontSize: "13px", fontWeight: "500",
                  }}>
                    {chip.icon} {chip.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── INFO CARDS ── */}
        <section style={s.infoSection}>
          <div className="container">
            <div className="row g-4">
              {infoCards.map(card => (
                <div className="col-6 col-md-3" key={card.title}>
                  <div
                    style={s.infoCard}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(97,109,107,0.14)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={s.infoIcon}>{card.icon}</div>
                    <div style={s.infoTitle}>{card.title}</div>
                    {card.lines.map(line => (
                      <div key={line} style={s.infoLine}>{line}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORM + MAP ── */}
        <section style={s.formSection}>
          <div className="container">
            <div className="row g-5 align-items-start">

              {/* Left — form */}
              <div className="col-lg-7">
                <p style={s.sectionLabel}>Send Us a Message</p>
                <h2 style={s.sectionTitle}>
                  We'd love to <span style={{ fontStyle: "italic" }}>hear</span><br />from you
                </h2>
                <p style={{ color: C.muted, fontSize: "14px", marginBottom: "32px", lineHeight: "1.7" }}>
                  Fill in the form and our team will respond within 24 hours on business days.
                </p>
                <ContactForm />
              </div>

              {/* Right — office info + map visual */}
              <div className="col-lg-5">
                <div style={s.mapBox}>
                  <div style={s.mapGrid} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: "52px", marginBottom: "16px" }}>📍</div>
                    <h4 style={{ color: C.white, fontWeight: "700", fontSize: "22px", letterSpacing: "-1px", marginBottom: "8px" }}>
                      Miltronix HQ
                    </h4>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", lineHeight: "1.8", marginBottom: "24px" }}>
                      123 Business Park,<br />
                      New Delhi – 110001,<br />
                      India
                    </p>
                    <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.2)", margin: "0 auto 24px" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {[
                        { icon: "📞", text: "+91 98765 43210" },
                        { icon: "✉️", text: "support@mitronix.com" },
                        { icon: "🕐", text: "Mon–Fri: 9:30 AM – 6:30 PM" },
                      ].map(item => (
                        <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 16px" }}>
                          <span>{item.icon}</span>
                          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── BOTTOM STRIP ── */}
        <section style={s.strip}>
          <div className="container text-center">
            <h2 style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: "300", color: C.white, letterSpacing: "-2.5px", marginBottom: "8px" }}>
              Prefer to call? <em>We're ready.</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "28px" }}>
              Mon – Fri · 9:30 AM – 6:30 PM · Average wait &lt; 2 min
            </p>
            <button style={{
              background: C.white, color: C.dark, border: "none",
              borderRadius: "999px", padding: "13px 38px",
              fontWeight: "700", fontSize: "14px", cursor: "pointer",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}>
              📞 Call 1800-MILTRONIX
            </button>
          </div>
        </section>

        <SubscriptionSection />
      </main>

      <Footer />
    </div>
  );
};

export default ContactUsPage;